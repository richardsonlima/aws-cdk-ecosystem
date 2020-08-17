import * as cdk from '@aws-cdk/core';
import * as ecs from "@aws-cdk/aws-ecs";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { Cluster, FargateTaskDefinition, TaskDefinition } from '@aws-cdk/aws-ecs';
import { clearScreenDown } from 'readline';
import { Vpc } from '@aws-cdk/aws-ec2';


export interface StackProps extends cdk.StackProps {
    vpc?: ec2.Vpc
    vpcId?: string
}

export class SharedInfraStack extends cdk.Stack {
    readonly vpc: ec2.Vpc

    constructor(scope:  cdk.Construct, id: string, props?: cdk.StackProps ) {
        super(scope, id, props);

        this.vcp = new ec2.Vpc(this, 'SharedVPC', {
            natGateways: 1,
        })

        new cdk.CfnOutput(this. 'vpcId', {
            value: this.vpc.vpcId,
            exportName: 'ExportedVpcId'
        });
    }
}

