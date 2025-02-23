import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  console.log("Received request to update appliance:", req.method);
  if (req.method === 'PUT') {
    const { id, switchState, lastSwitchedOn } = req.body;
    console.log("Received request to update appliance:", { id, switchState, lastSwitchedOn });

    if (typeof id !== 'number') {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      await client.connect();
      console.log("Connected to MongoDB");

      const database = client.db("PhantomPowerTracker");
      const collection = database.collection("familyappliances");

      // Log the query criteria
      console.log("Query criteria:", { id });

      const updateData = { switch: switchState };
      if (switchState) {
        updateData.lastSwitchedOn = new Date(lastSwitchedOn);
      }

      const result = await collection.findOneAndUpdate(
        { id: id },
        { $set: updateData },
        { returnDocument: 'after' } // Use returnDocument: 'after' to return the updated document
      );

      if (!result.value) {
        console.log("Appliance not found with id:", id);
        return res.status(404).json({ message: 'Appliance not found' });
      }

      res.status(200).json(result.value);
    } catch (error) {
      console.error('Error updating appliance:', error); // Log the error
      res.status(500).json({ message: 'Failed to update appliance', error });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}