import express, { Request, Response } from "express";
import { getTransaction } from "../functions";

export const Router = express.Router()

// Health check
Router.get("/status", async (req: Request, res: Response) => {
    res.send({
        status: true,
        message: "N/A"
    }).status(200);
});

// Get all schools within a municipality
Router.post("/get-transaction", async (req: Request, res: Response) => {
    try {
        const { text } = req.body;
        const [transactionCurrency, transactionId] = text?.split(" ") || [];
        console.log(transactionCurrency, transactionId);

        if (!transactionCurrency || !transactionId) {
            res.status(400).send("Invalid parameters");
            return;
        }

        const transaction = await getTransaction(transactionCurrency, transactionId);

        res.send({
            response_type: "in_channel",
            text: `Transaction: \n\`\`\`${JSON.stringify(transaction, null, 2)}\`\`\``
        }).status(200);
    } catch (error) {
        res.send({
            response_type: "ephemeral",
            text: "There was an error fetching transaction: \n ```" + String(error) + "```"
        }).status(500);
    }
});