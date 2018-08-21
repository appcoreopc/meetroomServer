

export const Config = {
    endpoint : process.env.HOST || "https://localhost:8081/",
    masterKey : process.env.AUTH_KEY || "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==",
    databaseId : "meetroomdb",
    containerId : "Items",
    userCollection : 'users',
    photoCollection : 'photos'
};
