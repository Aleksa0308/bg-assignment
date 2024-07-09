import express from 'express';
import filesController from '../controllers/filesController';

const router = express.Router();

router.get('/files', filesController.getFiles);

export default router;