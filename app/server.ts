import express from 'express';
import { AuthenticationController } from './controllers/authentication.controller';
import { UsersController } from './controllers/users.controller';
import { PhotoController } from './controllers/photo.controller';

import * as bodyParser from "body-parser";
// Create a new express application instance
const app: express.Application = express();
// The port the express app will listen on
const port: number = 3000;

// const s3Config:S3 = new aws.S3({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: "us-east-1",
//   });
        
// let awsBucket : string = '';

// if (process.env.AWS_BUCKET) 
//   awsBucket = process.env.AWS_BUCKET;
  
// const upload = multer({
//     storage: multerS3({s3 : s3Config,
//       bucket: awsBucket,
//       acl: 'public-read',
//       metadata(req, file, cb) {
//         cb(null, {fieldName: file.fieldname});
//       },
//       key(req, file, cb) {
//         cb(null, Date.now().toString() + '.png');
//       }
//     })
// });

app.use(express.json());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({     
    extended: true
  })); 

app.use('/authenticate', AuthenticationController);

app.use('/users', UsersController);

app.use('/photo', PhotoController);

// Serve the application at the given port
app.listen(port, () => {
    // Success callback

    console.log(`Listening at http://localhost:${port}/`);
});

