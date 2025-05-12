import { Response } from "express";
import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import Order from "../models/ordersModel";
import getUserId from "../middleware/getUserIdHandler";
import { IOrderProduct } from "../types/mongodb/orderProduct.interface";
import { IOrder } from "../types/mongodb/order.interface";
import { startSession } from "mongoose";
import OrderProduct from "../models/orderProductsModel";
import Product from "../models/productsModel";
import { sendStatusNotification } from "./subscribeController";

//@desc Get all user orders
//@route GET /api/<API_VERSION>/orders
//@access private
const getOrders = async (req: AuthorizedRequest, res: Response) => {
    try {
        const user = await getUserId(req);
        if (!user) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }
        const page: number = Number(req.query.page) || 1;
        const limit: number = Number(req.query.limit) || 20;
        const skip: number = (page - 1) * limit;
        const sortField: string = String(req.query.sortField || "createdAt");
        const sortOrder: number = req.query.sortOrder === "desc" ? -1 : 1;

        const queryOptions = { skip, limit, sort: { [sortField]: sortOrder } };
        const orders = await Order.find({ user: user }, null, queryOptions).populate({
            path: "orderProducts",
            select: "product quantity",
            populate: {
                path: "product",
                select: "name price images",
                populate: {
                    path: "images",
                    select: "image main"
                }
            }
        });
        res.status(200).json(orders);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Create new order
//@route POST /api/<API_VERSION>/orders
//@access private
const createOrder = async (req: AuthorizedRequest, res: Response) => {
    try {
        const user = await getUserId(req);
        if (!user) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }
        const order: IOrder = req.body;
        const orderProducts: IOrderProduct[] = req.body.orderProducts;

        if (!orderProducts || !orderProducts.length) {
            res.status(400).json({ message: "The order has no products" });
            return;
        }

        order.user = user;
        order.date = new Date();
        order.status = "Accepted";
        order.orderProducts = [];
        order.value = 0.0;
        const orderInstance = new Order(order);
        await orderInstance.validate();

        const session = await startSession();
        session.startTransaction();
        try {
            await Promise.all(
                orderProducts.map(async (orderProduct) => {
                    orderProduct.order = orderInstance._id;
                    const orderProductInstance = new OrderProduct(orderProduct);
                    await orderProductInstance.validate();
                    await orderProductInstance.save();
                    const product = await Product.findByIdAndUpdate(orderProduct.product, {
                        $inc: { quantity: -orderProduct.quantity }
                    });
                    if (!product) {
                        const error = new Error("Product not found");
                        error.name = "NotFound";
                        throw error;
                    }
                    if (product.quantity < 0 || product.quantity < orderProduct.quantity) {
                        const error = new Error(`No product ${product.name} in stock`);
                        error.name = "ValidationError";
                        throw error;
                    }
                    orderInstance.value += product.price * orderProduct.quantity;
                    orderInstance.orderProducts.push(orderProductInstance._id);
                })
            );
            orderInstance.value = Number(orderInstance.value.toFixed(2));
            await orderInstance.save();
        } catch (err) {
            await session.abortTransaction();
            throw err;
        }
        session.endSession();

        res.status(201).json(orderInstance);
    } catch (err) {
        const error = err as Error;
        if (error.name === "ValidationError") {
            res.status(400).json({ message: error.message });
        } else if (error.name === "NotFound") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
};

//@desc Get order
//@route GET /api/<API_VERSION>/orders/:id
//@access private
const getOrder = async (req: AuthorizedRequest, res: Response) => {
    try {
        const id: string = req.params.id;
        const user = await getUserId(req);
        if (!user) {
            res.status(401).json({ message: "User is not authorized" });
            return;
        }

        const order = await Order.findById(id).populate({
            path: "orderProducts",
            select: "quantity",
            populate: {
                path: "product",
                select: "name price",
                populate: [
                    {
                        path: "images",
                        select: "image main"
                    },
                    {
                        path: "brand",
                        select: "name"
                    },
                    {
                        path: "subcategory",
                        select: "name"
                    }
                ]
            }
        });
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        if (!order.user.equals(user)) {
            res.status(403).json({ message: "You do not have access to this resource" });
            return;
        }
        res.status(200).json(order);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

//@desc Change order status
//@route PATCH /api/<API_VERSION>/orders/:id/status
//@access private - Admin only
const changeOrderStatus = async (req: AuthorizedRequest, res: Response) => {
    try {
        const id: string = req.params.id;
        const status: string = req.body.status;

        if (!status) {
            res.status(400).json({ message: "Order status is mandatory" });
            return;
        }

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        await order.validate();
        await sendStatusNotification(order.user, order.status);
        res.status(200).json(order);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getOrders, createOrder, getOrder, changeOrderStatus };
