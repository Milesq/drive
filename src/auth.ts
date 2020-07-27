import { Router } from 'express';
import { User } from './model';

const router = Router();

router.post('/register', (req, res) => {
  res.send('Hello world');

  new User({
    userName: 'foo',
    password: 'bar',
    phoneNumber: '123 456 789',
  }).save();
});

export default router;
