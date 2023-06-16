import React from 'react'

const Features = () => {
  return (
    <div className='flex flex-col gap-8'>
        <div className='items-center'>
            <h1 className='text-center text-2xl font-bold'>Features</h1>
        </div>
        <div className='flex flex-row justify-around'>
            <div className='bg-yellow-600 h-[250px] w-[400px] rounded-full'>
                <h1 className=''>Feed</h1>
            </div>
            <div className='bg-yellow-600 h-[250px] w-[400px] rounded-full items-center'>
            </div>
            <div className='bg-yellow-600 h-[250px] w-[400px] rounded-full items-center'>
            </div>
        </div>
    </div>
  )
}

export default Features