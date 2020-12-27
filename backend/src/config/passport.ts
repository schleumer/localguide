import { NextFunction, Request, Response } from "express";
import passport from "passport";
import passportJwt from "passport-jwt";
// import { User, UserType } from '../models/User';
import { User, UserDocument } from "../models/User";
import jwt from "./jwt";

const JwtStrategy = passportJwt.Strategy;

console.log(jwt);

const params: passportJwt.StrategyOptions = {
  secretOrKey: jwt.jwtSecret,
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.serializeUser<UserDocument, string>((user, done) => {
  console.log("serializeUser");
  done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("deserializeUser");
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new JwtStrategy(params, function (payload, done) {
    console.log({ payload });
    User.findById(payload.id)
      .then((user) => {
        done(null, { id: user.id });
      })
      .catch((err) => {
        done(new Error("User not found"), null);
      });
  })
);

/**
 * Login Required middleware.
 */
export const isAuthenticated = () => {
  return [
    passport.authenticate("jwt", { session: false, failWithError: true }),
    (req: Request, res: Response, next: NextFunction) => {
      if (req.isAuthenticated()) {
        return next();
      }

      res.status(401);
      res.end();
    },
  ];
};
