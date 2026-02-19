import { Models } from "appwrite";

export interface User extends Models.Document {
    name: string;
    email: string;
    impactScore: number;
    hoursVolunteered: number;
    participation?: any[]; // For nested relationship fallbacks
}