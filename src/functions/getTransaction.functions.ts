import axios from 'axios';
import { Transaction } from '../types';


async function SHA256Checker(hash: string) {
    const types = ["btc", "ltc", "doge"]
    for (let i = 0; i < types.length; i++) {
        try {
            const response = await axios.get(`https://api.blockcypher.com/v1/${types[i]}/main/txs/${hash}&includeHex=true`, {
                headers: {
                    'X-Scope': '8a22163c-8662-4535-9050-bc5e1923df48',
                    "Accept": "application/json"
                }
            });
            return FetchTransactionAdress(response.data.addresses[0], types[i]);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(JSON.stringify(error.message));
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }
    return;
}

async function FetchTransaction(hash: string, type: string): Promise<Transaction> {
    try {
        const response = await axios.get(`https://api.blockcypher.com/v1/${type}/main/txs/${hash}&includeHex=true`, {
            headers: {
                'X-Scope': '8a22163c-8662-4535-9050-bc5e1923df48',
                "Accept": "application/json"
            }
        });
        response.data.currency = type;
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(JSON.stringify(error.message));
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}

async function FetchTransactionAdress(address: string, type: string): Promise<Transaction> {
    try {
        const resadress = await axios.get('https://api.blockcypher.com/v1/' + type + '/main/addrs/' + address);
        const restransaction = await axios.get('https://api.blockcypher.com/v1/' + type + '/main/txs/' + resadress.data.txrefs[0].tx_hash);
        restransaction.data.currency = type;
        return restransaction.data;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(JSON.stringify(error.message));
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}

async function checkAdressType(address: string) {
    switch (true) {
        case /^https:\/\/live\.blockcypher\.com\/[a-z]+\/tx\/[a-z0-9]+/.test(address): return FetchTransaction(address.split("/")[5].split("?")[0], address.split("/")[3]); // Blockcypher URL
        case /^(0x)?[0-9a-fA-F]{40}$/.test(address): return FetchTransactionAdress(address, "eth"); // Ethereum adress
        case /^(0x)?([A-Fa-f0-9]{64})$/.test(address): return FetchTransaction(address, "eth"); // Ethereum transaction hash
        case /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}/.test(address): return FetchTransactionAdress(address, "ltc"); // Litecoin adress Type 1
        case /^ltc([0-9a-zA-Z]{40})$/.test(address): return FetchTransactionAdress(address, "ltc");; // Litecoin adress Type 2
        case /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/.test(address): return FetchTransactionAdress(address, "doge");; // Dogecoin adress
        case /^[a-fA-F0-9]{64}$/.test(address): return SHA256Checker(address) // SHA256 transaction hash
        default: return "The adress/hash you sent is not valid or not supported on BlockCypher. https://live.blockcypher.com"; // Unknown adress
    }
}

export async function getTransaction(firstParam: string): Promise<Transaction | string> {
    try {
        const transaction = await checkAdressType(firstParam)
        
        // fuck off regex 🙂 🔥
        // Vår julskinka har rymt, och släkten kommer om en timme 🎤🔥
        // https://open.spotify.com/track/1ieq2YaXJBzyJ33fOYvG8W?si=c34385b0590545e3
        // använd gärna våran fina kod om ni vill ha buggar och problem 😎
        // Gjord med hat till regex av Cyber and Lazyllama

        return transaction || "The adress/hash you sent is not valid or not supported on BlockCypher. https://live.blockcypher.com";
    } catch (error) {
        console.log("Error: " + error);
        return (`Error: ${String(error) || "Could not get error."}`)
    }
}

