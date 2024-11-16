import { initMongoConnection } from './db/initMongoConnection.js';

dotenv.config();

const startApp = async () => {
  await initMongoConnection();
  setupServer();
};

startApp();

