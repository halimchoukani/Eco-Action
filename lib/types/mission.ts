import { Models } from "appwrite";

export enum MissionDifficulty {
    EASY = "Easy",
    MEDIUM = "Medium",
    HARD = "Hard",
}

export interface Mission extends Models.Document {
    name: string;
    description: string;
    avgRate: number;
    isFeatured: boolean;
    location: string;
    startDate: string;
    endDate: string;
    durationHours: number;
    image: string;
    totalSpots: number;
    availableSpots: number;
    category: string;
    difficulty: MissionDifficulty;
    creator: string;
}

export type CreateMissionPayload = Omit<Mission, keyof Models.Document>;