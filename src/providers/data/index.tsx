import { GraphQLClient } from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";

//  The URL of the GraphQL API
const API_URL = "https://api.crm.refine.dev";

//  GraphQL client that will make requests to the graphQL API
export const client = new GraphQLClient(API_URL, {
    // Define a fetch query. A call back function that accepts a url of the type string and an options object of type RequestInit which is a built-in interface in TypeScript that defines the properties that can be used to configure a fetch request.
    fetch: (url: string, options: RequestInit) => {
        try {
            return fetchWrapper(url, options);  // Call the fetchWrapper function and pass the url and options and authorization happens automatically
        } catch (error) {
            return Promise.reject(error);
        }
    }
    
})

// we are going to make a web socket that is going to listen to subscriptions to this graphQL API. So whenever the changes happen in the database, we can listen to those changes in real time. 
// Why we are doing this within the data provider is because we want to make sure that we are listening to the changes in the database and updating the UI in real time.
// in refine similar to the concept of data provider , there is a built in provider named live provider that allows us to listen to the changes in the database in real time.
// similar to what we did in the data provider we will create a graphql socket client that will listen to the changes in the database in real time, using the library called graphql-ws. and provide the websocket url it should listen to. All of this we can then pass to refine and tell it to listen to changes in realtime.
// one thing we can keep in mind with the configuration of the liveProvider is to activate live features in refine by passing the liveProvider to the refine component.

