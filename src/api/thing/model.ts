import { Schema, model } from "mongoose";

const ThingSchema = new Schema({
  name: String
});

export default model("Thing", ThingSchema);