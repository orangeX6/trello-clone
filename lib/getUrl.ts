import { storage } from '@/appwrite';

const getUrl = async (image: Image) => {
  const url = storage.getFilePreview(
    process.env.NEXT_PUBLIC_IMAGE_BUCKET_ID!,
    image.fileId
  );

  return url;
};

export default getUrl;
