import express,  { Request, Response } from 'express';
import aws, {S3} from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

// Import WelcomeController from controllers entry point
import { WelcomeController } from './controllers';
import { AuthenticationController } from './controllers/authentication.controller';

// Create a new express application instance
const app: express.Application = express();
// The port the express app will listen on
const port: number = 3000;

const s3Config:S3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",
  });
        
let awsBucket : string = '';

if (process.env.AWS_BUCKET) 
  awsBucket = process.env.AWS_BUCKET;
  
const upload = multer({
    storage: multerS3({s3 : s3Config,
      bucket: awsBucket,
      acl: 'public-read',
      metadata(req, file, cb) {
        cb(null, {fieldName: file.fieldname});
      },
      key(req, file, cb) {
        cb(null, Date.now().toString() + '.png');
      }
    })
});

app.use(express.json());

// Mount the WelcomeController at the /welcome route
app.use('/welcome', WelcomeController);

app.use('/user', AuthenticationController);

app.post('/upload', () => { 
    upload.single('photo'), (req : Request, res : Response, next : any) => {
    res.json(req.file)
}});

// Serve the application at the given port
app.listen(port, () => {
    // Success callback
    console.log(`Listening at http://localhost:${port}/`);
});

