import { appwriteConfig, databases } from "../appwrite"
import { Participation } from "../types/participation"
import { ID, Query } from "appwrite"

/**
 * Helper: extract the raw ID from a relationship field value.
 * Appwrite virtual relationship fields can be: a string, an object with $id, or an array of either.
 */
const extractId = (field: any): string | null => {
    if (!field) return null;
    const val = Array.isArray(field) ? field[0] : field;
    if (!val) return null;
    return typeof val === 'string' ? val : val?.$id ?? null;
};

/**
 * Fetches all participations from the collection.
 * Since mission/user are virtual relationships, we cannot use Query.equal on them.
 * We fetch all documents and filter client-side instead.
 */
const listAllParticipations = async () => {
    return await databases.listDocuments<any>(
        appwriteConfig.databaseId,
        appwriteConfig.participationsCollectionId,
        [
            Query.orderDesc("$createdAt"),
            Query.limit(500),
        ]
    );
};

export const isParticipated = async ({ missionId, userId }: { missionId: string, userId: string }): Promise<boolean> => {
    try {
        const response = await listAllParticipations();
        return response.documents.some((p: any) => {
            return extractId(p.mission) === missionId && extractId(p.user) === userId;
        });
    } catch (error) {
        console.error("Error checking participation:", error);
        return false;
    }
}

export const getParticipationByMissionAndUser = async ({ missionId, userId }: { missionId: string, userId: string }): Promise<Participation | null> => {
    try {
        const response = await listAllParticipations();
        const found = response.documents.find((p: any) => {
            return extractId(p.mission) === missionId && extractId(p.user) === userId;
        });
        return (found as Participation) || null;
    } catch (error) {
        console.error("Error getting participation:", error);
        return null;
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

export const cancelParticipation = async ({ missionId, userId }: { missionId: string, userId: string }): Promise<boolean> => {
    try {
        const participation = await getParticipationByMissionAndUser({ missionId, userId });
        if (!participation) {
            console.error("Participation not found");
            return false;
        }
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.participationsCollectionId,
            participation.$id
        );
        return true;
    } catch (error) {
        console.error("Error canceling participation:", error);
        return false;
    }
}

export const getUserParticipations = async (userId: string) => {
    return await databases.listDocuments<Participation>(
        appwriteConfig.databaseId,
        appwriteConfig.participationsCollectionId,
        [
            Query.equal('user', userId),
            Query.orderDesc("$createdAt"),
        ]
    )

}