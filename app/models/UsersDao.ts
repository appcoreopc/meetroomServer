
import { CosmosClient, Database } from "@azure/cosmos";
import { int } from "../../node_modules/aws-sdk/clients/datapipeline";

const endpoint = "https://localhost:8081";   // Add your endpoint
const masterKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";  // Add the masterkey of the endpoint
//const client = new CosmosClient({endpoint, auth: { masterKey }});

// id
// username
// email 
// role
// datetime
// organization

// sample query spec //
const userQuerySpec = {
    
    query: "SELECT * FROM users r WHERE r.completed=@completed",
    parameters: [
        {
            name: "@completed",
            value: false
        }
    ]
};

export class UserDao { 
    
    client : CosmosClient;
    databaseId : string; 
    collectionId : string;
    database : any = null;
    container : any = null;
    
    constructor(cosmosClient : CosmosClient, databaseId : string, collectionId : string )
    { 
        this.client = cosmosClient;
        this.databaseId = databaseId;
        this.collectionId = collectionId;
    }    
    
    async init() {
        
        console.log("Setting up the database...");
        const dbResponse = await this.client.databases.createIfNotExists({
            id: this.databaseId
        });
        
        this.database = dbResponse.database;
        console.log("Setting up the database...done!");
        console.log("Setting up the container...");
        const coResponse = await this.database.containers.createIfNotExists({
            id: this.collectionId
        });
        
        this.container = coResponse.container;
        console.log("Setting up the container...done!");
    }
    
    async find(querySpec : any) {         
        const { result: results } = await this.container.items
        .query(querySpec)
        .toArray();
        return results;           
    }
    
    async addUser() { 
        
        const { body : doc } = await this.container.items.create({
            'name' : 'jeremy', 
            'password' : 'uGuessedit'
        })  
    }
    
    async getUser(itemId: int) {       
        
        const { body } = await this.container.item(itemId).read();
        return body;                
    }
        
    async removeUser() { 
        
        // const { body : doc } = await this.container.items({
        //     'name' : 'jeremy', 
        //     'password' : 'uGuessedit'
        // })  
    }
}