// Node.js modules
import path from "path";
import fs from "fs";

// 3rd party modules
import multer, { FileFilterCallback } from "multer";
import { slugify } from "transliteration";           // convert filenames to safe ASCII strings
import {Request} from 'express';

// ensures that only image files are accepted
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  // accept the file if its mimetype starts with "image/"
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Invalid file type"));

};

// creates a multer diskStorage instance for a given folder
const makeStorage = (folder: string) =>
  multer.diskStorage({
    // define destination folder for uploaded files
    destination: (_req: Request, _file: Express.Multer.File, cb: (err: Error | null, destination: string) => void) => {
      const dir = path.join(__dirname, `../../public/${folder}/`);

      // create folder if it doesn't exist
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      cb(null, dir); // provide folder path to multer
    },

    // define filename for uploaded files
    filename: (_req: Request, file: Express.Multer.File, cb: (err: Error | null, filename: string) => void) => {
      // clean the original filename
      const cleanName = slugify(path.parse(file.originalname).name);

      // extract file extension
      const ext = path.extname(file.originalname);

      // combine timestamp + clean name + extension to create unique filename
      cb(null, `${Date.now()}-${cleanName}${ext}`);
    },
  });

// separate instances for different types of uploads
export const uploadAvatar = multer({ storage: makeStorage("avatar"), fileFilter });
export const uploadEventPhoto = multer({ storage: makeStorage("event"), fileFilter });
