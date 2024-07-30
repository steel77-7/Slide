"use client";

import React, { useState,useRef,useEffect } from "react";
import RecievePopupComponent from "@/components/revievePopupComponent";
import  generateToken  from "@/misc/tokenGernerator";
import getSocket from "@/misc/getSocket";


export default function Recieving() {
  const [reject, setReject] = useState(true);
  const [isConnected,setIsConnected] = useState(false)
  const connectionStringRef = useRef(generateToken(15));
  let socket = getSocket();
  //socket logic
  useEffect(() => {
    function onConnect() {
      console.log(socket.id)
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onRecieveRequest({ connectionString }) {
      if (connectionString === connectionStringRef) {
        setReject(false); 
      }
      else{
        socket.emit('handleConnectionRequest', {message:'string-mismatch', request:false })
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


  // to establish  a peer to peer connection with the other client (remote Peer)
  const handleEstablishConnection =()=>{


  }

  const handleReject = ()=>{
    setReject(!reject);
    socket.emit("handleConnectionRequest",{message: "Connection request rejected",request:false })
  }
  return (
    <>
      <>
        {!reject && <RecievePopupComponent handleReject={handleReject} handleEstablishConnection={handleEstablishConnection}/>}
        <div className="flex flex-col min-h-screen bg-gray-50 p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">Files</h1>
          </div>
          <p>Your connection string:{connectionStringRef.current}</p>
          <p>Connected with user:</p>
          <div className="flex-1 flex bg-zinc-100 shadow-2xl rounded-lg overflow-hidden">
            <div className="w-full flex-1 max-w-4xl p-4"></div>
          </div>
        </div>
      </>
    </>
  );
}
