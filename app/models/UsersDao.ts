
import { CosmosClient, Database } from "@azure/cosmos";

// id
// username
// email 
// role
// datetime
// organization
// sample query spec //
// const userQuerySpec = {    
//     query: "SELECT * FROM users r WHERE r.username=@username",
//     parameters: [
//         {
//             name: "@username",
//             value: 'jeremy'
//         },
//         {
//             name: "@password",
//             value: 'password'
//         }
//     ]
// };

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
        
        this.init();
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
    
    async executeQuery(querySpec : any) {                        
        const { result: results } = await this.container.items.query(querySpec).toArray();        
        return results;           
    }
    
    async addUser() { 
        
        const { body : doc } = await this.container.items.create({
            'name' : 'jeremy', 
            'password' : 'password'
        })          
    }
    
    async getUser(username: string) {  
        
        const userQuerySpec = {
            query: "SELECT * FROM users u WHERE u.username=@username",
            parameters: [
                {
                    name: "@username",
                    value: username
                }
            ]
        };
        
        let queryResult =  await this.executeQuery(userQuerySpec);  
        console.log(queryResult);  
        return queryResult; 
    }
    
    async removeUser(itemId: string) { 
        
        await this.container.item(itemId).delete(itemId);
        console.log('Deleted item:\n${itemBody.id}\n');
    }
    
    async authenticateUser(username : string, password : string) {
        
        const userQuerySpec = {
            query: "SELECT * FROM users u WHERE u.username=@username AND u.password=@password",
            parameters: [
                {
                    name: "@username",
                    value: username
                },
                {
                    name: "@password",
                    value: password
                }
            ]
        };
        
        
        let queryResult =  await this.executeQuery(userQuerySpec);  
        console.log(queryResult);
        
        if (queryResult && queryResult.length > 0) { 
            return true;            
        }
        return false;  
    }
    
    async updateUser(username : string, role : number) {
        
        let userDataResult = await this.getUser(username);
        
        if (userDataResult)        
        {
            console.log('able to retrieve item to update.');
            userDataResult[0].username = username; 
            // if (userDataResult.role) {
            //     userDataResult.role = role;                 
            // }
            userDataResult[0].role = role;             
            console.log(userDataResult);
            const { body: replaced } = await this.container.item(userDataResult[0].id).replace(userDataResult[0]);
            console.log(replaced);
            return replaced;
        }        
        return null;        
    }
}