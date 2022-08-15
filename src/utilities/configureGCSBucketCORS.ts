import { storage } from "./generateGCSSignedURL";

export const configureBucketCORS = async () => {
  const responseHeader = "Content-Type";
  const maxAgeSeconds = 60;
  const method = "PUT";

  await storage.bucket(process.env.GCS_BUCKET_NAME).setCorsConfiguration([
    {
      maxAgeSeconds,
      method: ["PUT"],
      origin: [process.env.CORS_ORIGIN],
      responseHeader: ["Content-Type"],
    },
  ]);

  console.log(`Bucket ${process.env.GCS_BUCKET_NAME} was updated with a CORS config
        to allow ${method} requests from ${process.env.CORS_ORIGIN} sharing 
        ${responseHeader} responses across origins`);
};
