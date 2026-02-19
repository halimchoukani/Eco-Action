import { ID, Query } from "appwrite";
import { appwriteConfig, databases } from "../appwrite"
import { Mission } from "../types/mission";
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

export const createMission = async (mission: Mission) => {
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