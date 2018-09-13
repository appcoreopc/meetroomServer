
import { Router, Request, Response } from 'express';
import { PhotoDao, IPhotoInfo } from '../models/PhotoDao';
import { CosmosClient } from '@azure/cosmos';
import { Config } from '../config';

let awsBucket : string = '';

if (process.env.AWS_BUCKET) 
awsBucket = process.env.AWS_BUCKET;

// const endpoint = Config.endpoint;  
// const masterKey = Config.masterKey;
const azureStoreConnectionString = Config.azureStoreConnectionString;

var multer = require('multer')
var MulterAzureStorage = require('multer-azure-storage')
var upload = multer({
  storage: new MulterAzureStorage({
    azureStorageConnectionString: azureStoreConnectionString,
    containerName: 'photos',
    containerSecurity: 'blob'
  })
})

const endpoint = "https://localhost:8081";   // Add your endpoint
const masterKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";

const client = new CosmosClient({ endpoint, auth: { masterKey }});
const photoProvider = new PhotoDao(client, Config.databaseId, Config.photoCollection);

const router: Router = Router();

//1. upload to azure s3 and
//2. update cosmodb database
var azStoreUpload = upload.single('image');

router.post('/',  async (req: Request, res: Response) => {
  
  let response = await azStoreUpload(req, res, function(err : any) {
    
    if (!err) {
      let objectJson : any = res.json();
      //console.log('completed from multer itself.')
      //console.log(objectJson.req.body);
      console.log(objectJson.req.file.url);              
      
      if (req.body.username && req.body.description)
      {
        const photoInfo = { 
          username : req.body.username,
          description : req.body.description, 
          url : objectJson.req.file.url
        }

        let dbInfoStatus = photoProvider.insertPhotoInfo(photoInfo);
        console.log(dbInfoStatus);
        //res.send("photo uploaded.");
      }

    }
    else { 
      console.log(err);
    }
  });
    
  // let objectJson : any = res.json();
  
  // console.log(objectJson.req.body);
  // console.log(objectJson.req.file.url); 
  
  // const photoInfo = { 
  //   username : req.body.username,
  //   description : req.body.description, 
  //   url : objectJson.req.file.url
  // }
  
  // photoProvider.insertPhotoInfo(photoInfo);
  
  // insert data into database //    
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  //res.send("photo uploaded.");
})

// Get by user 
router.get('/user/:username', async (req: Request, res: Response) => {
  
  let { username } = req.params;
  console.log('getuser ' + username);
  let result = await photoProvider.getUserPhoto(username);
  console.log(result);
  // Greet the given name
  res.send(result);
});

// Get by photoId 
router.get('/:photoId', async (req: Request, res: Response) => {
  
  let { photoId } = req.params;
  console.log('getuser ' + photoId);
  
  let result = await photoProvider.getPhoto(photoId);
  console.log(result);
  res.send(result);
});


// Export the express.Router() instance to be used by server.ts
export const PhotoController: Router = router;