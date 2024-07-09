import {NextFunction, Request, Response} from 'express';
import fileService  from '../services/filesService';
import rabbitMQService from "../services/rabbitMQService";
import { v4 as uuidv4 } from 'uuid';

class FileController {
    getFiles = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const correlationId = uuidv4();

            await fileService.getFiles(correlationId);
            await rabbitMQService.handleReply(correlationId, res);
        }catch (err){
            next(err)
        }
    }
}

export default new FileController();