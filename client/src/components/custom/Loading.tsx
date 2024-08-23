import { Loader2Icon } from 'lucide-react'

export const Loading = () => {
  return (
    <div className='flex flex-col h-screen'>
      <div className='flex-1'>
        <Loader2Icon className='w-6 h-6 m-auto my-[30%] animate-spin' />
      </div>
    </div>
  )
}
