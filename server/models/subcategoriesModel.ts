import { Model, Schema, model } from "mongoose";
import { ISubcategory } from "../types/mongodb/subcategory.interface";
import PropertyType from "./propertyTypesModel";

const subcategorySchema = new Schema<ISubcategory>(
    {
        name: {
            type: String,
            required: [true, "Subcategory name is required"]
        },

        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Subcategory category is required"]
        },

        propertyTypes: [{ type: Schema.Types.ObjectId, ref: "PropertyType" }]
    },
    {
        timestamps: true
    }
);

subcategorySchema.pre("findOneAndDelete", async function (next) {
    const subcategoryId = this.getQuery()["_id"];
    try {
        await PropertyType.deleteMany({ subcategory: subcategoryId });
    } catch (err) {
        const error = err as Error;
        next(error);
    }
    next();
});

subcategorySchema.pre("deleteMany", async function (next) {
    try {
        const subcategories = await this.model.find(this.getFilter());
        const subcategoryIds = subcategories.map((subcategory) => subcategory._id);
        await PropertyType.deleteMany({ subcategory: { $in: subcategoryIds } });
    } catch (err) {
        const error = err as Error;
        next(error);
    }
    next();
});

const Subcategory: Model<ISubcategory> = model<ISubcategory>("Subcategory", subcategorySchema);
export default Subcategory;
