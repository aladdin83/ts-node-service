---
to: src/api/<%=name.toLowerCase()%>/index.ts
---
<%
  var controllerName = h.inflection.titleize( h.inflection.pluralize(name) );
%>
import * as express from "express";
import { <%= controllerName %>Controller } from "./controller";

const router = express.Router();
const controller = new <%= controllerName %>Controller();

router.get("/", controller.index());
router.get("/:id", controller.show());
router.post("/", controller.create());
router.put("/:id", controller.upsert());
router.patch("/:id", controller.patch());
router.delete("/:id", controller.delete());

module.exports = router;
