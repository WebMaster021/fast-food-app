import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category { name: string; description: string; }
interface Customization { name: string; price: number; type: string; }
interface MenuItem {
    name: string; description: string; image_url: string; price: number;
    rating: number; calories: number; protein: number;
    category_name: string; customizations: string[];
}

const data = dummyData;

async function clearAll(collectionId: string) {
    const list = await databases.listDocuments(appwriteConfig.databaseId, collectionId);
    await Promise.all(list.documents.map(doc =>
        databases.deleteDocument(appwriteConfig.databaseId, collectionId, doc.$id)
    ));
}

async function clearStorage() {
    const list = await storage.listFiles(appwriteConfig.bucketId);
    await Promise.all(list.files.map(file =>
        storage.deleteFile(appwriteConfig.bucketId, file.$id)
    ));
}

async function uploadImageToStorage(imageUrl: string) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileObj = {
        name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
        type: blob.type,
        size: blob.size,
        uri: imageUrl,
    };

    const file = await storage.createFile(appwriteConfig.bucketId, ID.unique(), fileObj);
    return storage.getFileViewURL(appwriteConfig.bucketId, file.$id);
}

export default async function seed() {
    try {
        // 1. Clear everything
        console.log("Clearing collections...");
        await clearAll(appwriteConfig.categoriesCollectionId);
        await clearAll(appwriteConfig.customizationsCollectionId);
        await clearAll(appwriteConfig.menuCollectionId);
        await clearAll(appwriteConfig.menuCustomizationsCollectionId);
        await clearStorage();

        // 2. Categories
        const categoryMap: Record<string, string> = {};
        for (const cat of data.categories) {
            const doc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.categoriesCollectionId,
                ID.unique(),
                cat
            );
            categoryMap[cat.name] = doc.$id;
            console.log(`Category created: ${cat.name}`);
        }

        // 3. Customizations
        const customizationMap: Record<string, string> = {};
        for (const cus of data.customizations) {
            const doc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.customizationsCollectionId,
                ID.unique(),
                cus
            );
            customizationMap[cus.name] = doc.$id;
            console.log(`Customization created: ${cus.name}`);
        }

        // 4. Menu Items
        const menuMap: Record<string, string> = {};
        for (const item of data.menu) {
            const categoryId = categoryMap[item.category_name];
            if (!categoryId) {
                console.warn(`Skipping menu item "${item.name}" — category "${item.category_name}" not found`);
                continue;
            }

            let uploadedImage = item.image_url;
            try { uploadedImage = await uploadImageToStorage(item.image_url); } catch (e) {
                console.warn(`Failed to upload image for "${item.name}", using original URL`);
            }

            const doc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.menuCollectionId,
                ID.unique(),
                {
                    name: item.name,
                    description: item.description,
                    image_url: uploadedImage,
                    price: item.price,
                    rating: item.rating,
                    calories: item.calories,
                    protien: item.protein,
                    categories: categoryId,
                }
            );
            menuMap[item.name] = doc.$id;
            console.log(`Menu item created: ${item.name}`);
        }

        // 5. Menu Customizations
        for (const item of data.menu) {
            const menuId = menuMap[item.name];
            if (!menuId) continue; // skip if menu item not created

            for (const cusName of item.customizations) {
                const cusId = customizationMap[cusName];
                if (!cusId) {
                    console.warn(`Skipping customization "${cusName}" for menu "${item.name}" — not found`);
                    continue;
                }

                await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.menuCustomizationsCollectionId,
                    ID.unique(),
                    {
                        menu: menuId,
                        customizations: cusId, // must match collection field
                    }
                );
            }
        }

        console.log("✅ Seeding complete.");

    } catch (err) {
        console.error("Seeding failed:", err);
    }
}
