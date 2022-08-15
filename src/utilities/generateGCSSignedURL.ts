import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: "fishing-pw",
  keyFilename: __dirname + "../../../fishing-pw-b74401bbbdc3.json",
});

export type GCSFolder = "profiles" | "fishes" | "trips";

const configureBucketCORS = async () => {
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
// configureBucketCORS();
export const generateGCSSignedURL = async (folder: GCSFolder, filename: string) => {
  // configureBucketCORS().catch(console.error);
  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "write",
    expires: Date.now() + 1 * 60 * 1000, // 1 minute
  };

  const [url] = await storage
    .bucket(process.env.GCS_BUCKET_NAME + folder + "/")
    .file(filename)
    .getSignedUrl(options);
  return url;
};
