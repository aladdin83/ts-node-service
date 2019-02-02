import * as crypto from "crypto";
import { Schema, model } from "mongoose";
import config from "../../config/enviroment";

const UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    lowercase: true,
    required() {
      return (this.provider === "local");
    }
  },
  provider: String,
  salt: String,
  role: String
});

UserSchema
  .virtual("profile")
  .get(function() {
    return {name: this.name, role: this.role};
  });

UserSchema
  .virtual("token")
  .get(function() {
    return {_id: this._id, role: this.role};
  });

UserSchema
  .path("email")
  .validate(function(email: String) {
    if (this.provider !== "local") return true;
    return email.length;
  }, "Email cannot be blank.");

UserSchema
  .path("password")
  .validate(function(password: String) {
    if (this.provider !== "local") return true;
    return password.length;
  }, "Password cannot be blank.");

UserSchema
  .path("email")
  .validate(function(value: string, respond: (_: boolean) => {}) {
    if (this.provider !== "local") return respond(true);
    return this.constructor.findOne({ email: value }).exec()
      .then((user: any) => {
        if (user && this.id === user.id) return respond(true);
        if (user && this.id !== user.id) return respond(false);
        return respond(true);
      })
      .catch(function(err: Error) { throw err; });
  }, "The specified email address is already in user");

UserSchema
  .pre("save", (next) => {
    if (!this.isModified("password")) return next();
    if (!(this.password && this.password.length)) {
      if (this.provider === "local") return next(new Error("Invalid password"));
      else return next();
    }

    // Make Salt
    this.makeSalt((saltError: Error, salt: String) => {
      if (saltError) return next(saltError);
      this.salt = salt;
      this.encryptPassword(this.password, (encryptError: Error, hashedPassword: String) => {
        if (encryptError) return next(encryptError);
        this.password = hashedPassword;
        return next();
      });
    });
  });

UserSchema.methods = {
  authenticate(password: String, callback: Function) {
    if (!callback) return this.password === this.encryptPassword(password);
    this.encryptPassword(password, (error: Error, pwdGen: String) => {
      if (error) return callback(error);
      if (this.password === pwdGen) return callback(undefined, true);
      return callback(undefined, false);
    });
  },

  makeSalt(...args: any) {
    const defaultByteSize = 16;
    let byteSize = 16;
    let callback: Function;
    if (typeof args[0] === "function") {
      callback = args[0];
    } else if (typeof args[1] === "function") {
      callback = args[1];
      byteSize = args[0];
    } else {
      throw new Error("MakeSalt: Missing Callback");
    }
    if (!byteSize) byteSize = defaultByteSize;
    return crypto.randomBytes(byteSize, (error: Error, salt: Buffer) => {
      if (error) return callback(error);
      return callback(undefined, salt.toString("base64"));
    });
  },

  encryptPassword(password: string, callback: Function) {
    if (!password || !this.salt) {
      if (!callback) return undefined;
      return callback("encrypt password: Missing password or salt");
    }

    const defaultIterations = 10000;
    const defaultKeyLength = 64;
    const salt = new Buffer(this.salt, "base64");

    if (!callback) return crypto.pbkdf2Sync(
      password, salt,
      defaultIterations, defaultKeyLength, "sha256"
    ).toString("base64");

    return crypto.pbkdf2(
      password, salt, defaultIterations, defaultKeyLength, "sha256",
      (error: Error, key) => {
        if(error) return callback(error);
        return callback(undefined, key.toString("base64"));
      });
  }
};

export default model("User", UserSchema);