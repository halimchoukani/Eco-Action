import { Models } from "appwrite";

export interface Category extends Models.Document {
    title: string;
    icon: string;
    description: string;
}