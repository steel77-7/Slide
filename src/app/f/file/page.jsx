"use client";

import FileComponent from "@/components/fileComponent";
import UploadComponent from "@/components/uploadComponent";
import generateToken from "@/misc/tokenGernerator";
import React, { useState, useEffect, useRef } from "react";
import getSocket from "@/misc/getSocket";
import { generateAnswer,handlingDataChannel} from "@/misc/rtcHandler";

export default function Files() {
  const [uploadPress, setUploadPress] = useState(false);
  const [peer, setPeer] = useState({})
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);
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

    async function handleConnectionRequest(data) {
      if (data.request) {
        setConnectionStatus({
          color: "bg-green-400",
          message: data.message,
        });
       const {answer,dataChannel} =await generateAnswer(data.offer)
       handlingDataChannel(dataChannel);
       
      } 
      else
       return setConnectionStatus({
          color: "bg-red-400",
          message: data.message,
        });
        if(data.offer){
         await handleAnswer(data.offer);
        }
        
    }

    async function handleAnswer(offer){
      console.log('offer recieved!!! \n' , offer)
      const {peerConnection,answer,dataChannel}= await generateAnswer(offer);
     // await setRemoteDescription(peerConnection,answer);
     setPeer(peerConnection);
     handlingDataChannel(peer,dataChannel)
      socket.emit('answer', {answer})
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("handleConnectionRequest", handleConnectionRequest);
    //socket.on('offer',handleAnswer)
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("recieve-request", handleConnectionRequest);
      //socket.off('offer',handleAnswer)
    };
  }, [socket]);

  // Key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      console.log("User's connection string:", e.target.value);
      handleSendReqest(e);
    }
  };

  //sending the connection string
  const handleSendReqest = async (e) => {
    socket.emit("connection-request", {
      connectionString: e.target.value
    });
    setConnectionStatus({
      color: "bg-yellow-600",
      message: "processing...",
    });
  };
  //handling the rtc connection by sending recieving the SDP frobn the remote peer
  /* const handleRTCConnection = () => {
    const offer = socket.emit("offer");
  }; */

  return (
    <>
      {uploadPress && (
        <UploadComponent
          setUploadPress={setUploadPress}
          handleSendReqest={handleSendReqest}
        />
      )}
      <div className="flex flex-col min-h-screen bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">Files</h1>
          <Upload setUploadPress={setUploadPress} uploadPress={uploadPress} />
        </div>
        <p className="text-blue-500">
          Your connection string: {connectionStringRef.current}
        </p>
        <p>
          Type user's connection string here:
          <input
            type="text"
            placeholder="Type here..."
            className="outline-none bg-transparent border-b-2 border-slate-600 px-2"
            onKeyPress={handleKeyPress}
          />
        </p>
        {connectionStatus && (
          <div className="flex gap-1 items-center">
            <div
              className={`h-4 w-4 ${connectionStatus.color} rounded-full `}
            ></div>
            <p>Connection Status : </p>
            <p>{connectionStatus.message}</p>
          </div>
        )}
        <div className="flex-1 flex bg-zinc-100 shadow-2xl rounded-lg overflow-hidden">
          <div className="w-full flex-1 max-w-4xl p-4">
            <FileComponent />
            <FileComponent />
            <FileComponent />
            <FileComponent />
            <FileComponent />
          </div>
        </div>
      </div>
    </>
  );
}

const Upload = ({ uploadPress, setUploadPress }) => {
  const handleClick = () => {
    setUploadPress(!uploadPress);
  };

  return (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      onClick={handleClick}
    >
      Upload
    </button>
  );
};
