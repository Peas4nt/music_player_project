import postgres from "postgres";
import dotenv from 'dotenv';
dotenv.config();

export const sql = postgres({
	host: (process.env.DEV == 1)? process.env.DB_HOST : "localhost",
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
});

export async function dbTest() {
	try {
		const result = await sql`SELECT 1+1 sum`;
    console.log("Database connection established");
		return true;
	} catch (err) {
		console.error("Error executing SQL query", err.stack);

		return false;
	}
}