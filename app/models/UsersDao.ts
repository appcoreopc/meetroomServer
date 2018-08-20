
import { CosmosClient, Database } from "@azure/cosmos";
import { NOTIMP } from "dns";

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
        }); 
        console.log('inserted');
    }
    
    async getUser(itemId: string) {       
        
        const { body } = await this.container.item(itemId).read();
        return body;                
    }


    async getUsers() {

        const querySpec = {
            query: "SELECT * FROM Users "            
        };
    
        const { result: results } = await this.container.items.query(querySpec).toArray();
        
        for (var queryResult of results) {
            let resultString = JSON.stringify(queryResult);
            console.log(`\tQuery returned ${resultString}\n`);
        }

    }
    
    async removeUser(itemId: string) { 
        await this.container.item(itemId).delete(itemId);
        console.log('Deleted item:\n${itemBody.id}\n');
    }
}