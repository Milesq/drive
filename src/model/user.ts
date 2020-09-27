import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  pass: string;
  phoneNumber: string;
}

const userSchema = new Schema({
  name: String,
  pass: String,
  phoneNumber: String,
});

const User = model<IUser>('User', userSchema);

export default User;
