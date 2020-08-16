import * as cdk from '@aws-cdk/core';
import * as ecs from "@aws-cdk/aws-ecs";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { Cluster } from '@aws-cdk/aws-ecs';


export class EcsFargateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = ec2.Vpc.fromLookup(this, "vpc", {
        vpcId: "vpc-0a0a0a0a0a00a0a00a0a0a0a00a0a0a",
        //tags:{"Name:" ""},
        //vpcName: "",
    });

    const cluster = new ecs.Cluster(this, "EcsClusterStack01", {
        vpc: vpc 
    
    });
    const taskDefinition = new ecs.FargateTaskDefinition(this, "FargateTaskDef");
    taskDefinition.addContainer('AppContainer',{
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
        memoryLimitMiB: 512,
    });
    // Initiating a ECS Fargate Service
    const fargateService = new ecs.FargateService(this, "FargateService", {
        cluster,
        taskDefinition,
        desiredCount: 2
    });

 }
}
