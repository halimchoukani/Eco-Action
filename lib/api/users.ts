import { ID } from "appwrite";
import { account, databases } from "../appwrite"
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
        const newUser: User = {
            $id: ID.unique(),
            $createdAt: new Date().toISOString(),
            $updatedAt: new Date().toISOString(),
            name,
            email,
            impactScore: 0,
            hoursVolunteered: 0,
        }
        await account.create(
            newUser.$id,
            newUser.email,
            password,
            newUser.name
        )
        await databases.createDocument(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
            "user",
            newUser.$id,
            newUser
        )
        return true;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export const getCurrentUser = async () => {
    try {
        const user = await account.get();
        if (!user) {
            return null;
        }
        const userData = await databases.getDocument(
            process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
            "user",
            user.$id
        )
        return userData;
    } catch (error) {
        console.log(error)
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