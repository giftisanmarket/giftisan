import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

console.log('--- Cloudinary Config Check ---');
console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✅ Found' : '❌ Missing');
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Found' : '❌ Missing');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Found' : '❌ Missing');
console.log('Database URL:', process.env.DATABASE_URL ? '✅ Found' : '❌ Missing');
