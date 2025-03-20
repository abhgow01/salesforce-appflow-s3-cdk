import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class S3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket
    new s3.Bucket(this, 'MyCDKBucket', {
      bucketName: 'my-cdk-typescript-bucket-new-123456',
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
  }
}
