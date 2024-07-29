const rtcHandler =async ()=>{
    const peer=new RTCPeerConnection();

    const offer= await peer.createOffer();
    await peer.setLocalDescription(offer);
    
   // const remote
}