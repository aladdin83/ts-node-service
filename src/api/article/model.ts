import { Schema, model } from "mongoose";

const ArticleSchema = new Schema({
  title: String,
  link: String,
  guid: String,
  body: String,
  pubDate: Date,
  enclosure: {
    url: String,
    type: String,
    length: String
  },
  media: [{
    title: String,
    url: String,
    type: String
  }],
  creator: {
    name: String
  },
  source: {
    name: String
  },
  lastModified: Date,
  section: {
    type: Schema.Types.ObjectId,
    ref: "Section"
  },
  keywords: [String]
});

export default model("Article", ArticleSchema);