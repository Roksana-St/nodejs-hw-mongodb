import dotenv from 'dotenv';
dotenv.config();
import { initMongoConnection } from './db/initMongoConnection.js';
import setupServer from './server.js';

const startApp = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Error starting the app:', error.message);
    process.exit(1);
  }
};

startApp();
