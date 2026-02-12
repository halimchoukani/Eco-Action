export interface User {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    name: string;
    email: string;
    impactScore: number;
    hoursVolunteered: number;
}