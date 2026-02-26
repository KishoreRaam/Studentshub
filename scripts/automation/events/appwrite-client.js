'use strict';
const { Client, Databases, Storage, ID } = require('node-appwrite');

function getClient() {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);
  return client;
}

const client = getClient();

module.exports = {
  databases: new Databases(client),
  storage:   new Storage(client),
  ID,
  DATABASE_ID:   process.env.DATABASE_ID,
  COLLECTION_ID: process.env.EVENTS_COLLECTION_ID,
  BUCKET_ID:     process.env.APPWRITE_BUCKET_EVENT_MEDIA,
  ENDPOINT:      process.env.APPWRITE_ENDPOINT,
  PROJECT_ID:    process.env.APPWRITE_PROJECT_ID,
};
