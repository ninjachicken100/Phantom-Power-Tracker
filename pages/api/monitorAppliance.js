import fetch from 'node-fetch'; // Ensure you have node-fetch installed
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log("==== HANDLER CALLED ===")
    const client = new MongoClient(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    try {
      await client.connect();
      console.log('Connected to database');

      const intervalId = setInterval(async () => {
        try {
          console.log("==== Interval Started ====");
          const response = await fetch('http://localhost:3000/api/getAllData', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const rows = await response.json();
          // console.log('Fetched data:', rows);

          const now = new Date();
          for (const row of rows) {
            const { owner, appliance, lastSwitchedOn, switch: switchState } = row;
            const lastSwitchedOnDate = new Date(lastSwitchedOn);

            if (isNaN(lastSwitchedOnDate)) {
              console.error('Invalid date:', lastSwitchedOn);
              continue;
            }

            if (!switchState) {
              // console.log(`Switch is off for appliance ${appliance}, skipping...`);
              continue;
            }

            const timeDiff = now - lastSwitchedOnDate;
            const hoursDiff = timeDiff / (1000 * 60 * 60); // Calculate the difference in hours
            const secondsDiff = timeDiff / 1000; // Calculate the difference in seconds
            
            
            // if (hoursDiff > 3) { // Check if the difference is more than 3 hours
            if (secondsDiff > 30) { // Check if the difference is more than 3 seconds
              console.log('triggering sendEmail for:', owner);
              await fetch('http://localhost:3000/api/sendEmail', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ owner, appliance }),
              })
              .then(response => {
                if (!response.ok) {
                  throw new Error('Failed to send email');
                }
                return response.json();
              })
              .then(data => {
                console.log('Email sent successfully:', data);
              })
              .catch(error => {
                console.error('Error sending email:', error);
              });
            }
          }
        } catch (error) {
          console.error('Error in interval:', error);
          clearInterval(intervalId); // Clear the interval if there's an error
        }
      // }, 30 * 60 * 1000); // Check every 30 minutes
      }, 20 * 1000); // Check every 20s

      res.status(200).json({ message: 'Monitoring started' });
    } catch (error) {
      console.error('Error connecting to database:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}