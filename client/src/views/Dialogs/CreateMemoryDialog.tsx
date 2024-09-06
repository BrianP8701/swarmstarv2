import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateMemoryRequest, useCreateMemoryMutation } from "../../graphql/generated/graphql";

interface CreateMemoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const initialCreateMemoryRequest: CreateMemoryRequest = {
    title: '',
}

export function CreateMemoryDialog({ open, onOpenChange }: CreateMemoryDialogProps) {
    const [createMemoryRequest, setCreateMemoryRequest] = useState<CreateMemoryRequest>(initialCreateMemoryRequest)
    const [createMemory] = useCreateMemoryMutation();

    const handleCreateMemory = async () => {
        try {
            await createMemory({ variables: { input: createMemoryRequest } });
            onOpenChange(false);
            setCreateMemoryRequest(initialCreateMemoryRequest);
        } catch (error) {
            console.error("Error creating memory:", error);
        }
    };

    const isCreateButtonDisabled = !createMemoryRequest.title

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <div className="grid gap-4 py-4 px-20 mt-2">
                    <Input
                        placeholder="Title"
                        value={createMemoryRequest.title}
                        onChange={(e) => setCreateMemoryRequest({ ...createMemoryRequest, title: e.target.value })}
                    />
                </div>
                <div className="flex justify-end">
                    <Button 
                        onClick={handleCreateMemory}
                        disabled={isCreateButtonDisabled}
                    >
                        Create Memory
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
