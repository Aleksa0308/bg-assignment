import rabbitMQService from './rabbitMQService';
class FilesService {
    getFiles = async () => {
        await rabbitMQService.sendToQueue('Get files');
        return true;
    }
}

export default new FilesService();