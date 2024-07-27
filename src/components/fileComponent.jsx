

import React from 'react'

export default function FileComponent() {
  return (
    <div className="flex justify-between  p-2 m-2  rounded-md flex-1 hover:bg-slate-400">
     <input type="checkbox" className="" />
     <p>name</p>
     <p>{Date.now()}</p>
     <button className="flex items-center justify-center   rotate-90 hover:bg-slate-500 h-7 w-7  rounded-md "><p className="relative bottom-1">...</p></button>
    </div>
  )
}
