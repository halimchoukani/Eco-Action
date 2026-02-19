import { Query } from "appwrite"
import { appwriteConfig, databases } from "../appwrite"
import { Category } from "../types/category"

export const getCategories = async () => {
    return await databases.listDocuments<Category>(
        appwriteConfig.databaseId,
        appwriteConfig.categoriesCollectionId,
        [
            Query.orderAsc("$createdAt"),
        ]
    )
}

export const getCategoryById = async (id: string) => {
    return await databases.getDocument<Category>(
        appwriteConfig.databaseId,
        appwriteConfig.categoriesCollectionId,
        id
    )
}