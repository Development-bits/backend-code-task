import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import { generateStringId } from "src/components/file-management/utils/utils";
import { UsersInterface } from "src/interface/users/users.interface";

export const UserSchema = new mongoose.Schema(
    {
        _id: { type: String, default: generateStringId },
        userName: { type: String, default: '' },
        password: { type: String },
        deposit: { type: Number, default: 0 },
        role: { type: String }
    },
    {
        collection: 'users'
    }
);

mongoose.model('users', UserSchema);

UserSchema.set('timestamps', true);

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

UserSchema.pre<UsersInterface>('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});