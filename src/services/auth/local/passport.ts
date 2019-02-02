import * as passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Model } from "mongoose";

function localAuthentication(User: Model<any>, email: string, password: string, done: Function) {
  User.findOne({
    email: email.toLocaleLowerCase()
  }).exec()
  .then((user: any) => {
    if (!user) return done(undefined, false, {message: "This email is not registered"});
    user.authenticate(password, (authError: Error, authenticated: boolean) => {
      if (authError) return done(authError);
      if (authenticated) return done(undefined, user);
      return done(undefined, false, {message: "This password is not correct."});
    });
  })
  .catch((error: Error) => done(error));
}

export function setup(User: Model<any>) {
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password" // this is the virtual field on the model
  }, function(email, password, done) {
    return localAuthentication(User, email, password, done);
  }));
}