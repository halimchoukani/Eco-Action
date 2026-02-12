import { Account, Avatars, Client, Databases, Teams } from "appwrite";

export const appwriteConfig = {
    platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ?? "com.halimchoukani.ecoaction",
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? "https://cloud.appwrite.io/v1",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? "",
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ?? "",
};

const client = new Client()
    .setProject(appwriteConfig.projectId)
    .setEndpoint(appwriteConfig.endpoint);

export const databases = new Databases(client);
export const account = new Account(client);
export const teams = new Teams(client);
export const avatars = new Avatars(client);

export default client;