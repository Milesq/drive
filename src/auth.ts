import { Router } from 'express';
import bodyparser from 'body-parser';
import jwt from 'jsonwebtoken';
import { User } from './model';
import { objectIncludes } from './utils';

const router = Router();

router.use(bodyparser.json());

interface RegisterData {
  user: {
    name?: string;
    pass?: string;
    phone?: string;
  };
}

router.post('/register', async (req, res) => {
  const validPhoneNumber = /^(\+[0-9]{2})?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{3}$/i;
  const validName = /^[a-z\-_]{3,}$/i;

  if (!objectIncludes(req.body?.user || {}, 'name', 'pass', 'phone')) {
    return res
      .status(400)
      .send({ err: 'name, pass and phone are required in body' });
  }

  const { name, pass, phone } = (req.body as RegisterData)?.user;

  const user = await User.findOne({ name });

  if (user) return res.status(409).send({ err: 'User already exists!' });

  if (!validPhoneNumber.test(phone))
    return res.status(400).send({ err: 'Invalid phone number!' });

  if (!validName.test(name))
    return res
      .status(400)
      .send({ err: 'Name contains disallowed chars or is too short' });

  if (pass.length < 6)
    return res.status(400).send({ err: 'Password is too short!' });

  const token = jwt.sign({ user: name }, 'privateKey');

  new User({
    name,
    pass,
    phoneNumber: phone,
  })
    .save()
    .then(() => res.status(201).send({ token }))
    .catch(() => res.status(500).send({ err: 'Cannot save to database.' }));
});

router.post('/login', async (req, res) => {
  if (!objectIncludes(req.body?.user || {}, 'name', 'pass')) {
    return res
      .status(400)
      .send({ err: 'both name and pass are required in body' });
  }

  const { name, pass } = (req.body as RegisterData)?.user;

  const foundedUser = await User.findOne({ name });

  if (foundedUser === null) {
    return res.status(400).send({
      err: 'userNotFound',
    });
  }

  if (foundedUser.pass !== pass) {
    return res.status(401).send({
      err: 'passwordIncorrect',
    });
  }

  const token = jwt.sign({ user: foundedUser.name }, 'privateKey');

  res.send({ token });
});

export default router;
