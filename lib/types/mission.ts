export interface Mission {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    name: string;
    type: string;
    description: string;
    impactScore: number;
    hoursVolunteered: number;
}