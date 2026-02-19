import { ID, Query } from "appwrite";
import { appwriteConfig, databases } from "../appwrite"
import { CreateMissionPayload, Mission } from "../types/mission";
import { createParticipation } from "./participation";


export const getMissions = async () => {
    return await databases.listDocuments<Mission>(
        appwriteConfig.databaseId,
        appwriteConfig.missionsCollectionId,
        [
            Query.orderAsc("$createdAt"),
        ]
    )
}

export const getMissionById = async (missionId: string) => {
    return await databases.getDocument<Mission>(
        appwriteConfig.databaseId,
        appwriteConfig.missionsCollectionId,
        missionId
    )
}

export const getMissionsByCategory = async (categoryId: string) => {
    return await databases.listDocuments<Mission>(
        appwriteConfig.databaseId,
        appwriteConfig.missionsCollectionId,
        [
            Query.equal('category', categoryId),
            Query.orderAsc("$createdAt"),
        ]
    )
}

export const searchMissions = async (searchQuery: string) => {
    searchQuery = searchQuery.toLowerCase();
    return await databases.listDocuments<Mission>(
        appwriteConfig.databaseId,
        appwriteConfig.missionsCollectionId,
        [
            Query.search('name', searchQuery),
            Query.search('description', searchQuery),
        ]
    )
}

export const getMissionsByCreator = async (creatorId: string) => {
    return await databases.listDocuments<Mission>(
        appwriteConfig.databaseId,
        appwriteConfig.missionsCollectionId,
        [
            Query.equal('creator', creatorId),
            Query.orderDesc("$createdAt"), // Show newest first
        ]
    )
}
export const getMissionsByIds = async (missionIds: string[]) => {
    if (missionIds.length === 0) return { documents: [], total: 0 };
    return await databases.listDocuments<Mission>(
        appwriteConfig.databaseId,
        appwriteConfig.missionsCollectionId,
        [
            Query.equal('$id', missionIds),
        ]
    )
}

export const createMission = async (mission: CreateMissionPayload) => {
    const missionId = ID.unique()
    const missionData = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.missionsCollectionId,
        missionId,
        mission
    )
    if (missionData) {
        //create participation for the mission
        const participationData = await createParticipation({
            missionId,
            userId: mission.creator,
        })
        if (participationData) {
            return missionData
        } else {
            return null
        }
    }
    return null
}

export const updateMissionSpots = async (missionId: string, availableSpots: number) => {
    return await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.missionsCollectionId,
        missionId,
        { availableSpots }
    )
}