
"use client";

import { useState } from "react";
import { useFirebaseApp } from "@/firebase";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useToast } from "./use-toast";

export function useUploadFile() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const { toast } = useToast();
  const app = useFirebaseApp();
  const storage = getStorage(app);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    setProgress({});

    const uploadPromises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(prev => ({ ...prev, [file.name]: currentProgress }));
          },
          (error) => {
            console.error(`Upload failed for ${file.name}:`, error);
            toast({
              variant: "destructive",
              title: `Upload failed for ${file.name}`,
              description: error.message,
            });
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (error: any) {
               console.error(`Failed to get download URL for ${file.name}:`, error);
               toast({
                    variant: "destructive",
                    title: `Upload failed for ${file.name}`,
                    description: `Could not get download URL: ${error.message}`,
               });
               reject(error);
            }
          }
        );
      });
    });

    try {
      const urls = await Promise.all(uploadPromises);
      toast({
        title: "Upload complete!",
        description: `${files.length} image(s) have been uploaded.`,
      });
      return urls;
    } catch (error) {
      // Errors are already toasted inside the promise rejection
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return { isUploading, progress, uploadFiles };
}
