import { Schema, model } from "mongoose";

const SectionSchema = new Schema({
  title: String,
  rssUrl: String,
  urlPath: String
});

export default model("Section", SectionSchema);