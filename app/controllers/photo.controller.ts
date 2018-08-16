
import { Router, Request, Response } from 'express';
import aws, {S3} from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { CosmosClient } from "@azure/cosmos";
const endpoint = "https://localhost:8081";   // Add your endpoint
const masterKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";  // Add the masterkey of the endpoint
const client = new CosmosClient({endpoint, auth: { masterKey }});


const s3Config:S3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",
  });
        
let awsBucket : string = '';

if (process.env.AWS_BUCKET) 
  awsBucket = process.env.AWS_BUCKET;
  
// Assign router to the express.Router() instance
const router: Router = Router();

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
     
router.post('/', () => { 
    upload.single('photo'), (req : Request, res : Response, next : any) => {
    res.json(req.file)
}});

router.get('/:username', (req: Request, res: Response) => {

    let { name } = req.params;
    // Greet the given name
    res.send(`photo, ${name}`);
  });
  
// Export the express.Router() instance to be used by server.ts
export const PhotoController: Router = router;