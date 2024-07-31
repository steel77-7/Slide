"use client";

import React, { useState, useRef, useEffect } from "react";
import RecievePopupComponent from "@/components/revievePopupComponent";
import generateToken from "@/misc/tokenGernerator";
import getSocket from "@/misc/getSocket";
import { genrateAnswer, setRemoteDescription,generateOffer,handlingDataChannel } from "@/misc/rtcHandler";

export default function Recieving() {
  const [reject, setReject] = useState(true);
 const peerRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const connectionStringRef = useRef(generateToken(15));
  let socket = getSocket();
  
  //socket logic
  useEffect(() => {
    function onConnect() {
      console.log(socket.id);
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onRecieveRequest({ connectionString }) {
      console.log("connection string recieved", connectionString);
      if (connectionString === connectionStringRef.current) {
        setReject(false);
      } else {
        console.log(
          "string mismatch or the connection string is incorrect",
          connectionString,
          connectionStringRef.current
        );
        socket.emit("handleConnectionRequest", {
          message: "string-mismatch",
          request: false,
        });
        return;
      }
    }

   async function recieveAnswer({ answer}){
     console.log("answer",answer)
     await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer))
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connection-request", onRecieveRequest);
    socket.on('answer',recieveAnswer)

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connection-request", onRecieveRequest);
      socket.off('answer',recieveAnswer)
    };
  }, [socket]);

  // to establish  a peer to peer connection with the other client (remote Peer)
  const handleEstablishConnection = async () => {
    const { offer,dataChannel ,peerConnection} = await generateOffer();
    //console.log('offer in handleEstablishConnection ', await generateOffer())
    console.log("peerconnection",peerConnection)
    peerRef.current = peerConnection;
    socket.emit("handleConnectionRequest", {
      message: "Connected",
      request: true,
      offer:offer
    });
    handlingDataChannel(peerConnection,dataChannel);
    
    setReject(true);
  };


  const rtcHanldler =()=>{
    const configuration = {'iceServers': [{'urls': 'stun:stun.l.google.com:19302'}]}
    const peerConnection = new RTCPeerConnection(configuration);

    const dataChannel = peerConnection.createDataChannel('message ')
  }

  const handleReject = () => {
    setReject(!reject);
    socket.emit("handleConnectionRequest", {
      message: "Connection request rejected",
      request: false,
    });
  };
  return (
    <>
      <>
        {!reject && (
          <RecievePopupComponent
            handleReject={handleReject}
            handleEstablishConnection={handleEstablishConnection}
          />
        )}
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
