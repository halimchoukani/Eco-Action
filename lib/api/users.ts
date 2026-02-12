import { ID } from "appwrite";
import { account } from "../appwrite"

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
        await account.create(
            ID.unique(),
            email,
            password,
            name
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
        return user;
    } catch (error) {
        console.log(error)
        return null;
    }
}
