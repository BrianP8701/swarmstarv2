import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateInformationGraphRequest, useCreateInformationGraphMutation } from "../../graphql/generated/graphql";

interface CreateMemoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const initialCreateInformationGraphRequest: CreateInformationGraphRequest = {
    title: '',
}

export function CreateMemoryDialog({ open, onOpenChange }: CreateMemoryDialogProps) {
    const [createInformationGraphRequest, setCreateInformationGraphRequest] = useState<CreateInformationGraphRequest>(initialCreateInformationGraphRequest)
    const [createInformationGraph] = useCreateInformationGraphMutation();

    const handleCreateInformationGraph = async () => {
        try {
            await createInformationGraph({ variables: { input: createInformationGraphRequest } });
            onOpenChange(false);
            setCreateInformationGraphRequest(initialCreateInformationGraphRequest);
        } catch (error) {
            console.error("Error creating information graph:", error);
        }
    };

    const isCreateButtonDisabled = !createInformationGraphRequest.title

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <div className="grid gap-4 py-4 px-20 mt-2">
                    <Input
                        placeholder="Title"
                        value={createInformationGraphRequest.title}
                        onChange={(e) => setCreateInformationGraphRequest({ ...createInformationGraphRequest, title: e.target.value })}
                    />
                </div>
                <div className="flex justify-end">
                    <Button 
                        onClick={handleCreateInformationGraph}
                        disabled={isCreateButtonDisabled}
                    >
                        Create Information Graph
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
