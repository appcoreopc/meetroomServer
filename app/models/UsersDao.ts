
import { CosmosClient, Database } from "@azure/cosmos";

const endpoint = "https://localhost:8081";   // Add your endpoint
const masterKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";  // Add the masterkey of the endpoint
//const client = new CosmosClient({endpoint, auth: { masterKey }});

class PhotosDao { 
        
    client : CosmosClient;
    databaseId : string; 
    collectionId : string;
   
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

        let database = dbResponse.database;
        console.log("Setting up the database...done!");
        console.log("Setting up the container...");
        const coResponse = await this.database.containers.createIfNotExists({
            id: this.collectionId
        });
        this.container = coResponse.container;
        console.log("Setting up the container...done!");
    }
}