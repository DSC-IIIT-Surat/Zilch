let Peer = require("simple-peer");
let socket = io();
const video = document.querySelector("video");
let client = {};

// username = prompt("username", "Harry Potter");
// room = prompt("room", "test");

console.log(username);
console.log(room);

socket.emit("join-video-chat", { username, room });
socket.on("output_video", (data) => {
	console.log(data);
});

//get stream
window.addEventListener("load", function () {
	if (navigator.mediaDevices) {
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				socket.emit("NewClient");
				video.srcObject = stream;
				video.play();
				function InitPeer(type) {
					console.log("INIT");
					let peer = new Peer({
						initiator: type == "init" ? true : false,
						stream: stream,
						trickle: false,
					});

					peer.on("stream", (stream) => {
						console.log("wrong");
						CreateVideo(stream);
					});
					return peer;
				}

				//for peer of type init
				function MakePeer() {
					console.log("Make peeer");
					client.gotAnswer = false;
					let peer = InitPeer("init");
					peer.on("signal", (data) => {
						if (!client.gotAnswer) {
							socket.emit("Offer", data);
						}
					});
					client.peer = peer;
				}

				function FrontAnswer(offer) {
					console.log("Frot Answ");
					let peer = InitPeer("noinit");
					peer.on("signal", (data) => {
						socket.emit("Answer", data);
					});
					peer.signal(offer);
				}

				function SignalAnswer(answer) {
					console.log("Signaml absw");
					client.gotAnswer = true;
					let peer = client.peer;
					peer.signal(answer);
				}

				function CreateVideo(stream) {
					console.log("Create video");
					let video = document.createElement("video");
					video.id = "peerVideo";
					video.srcObject = stream;
					video.className = "embed-responsive-item";
					document.querySelector("#peerDiv").appendChild(video);
					video.play();
					removeHeading();
				}

				function SessionActive() {
					document.write("session active");
				}

				function RemovePeer() {
					const a = document.getElementById("peerVideo");
					console.log(a.parentElement);
					a.remove();
					if (client.peer) {
						client.peer.destroy();
					}
				}

				socket.on("BackOffer", FrontAnswer);
				socket.on("BackAnswer", SignalAnswer);
				socket.on("SessionActive", SessionActive);
				socket.on("CreatePeer", MakePeer);
				socket.on("Disconnect", RemovePeer);
			})
			.catch((err) => {
				console.log(err);
				alert(err);
			});
	} else {
		alert("Not able to get Your video");
	}
});

function removeHeading() {
	const head = document.getElementById("heading");
	head.remove();
}
