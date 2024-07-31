//create the peers
function init() {
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  const peerConnection = new RTCPeerConnection(configuration);
  const dataChannel = peerConnection.createDataChannel("file");
  return { peerConnection, dataChannel };
}

export async function generateOffer() {
    const { peerConnection ,dataChannel} = init();
   

    dataChannel.onopen=()=>console.log("CONNECTION ESTABLISHED!!!!!!!!!!!")
    dataChannel.onclose=()=>console.log("CONNECTION CLOSED!!!!!!!!!!!")
    dataChannel.onmessage =(e)=> console.log("message arrived",e.data)
    try {
      const offer = await peerConnection.createOffer();
      console.log("offer", offer);
  
      await peerConnection.setLocalDescription(offer);
      console.log("Local description set", offer);
  
     /*  peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
           //handleNewICECandidateMsg(peerConnection,event.candidate)
          console.log("New ICE candidate:", event.candidate);
        }
      }; */
        //send offer to the peer
      return { peerConnection, offer,dataChannel };
    } catch (error) {
      console.error("Error generating offer:", error);
      throw error; // Re-throw the error to propagate it further if needed
    }
  }
  

//handling remote connection
export async function generateAnswer(offer) {
    const { peerConnection ,dataChannel} = init();
  
    // Setting up remote description
    /* peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        //handleNewICECandidateMsg(peerConnection,event.candidate)
        console.log("New ICE candidate:", event.candidate);
      }
    }; */
    
    peerConnection.ondatachannel =e=>{
      const rdataChannel = e.channel;
      rdataChannel.onopen = (e) => console.log('Data channel is open');
      rdataChannel.onclose = (e) => console.log('Data channel is closed');
      rdataChannel.onmessage =(e)=> console.log("message arrived",e.data)
     }
   
  
    try {
      await peerConnection.setRemoteDescription(offer);
      console.log("Remote description set!!!!");
  
      // Setting up local description
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      console.log("Local description set (generate answer)", answer);
  
      return { peerConnection, answer ,dataChannel};
    } catch (error) {
      console.error("Error generating answer:", error);
      throw error; // Re-throw the error to propagate it further if needed
    }
  }
  async function handleNewICECandidateMsg(peerConnection,incoming) {
    const candidate = new RTCIceCandidate(incoming);

    peerConnection.addIceCandidate(candidate)
        .catch(e => console.log(e));
}

export async function setRemoteDescription(peerConnection, answer) {
    console.log('perreconnecton ',peerConnection)
  await peerConnection.setRemoteDescription(answer);
  console.log("Remote description set (answer)(the next one)");
}

export function handlingDataChannel(peerConnection,dataChannel) {
   peerConnection.ondatachannel =e=>{
    dataChannel.onopen = (e) => console.log('Data channel is open');
    dataChannel.onclose = (e) => console.log('Data channel is closed');
    dataChannel.onmessage =(e)=> console.log("message arrived",e.data)
   }
    /* dataChannel.onopen = (e) => console.log('Data channel is open');
    dataChannel.onclose = (e) => console.log('Data channel is closed');
    dataChannel.onmessage =(e)=> console.log("message arrived",e.data)
    
    dataChannel.send('hellooooo to you') */
}

