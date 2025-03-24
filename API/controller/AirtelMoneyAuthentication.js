import express from "express"
import dotenv from "dotenv"
import fetch from "node-fetch"



dotenv.config();

// const client_id = process.env.CLIENT_ID
// const client_secret = process.env.SECRET_KEY


export const getAnthToken = async () => {
    try {
        const response = await fetch('https://openapiuat.airtel.africa/auth/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "client_id": process.env.CLIENT_ID,
                "client_secret": process.env.SECRET_KEY,
                "grant_type": "client_credentials"
            })
        });

        const data = await response.json();
        console.log("Airtel Auth Response:", data); // Log full response

        if (!data.access_token) {
            console.error("Failed to get a valid authentication token:", data);
            return null; // Return null if authentication fails
        }

        return data.access_token;
    } catch (error) {
        console.error("Error getting authentication token:", error);
        return null;
    }
};
