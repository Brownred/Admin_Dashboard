/*
Our custom fetch function. Think of it as middleware, because it is gonna be happening on top or before every single fetch we make. And we have added a custom error handling function to it in the fetchWrapper function package which we can export.

// creating a custom fetch is verry useful for making requests to the API improving code reusability. This is because it allows you to add custom headers, handle errors, and perform other operations before making the request.
*/

import { GraphQLFormattedError } from "graphql";

type Error = {
    message: string;
    statusCode: string;
};

// we can define some specifics for every request that we make.

const customFetch = async (url: string, options: RequestInit) => {
    // we wanna add authorization headers. First get access token from the local storage
    const accessToken = localStorage.getItem("access_token");

    // get headers from the options object
    const headers = options.headers as Record<string, string>; //type created to define the headers object

    // we can return the fetch request with the added authorization headers
    // we pass the origina url that we passed to the original function.
    return fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${accessToken}`, // if the headers object has an Authorization key, we use it, otherwise we add the access token
            "content-Type": "application/json", 
            // This helps to prevent CORS errors
            "Apollo-Require-Preflight": "true",
        },
    });
};

// Buld a comprehensive error handling solution. Since we will be dealling with a lot of data, we want to make sure that we handle errors properly, and we are getting the data that we querried.
const getGraphQLError = (body: Record<"errors", GraphQLFormattedError[] | undefined>): Error | null => {
    if(!body) {
        return {
            message: 'unknown error',
            statusCode: "INTERNAL_SERVER_ERROR"
        }
    }

    if ("errors" in body) {
        const errors = body?.errors;
        // Join the errors in a single string
        const messages = errors?.map((error) => error?.message).join("");
        const code = errors?.[0]?.extensions?.code;

        return {
            message: messages || JSON.stringify(errors),
            statusCode: code || 500,
        };
    }

    return null;
}; // we can use this and fuse it with the custom fetch function to create a comprehensive error handling solution.

export const fetchWrapper = async (url: string, options: RequestInit) => {
    const response = await customFetch(url, options);
    
    const responseClone = response.clone(); // clone the response so that we can use it multiple times without consuming it. since we can only consume it once.

    const body = await responseClone.json(); // parse the response body as json

    const error = getGraphQLError(body); // get the error from the response body

    if (error) {
        throw error;
    }

    return response;
};

