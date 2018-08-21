
import { Router, Request, Response } from 'express';
import { PhotoDao } from '../models/PhotoDao'; 
import { CosmosClient } from "@azure/cosmos";
import { UserDao } from '../models/UsersDao'; 
import { Config } from '../config';

const endpoint = Config.endpoint;  
const masterKey = Config.masterKey;''
const client = new CosmosClient({endpoint, auth: { masterKey }});
const userDao = new UserDao(client, 'meetroomdb', Config.userCollection);

// Assign router to the express.Router() instance
const router: Router = Router();

// authenticate user 
router.post('/', async (req: Request, res: Response) => {
    // Extract the name from the request parameters
    console.log(req.body);    
    let { username, password } = req.body;
    let authenticateResult:boolean = false;
    if (username) {   
        let authenticateResult = await userDao.authenticateUser(username, password); 
        console.log(authenticateResult);
        return authenticateResult;
    }  
    // Greet the given name   
    res.send(authenticateResult);
});

// Export the express.Router() instance to be used by server.ts
export const AuthenticationController: Router = router;