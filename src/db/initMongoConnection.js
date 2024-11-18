import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    const connection = await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}`
    );
    console.log('Mongo connection successfully established!');
    return connection;
  } catch (error) {
    console.error('Mongo connection error:', error.message);
    process.exit(1);
  }
};