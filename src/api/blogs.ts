import { connectDB, createObjectId } from '../lib/db';

export async function getBlogs() {
  const db = await connectDB();
  return await db.collection('blogs').find().sort({ createdAt: -1 }).toArray();
}

export async function getBlogById(id: string) {
  const db = await connectDB();
  return await db.collection('blogs').findOne({ _id: createObjectId(id) });
}

export async function createBlog(blog: any) {
  const db = await connectDB();
  const result = await db.collection('blogs').insertOne({
    ...blog,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result;
}

export async function updateBlog(id: string, blog: any) {
  const db = await connectDB();
  const result = await db.collection('blogs').updateOne(
    { _id: createObjectId(id) },
    { 
      $set: {
        ...blog,
        updatedAt: new Date()
      }
    }
  );
  return result;
}

export async function deleteBlog(id: string) {
  const db = await connectDB();
  return await db.collection('blogs').deleteOne({ _id: createObjectId(id) });
}