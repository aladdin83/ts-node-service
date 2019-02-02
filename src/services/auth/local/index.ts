import * as express from "express";
import * as passport from "passport";
import { AuthService } from "../auth.service";

const router = express.Router();

router.post("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
  passport.authenticate("local", (authError: Error, user: any, info: any) => {
    const error = authError || info;
    if (error) return res.status(401).json(error);
    if (!user) return res.status(404).json({
      message: "Something went wrong, please try again."
    });
    const token = AuthService.signToken(user._id, user.role);
    res.json({ token });
  })(req, res, next);
});

export default router;