"use client";

import React, { useState, useRef, useEffect } from "react";
import RecievePopupComponent from "@/components/revievePopupComponent";
import generateToken from "@/misc/tokenGernerator";
import getSocket from "@/misc/getSocket";
import StreamSaver from "streamsaver";

export default function Recieving() {
  const [reject, setReject] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const peerRef = useRef(null);
  const dataChannel = useRef(null);
  const fileName = useRef("");
  const [isConnected, setIsConnected] = useState(false);

  const [filePresent, setFilePresent] = useState(false);
  const connectionStringRef = useRef(generateToken(15));
  const socket = getSocket();
  const worker = useRef(new Worker("/worker.js"));

  // Socket logic
  useEffect(() => {
    function onConnect() {
      console.log(socket.id);
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onRecieveRequest({ connectionString }) {
      console.log("Connection string received:", connectionString);
      if (connectionString === connectionStringRef.current) {
        setReject(false);
      } else {
        console.log(
          "String mismatch or the connection string is incorrect",
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

    async function recieveAnswer(answer) {
      try {
        if (peerRef.current.signalingState === "have-local-offer") {
          await peerRef.current.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        } else {
          console.error(
            "Peer connection is not in the correct state to set remote description",
            peerRef.current
          );
        }
      } catch (error) {
        console.error("Error setting remote description:", error);
      }
    }

    async function incomingICECandidate(candidate) {
      try {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("ICE candidate added successfully");
      } catch (error) {
        console.error("Error occurred while handling ICE candidates", error);
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connection-request", onRecieveRequest);
    socket.on("answer", recieveAnswer);
    socket.on("ice-candidate", incomingICECandidate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connection-request", onRecieveRequest);
      socket.off("answer", recieveAnswer);
      socket.off("ice-candidate", incomingICECandidate);
    };
  }, [socket]);

  useEffect(() => {
    peerRef.current = createPeer();
  }, []);

  const handleEstablishConnection = async () => {
    const offer = await generateOffer();

    socket.emit("handleConnectionRequest", {
      message: "Connected",
      request: true,
      offer: offer,
    });
    setConnectionStatus(true);
    setReject(true);
  };

  const createPeer = () => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peerConnection = new RTCPeerConnection(configuration);

    dataChannel.current = peerConnection.createDataChannel("file");
    dataChannel.current.onopen = () => console.log("Data channel is open");
    dataChannel.current.onclose = () => console.log("Data channel is closed");
    dataChannel.current.onmessage = (e) => {
      recieveFiles(e.data);
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        socket.emit("ice-candidate", event.candidate);
      }
    };

    return peerConnection;
  };

  const generateOffer = async () => {
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    return offer;
  };

  const handleReject = () => {
    setReject(!reject);
    socket.emit("handleConnectionRequest", {
      message: "Connection request rejected",
      request: false,
    });
  };

  //handling the file transfer logic

  const recieveFiles = async (data) => {
    if (data === "done") {
      setFilePresent(true);
    } else {
      worker.current.postMessage(data);
    }

    if (typeof data === "string" && data !== "done") {
      let name = JSON.parse(data);
      fileName.current = name.fileName;
    }
  };

  function handleDownload() {
    worker.current.postMessage("download");
    worker.current.addEventListener("message", (e) => {
      const file = e.data;

      const fileStream = StreamSaver.createWriteStream(
        fileName.current + ".zip"
      );
      const readableStream = file.stream();
      readableStream.pipeTo(fileStream);
    });
    setFilePresent(false);
  }

  return (
    <>
      {!reject && (
        <RecievePopupComponent
          handleReject={handleReject}
          handleEstablishConnection={handleEstablishConnection}
        />
      )}
      <div className="flex flex-col min-h-screen bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Receiving Files
          </h1>
        </div>
        <p className="mb-4 text-lg font-medium text-gray-700">
          Your connection string:{" "}
          <span className="font-bold">{connectionStringRef.current}</span>
        </p>
        <p className="text-gray-600 mb-4 flex items-center">
          <strong>Connected with user:</strong>
          <span className="ml-2 font-bold">
            {connectionStatus ? "Yes" : "No"}
          </span>
        </p>
        {filePresent && (
          <p className="mb-4 text-lg font-medium text-gray-700">
            Download:{" "}
            <button
              onClick={handleDownload}
              className="text-indigo-500 hover:text-indigo-700 focus:outline-none focus:underline"
            >
              Click here
            </button>
          </p>
        )}
        <div className="flex-1 flex bg-white shadow-2xl rounded-lg overflow-hidden justify-center items-center flex-col p-6">
          {filePresent && (
            <>
              <p className="mb-4 text-lg text-gray-800 font-semibold">
                Your file has been downloaded
              </p>
              <div className="w-full flex-1 max-w-4xl p-4 flex justify-center">
                <button className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl justify-center ">
                  <svg
                    className="w-6 h-6 mr-2 -ml-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v6h16v-6m-1-6l-7 7-7-7m14-7H5a2 2 0 00-2 2v7"
                    ></path>
                  </svg>
                  Download
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
