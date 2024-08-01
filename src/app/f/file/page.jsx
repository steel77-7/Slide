"use client";

import FileComponent from "@/components/fileComponent";
import UploadComponent from "@/components/uploadComponent";
import generateToken from "@/misc/tokenGernerator";
import React, { useState, useEffect, useRef } from "react";
import getSocket from "@/misc/getSocket";
//import { generateAnswer,handlingDataChannel} from "@/misc/rtcHandler";

export default function Files() {
  const [uploadPress, setUploadPress] = useState(false);
  const peerRef = useRef(null);
  const dataChannel = useRef(null);
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
        const answer = await generateAnswer(data.offer);
      socket.emit('answer', answer);
      } else {
        return setConnectionStatus({
          color: "bg-red-400",
          message: data.message,
        });
      }
      
    }



    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("handleConnectionRequest", handleConnectionRequest);
    socket.on('ice-candidate', incomingICECandidate);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("handleConnectionRequest", handleConnectionRequest);
      socket.off('ice-candidate', incomingICECandidate);
    };
  }, [socket]);

  useEffect(()=>{
    peerRef.current = createpeer();
  },[])
  // Key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      console.log("User's connection string:", e.target.value);
      handleSendRequest(e);
    }
  };

  //sending the connection string
  const handleSendRequest = async (e) => {
    socket.emit("connection-request", {
      connectionString: e.target.value
    });
    setConnectionStatus({
      color: "bg-yellow-600",
      message: "processing...",
    });
  };
  
  async function generateAnswer(offer) {
    try {
      await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      console.log("Remote description set!!!!");
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      console.log("Local description set successfully (answer):", answer);
      return answer;
    } catch (error) {
      console.error("Error generating answer:", error);
      throw error;
    }
  }

    
 

  const createpeer = () => {
    const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        socket.emit('ice-candidate', event.candidate);
      }
    };

    peerConnection.ondatachannel = (event) => {
      dataChannel.current = event.channel;
      dataChannel.current.onopen = () => console.log("Data channel is open");
      dataChannel.current.onclose = () => console.log("Data channel is closed");
      dataChannel.current.onmessage = (e) => console.log("Message received:", e.data);
    };

    return peerConnection;
  };
  

  async function incomingICECandidate(candidate) {
    console.log("Incoming ICE candidate:", candidate);
    try {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("ICE candidate added successfully");
    } catch (error) {
      console.error("Error occurred while handling ICE candidates", error);
    }
  }
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Files</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
          onClick={() => setUploadPress(true)}
        >
          Upload
        </button>
      </div>
      <p>Your connection string: {connectionStringRef.current}</p>
      <input
        type="text"
        placeholder="Enter connection string..."
        className="border border-gray-300 rounded p-2 mb-4"
        onKeyPress={handleKeyPress}
      />
      {connectionStatus && (
        <p className={`${connectionStatus.color} p-2 rounded text-white`}>
          {connectionStatus.message}
        </p>
      )}
      <div className="flex-1 flex bg-zinc-100 shadow-2xl rounded-lg overflow-hidden">
        <div className="w-full flex-1 max-w-4xl p-4">
          
        </div>
      </div>
      {uploadPress && <UploadComponent closeUpload={() => setUploadPress(false)} />}
    </div>
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

