//pages/api/saveData.js

import { MongoClient } from "mongodb";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { owner, appliance } = req.body;

        const client = new MongoClient(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        try {
            await client.connect();

            // Choose a name for your database
            const database = client.db("PhantomPowerTracker");

            // Choose a name for your collection
            const collection = database.collection("familyappliances");

            // Insert the new appliance with switch set to false
            await collection.insertOne({ owner, appliance, switch: false });

            res.status(201).json({ message: "Appliance added successfully!" });
        } catch (error) {
            res.status(500).json({ message: "Something went wrong!", error });
        } finally {
            await client.close();
        }
    } else {
        res.status(405).json({ message: "Method not allowed!" });
    }
}
