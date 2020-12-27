import "./config/passport";

import bluebird from "bluebird";
import bodyParser from "body-parser";
import compression from "compression"; // compresses requests
import express from "express";
import lusca from "lusca";
import mongoose from "mongoose";
import passport from "passport";
import * as passportConfig from "./config/passport";
import { helloWorld, helloWorldAuthenticated } from "./controllers";
import { MONGODB_URI } from "./util/secrets";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
mongoose.Promise = bluebird;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err) => {
    console.log(
      `MongoDB connection error. Please make sure MongoDB is running. ${err}`
    );
    // process.exit();
  });

// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(passport.initialize());

app.get("/", helloWorld);
app.get("/authenticated", passportConfig.isAuthenticated(), helloWorldAuthenticated);

export default app;
