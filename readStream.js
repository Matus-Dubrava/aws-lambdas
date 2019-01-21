const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const bucket = 'S3-bucket-name';

exports.handler = (event, context, callback) => {
    event.Records.forEach(record => {
        const userName = record.dynamodb.Keys.name.S;
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
