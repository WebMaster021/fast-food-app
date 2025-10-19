import {Account, Avatars, Client, Databases, ID, Query, Storage} from "react-native-appwrite"
import {CreateUserParams, GetMenuParams, SignInParams} from "@/type";

export const appwriteConfig = {
    endpoint : process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.tussi.fastfoodapp",
    databaseId: '68f11b3a00117ebf6a79',
    bucketId: '68f3705f002b9366d309',
    userCollectionId: 'user',
    categoriesCollectionId: 'categories',
    menuCollectionId: 'menu',
    customizationsCollectionId: 'customizations',
    menuCustomizationsCollectionId: 'menu_customizations',
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);


export const createUser = async ({email, password, name}: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(),email, password, name);

        if(!newAccount) throw new Error;

        await signIn({email, password});

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountid: newAccount.$id, email, name, avatar: avatarUrl
            }
        )
    } catch (e) {
        throw new Error(e as string)
    }
}

export const signIn = async ({email, password}: SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw  Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountid', currentAccount.$id)]
        )

        if (!currentAccount) throw new Error("No current account found");

        return currentUser.documents[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
}

export const getMenu = async ({category, query}: GetMenuParams) => {
    try {
        const queries: string[] = [];

        if(category) queries.push(Query.equal('categories', category));
        if(query) queries.push(Query.search('name', query));

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries,
        )

        return menus.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId,
        )
        return categories.documents;
    } catch (e) {
        throw new Error(e as string);
    }
}