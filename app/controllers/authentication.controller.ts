
import { Router, Request, Response } from 'express';
import { PhotoDao } from '../models/PhotoDao'; 
import { CosmosClient } from "@azure/cosmos";
import { UserDao } from '../models/UsersDao'; 
import { Config } from '../config';

// const endpoint = Config.endpoint;  
// const masterKey = Config.masterKey;''

const endpoint = "https://localhost:8081";   // Add your endpoint
const masterKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";

const client = new CosmosClient({endpoint, auth: { masterKey }});
const userDao = new UserDao(client, Config.databaseId, Config.userCollection);

// Assign router to the express.Router() instance
const router: Router = Router();
// authenticate user 
router.post('/', async (req: Request, res: Response) => {
    //console.log(req.body);    
    let { username, password } = req.body;
    let authenticateResult = {};

    if (username) {   
        authenticateResult = await userDao.authenticateUser(username, password); 
        console.log('AUTHENTICATED form server');
        console.log(authenticateResult);    
    }    
    res.send(authenticateResult);
});

// Export the express.Router() instance to be used by server.ts
export const AuthenticationController: Router = router;