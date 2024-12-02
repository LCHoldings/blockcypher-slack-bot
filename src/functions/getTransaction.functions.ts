import axios from "axios";

export const getTransaction = async (transactionCurrency: string , transactionId: string): Promise<string> => {
    try {
        const URL = `https://api.blockcypher.com/v1/${transactionCurrency}/main/txs/${transactionId}&includeHex=true`;
        const response = await axios.get(URL,{
            headers: {
                'X-Scope': '8a22163c-8662-4535-9050-bc5e1923df48',
                "Accept": "application/json"
            }
        });
        const transactionResponse = response.data;

        console.log(transactionResponse);

        return transactionResponse;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(JSON.stringify(error.message));
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}