import { Router } from 'express';
import bodyparser from 'body-parser';

const router = Router();

router.use(bodyparser.json());

router.post('/register', (req, res) => {
  const validPhoneNumber = /^(\+[0-9]{2})?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{3}$/i;
  const { name, pass, phone } = req.body.user;

  if (!validPhoneNumber.test(phone))
    return res.status(400).send({ err: 'Invalid phone number!' });

  if (name.length < 3)
    return res.status(400).send({ err: 'Name is too short!' });

  if (pass.length < 6)
    return res.status(400).send({ err: 'Password is too short!' });
  }
});

export default router;
