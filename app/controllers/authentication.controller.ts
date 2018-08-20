
import { Router, Request, Response } from 'express';
import { PhotoDao } from '../models/PhotoDao'; 
import { CosmosClient } from "@azure/cosmos";
import { UserDao } from '../models/UsersDao'; 

const endpoint = "https://localhost:8081";   // Add your endpoint
const masterKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";  // Add the masterkey of the endpoint
const client = new CosmosClient({endpoint, auth: { masterKey }});
const userDao = new UserDao(client, 'meetroomdb', 'Users');

// Assign router to the express.Router() instance
const router: Router = Router();

// authenticate user 
router.get('/', async (req: Request, res: Response) => {
    // Extract the name from the request parameters
    res.send('authenticated, ${name}');
});

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