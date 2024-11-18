// copyDB.js

require('dotenv').config();
const { MongoClient } = require('mongodb');

// Environment variables
const sourceUri = process.env.SOURCE_MONGODB_URI;
const targetUri = process.env.TARGET_MONGODB_URI;

if (!sourceUri || !targetUri) {
  console.error('Error: Please define SOURCE_MONGODB_URI and TARGET_MONGODB_URI in your .env file.');
  process.exit(1);
}

async function copyDatabase() {
  const sourceClient = new MongoClient(sourceUri, { useNewUrlParser: true, useUnifiedTopology: true });
  const targetClient = new MongoClient(targetUri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // Connect to source and target MongoDB servers
    await sourceClient.connect();
    console.log('Connected to the source MongoDB server.');

    await targetClient.connect();
    console.log('Connected to the target MongoDB server.');

    // Extract database names from URIs
    const sourceDbName = sourceUri.split('/').pop().split('?')[0];
    const targetDbName = targetUri.split('/').pop().split('?')[0];

    const sourceDb = sourceClient.db(sourceDbName);
    const targetDb = targetClient.db(targetDbName);

    // Get all collections from the source database
    const collections = await sourceDb.listCollections().toArray();

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`Copying collection: ${collectionName}`);

      const sourceCollection = sourceDb.collection(collectionName);
      const targetCollection = targetDb.collection(collectionName);

      // Optional: Drop the target collection if it exists to avoid duplicates
      const targetCollectionExists = await targetDb.listCollections({ name: collectionName }).hasNext();
      if (targetCollectionExists) {
        console.log(`- Dropping existing collection: ${collectionName}`);
        await targetCollection.drop();
      }

      // Create the collection in the target database
      await targetDb.createCollection(collectionName);
      console.log(`- Created collection: ${collectionName}`);

      // Fetch all documents from the source collection
      const cursor = sourceCollection.find({});
      const batchSize = 1000; // Adjust based on your memory constraints
      let batch = [];

      while (await cursor.hasNext()) {
        const doc = await cursor.next();
        batch.push(doc);

        if (batch.length === batchSize) {
          await targetCollection.insertMany(batch);
          console.log(`  Inserted ${batch.length} documents into ${collectionName}`);
          batch = [];
        }
      }

      // Insert any remaining documents
      if (batch.length > 0) {
        await targetCollection.insertMany(batch);
        console.log(`  Inserted ${batch.length} documents into ${collectionName}`);
      }

      // Optional: Copy indexes
      const indexes = await sourceCollection.indexes();
      for (const index of indexes) {
        if (index.name === '_id_') continue; // _id index is created by default
        await targetCollection.createIndex(index.key, { name: index.name, unique: index.unique });
        console.log(`- Created index: ${index.name} on collection: ${collectionName}`);
      }

      console.log(`Finished copying collection: ${collectionName}\n`);
    }

    console.log('Database copy completed successfully!');
  } catch (error) {
    console.error('An error occurred while copying the database:', error);
  } finally {
    // Close the connections
    await sourceClient.close();
    await targetClient.close();
    console.log('Closed all MongoDB connections.');
  }
}

// Execute the copy
copyDatabase();
