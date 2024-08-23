import { useState } from "react"

import HomeControlBoard from "./ControlBoard"
import HomeChat from "./Chat"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import HomeControlBoardCreateTab from "./ControlBoardCreateTab"

export default function HomePage() {
  const [selectedMemory, setSelectedMemory] = useState("")
  const [memoryOptions, setMemoryOptions] = useState(["memory-1", "memory-2", "memory-3"])

  return (
    <div className="flex flex-col h-full">
      <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          className="relative hidden flex-col items-start gap-8 md:flex" x-chunk="dashboard-03-chunk-0"
        >
          <fieldset className="grid gap-6 rounded-lg border-transparent p-4 h-full w-full">
            <ScrollArea className="h-[calc(100vh-140px)]">
              <Tabs defaultValue="create" className="h-full flex flex-col">
                <div className="flex justify-center mb-2">
                  <TabsList className="inline-flex gap-2">
                    <TabsTrigger value="create" className="hover:bg-muted-foreground text-secondary-foreground">Create</TabsTrigger>
                    <TabsTrigger value="active" className="hover:bg-muted-foreground text-secondary-foreground">Active</TabsTrigger>
                    <TabsTrigger value="history" className="hover:bg-muted-foreground text-secondary-foreground">History</TabsTrigger>
                  </TabsList>
                </div>
                <div className="flex-1 overflow-auto">
                  <TabsContent value="create" className="h-full">
                    <HomeControlBoardCreateTab memoryOptions={memoryOptions} setMemoryOptions={setMemoryOptions} setSelectedMemory={setSelectedMemory} />
                  </TabsContent>
                  <TabsContent value="active" className="h-full">
                    <HomeControlBoard />
                  </TabsContent>
                  <TabsContent value="history" className="h-full">
                    <HomeControlBoard />
                  </TabsContent>
                </div>
              </Tabs>
            </ScrollArea>
          </fieldset>
        </div>
        <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
          <HomeChat />
        </div>
      </main>
    </div>
  )
}
