import * as cdk from '@aws-cdk/core';
import { Queue } from '@aws-cdk/aws-sqs';
import { Table, AttributeType } from '@aws-cdk/aws-dynamodb';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { RestApi, LambdaIntegration } from '@aws-cdk/aws-apigateway';
import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';

export class ServerlessStackStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const queue = new Queue(this, 'queue', {
      queueName: 'queue'
    });
    const table = new Table(this, 'table', {
      partitionKey: { name: 'id', type: AttributeType.NUMBER }
    });
    const publishFunction = new Function(this, 'publishFunction', {
      runtime: Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: Code.asset('./handlers/publish'),
      environment: {
        QUEUE_URL: queue.queueUrl
      },
    });
    const api = new RestApi(this, 'api', {
      deployOptions: {
        stageName: 'dev'
      }
    });

    api.root.addMethod('GET', new LambdaIntegration(publishFunction));

    const subscribeFunction = new Function(this, 'subscribeFunction', {
      runtime: Runtime.NODEJS_10_X,
      handler: 'index.handler',
      code: Code.asset('./handlers/subscribe'),
      environment: {
        QUEUE_URL: queue.queueUrl,
        TABLE_NAME: table.tableName
      },
      events: [
        new SqsEventSource(queue)
      ]
    });

    queue.grantSendMessages(publishFunction);
    table.grant(subscribeFunction, "dynamodb:PutItem");
//

  }
}
