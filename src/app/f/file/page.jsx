"use client";

import UploadComponent from "@/components/uploadComponent";
import generateToken from "@/misc/tokenGernerator";
import React, { useState, useEffect, useRef } from "react";
import getSocket from "@/misc/getSocket";
import JSZip from "jszip";
import { toast } from "sonner";
export default function Files() {
  const peerRef = useRef(null);
  const dataChannel = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [files, setFiles] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const connectionStringRef = useRef(generateToken(15));
  let socket = getSocket();

  

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
        socket.emit("answer", answer);
      } else {
        setConnectionStatus({
          color: "bg-red-400",
          message: data.message,
        });
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("handleConnectionRequest", handleConnectionRequest);
    socket.on("ice-candidate", incomingICECandidate);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("handleConnectionRequest", handleConnectionRequest);
      socket.off("ice-candidate", incomingICECandidate);
    };
  }, [socket]);

  useEffect(() => {
    peerRef.current = createpeer();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      handleSendRequest(e);
    }
  };

  const handleSendRequest = async (e) => {
    socket.emit("connection-request", {
      connectionString: e.target.value,
    });
    setConnectionStatus({
      color: "bg-yellow-600",
      message: "processing...",
    });
  };

  async function generateAnswer(offer) {
    try {
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);

      return answer;
    } catch (error) {
      console.error("Error generating answer:", error);
      throw error;
    }
  }

  const createpeer = () => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate);
      }
    };

    peerConnection.ondatachannel = (event) => {
      dataChannel.current = event.channel;
      dataChannel.current.onopen = () => console.log("Data channel is open");
      dataChannel.current.onclose = () => console.log("Data channel is closed");
    };

    return peerConnection;
  };

  async function incomingICECandidate(candidate) {
    try {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("ICE candidate added successfully");
    } catch (error) {
      console.error("Error occurred while handling ICE candidates", error);
    }
  }

  //send files to recieving end
  const zip = new JSZip();
  const sendFiles = async () => {
    const chunkSize = 16 * 1024;
    files.forEach((file) => {
      zip.file(file.name, file, { binary: true });
    });
    //file to be sent
    const zipBlob = await zip.generateAsync({ type: "blob" });
    let buffer = await zipBlob.arrayBuffer();
    function send(){
    while (buffer.byteLength) {
      //checking if the datachannel is safe to send more data or not without any overflow
      if (dataChannel.current.bufferedAmount > dataChannel.current.bufferedAmountLowThreshold) {
        dataChannel.current.onbufferedamountlow = () => {
         // dataChannel.current.onbufferedamountlow = null;
          send();
        };
        return;
      }
      const chunk = buffer.slice(0, chunkSize);
      buffer = buffer.slice(chunkSize, buffer.byteLength);
      dataChannel.current.send(chunk);
    }
    dataChannel.current.send("done");
  }
  send()
  };



  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-800">Files</h1>
        <Upload setFiles={setFiles} sendFiles={sendFiles} files={files} />
      </div>
      <p className="mb-4 text-lg font-medium text-gray-700">
        Your connection string:{" "}
        <span className="font-bold text-indigo-600">
          {connectionStringRef.current}
        </span>
      </p>
      <input
        type="text"
        placeholder="Enter connection string..."
        className="border border-gray-300 rounded-lg p-2 mb-4 w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        onKeyPress={handleKeyPress}
      />
      {connectionStatus && (
        <p className={`${connectionStatus.color} p-2 rounded text-white mb-4`}>
          {connectionStatus.message}
        </p>
      )}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Upload Files</h2>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300"
          onClick={() => setFiles([])}
        >
          Reset Queue
        </button>
      </div>
      <div className="flex-1 flex bg-white shadow-2xl rounded-lg overflow-hidden">
        <div className="w-full flex-1 max-w-4xl p-4">
          <UploadComponent files={files} setFiles={setFiles} />
        </div>
      </div>
    </div>
  );
}

const Upload = ({ sendFiles, setFiles, files }) => {
  const handleClick = () => {
    if (files.length > 0) {
      sendFiles();
      setFiles([]);
    } else {
      toast.warning("Add some files first");
    }
  };
  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={handleClick}
    >
      Upload
    </button>
  );
};
