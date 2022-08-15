import { GetSignedUrlConfig, Storage } from "@google-cloud/storage";

export const storage = new Storage({
  projectId: "fishing-pw",
  keyFilename: __dirname + "../../../fishing-pw-b74401bbbdc3.json",
});

export type GCSFolder = "profiles" | "fishes" | "trips";

export const generateGCSSignedURL = async (folder: GCSFolder, filename: string) => {
  // await configureBucketCORS().catch(console.error);
  const options: GetSignedUrlConfig = {
    version: "v4",
    action: "write",
    expires: Date.now() + 1 * 60 * 1000, // 1 minute
  };

  const [url] = await storage
    .bucket(process.env.GCS_BUCKET_NAME + "/" + folder + "/")
    .file(filename)
    .getSignedUrl(options);
  return url;
};

export const makeGCSFilePublic = async (folder: GCSFolder, filename: string) => {
  console.log(folder, filename);
  console.log("String", process.env.GCS_BUCKET_NAME + "/" + folder + "/");
  const response = await storage
    .bucket(process.env.GCS_BUCKET_NAME + "/" + folder + "/")
    .file(filename)
    .makePublic();

  return response;
};
