import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { User } from '../model';

passport.use(
  new BearerStrategy(async (token, done) => {
    let payload: any;
    try {
      payload = jwt.verify(token, 'privateKey');
    } catch {
      return done(null, false);
    }

    const foundedUser = await User.findOne({ name: payload.user });

    done(null, foundedUser);
  })
);
