import { Response } from "express";
import { AuthorizedRequest } from "../types/express/authorizedRequest.interface";
import Order from "../models/ordersModel";
import getUserId from "../middleware/getUserIdHandler";
import { IOrderProduct } from "../types/mongodb/orderProduct.interface";
import { IOrder } from "../types/mongodb/order.interface";
import { startSession } from "mongoose";
import OrderProduct from "../models/orderProductsModel";
import Product from "../models/productsModel";

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
        const orders = await Order.find({ user: user }, null, queryOptions);
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
        order.orderProducts = [];
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
                    await Product.findByIdAndUpdate(orderProduct.product, {
                        $inc: { quantity: -orderProduct.quantity }
                    });
                    orderInstance.orderProducts.push(orderProductInstance._id);
                })
            );
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
                path: "product"
            }
        });
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        if (order.user !== user) {
            res.status(403).json({ message: "You do not have access to this resource" });
            return;
        }
        res.status(200).json(order);
    } catch (err) {
        const error = err as Error;
        res.status(500).json({ message: error.message });
    }
};

export { getOrders, createOrder, getOrder };
