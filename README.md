# parse-files-utils-s3
[![Build Status](https://travis-ci.org/parse-server-modules/parse-files-utils.svg?branch=master)](https://travis-ci.org/parse-server-modules/parse-files-utils)
[![codecov](https://codecov.io/gh/parse-server-modules/parse-files-utils/branch/master/graph/badge.svg)](https://codecov.io/gh/parse-server-modules/parse-files-utils)

Utilities to list and migrate Parse files using s3.

This utility will do the following:

1. Get all files across all classes in a Parse database.
2. Print file URLs to console OR transfer to S3.
3. Rename files so that [Parse Server](https://github.com/ParsePlatform/parse-server) no longer detects that they are hosted by Parse.
4. Update MongoDB with new file names.

**Note:** This is a forked version of the original [parse-files-utils](https://github.com/parse-server-modules/parse-files-utils). It has been updated to work with latest libraries. This version only converts files to **S3**, NOT FileSystem or Google Cloud.

The same disclaimers found on the original repository apply here as well.

## Installation

1. Clone the repo: `git clone git@github.com:acmeyer/parse-files-utils-s3.git`
2. cd into repo: `cd parse-files-utils-s3`
3. Install dependencies: `npm install`

## Usage

The quickest way to get started is to run `npm start` and follow the command prompts.

You can optionally specify a js/json configuration file (see [config.example.js](./config.example.js)).
```
$ npm start config.js
```

### Available configuration options

* `applicationId`: Parse application id.
* `masterKey`: Parse master key.
* `serverURL`: The URL for the Parse server (default: http://api.parse.com/1).
This is used to with `applicationId` and `masterKey` to get the schema and fetch all files/objects.
* `renameFiles` (boolean): Whether or not to rename Parse hosted files.
This removes the "tfss-" or legacy Parse filename prefix before saving with the new file adapter.
* `renameInDatabase` (boolean): Whether or not to rename files in MongoDB.
* `mongoURL`: MongoDB connection url.
Direct access to the database is needed because Parse SDK doesn't allow direct writing to file fields.
* `filesToTransfer`: Which files to transfer.
Accepted options:
  * `"parseOnly"`: only process files with a filename that starts with "tfss-" or matches Parse's legacy file name format.
  * `"parseServerOnly"`: only process files with a filename that **does not** start with "tfss-" nor match Parse's legacy file name format.
  * `"all"`: process all files.
* `filesAdapter`: A Parse Server file adapter with a function for `createFile(filename, data)`  
(ie.
[parse-server-s3-adapter](https://github.com/parse-server-modules/parse-server-s3-adapter)).
* `aws_accessKeyId`: AWS access key id.
* `aws_secretAccessKey`: AWS secret access key.
* `aws_bucket`: S3 bucket name.
* `asyncLimit`: The number of files to process at the same time (default: 5).


## Parse File Migrations

If you need to migrate files from hosted Parse.com to self-hosted Parse Server,
you should follow one of the below strategies.
Given [ParsePlatform/parse-server#1582](https://github.com/ParsePlatform/parse-server/issues/1582),
there will not be any updates to api.parse.com. This leaves two options for the file migration.
Each one has its own set of advantages and disadvantages.

**Option 1**:
"Supporting clients that access via api.parse.com is *not* important"
* File utils configuration:
  * `filesToTransfer`: 'parseOnly'
  * `renameFiles`: true
  * `renameInDatabase`: true
* Parse Server configuration: keep using `fileKey` in settings
* After file migration:
  * api.parse.com clients:
    * can not see all previously uploaded files
    * can not see files uploaded by Parse Server clients
    * can see new files uploaded by api.parse.com clients
  * Parse Server clients:
    * can see all previously uploaded files
    * can see new files uploaded by api.parse.com clients
    * can see new files uploaded by Parse Server clients
* Additional steps required:
  * Run file migration again after all clients switch to Parse Server or before Jan 28

**Option 2**:
"Supporting clients that access via api.parse.com is important"
* File utils configuration:
  * `filesToTransfer`: 'parseOnly'
  * `renameFiles`: false
  * `renameInDatabase`: false
* Parse Server configuration:
  * Use version >= 2.2.16
  * remove `fileKey` from settings
* After file migration:
  * api.parse.com clients:
    * can see all previously uploaded files
    * can not see files uploaded by Parse Server clients
  * Parse Server clients:
    * can see all migrated files
    * can not see new files uploaded by api.parse.com clients
* Additional steps required:
  * Run file migration again after all clients switch to Parse Server or before Jan 28
