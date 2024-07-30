/* const rtcHandler =async ()=>{
    const peer=new RTCPeerConnection();

    const offer= await peer.createOffer();
    await peer.setLocalDescription(offer);
    
   // const remote
} */

//create the peers
function init() {
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };
  const peerConnection = new RTCPeerConnection(configuration);
  const dataChannel = peerConnection.createDataChannel("file");
  return { peerConnection, dataChannel };
}

export function generateOffer() {
  const { peerConnection } = init();
  const offer = peerConnection.createOffer();
  peerConnection.setLocalDescription(offer).then((o) => {
    console.log("Local description set");
  });
  return {peerConnection,offer};
}

//handling remote connection
export function genrateAnswer(offer) {
  const { peerConnection } = init();
  //setting up remote description
  peerConnection
    .setRemoteDescription(offer)
    .then((a) => console.log("remote description set!!!!"));

  //setting up local description
  const answer = peerConnection.createAnswer();
  peerConnection.setLocalDescription(answer).then((a) => {
    console.log("Local description set");
  });
  return {peerConnection,answer};
}

export async function setRemoteDescription(peerConnection, answer) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log('Remote description set (answer)');
  }

function handlingDataChannel() {}
