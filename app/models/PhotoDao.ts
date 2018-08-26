
import { CosmosClient, Database } from "@azure/cosmos";

const endpoint = "https://localhost:8081";   // Add your endpoint
const masterKey = "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";  

// {  
//   "info" : "text", 
//   "url" : "imageurl",
//   "username" : "jeremy"
// }

export interface IPhotoInfo { 
    username : string, 
    url : string, 
    description : string
}

export class PhotoDao { 
        
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

        this.init();
    }    
    
    async init() {
        
        console.log("photos : Setting up the database...");
        const dbResponse = await this.client.databases.createIfNotExists({
            id: this.databaseId
        });

        this.database = dbResponse.database;
        console.log("photos :Setting up the database...done!");
      
        const coResponse = await this.database.containers.createIfNotExists({
            id: this.collectionId
        });

        this.container = coResponse.container;
        console.log("photos : Setting up the container...done!");
    }


    async getUserPhoto(username : string) { 

        const userQuerySpec = {
            query: "SELECT * FROM photos u WHERE u.username=@username",
            parameters: [
                {
                    name: "@username",
                    value: username
                }]
        };     

        let queryResult =  await this.executeQuery(userQuerySpec);  
        return queryResult; 
    }
    
    async getPhoto(photoId : string ) { 

        const userQuerySpec = {
            query: "SELECT * FROM photos u WHERE u.id=@photoId",
            parameters: [
                {
                    name: "@photoId",
                    value: photoId
                }]
        };   

        let queryResult =  await this.executeQuery(userQuerySpec);  
        return queryResult; 
    }

    async executeQuery(querySpec : any) { 

        const { result: results } = await this.container.items.query(querySpec).toArray();        
        return results;           
    }

    async insertPhotoInfo(photoJsonData : IPhotoInfo) { 
          
        const { body : doc } = await this.container.items.create({
            'username' : photoJsonData.username, 
            'url' : photoJsonData.url, 
            'description' : photoJsonData.description
        });      

        return doc;          
    }
}