
import { Router, Request, Response } from 'express';
import { UserDao } from '../models/UsersDao'; 
import { CosmosClient } from "@azure/cosmos";
var azure = require('azure-storage');


var multer = require('multer')
var MulterAzureStorage = require('multer-azure-storage')

const endpoint = "https://localhost:8081";   // Add your endpoint
const masterKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";  // Add the masterkey of the endpoint
const client = new CosmosClient({endpoint, auth: { masterKey }});

const userDao = new UserDao(client, 'meetroomdb', 'Users');
// Assign router to the express.Router() instance
const router: Router = Router();

// set AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=http;AccountName='devstoreaccount1';AccountKey='Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw=='
//set HTTP_PROXY= http://127.0.0.1:8888


router.get('/', (req: Request, res: Response) => {
    // Reply with a hello world when no name param is provided
    
    //userDao.init();
    //let a = userDao.getUser('1');
        
    var blobService = azure.createBlobService("UseDevelopmentStorage=true");
    
    blobService.createContainerIfNotExists('taskcontainer', {
        publicAccessLevel: 'blob'
    }, function(error:any, result:any, response:any) {
        if (!error) {
            // if result = true, container was created.
            // if result = false, container already existed.
        }
    });
        
    var upload = multer({
        storage: new MulterAzureStorage({
            azureStorageConnectionString: 'DefaultEndpointsProtocol=https;AccountName=mystorageaccount;AccountKey=mykey;EndpointSuffix=core.windows.net',
            containerName: 'photos',
            containerSecurity: 'blob'
        })
    });
    
    
    
    res.send('login, World!');
});

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