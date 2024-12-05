import express, { Request, Response } from "express";
import { getTransaction, dateToLink, convertPrefenceToEmoji, addDecimal } from "../functions";
import { Transaction } from "../types";
import axios from "axios";

export const Router = express.Router()

// Health check
Router.get("/status", async (req: Request, res: Response) => {
    res.send({
        status: true,
        message: "N/A"
    }).status(200);
});

Router.post("/get-transaction", async (req: Request, res: Response): Promise<void> => {
    try {
        const { text } = req.body;
        var [firstParam, isChannel] = text?.split(" ") || [];

        if (!firstParam) {
            res.status(400).send("Invalid parameters");
            return;
        }

        const transaction: Transaction | string = await getTransaction(firstParam);

        if (typeof transaction === "string") {
            res.send({
                response_type: "ephemeral",
                text: "There was an error fetching transaction: \n ```" + transaction + "```"
            }).status(500);
            return;
        }

        const inputs = transaction.inputs.map(input => input.addresses).join(", ");
        const outputs = transaction.outputs.map(output => output.addresses).join(", ");

        res.send({
            response_type: `${isChannel == undefined ? "ephemeral" : "in_channel"}`,
            type: "mrkdwn",
            text: `<${`https://live.blockcypher.com/${transaction.currency}/tx/${transaction.hash}?includeConfidence=true|Transaction Information`}>:
>*Block Hash:* \`${transaction.block_hash}\`
>*Transaction Hash:* \`${transaction.hash}\`
>*Addresses:* \`${transaction.addresses}\`
>*Total:* ${addDecimal(transaction.currency, transaction.total)} ${transaction.currency.toUpperCase()}
>*Fees:* ${addDecimal(transaction.currency, transaction.fees)} ${transaction.currency.toUpperCase()}
>*Miner Preference:* ${convertPrefenceToEmoji(transaction.preference)}
>*Relayed By:* \`${transaction.relayed_by || "Not Available"}\`
>*Confirmed:* ${dateToLink(transaction.confirmed) || "Not Confirmed"}
>*Received:* ${dateToLink(transaction.received)}
>*Confirmations:* ${transaction.confirmations > 6 ? "6+" : transaction.confirmations + " / 6"}
>*Confidence:* ${transaction.confidence == null ? "Not Available" : (transaction.confidence * 100) + "%"}
>*Inputs:* \`${inputs || "Not Available"}\`
>*Outputs:* \`${outputs || "Not Available"}\`
            `
        }).status(200);
    } catch (error) {
        res.send({
            response_type: "ephemeral",
            text: "There was an error fetching transaction: \n ```" + String(error) + "```"
        }).status(500);
    }
});