import * as composeMiddleware from "compose-middleware";
import * as expressJwt from "express-jwt";
import * as express from "express";
import * as jwt from "jsonwebtoken";

import config from "../../config/enviroment";
import User from "../../api/user/model";
import { Mongoose, Schema } from "mongoose";

export class AuthService {
  validateJwt = expressJwt({
    secret: config.secrets.session
  });
  constructor() {}
  isAuthenticated() {
    return composeMiddleware.compose([
      // Validate JWT
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        // allow access_token to be passed through query parameter as well
        if (req.query && req.query.hasOwnProperty("access_token")) {
          req.headers.authorization = `Bearer ${req.headers.access_token}`;
        }
        // IE 11 forget to set authorization header sometimes. Pull from cookie instead
        if (req.query && typeof req.headers.authorization === "undefined") {
          req.headers.authorization = `Bearer ${(req as any).cookies.token}`;
        }
        this.validateJwt(req, res, next);
      },
      // Attach user to request
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        User.findById((req as any).user._id).exec()
          .then(user => {
            if (!user) return res.status(401).end();
            (req as any).user = user;
            next();
            return undefined;
          })
          .catch(err => next(err));
      }
    ]);
  }

  hasRole(roleRequired: string) {
    if (!roleRequired) {
      throw new Error("Required role needs to be set");
    }
    return composeMiddleware.compose([
      this.isAuthenticated(),
      (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (config.userRoles.indexOf((req as any).user.role) >= config.userRoles.indexOf(roleRequired)) 
          return next();
        else return res.status(403).send("Forbidden");
      }
    ]);
  }

  static signToken(id: string, role: string) {
    return jwt.sign({_id: id, role}, config.secrets.session, {
      expiresIn: config.session.lifetime
    });
  }

  setTokenCookie(req: express.Request, res: express.Response) {
    if (!(req as any).user) {
      return res.status(404).send("You aren't logged in, please try again.");
    }
    const token = AuthService.signToken((req as any).user._id, (req as any).user.role);
    res.cookie("token", token);
    res.redirect("/");
  }
}