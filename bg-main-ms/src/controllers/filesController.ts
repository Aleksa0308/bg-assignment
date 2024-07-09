import {NextFunction, Request, Response} from 'express';
import logging from "../config/logging";
import fileService  from '../services/filesService';

class FileController {
    getFiles = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const files = await fileService.getFiles();
            res.status(200).json(files);
        }catch (err){
            next(err)
        }
    }
}

export default new FileController();