import {getAnthToken} from "./AirtelMoneyAuthentication.js"

export const validateNummber = async (phoneNumber) => {
    try {
        const token = await getAnthToken();
        
        if (!token) {
            console.error("Token is invalid. Cannot validate number.");
            return { status: { success: false }, message: "Authentication failed" };
        }

        const response = await fetch('https://openapiuat.airtel.africa/airtel_money/validate_number', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'x-country': 'MW',
                'x-currency': 'MWK'
            },
            body: JSON.stringify({ "msisdn": phoneNumber })
        });

        const data = await response.json();
        console.log("Airtel API Response:", data);

        return data;
    } catch (error) {
        console.error("Error validating number:", error);
        return { status: { success: false } };
    }
};
