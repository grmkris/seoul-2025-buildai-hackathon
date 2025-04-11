import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { Client } from "minio";
import S3rver from "s3rver";

/**
 * Creates a temporary directory for S3rver to use
 */
const createTempDir = () => {
	const tmpDir = path.join(os.tmpdir(), `s3rver-test-${Date.now()}`);
	if (!fs.existsSync(tmpDir)) {
		fs.mkdirSync(tmpDir, { recursive: true });
	}
	return tmpDir;
};

/**
 * Generate a random port number between min and max
 */
const getRandomPort = (min = 10000, max = 50000) => {
	return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Initializes an S3rver server and returns a Minio client connected to it
 */
export async function createTestS3Setup(bucketName: string) {
	// Set up the S3rver server
	const port = getRandomPort();
	const hostname = "localhost";
	const directory = createTempDir();

	// Create the S3rver instance
	const s3rver = new S3rver({
		port,
		directory,
		silent: true,
		configureBuckets: [], // We'll create buckets through the API
	});

	// Start the server
	const server = await s3rver.run();

	// Create a MinIO client that points to our S3rver instance
	const minioClient = new Client({
		endPoint: hostname,
		port,
		useSSL: false,
		accessKey: "S3RVER",
		secretKey: "S3RVER",
	});

	// Create our test bucket if it doesn't exist
	const bucketExists = await minioClient.bucketExists(bucketName);
	if (!bucketExists) {
		await minioClient.makeBucket(bucketName);
	}

	// Create a method to shutdown the server
	const shutdown = async () => {
		await s3rver.close();
		// Clean up temp directory
		try {
			fs.rmSync(directory, { recursive: true, force: true });
		} catch (err) {
			console.warn("Failed to cleanup S3rver temp directory:", err);
		}
	};

	return {
		client: minioClient,
		s3rver,
		server,
		port,
		hostname,
		bucketName,
		shutdown,
	};
}
