"use client";

import React,{ useState } from 'react'
import RecievePopupComponent from '@/components/revievePopupComponent'
import { generateToken } from '@/misc/tokenGernerator';
import getSocket from '@/misc/getSocket';
import { useRef } from 'react/cjs/react.production.min';
 
export default function Recieving() {
    const [reject, setReject] = useState(true)
    const connectionStringRef = useRef(generateToken(15));
//socket logic
    useEffect(() => {
      function onConnect() {
        setIsConnected(true);
      }
  
      function onDisconnect() {
        setIsConnected(false);
      }
  
      function onRecieveRequest({connectionString}) {
        if(connectionString===connectionStringRef){
          socket.emit('establish-rtcConnection',{})
        }
      }
  
      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("connection-request", onRecieveRequest);
  
      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("recieve-request", onRecieveRequest);
      };
    }, [socket]);
  return (
   <>
    <>
    {!reject&&<RecievePopupComponent setReject={setReject}/>}
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Files</h1>
        
      </div>
      <p>Your connection string:{connectionString }</p>
      <p>Connected with user:</p>
      <div className="flex-1 flex bg-zinc-100 shadow-2xl rounded-lg overflow-hidden">
        <div className="w-full flex-1 max-w-4xl p-4">
         
        </div>
      </div>
    </div>
    </>
   </>
  )
}
