import {Request, Response } from 'express';

// dummy function to create routes quickly
const dummy = (req: Request, res: Response) => {
  res.status(200).json({});
}

export default  dummy;