import mongoose from "mongoose";

const URI = "mongodb+srv://admin:i2OuWWnIAmpGD9Ow@cluster0.z34mo.mongodb.net/prod?appName=Cluster0";
await mongoose.connect(URI);
console.log("connected!");
mongoose.disconnect();