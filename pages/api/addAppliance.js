//pages/api/saveData.js

import { MongoClient } from "mongodb";

async function getNextSequenceValue(client, sequenceName) {
    const database = client.db("PhantomPowerTracker");
    const counters = database.collection("counters");
    const collection = database.collection("familyappliances");
  
    // Find the highest existing id in the familyappliances collection
    const highestIdDoc = await collection.find().sort({ id: -1 }).limit(1).toArray();
    const highestId = highestIdDoc.length > 0 ? highestIdDoc[0].id : 0;
    console.log('highest Id:', highestId);
    
    const nextId = highestId + 2;
    
    return nextId;
  }

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { owner, appliance } = req.body;

        const client = new MongoClient(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        try {
            await client.connect();

            // Get the next sequence value for the appliance ID
            const nextid = await getNextSequenceValue(client, "applianceid");
            console.log("id", nextid);

            // Choose a name for your database
            const database = client.db("PhantomPowerTracker");

            // Choose a name for your collection
            const collection = database.collection("familyappliances");

            // Insert the new appliance with switch set to false and lastSwitchedOn set to null
            await collection.insertOne({ id:nextid, owner, appliance, switch: false, lastSwitchedOn: null });

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
