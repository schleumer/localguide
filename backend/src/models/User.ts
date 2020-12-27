import crypto from "crypto";
import mongoose from "mongoose";
import * as argon2 from "argon2";

export type UserDocument = mongoose.Document & {
    name: string;
    email: string;
    password: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;

    tokens: AuthToken[];

    comparePassword: comparePasswordFunction;
    gravatar: (size: number) => string;
};

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => any) => void;

export interface AuthToken {
    accessToken: string;
    kind: string;
}

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    passwordResetToken: { type: String, required: false },
    passwordResetExpires: { type: Date, required: false },

    tokens: Array,
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
    const user = this as UserDocument;
    if (!user.isModified("password")) { return next(); }

    argon2.hash(user.password).then((hash) => {
        user.password = hash;
        next();
    }).catch((err) => {
        next(err);
    });
});

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    argon2.verify(candidatePassword, this.password).then((success) => {
        cb(undefined, success);
    }).catch((err) => {
        cb(err, false);
    });
};

userSchema.methods.comparePassword = comparePassword;

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function (size: number = 200) {
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash("md5").update(this.email).digest("hex");
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

export const User = mongoose.model<UserDocument>("User", userSchema);
