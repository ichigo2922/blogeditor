import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://245122737146:ZuBRgDXd8G8TjBoV@mydatabase.xdxqrpv.mongodb.net/?retryWrites=true&w=majority&appName=myDatabase';
const client = new MongoClient(uri);

export async function connectDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('myDatabase');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export async function disconnectDB() {
  await client.close();
  console.log('Disconnected from MongoDB');
}

export function createObjectId(id: string) {
  return new ObjectId(id);
}