export interface Rate {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    missionId: string;
    userId: string;
    score: number;
    comment: string;
}