import { Models } from "appwrite";

export enum MissionDifficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard",
}

export interface Mission extends Models.Document {
    name: string;
    type: string;
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