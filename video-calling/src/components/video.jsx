import "./VideoStyles.css";
import Grid from "@mui/material/Unstable_Grid2";
import { useEffect, useState } from "react";

function Videos() {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  // list of stun servers 
  const servers = {
    iceServers: [
      {
        urls: ["stun:stun.awa-shima.com:3478"],
      },
    ],
  };

  useEffect(() => {
    const getUserMediaAndCreateOffer = async () => {
        // Taking permission for camera and mic 
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setLocalStream(mediaStream);
        
        const user1Video = document.getElementById("user1");
        if (user1Video) user1Video.srcObject = mediaStream;

        const pc = new RTCPeerConnection(servers);
        setPeerConnection(pc);

        const remoteMediaStream = new MediaStream();
        setRemoteStream(remoteMediaStream);
        
        pc.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
            remoteMediaStream.addTrack(track);
          });
        };

        pc.onicecandidate = (event) => {
          if (event.candidate) {
            console.log(event.candidate);
          }
        };

        mediaStream.getTracks().forEach((track) => {
          pc.addTrack(track, mediaStream);
        });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        console.log(offer);
    };

    getUserMediaAndCreateOffer();
  }, []);

  return (
    <div id="console">
      <Grid container spacing={10}>
        <Grid item xs={2}></Grid>
        <Grid item xs={4}>
          {localStream && (
            <video className="window" id="user1" autoPlay playsInline />
          )}
        </Grid>
        <Grid item xs={4}>
          {remoteStream && (
            <video className="window" id="user2" autoPlay playsInline />
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default Videos;
