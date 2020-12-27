import mongoose from "mongoose";
import * as passport from "./src/config/passport";
import "./src/app";
import { User } from "./src/models/User";
import * as jwt from "jwt-simple";
import * as bcrypt from "bcrypt-nodejs";
import * as argon2 from "argon2";
import * as secrets from "./src/util/secrets";
import * as yargs from "yargs";

const argv = yargs.demandOption("root-password").argv;

const run = async () => {
    const mainUser = await User.findOne({ email: "root@root" });

    if (!mainUser) {
        const user = await User.create({
            email: "root@root",
            name: "Root",
            password: argv["root-password"] as string,
            tokens: [],
        });

        const payload = { id: user.id };
        const token = jwt.encode(payload, secrets.JWT_SECRET);

        console.log(`User created id: ${user._id} => ${token}`);
    }

    process.exit(0);
};


run();