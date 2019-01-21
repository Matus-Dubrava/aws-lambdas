# DynamoDB stream/Lambda/S3 integration

This is a sample code that can be run as a lambda function polling DynamoDB stream and creating/removing objects from S3 in response.

Function reads batch of records (users inserted into/deleted from DynamoDB) and creates/deletes
mock object in a specified S3 bucket. Object is associated with the user via prefix, where prefix is equal to that user's name.

Code assumes that DynamoDB table items have primary key called `name` which is a _string_.

```javascript
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const bucket = 'S3-bucket-name';

exports.handler = (event, context, callback) => {
    event.Records.forEach(record => {
        const userName = record.dynamodb.Keys.name.S; // get name attribute
        const eventName = record.eventName;

        // if there was an insert DB event, create new object with prefix equal to username
        // if there was a delete DB event, delete the object belonging to the deleted user
        if (eventName === 'INSERT') {
            const userData = Buffer.from('just some data', 'utf8');

            const params = {
                Body: userData,
                Bucket: bucket,
                Key: `${userName}/userdata`
            };

            s3.putObject(params, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(
                        `S3 object successfully created for user: ${userName}`
                    );
                }
            });
        } else if (eventName === 'REMOVE') {
            const params = {
                Bucket: bucket,
                Key: `${userName}/userdata`
            };

            s3.deleteObject(params, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(
                        `S3 object was successfully removed for user: ${userName}`
                    );
                }
            });
        }
    });
};
```
