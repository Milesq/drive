import { Router } from 'express';
import fileUpload from 'express-fileupload';
import passport from 'passport';

const router = Router();

router.use(fileUpload());

router.put(
  '/',
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    res.send(req.user);
  }
);

export default router;
