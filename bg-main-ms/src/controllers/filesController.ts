import {NextFunction, Request, Response} from 'express';
import fileService  from '../services/filesService';

class FileController {
    getFiles = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const response = await fileService.getFiles();
            res.status(200).json({ success: response });
        }catch (err){
            next(err)
        }
    }
}

export default new FileController();