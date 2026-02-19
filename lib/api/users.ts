import { ID, Query } from "appwrite";
import { account, appwriteConfig, databases } from "../appwrite"
import { User } from "../types/user";

export const login = async (email: string, password: string) => {
    try {
        await account.createEmailPasswordSession(email, password);
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const register = async (name: string, email: string, password: string) => {
    try {
        const user = await getCurrentUser();
        if (user) {
            return false;
        }
        const userId = ID.unique();
        const userData = {
            name,
            email,
            impactScore: 0,
            hoursVolunteered: 0,
        }
        await account.create(
            userId,
            email,
            password,
            name
        )
        await databases.createDocument(
            appwriteConfig.databaseId,
            "user",
            userId,
            userData
        )
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const getCurrentUser = async () => {
    try {
        console.log("Getting the current user ....");

        const user = await account.get();
        if (!user) {
            console.log("User not found in appwrite");
            return null;
        }
        console.log("User found in appwrite", user);
        const userData = await databases.getDocument<User>(
            appwriteConfig.databaseId,
            "user",
            user.$id
        )
        console.log("User data", userData);
        return userData;
    } catch (error: any) {
        if (error?.code !== 401) {
            console.log("Error in getCurrentUser:", error);
        }
        return null;
    }
}

export const getUserById = async (userId: string) => {
    try {
        return await databases.getDocument<User>(
            appwriteConfig.databaseId,
            "user",
            userId
        )
    } catch (error) {
        console.log("Error in getUserById:", error);
        return null;
    }
}


export const logout = async () => {
    try {
        await account.deleteSession('current');
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}
