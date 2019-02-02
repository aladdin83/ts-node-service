
import * as express from "express";
import { SectionsController } from "./controller";

const router = express.Router();
const controller = new SectionsController();

router.get("/", controller.index());
router.get("/:id", controller.show());
router.post("/", controller.create());
router.put("/:id", controller.upsert());
router.patch("/:id", controller.patch());
router.delete("/:id", controller.delete());

module.exports = router;
