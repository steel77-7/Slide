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
    
    try {
      const offer = await peerConnection.createOffer();
      console.log("offer", offer);
  
      await peerConnection.setLocalDescription(offer);
      console.log("Local description set", offer);
  
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // Send ICE candidate to the remote peer
          console.log("New ICE candidate:", event.candidate);
        }
      };
  
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
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to the remote peer
        console.log("New ICE candidate:", event.candidate);
      }
    };
    
  
    try {
      await peerConnection.setRemoteDescription(offer);
      console.log("Remote description set!!!!");
  
      // Setting up local description
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      console.log("Local description set", answer);
  
      return { peerConnection, answer ,dataChannel};
    } catch (error) {
      console.error("Error generating answer:", error);
      throw error; // Re-throw the error to propagate it further if needed
    }
  }
  

export async function setRemoteDescription(peerConnection, answer) {
  await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  console.log("Remote description set (answer)");
}

export function handlingDataChannel(dataChannel) {
   
    dataChannel.onopen = () => console.log('Data channel is open');
    dataChannel.onclose = () => console.log('Data channel is closed');
    dataChannel.onmessage =(e)=> console.log(e)
    dataChannel.send('hellooooo to you')
}
