export interface Group {
    id: string;
    name: string;
    description: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    position: string;
    groupId: string | null;
}