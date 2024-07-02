<script>
import { onMount } from 'svelte';

let client;
let stream;
let userVideo;
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiYWgxU0pqVDlSNk8yRUl5bGZJODQ2USIsInJvbGVfdHlwZSI6MSwidHBjIjoibXluaHMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3MTk5NTQ4NzQsImV4cCI6MTcxOTk1ODQ3NH0.E69eTpHUZrEqE8MvzM7vZukzSMGQtM9FHdlhuyDs5wA';


onMount(async ()=>{ 
    const ZoomVideo = (await import('@zoom/videosdk')).default;
    client = ZoomVideo.createClient()
    if (client){
  // Handle new participant video streams
  
}
})


const startVideoCall=async()=>{
  await client.init('en-US', 'Global', { patchJsMedia: true }).then(() => {
    client.join('mynhs', token, 'userName', '1234') //replace 'VIDEO_SDK_JWT with generated auth code (valid for 1hr)'
    .then(() => {
     stream = client.getMediaStream()
     console.log("stream: ",stream)
     client.on('peer-video-state-change', (payload) => {
      console.log("payload: ",payload)
        console.log("user joined.",payload.userId)
        const { userId } = payload;
        console.log("stream2: ",stream)
        const participantVideo = document.querySelector("#participant-video")
        console.log("participantVideo: ",participantVideo)
          stream.renderVideo(participantVideo,userId,500,500,0,0,3);
      });
    }).then(()=>{stream.startVideo({ videoElement: document.querySelector('#my-self-view-video') }) 
      
    })

  })
}



const stopVideoCall=async()=>{
  await stream.stopVideo().then(() => {
  stream.detachVideo(client.getCurrentUserInfo().userId)
  client.leave(true)
})
}

</script>

<style>

.video-player-container {
  width: 500px;
  height: 500px;
  background-color: grey;
}

.video-player {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
}

.videos {
  display: flex;
  flex-direction: row;
  width: fit-content;
}

</style>

<h1>Video Call</h1>
<button on:click={()=>startVideoCall()}>
  start video
</button>
<button on:click={()=>stopVideoCall()}>
  stop video
</button>
<div class = "videos">
  <div class = "video-player-container">
    <video id="my-self-view-video" width="500" height="500"></video>
  </div>
  <div class = "video-player-container">
    <canvas id="participant-video" width="500" height="500"></canvas>
  </div>
</div>