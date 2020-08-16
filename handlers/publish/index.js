const aws = require('aws-sdk');
const sqs = new aws.SQS();

exports.handler = async (event) => {
    const randomInt = Math.floor(Math.random() * Math.floor(10000)).toString();

    const params = {
        QueueUrl: process.env.QUEUE_URL,
        MessageBody: randomInt
    };

    await sqs.sendMessage(params).promise();

    return {
        statusCode: 200,
        body: `Successfully pushed message ${randomInt}!!`
    }
}