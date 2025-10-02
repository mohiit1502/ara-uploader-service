

import { RekognitionClient, DetectFacesCommand } from '@aws-sdk/client-rekognition';
import EnvVars from '../constants/EnvVars';

// Returns { faceCount, largestFaceRatio } using AWS Rekognition
export async function detectFacesRekognition(
  buffer: Buffer,
  region?: string,
): Promise<{ faceCount: number; largestFaceRatio: number }> {
  const REKOGNITION_REGION = String(region || EnvVars.S3_REGION || 'us-east-1');
  const REKOGNITION_ACCESS_KEY = String(EnvVars.S3_ACCESS_KEY || '');
  const REKOGNITION_SECRET_KEY = String(EnvVars.S3_SECRET_KEY || '');
  const client = new RekognitionClient({
    region: REKOGNITION_REGION,
    credentials: {
      accessKeyId: REKOGNITION_ACCESS_KEY,
      secretAccessKey: REKOGNITION_SECRET_KEY,
    },
  });
  // Convert Buffer to Uint8Array for Rekognition
  const bytes = new Uint8Array(buffer);
  const params = {
    Image: { Bytes: bytes },
    Attributes: ['ALL' as const],
  };
  const command = new DetectFacesCommand(params);
  const response = await client.send(command);
  const faces = response.FaceDetails || [];
  let largestFaceRatio = 0;
  if (faces.length > 0 && response.FaceDetails) {
    for (const face of response.FaceDetails) {
      if (face.BoundingBox && face.BoundingBox.Width && face.BoundingBox.Height) {
        const area = face.BoundingBox.Width * face.BoundingBox.Height;
        if (area > largestFaceRatio) largestFaceRatio = area;
      }
    }
  }
  return { faceCount: faces.length, largestFaceRatio };
}
