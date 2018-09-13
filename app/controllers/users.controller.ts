
import { Router, Request, Response } from 'express';
import { UserDao } from '../models/UsersDao'; 
import { CosmosClient } from "@azure/cosmos";
import { AzureStorageService } from '../services/AzureStorageService';
import { Config } from '../config';

var multer = require('multer')
var MulterAzureStorage = require('multer-azure-storage')

// const endpoint = Config.endpoint;  
// const masterKey = Config.masterKey;

const endpoint = "https://localhost:8081";   // Add your endpoint
const masterKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";

const client = new CosmosClient({endpoint, auth: { masterKey }});
const userDao = new UserDao(client, Config.databaseId, Config.userCollection);

// Assign router to the express.Router() instanc
const router: Router = Router();

router.get('/all', async (req: Request, res: Response) => { 
    console.log('get all users');
    let userResult = await userDao.getAll();  
    res.send(userResult);
});

router.get('/:username', async (req: Request, res: Response) => {  
   
    let userResult = null; 
    let username = req.params.username;

    if (username) {
       userResult = await userDao.getUser(username);
    }    
    res.send(userResult);
});

async function handleStorage() { 

    const azureService = new AzureStorageService('taskcontainer');
    let state = await azureService.upload('serkoApp.json', 'serkoApp.json');
    let state3 = await azureService.upload('serkoApp.json', 'serkoApp2.json');
    let state2 = await azureService.removeFile('serkoApp2.json');   
}

router.put('/', async (req: Request, res: Response) => {
    // Reply with a hello world when no name param is provided
    res.send('update, World!');
});

// delete user 
router.delete('/:userid', async (req: Request, res: Response) => {
    // Extract the name fromusresthe request parameters
    let { name } = req.params.userid;
    
    // Greet the given name
    res.send(`delete, ${name}`);
});

// create user 
router.post('/create', async (req: Request, res: Response) => {
    // Extract the name from the request parameters
    //let { name } = req.params;
    
    console.log(req.body);
    // Greet the given name
    res.send(`create`);
});

// Update role //
router.post('/updateRole', async (req: Request, res: Response) => {
    // Extract the name from the request parameters
    let { username, role} = req.body;
    console.log(req.body);
    let status = await userDao.updateUser(username, 1);    
    // Greet the given name   
    res.send(`updated role`);
});

// Export the express.Router() instance to be used by server.ts
export const UsersController: Router = router;