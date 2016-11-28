var S3Adapter = require('parse-server-s3-adapter');

module.exports = {
  applicationId: "PARSE_APPLICATION_ID",
  masterKey: "PARSE_MASTER_KEY",
  mongoURL: "mongodb://<username>:<password>@mongourl.com:27017/database_name",
  serverURL: "https://api.customparseserver.com/parse",
  filesToTransfer: 'parseOnly',
  renameInDatabase: false,
  transferTo: 's3',

  // For S3 configuration
  aws_accessKeyId: "ACCESS_KEY_ID",
  aws_secretAccessKey: "SECRET_ACCESS_KEY",
  aws_bucket: "BUCKET_NAME",
  aws_bucketPrefix: "",

  // Or set filesAdapter to a Parse Server S3 file adapter
  // filesAdapter: new S3Adapter({
  //   accessKey: 'ACCESS_KEY_ID',
  //   secretKey: 'SECRET_ACCESS_KEY',
  //   bucket: 'BUCKET_NAME'
  // }),
};
