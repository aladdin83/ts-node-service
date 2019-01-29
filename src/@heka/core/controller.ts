import * as express from "express";
import * as mongoose from "mongoose";
import { applyPatch } from "fast-json-patch";
import { ErrorHandlerComponent } from "../../components/error-handler";
export class HekaController {
  model: mongoose.Model<any>;
  constructor(model: mongoose.Model<any>) {
    this.model = model;
  }

  public respondWithResults(res: express.Response, statusCode: number) {
    statusCode = statusCode || 200;
    return function(entity: any) {
      if (entity) {
        return res.status(statusCode).json(entity);
      }
      return undefined;
    };
  }

  public handleError(req: express.Request, res: express.Response, statusCode: number = 500) {
    const errorHandler = new ErrorHandlerComponent();
    return (err: Error) => {
      errorHandler.handleError()(err, req, res, undefined);
    };
  }

  public handleEntityNotFound(res: express.Response) {
    return function(entity: any) {
      if (!entity) {
        res.status(404).end();
        return undefined;
      }
      return entity;
    };
  }

  public pathchUpdates(patches: any) {
    return function(entity: any) {
      try {
        applyPatch(entity, patches, true);
      } catch (err) {
        return Promise.reject(err);
      }
      return entity.save();
    };
  }

  public removeEntity(res: express.Response) {
    return function(entity: any) {
      if (entity) {
        return entity.remove()
          .then(() => res.status(204).end());
      }
    };
  }

  index() {
    return (req: express.Request, res: express.Response) => {
      return this.model.find({})
        .then(this.respondWithResults(res, 200))
        .catch(this.handleError(req, res, 500));
    };
  }

  show() {
    return (req: express.Request, res: express.Response) => {
      return this.model.findById(req.params["id"])
        .then(this.handleEntityNotFound(res))
        .then(this.respondWithResults(res, 200))
        .catch(this.handleError(req, res));
    };
  }

  create() {
    return (req: express.Request, res: express.Response) => {
      return this.model.create((req as any).body)
        .then(this.respondWithResults(res, 201))
        .catch(this.handleError(req, res));
    };
  }

  upsert() {
    return (req: express.Request, res: express.Response) => {
      if ((req as any).body._id) {
        Reflect.deleteProperty((req as any).body, "_id");
      }
      return this.model.findOneAndUpdate({_id: req.params.id},
        (req as any).body,
        {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true})
        .exec()
        .then(this.respondWithResults(res, 200))
        .catch(this.handleError(req, res));
    };
  }

  patch() {
    return (req: express.Request, res: express.Response) => {
      if ((req as any).body._id) {
        Reflect.deleteProperty((req as any).body, "_id");
      }
      return this.model.findById(req.params.id)
        .exec()
        .then(this.handleEntityNotFound(res))
        .then(this.pathchUpdates((req as any).body))
        .then(this.respondWithResults(res, 200))
        .catch(this.handleError(req, res));
    };
  }

  delete() {
    return (req: express.Request, res: express.Response) => {
      return this.model.findById(req.params.id)
        .exec()
        .then(this.handleEntityNotFound(res))
        .then(this.removeEntity(res))
        .catch(this.handleError(req, res));
    };
  }
}