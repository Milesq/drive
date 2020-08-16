import { Router } from 'express';
import bodyparser from 'body-parser';
import { User } from './model';

const router = Router();

router.use(bodyparser.json());

router.post('/register', async (req, res) => {
  const validPhoneNumber = /^(\+[0-9]{2})?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{3}$/i;
  const { name, pass, phone } = req.body?.user;

  console.log(`Name: ${name} Pass: ${pass} Phone ${phone}`);

  const user = await User.findOne({ name });

  if (user) return res.status(409).send({ err: 'User already exists!' });

  if (!validPhoneNumber.test(phone))
    return res.status(400).send({ err: 'Invalid phone number!' });

  if (name.length < 3)
    return res.status(400).send({ err: 'Name is too short!' });

  if (pass.length < 6)
    return res.status(400).send({ err: 'Password is too short!' });

  new User({
    userName: name,
    password: pass,
    phoneNumber: phone,
  })
    .save()
    .then(() => res.status(201).send({ token: 'a.b.c' }))
    .catch(() => res.status(500).send({ err: 'Cannot save to database.' }));
});

export default router;
