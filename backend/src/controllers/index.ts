"use strict";

import { Request, Response } from "express";

export const helloWorld = (req: Request, res: Response) => {
    res.json({ hello: "world" });
};

export const helloWorldAuthenticated = (req: Request, res: Response) => {
    res.json({ hello: "world" });
};
