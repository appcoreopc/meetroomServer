import { Router, Request, Response } from 'express';
import { UserDao } from '../models/UsersDao'; 
import { CosmosClient } from "@azure/cosmos";
import { AzureStorageService } from '../services/AzureStorageService';

var multer = require('multer')
var MulterAzureStorage = require('multer-azure-storage')

const endpoint = "https://localhost:8081";   // Add your endpoint
const masterKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";  // Add the masterkey of the endpoint
const client = new CosmosClient({endpoint, auth: { masterKey }});

const userDao = new UserDao(client, 'meetroomdb', 'Users');
// Assign router to the express.Router() instance
const router: Router = Router();

router.get('/', (req: Request, res: Response) => {
    
    //userDao.init();
    //let a = userDao.getUser('1');

    handleStorageTest();
 
    res.send('login, World!');
});

async function handleStorageTest() { 

    const azureService = new AzureStorageService('taskcontainer');
    let state = await azureService.upload('serkoApp.json', 'serkoApp.json');
    let state3 = await azureService.upload('serkoApp.json', 'serkoApp2.json');
    let state2 = await azureService.removeFile('serkoApp2.json');   
}

router.put('/', (req: Request, res: Response) => {
    // Reply with a hello world when no name param is provided
    res.send('update, World!');
});

// delete user 
router.delete('/', (req: Request, res: Response) => {
    // Extract the name from the request parameters
    let { name } = req.params;
    
    // Greet the given name
    res.send(`delete, ${name}`);
});

// create user 
router.post('/create', (req: Request, res: Response) => {
    // Extract the name from the request parameters
    //let { name } = req.params;
    
    console.log(req.body);
    // Greet the given name
    res.send(`create`);
});

// login
router.post('/login', (req: Request, res: Response) => {
    // Extract the name from the request parameters
    let { name } = req.params;
    
    // Greet the given name   
    res.send(`login, ${name}`);
});

// Export the express.Router() instance to be used by server.ts
export const UsersController: Router = router;