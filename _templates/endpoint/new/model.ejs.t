---
to: src/api/<%= name.toLowerCase() %>/model.ts
---
import { Schema, model } from "mongoose";

const <%= h.inflection.titleize(name) %>Schema = new Schema({
  name: String
});

export default model("<%= h.inflection.titleize(name) %>", <%= h.inflection.titleize(name) %>Schema);