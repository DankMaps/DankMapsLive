// exportToJSON.js

require('dotenv').config();
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Environment variables
const sourceUri = process.env.SOURCE_MONGODB_URI;

if (!sourceUri) {
  console.error('Error: Please define SOURCE_MONGODB_URI in your .env file.');
  process.exit(1);
}

async function exportDatabase() {
  const sourceClient = new MongoClient(sourceUri);

  try {
    // Connect to the source MongoDB server
    await sourceClient.connect();
    console.log('Connected to the source MongoDB server.');

    // Extract database name from URI
    const sourceDbName = sourceUri.split('/').pop().split('?')[0];

    if (!sourceDbName) {
      throw new Error('Source database name is missing in SOURCE_MONGODB_URI.');
    }

    const sourceDb = sourceClient.db(sourceDbName);

    // Get all collections from the source database
    const collections = await sourceDb.listCollections().toArray();

    // Create a directory to store the exported JSON files
    const exportDir = path.join(__dirname, 'exported_data');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
      console.log(`Created directory: ${exportDir}`);
    }

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`Exporting collection: ${collectionName}`);

      const collection = sourceDb.collection(collectionName);
      const cursor = collection.find({});
      const allDocs = await cursor.toArray();

      const filePath = path.join(exportDir, `${collectionName}.json`);
      fs.writeFileSync(filePath, JSON.stringify(allDocs, null, 2));
      console.log(`- Exported ${allDocs.length} documents to ${filePath}`);
    }

    console.log('Database export completed successfully!');
  } catch (error) {
    console.error('An error occurred while exporting the database:', error);
  } finally {
    // Close the connection
    await sourceClient.close();
    console.log('Closed the MongoDB connection.');
  }
}

// Execute the export
exportDatabase();
