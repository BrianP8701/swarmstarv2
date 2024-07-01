// types/app.ts
export interface AppSlice {
    current_page: string;
    current_swarm: string | null;
    current_chat: string | null;
    chats: string[][];
    swarms: string[][];
}
