import { Request, Response, NextFunction } from "express";
import {generateAccessToken, verifyAccessToken, verifyRefreshToken} from "../modules/security/jwt";
import userModel from "../models/UserModel";


export const auth = async (req: Request, res: Response, next: NextFunction) => {
  // console.log("aaaaaaaaaa")
  try {
    const { accessToken, refreshToken } = req.cookies || {};
    // @ts-ignore
    req.userId = null;

    if (!accessToken && !refreshToken) return res.status(401).json({ message: "Not authorized" });

    try {
      const payload = verifyAccessToken(accessToken!);
      // @ts-ignore
      req.userId = payload.id;
      return next();
    } catch (err) {
      // console.log("Access token invalid or expired:", (err as Error).message);

      if (!refreshToken) res.status(401).json({ message: "Not authorized" });

      try {
        const payload = verifyRefreshToken(refreshToken);
        const userId = payload.id;

        const user = await userModel.findOne({_id: userId});
        if (!user) return res.status(401).json({ message: "Not authorized" });

        const newAccessToken = generateAccessToken(userId);

        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/"
        });

        // @ts-ignore
        req.userId = userId;
        return next();
      } catch (err) {
        // console.log("Refresh token invalid:", (err as Error).message);
        return res.status(401).json({ message: "Not authorized" });
      }
    }
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Not authorized" });
  }
};
