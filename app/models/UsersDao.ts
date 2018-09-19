
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

interface ILoginResult { 
    username? : string, 
    role? : string, 
    status? : string
}

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
        
        console.log("users : Setting up the database...");
        const dbResponse = await this.client.databases.createIfNotExists({
            id: this.databaseId
        });
        
        this.database = dbResponse.database;
        console.log("users : Setting up the container...");
        const coResponse = await this.database.containers.createIfNotExists({
            id: this.collectionId
        });
        
        this.container = coResponse.container;
        console.log("users : Setting up the container...done!");
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
        return queryResult; 
    }

    async getUserId(userid: string) {  
        
        const userQuerySpec = {
            query: "SELECT * FROM users u WHERE u.id=@userid",
            parameters: [
                {
                    name: "@userid",
                    value: userid
                }
            ]
        };

        let queryResult =  await this.executeQuery(userQuerySpec);  
        return queryResult; 
    }


    


    async getAll() {  

        const userQuerySpec = {
            query: "SELECT * FROM users "
        };
                
        let queryResult =  await this.executeQuery(userQuerySpec);  
        console.log(queryResult);
        return queryResult; 
    }
    
    async removeUser(itemId: string) { 
        
        await this.container.item(itemId).delete(itemId);
        console.log('Deleted item:\n${itemBody.id}\n');
    }
    
    async authenticateUser(username : string, password : string): Promise<ILoginResult> {
             
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
        
        if (queryResult && queryResult.length > 0) {

           let result = { username : username, role : queryResult[0].role, status : 'true' }            
           return new Promise(resolve => {
                resolve(result);
             });                      
        }

        return new Promise(resolve => {
            resolve({ username : username, role : -1, status : 'false' });
        })
    }
    
    async updateUser(usersid : string[], role : number) {

         for (let index = 0; index < usersid.length; index++) {
             const element = usersid[index];

             let userDataResult = await this.getUserId(element);

             if (userDataResult)        
             {
                 console.log('able to retrieve item to update.');                
                 userDataResult[0].role = role; 
                  userDataResult[0].role = role;             
                 console.log(userDataResult);
                 const { body: replaced } = await this.container.item(userDataResult[0].id).replace(userDataResult[0]);
                 console.log(replaced);
                 return replaced;
             }   
         }
                
        return null;        
    }
}