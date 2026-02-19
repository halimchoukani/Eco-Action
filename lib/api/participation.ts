import { appwriteConfig, databases } from "../appwrite"
import { Participation } from "../types/participation"
import { ID, Query } from "appwrite"


export const isParticipated = async ({ missionId, userId }: { missionId: string, userId: string }) => {
    try {
        const response = await databases.listDocuments<Participation>(
            appwriteConfig.databaseId,
            appwriteConfig.participationsCollectionId,
            [
                Query.equal('mission', missionId),
                Query.equal('user', userId),
            ]
        );
        return response.total > 0;
    } catch (error) {
        console.error("Error checking participation:", error);
        return false;
    }
}


export const createParticipation = async ({ missionId, userId }: { missionId: string, userId: string }) => {
    try {
        const participationId = ID.unique();
        const participationData = {
            mission: missionId,
            user: userId,
        };
        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.participationsCollectionId,
            participationId,
            participationData
        );
    } catch (error) {
        console.error("Error creating participation:", error);
        return null;
    }
}