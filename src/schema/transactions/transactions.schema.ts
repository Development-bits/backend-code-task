import * as mongoose from "mongoose";
import { generateStringId } from "src/components/file-management/utils/utils";
import { TransactionsInterface } from "src/interface/transcations/transactions.interface";

export const TransactionSchema = new mongoose.Schema(
    {
        _id: { type: String, default: generateStringId },
        products: { type: Array },
        totalSpent: { type: Number },
        change: { type: Number, default: 0 }
    },
    {
        collection: 'transactions'
    }
);

TransactionSchema.set('timestamps', true);
TransactionSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('transactions', TransactionSchema);

TransactionSchema.pre<TransactionsInterface>('save', async function (next) {
  next();
});
