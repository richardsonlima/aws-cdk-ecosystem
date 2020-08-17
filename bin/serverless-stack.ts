#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ServerlessStackStack } from '../lib/serverless-stack-stack';
import { EcsFargateStack } from '../lib/ecs-fargate-stack';
import { SharedInfraStack } from '../lib/shared-Infra';

const app = new cdk.App();
new ServerlessStackStack(app, 'ServerlessStackStack');
new EcsFargateStack(app, 'EcsFargateStack', {
    env: { 
        account: process.env.CDK_DEPLOY_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT, 
        region: process.env.CDK_DEPLOY_REGION || process.env.CDK_DEFAULT_REGION 
    }
});