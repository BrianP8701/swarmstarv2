import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { CreateInformationGraphRequest, useCreateInformationGraphMutation } from '../../graphql/generated/graphql'
import { useFetchUser } from '../../hooks/fetchUser'
import ButtonWithTooltipWhenDisabled from '@/components/custom/ButtonWithTooltipWhenDisabled'

interface CreateInformationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const initialCreateInformationGraphRequest: CreateInformationGraphRequest = {
  title: '',
}

export function CreateInformationDialog({ open, onOpenChange }: CreateInformationDialogProps) {
  const [createInformationGraphRequest, setCreateInformationGraphRequest] = useState<CreateInformationGraphRequest>(
    initialCreateInformationGraphRequest
  )
  const [createInformationGraph] = useCreateInformationGraphMutation()
  const { refetch } = useFetchUser()

  const handleCreateInformationGraph = async () => {
    try {
      const result = await createInformationGraph({
        variables: { input: createInformationGraphRequest },
      })
      console.log(result)
      await refetch() // Refetch user data after creating a new information graph
      onOpenChange(false)
      setCreateInformationGraphRequest(initialCreateInformationGraphRequest)
    } catch (error) {
      console.error('Error creating information graph:', error)
    }
  }

  const isCreateButtonDisabled = !createInformationGraphRequest.title

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isCreateButtonDisabled) {
      handleCreateInformationGraph()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='bg-background border-secondary border-2 rounded-2xl w-[50vw] min-h-[8vh]'>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4 px-20 mt-2'>
            <Input
              className='bg-secondary rounded-2xl'
              placeholder='Title'
              value={createInformationGraphRequest.title}
              onChange={e =>
                setCreateInformationGraphRequest({ ...createInformationGraphRequest, title: e.target.value })
              }
            />
          </div>
          <div className='flex justify-end'>
            <ButtonWithTooltipWhenDisabled
              className='max-w-[100px] px-10'
              type='submit'
              disabled={isCreateButtonDisabled}
              onClick={() => {}} // This is needed because the onClick prop is required
              tooltipText='Please enter a title'
              ariaLabel='Create information graph'
              variant='default'
            >
              Create
            </ButtonWithTooltipWhenDisabled>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
