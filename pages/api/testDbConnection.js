const dbConnect = require('../../mongodb');

async function testConnection() {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Connected to database successfully');
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
}

testConnection();