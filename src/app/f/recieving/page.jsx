"use client";

import React, { useState, useRef, useEffect } from "react";
import RecievePopupComponent from "@/components/revievePopupComponent";
import generateToken from "@/misc/tokenGernerator";
import getSocket from "@/misc/getSocket";

export default function Recieving() {
  const [reject, setReject] = useState(true);
  const peerRef = useRef(null);
  const dataChannel = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const connectionStringRef = useRef(generateToken(15));
  const socket = getSocket();

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
      console.log("Answer received:", answer);
      console.log("State before setting remote description: ", peerRef.current.signalingState);
      try {
        if (peerRef.current.signalingState === "have-local-offer") {
          await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
          console.log("Remote description set successfully");
          console.log("State after setting remote description: ", peerRef.current.signalingState);
          dataChannel.current.send('hello');
        } else {
          console.error("Peer connection is not in the correct state to set remote description", peerRef.current);
        }
      } catch (error) {
        console.error("Error setting remote description:", error);
      }
    }

    async function incomingICECandidate(candidate) {
      console.log("Incoming ICE candidate:", candidate);
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
    console.log("Offer generated:", offer);
    socket.emit("handleConnectionRequest", {
      message: "Connected",
      request: true,
      offer: offer,
    });

    setReject(true);
  };

  const createPeer = () => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };
    const peerConnection = new RTCPeerConnection(configuration);

    dataChannel.current = peerConnection.createDataChannel("message");
    dataChannel.current.onopen = () => console.log("Data channel is open");
    dataChannel.current.onclose = () => console.log("Data channel is closed");
    dataChannel.current.onmessage = (e) => console.log("Message received:", e.data);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("Sending ICE candidate:", event.candidate);
        socket.emit("ice-candidate", event.candidate);
      }
    };

    // Listen for connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log("Connection state change:", peerConnection.connectionState);
    };

    return peerConnection;
  };

  const generateOffer = async () => {
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    console.log("Local description set successfully (offer):", offer);
    return offer;
  };

  const handleReject = () => {
    setReject(!reject);
    socket.emit("handleConnectionRequest", {
      message: "Connection request rejected",
      request: false,
    });
  };

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
          <h1 className="text-3xl font-semibold text-gray-800">Files</h1>
        </div>
        <p>Your connection string: {connectionStringRef.current}</p>
        <p>Connected with user:</p>
        <div className="flex-1 flex bg-zinc-100 shadow-2xl rounded-lg overflow-hidden">
          <div className="w-full flex-1 max-w-4xl p-4"></div>
        </div>
      </div>
    </>
  );
}
