
import mongoose, { Mongoose } from 'mongoose';
import { env } from '@/lib/env';

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null
}

let cached: MongooseConnection = (global as any).mongoose

if (!cached){
    cached = (global as any).mongoose = { 
        conn: null, 
        promise: null }
}

export const connectToDatabase = async () => {
    if (cached.conn) return cached.conn;

    cached.promise = 
        cached.promise || 
        mongoose.connect(env.MONGODB_URL, { 
        dbName:'developers',
        bufferCommands:false 
    })

    cached.conn = await cached.promise;

    return cached.conn;
}
