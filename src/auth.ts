import { Router } from 'express';
import { User } from './model';

const router = Router();

router.post('/auth/register', (req, res) => {
  res.send('knaga papaja owns me and all');

  new User({
    userName: 'foo',
    password: 'bar',
    phoneNumber: '123 456 789',
  }).save();
});

export default router;
