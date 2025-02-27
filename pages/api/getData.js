import { MongoClient } from 'mongodb';
import Appliance from '../models/appliance';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;
    console.log('im inside getData.js and the id is:', id, 'of type', typeof(id));

    // Ensure the id is a valid integer
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      res.status(400).json({ message: 'Invalid ID format' });
      return;
    }

    // const client = new MongoClient(process.env.MONGODB_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    // });

    try {
      // await client.connect();

      // // Choose a name for your database
      // const database = client.db('PhantomPowerTracker');

      // // Choose a name for your collection
      // const collection = database.collection('familyappliances');

      console.log('Connecting to database...');
      await dbConnect();
      console.log('Connected to database');
      

      console.log('Finding appliance with id:', parsedId);
      const data = await collection.findOne({ id: parsedId });

      if (!data) {
        console.log('Data not found for id:', parsedId);
        res.status(404).json({ message: 'Data not found' });
        return;
      }

      console.log('Data found:', data);
      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}