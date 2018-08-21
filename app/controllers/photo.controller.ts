
import { Router, Request, Response } from 'express';
       
let awsBucket : string = '';

if (process.env.AWS_BUCKET) 
  awsBucket = process.env.AWS_BUCKET;
  
// Assign router to the express.Router() instance
const router: Router = Router();

router.post('/', async () => { 
    //upload.single('photo'), (req : Request, res : Response, next : any) => {
    //res.json(req.file)
});

router.get('/:username', async (req: Request, res: Response) => {

    let { name } = req.params;
    // Greet the given name
    res.send(`photo, ${name}`);
  });
  
// Export the express.Router() instance to be used by server.ts
export const PhotoController: Router = router;