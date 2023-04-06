import * as mongoose from "mongoose";
import { generateStringId } from "src/components/file-management/utils/utils";
import { ProductInterface } from "src/interface/products/products.interface";

export const ProductSchema = new mongoose.Schema(
    {
        _id: { type: String, default: generateStringId },
        productName: { type: String, default: '' },
        sellerld: { type: String, default: '' },
        amountAvailable: { type: Number, default: 0 },
        cost: { type: Number, default: 0 }
    },
    {
        collection: 'products'
    }
);

ProductSchema.set('timestamps', true);
ProductSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('products', ProductSchema);

ProductSchema.pre<ProductInterface>('save', async function (next) {
  next();
});
