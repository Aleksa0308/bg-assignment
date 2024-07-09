import amqp from 'amqplib';
import { RABBITMQ } from '../config/config';

class RabbitMQService {
    private connection!: amqp.Connection;
    private channel!: amqp.Channel;
    private queue: string = 'fileQueue';

    async connect() {
        this.connection = await amqp.connect(`amqp://${RABBITMQ.RABBITMQ_HOST}`);
        this.channel = await this.connection.createChannel();
        await this.channel.assertQueue(this.queue, { durable: true });
    }

    async sendToQueue(message: string) {
        if(!this.channel) await this.connect();

        this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify({
            message,
            timestamp: Date.now()
        })), {
            persistent: true
        });

        logging.info(`The message ${message} has been sent to the queue ${this.queue}`);
    }
}

export default new RabbitMQService();