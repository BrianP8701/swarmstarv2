import { useState } from "react";
import Chat from "../home/Chat";
import DialogSection from "@/components/custom/DialogSection";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function HomePage() {
    const [selectedSwarm, setSelectedSwarm] = useState("Swarm 1");

    return (
        <div className="flex flex-col h-full">
            <header className="sticky top-0 h-15 flex items-center z-20">
                <Select>
                    <SelectTrigger className="text-md">
                        <SelectValue placeholder="Create" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Swarm 1">Swarm 1</SelectItem>
                        <SelectItem value="Swarm 2">Swarm 2</SelectItem>
                        <SelectItem value="Swarm 3">Swarm 3</SelectItem>
                    </SelectContent>
                </Select>
            </header>
            <main className="flex flex-1">
                <div className="w-1/2 pt-4">
                    <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
                        <Chat />
                    </div>
                </div>
                <div className="w-1/2 flex flex-col">
                    <div className="flex-1 p-4">
                        <DialogSection selectedSwarm={selectedSwarm} />
                    </div>
                    <div className="flex-1 p-4">
                        <DialogSection selectedSwarm={selectedSwarm} />
                    </div>
                </div>
            </main>
        </div >
    );
}