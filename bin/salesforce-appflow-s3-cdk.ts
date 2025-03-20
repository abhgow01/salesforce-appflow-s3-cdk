#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { S3Stack } from '../lib/s3-stack';
import { AppFlowStack } from '../lib/appflow-stack';

const app = new cdk.App();
new S3Stack(app, 'S3Stack');
new AppFlowStack(app, 'AppFlowStack');
