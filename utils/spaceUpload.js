import sharp from 'sharp';
import s3Client from '@/utils/spaceInit';
const {
  PutObjectCommand,
  PutBucketPolicyCommand
} = require('@aws-sdk/client-s3');

export const resizeBuffer = async (buffer, width, height) => {
  return await sharp(buffer)
    .resize({
      width,
      height
    })
    .toBuffer();
};

export const s3Upload = async params => {
  clientPolicy();
  const uploadCommand = new PutObjectCommand(params);
  try {
    const response = await s3Client.send(uploadCommand);
    console.log('Image uploaded successfully:', response);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(error?.message);
  }
};

// Define the parameters for the object you want to upload.
export const getParams = (nameKey, buffer) => {
  return {
    Bucket: process.env.SPACES_BUCKET,
    Key: nameKey,
    Body: buffer
  };
};

const clientPolicy = async () => {
  const spaceName = process.env.SPACES_BUCKET;

  const params = {
    Bucket: spaceName,
    Policy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicRead',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${spaceName}/*`
        }
      ]
    })
  };

  const command = new PutBucketPolicyCommand(params);

  try {
    const data = await s3Client.send(command);
    console.log('Default ACL set successfully.');
  } catch (error) {
    console.error('Error setting default ACL:', error);
  }
};
