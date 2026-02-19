import { Models } from "appwrite";

export interface Participation extends Models.Document {
    mission: string;
    user: string;
}