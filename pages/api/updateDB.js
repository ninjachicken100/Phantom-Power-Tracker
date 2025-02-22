import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  if (req.method === 'PUT') {
    const { owner, appliance, switchState } = req.body;

    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      await client.connect();
      console.log("connected to mongoDB");

      const database = client.db("PhantomPowerTracker");
      const collection = database.collection("familyappliances");

      const result = await collection.findOneAndUpdate(
        { owner: owner, appliance: appliance },
        { $set: { switch: switchState } },
        { returnOriginal: false }
      );

      if (!result.value) {
        return res.status(404).json({ message: 'Appliance not found' });
      }

      res.status(200).json(result.value);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update appliance', error });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}