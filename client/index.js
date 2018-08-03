import io from "socket.io-client";
require("webrtc-adapter");

const socket = io("http://localhost:3030");

// Define DOM Elements consts
const usernameSpan = document.querySelector("#usernameSpan");
const usernameInput = document.querySelector("#usernameInput");
const callBtn = document.querySelector("#callBtn");
const localVideo = document.querySelector("#localVideo");
const remoteVideo = document.querySelector("#remoteVideo");

callBtn.addEventListener("click", e => call(e));

let username = null;

// Get your generated ID from the signaling server
socket.on("connect", () => {
  console.log("Connected to Signaling Server");
  username = socket.id;
  usernameSpan.innerHTML = username;
  callBtn.disabled = false;
});

// getUserMedia Constrains
let constrains = {
  audio: true,
  video: true
};

let handleMediaStream = stream => {
  // Add local stream to localVideo element
  localVideo.srcObject = stream;
  // Add local stream to peer connection
  stream.getTracks().forEach(track => pc.addTrack(track, stream));
};

navigator.mediaDevices
  .getUserMedia(constrains)
  .then(handleMediaStream)
  .catch(error => console.log(error));

// Initiate Peer Connection
let servers = {
  iceServers: [{ url: "stun:stun.l.google.com:19302" }]
};

let pc = new RTCPeerConnection(servers);

let call = e => {
  e.preventDefault();
  let remoteUsername = usernameInput.value;
  console.log(`Calling ${remoteUsername}...`);

  if (usernameInput.value === "") {
    alert("Please Instert a Username");
    return;
  }
  // Create offer for the other peer
  pc.createOffer()
    .then(offer => {
      // Set the offer as pc's local description
      pc.setLocalDescription(offer);
      // Send the offer to the other peer through the signaling server.
      socket.emit("msg", {
        action: "offer",
        offer,
        to: remoteUsername,
        from: username
      });
    })
    .catch(error => console.log(`Error sending offer to other peer: ${error}`));

  // Exchange ICE candidates
  pc.onicecandidate = e => {
    if (e.candidate) {
      socket.emit("msg", {
        action: "candidate",
        candidate: e.candidate,
        to: remoteUsername,
        from: username
      });
    }
  };
};

socket.on("disconnect", () => {
  console.error("Disconnected from Signaling Server");
});

socket.on("msg", msg => {
  switch (msg.action) {
    case "offer":
      console.log(`Incoming Offer from ${msg.from}`);
      // Set the offer as pc's remote description
      pc.setRemoteDescription(msg.offer);
      // Create answer for the other peer
      pc.createAnswer()
        .then(answer => {
          // Set the answer as pc's local description
          pc.setLocalDescription(answer);
          // Send the answer to the remote peer through the signaling server
          socket.emit("msg", {
            action: "answer",
            answer,
            to: msg.from,
            from: username
          });
        })
        .catch(error => {
          console.error("Error sending answer to other peer", error);
        });
      break;
    case "answer":
      console.log(`Incoming Answer from ${msg.from}`);
      // Set the answer as pc's remote description
      pc.setRemoteDescription(msg.answer);
      break;
    case "candidate":
      console.log(`Incoming Candidate from ${msg.from}`);
      // Register the candidate in Peer Connection
      pc.addIceCandidate(msg.candidate);
      break;
    default:
      break;
  }
});

// When someone calls, add their stream to remoteVideo element
pc.ontrack = e => {
  remoteVideo.srcObject = e.streams[0];
  remoteVideo.onloadedmetadata = () => remoteVideo.play();
  callBtn.disabled = true;
};
