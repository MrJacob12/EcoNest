import { AquariumImage } from "@/types";

const DB_NAME = "aquariumDB";
const DB_VERSION = 1;
const STORE_NAME = "images";

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("Failed to open database"));

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });

export const saveImageToDb = (image: AquariumImage) => {
  return openDb().then((db) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    store.put(image);

    return new Promise<void>((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(new Error("Failed to save image"));
    });
  });
};

export const getAllImagesFromDb = (): Promise<AquariumImage[]> => {
  return openDb().then((db) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise<AquariumImage[]>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error("Failed to fetch images"));
    });
  });
};

export const getImageFromDb = (
  id: string
): Promise<AquariumImage | undefined> => {
  return openDb().then((db) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    return new Promise<AquariumImage | undefined>((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error("Failed to fetch image"));
    });
  });
};

export const exportDataToDb = async () => {
  const db = await openDb();
  const transaction = db.transaction(STORE_NAME, "readonly");
  const store = transaction.objectStore(STORE_NAME);
  const request = store.getAll();
  return new Promise<any[]>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = (error) => reject(error);
  });
};

export const importDataFromDb = async (data: string) => {
  const db = await openDb();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);
  const parsedData = JSON.parse(data);
  parsedData.forEach((item: any) => store.put(item));
};
