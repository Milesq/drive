import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  phoneNumber: String,
});

const User = mongoose.model('user', userSchema);

router.post('/auth/register', (req, res) => {
  res.send('knaga papaja owns me and all');

  new User({userName: 'Wojciuch', password: 'AZAZA!', phoneNumber: '+48 997 997 997'}).save();
})

export default router;
