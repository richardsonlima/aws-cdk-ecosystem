import * as cdk from '@aws-cdk/core';
import * as ecs from "@aws-cdk/aws-ecs";
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";
import { Cluster, FargateTaskDefinition, TaskDefinition } from '@aws-cdk/aws-ecs';
import { clearScreenDown } from 'readline';


export class EcsFargateStack extends cdk.Stack {

    readonly vpc : ec2.IVpc; //interface IVpc
    readonly cluster : ecs.ICluster // Class Cluster
    readonly loadBalancerFargateService : ecs_patterns.ApplicationLoadBalancedFargateService;
    readonly securityGroups: ec2.ISecurityGroup[];

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
      super(scope, id, props);

      this.vpc = this.importVpc ();
      this.cluster = this.importCluster();
      this.loadBalancerFargateService = this.createFargateMicroService01();
      this.loadBalancerFargateService = this.createFargateMicroService02();
    }

    // method to import an exported VPC
    private importVpc() : ec2.IVpc {
        let vpc = ec2.Vpc.fromVpcAttributes(this, 'VPC', {
            // Reference: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html
            // The intrinsic function Fn::ImportValue returns the value of an output exported by another stack. 
            vpcId: cdk.Fn.importValue('a001021010'),
            availabilityZones: cdk.Fn.split(',', cdk.Fn.importValue('a001021010')),
            publicSubnetIds: cdk.Fn.split(',', cdk.Fn.importValue('a001021010')),
            privateSubnetIds: cdk.Fn.split(',', cdk.Fn.importValue('a001021010')),
        });
        return vpc;
    }

    private importCluster() : ecs.ICluster {
        let cluster = ecs.Cluster.fromClusterAttributes(this, 'Cluster', {
            clusterName: cdk.Fn.importValue('ClusterName'),
            vpc: this.vpc ,
            securityGroups: []
        });
        return cluster;        
    }    

    private createFargateMicroService01() : ecs_patterns.ApplicationLoadBalancedFargateService {
        let loadBalancerFargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'amazon-ecs-sample', {
            cluster: this.cluster ,
            cpu: 256,
            desiredCount: 2,
            taskImageOptions: {
                // from  https://hub.docker.com/u/amazon
                image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
            },
            memoryLimitMiB: 512,
            publicLoadBalancer: true,
        });
        return loadBalancerFargateService;
    }
    private createFargateMicroService02() : ecs_patterns.ApplicationLoadBalancedFargateService {
        let loadBalancerFargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'amazon-ecs-secrets', {
            cluster: this.cluster ,
            cpu: 256,
            desiredCount: 1,
            taskImageOptions: {
                // from  https://hub.docker.com/u/amazon
                image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-secrets"),
            },
            memoryLimitMiB: 256,
            publicLoadBalancer: true,
        });
        return loadBalancerFargateService;
    }
    //

    //
}
