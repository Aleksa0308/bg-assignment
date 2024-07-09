import rabbitMQService from './rabbitMQService';
class FilesService {
    getFiles = async (correlationId: string) => {
        await rabbitMQService.sendToQueue(correlationId, 'Get files');
        return true;
    }
}

export default new FilesService();