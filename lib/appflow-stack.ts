import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as appflow from 'aws-cdk-lib/aws-appflow';

export class AppFlowStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Import the existing S3 bucket created in S3Stack
    const bucket = s3.Bucket.fromBucketName(this, 'ImportedBucket', 'my-cdk-typescript-bucket-123456');

    // Create a Secrets Manager secret for Salesforce credentials
    const salesforceSecret = new secretsmanager.Secret(this, 'SalesforceSecret', {
      secretName: 'salesforce-credentials',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({
          client_id: '3MVG9dAEux2v1sLvcl8.3HyVWRlm1iVD.6Py7ujxfyDRkbfLhnNWqHgDHlhjKcYdWG6Rus20hF2.E.ZGpKeTd',
          client_secret: '6E6690672856C27091C5BC01E4EDA8671689B67F0AD3A6072BD5CACFF7BEFA10',
          refresh_token: '5Aep861eN26Sp9j0R6NNry5S5mq1bcGS1mMDyMgZ0VVWL5GeriFt2W7nXd4rLwqv.QLFDQklKTDK.POWwXHnRKR',
          access_token: '00DgL000000aHhb!AQEAQJPPUpqlSQ43JvgLV020MerzxTyd_Fz4qFWwWgS3uNDG6g4Efac03ab69gJ_reTuP_4C3_aU4zdy4BDrxtIp5W5zd.oF',
          instance_url: 'https://orgfarm-08e804a438-dev-ed.develop.my.salesforce.com',
        }),
        excludePunctuation: true,
      }
    });

    // Create the AppFlow flow to pull data from Salesforce to S3
    new appflow.CfnFlow(this, 'SalesforceToS3Flow', {
      flowName: 'SalesforceToS3Flow',
      sourceFlowConfig: {
        connectorType: 'Salesforce',
        connectorProfileName: 'SalesforceConnector',
        sourceConnectorProperties: {
          salesforce: {
            object: 'Account',  // Fetch Accounts data
          },
        },
      },
      destinationFlowConfigList: [
        {
          connectorType: 'S3',
          destinationConnectorProperties: {
            s3: {
              bucketName: bucket.bucketName,
              bucketPrefix: 'salesforce-data/',
              s3OutputFormatConfig: {
                fileType: 'CSV',
              },
            },
          },
        },
      ],
      triggerConfig: {
        triggerType: 'OnDemand',
      },
      tasks: [
        {
          sourceFields: ['Id', 'Name', 'Industry'],  // Fields to fetch from Salesforce
          destinationField: 'Data',
          taskType: 'MapAll',
        },
      ],
    });

    // Output the Secrets Manager ARN (optional)
    new cdk.CfnOutput(this, 'SalesforceSecretArn', {
      value: salesforceSecret.secretArn,
      description: 'Salesforce Secret ARN',
    });
  }
}
