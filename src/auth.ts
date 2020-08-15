import { Router } from 'express';
import bodyparser from 'body-parser';

const router = Router();

router.use(bodyparser.json());

router.post('/register', (req, res) => {
  const validPhoneNumber = /^(\+[0-9]{2})?[0-9]{3}[\s-]?[0-9]{3}[\s-]?[0-9]{3}$/i;
  const { name, pass, phone } = req.body.user;

  if (!validPhoneNumber.test(phone)) {
    res.status(400).send('Invalid phone number!');
    return;
  }

  if (name.length < 3) {
    res.status(400).send({ err: 'Name is too short!' });
    return;
  }

  if (pass.length < 6) {
    res.status(400).send({ err: 'Password is too short!' });
    return;
  }
});

export default router;
