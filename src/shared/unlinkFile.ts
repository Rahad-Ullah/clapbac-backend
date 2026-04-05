import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/aws-s3';
import config from '../config';

const unlinkFile = async (fileKey: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: config.aws.bucketName!,
      Key: fileKey, // e.g., "image/my-photo-12345.jpg"
    });
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw error;
  }
};

export default unlinkFile;
