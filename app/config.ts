export const Config = {
    endpoint : process.env.HOST || "https://meetroomdatabase.documents.azure.com:443/",
    masterKey : process.env.AUTH_KEY || "BkMkhVWr1gUOOvrXcTN50mnB4wmSEEJd1I4hqqyctL9pMXpMgZDqH87aRjlJsBjVRXOr3KQlzTfqCBe77ftnRA==",
    databaseId : "meetroomdb",
    containerId : "Items",
    userCollection : 'users',
    photoCollection : 'photos',
    azureStoreConnectionString : 'DefaultEndpointsProtocol=https;AccountName=meetroomstorage;AccountKey=1pbeX5cw5UWRCd5WtH24wgyioeIAGCibJenDkx06hmcbAMHzE9nPR/iLOv8Acf3M055d6vlLB+GeK5ZprgpfNQ==;EndpointSuffix=core.windows.net'
};
