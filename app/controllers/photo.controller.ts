
import { Router, Request, Response } from 'express';
import { PhotoDao } from '../models/PhotoDao';
import { CosmosClient } from '@azure/cosmos';
       
let awsBucket : string = '';

if (process.env.AWS_BUCKET) 
  awsBucket = process.env.AWS_BUCKET;

const endpoint = "https://localhost:8081";   // Add your endpoint
const masterKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";

const client = new CosmosClient({endpoint, auth: { masterKey }});
const photoProvider = new PhotoDao(client, 'meetroomdb', 'Photos');

const router: Router = Router();

//1. upload to azure s3 and
//2. update cosmodb database

router.post('/', async () => { 
    //upload.single('photo'), (req : Request, res : Response, next : any) => {
    //res.json(req.file)
});

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