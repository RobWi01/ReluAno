import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.DB_NAME

let cachedClient = null;
let cachedDb = null;

// check the MongoDB URI
if (!MONGODB_URI) {
    throw new Error('Define the MONGODB_URI environmental variable');
}

// check the MongoDB DB
if (!MONGODB_DB) {
    throw new Error('Define the MONGODB_DB environmental variable');
}

export async function connectToDatabase() {
	if (cachedClient && cachedDb) {
		return {
			client: cachedClient,
			db: cachedDb,
		};
	}


	const opts = {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};

	let client = new MongoClient(MONGODB_URI);
	await client.connect();
	let db = client.db(MONGODB_DB);

	cachedClient = client;
	cachedDb = db;

	return {
		client: cachedClient,
		db: cachedDb,
	};
}