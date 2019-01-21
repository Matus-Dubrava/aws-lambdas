# DynamoDB stream/Lambda/S3 integration

This is a sample code that can be run as a lambda function polling DynamoDB stream and creating/removing objects from S3 in response.

Function reads batch of records (users inserted into/deleted from DynamoDB) and creates/deletes
mock object in a specified S3 bucket. Object is associated with the user via prefix, where prefix is equal to that user's name.
