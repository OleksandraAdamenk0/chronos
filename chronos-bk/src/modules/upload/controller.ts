import type {Request, Response} from "express";

const HOST=process.env.HOST || 'http://localhost:';
const PORT=process.env.PORT || 5000;

export const handleAvatarUpload = (req: Request, res: Response): void => {
  // @ts-ignore
  const file = req.file;

  // file wasn't found in the req => error happened during uploading process
  if (!file) {
    res.status(400).json({success: false, error: "File wasn't upload"});
    return;
  }

  // return path to the client
  const path = `${HOST}${PORT}/public/avatar/${file.filename}`;
  res.json({ success: true, data: path });
}