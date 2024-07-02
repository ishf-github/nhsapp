<script>
import { onMount } from 'svelte';

let client;
let stream;
let userVideo;
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiYWgxU0pqVDlSNk8yRUl5bGZJODQ2USIsInJvbGVfdHlwZSI6MSwidHBjIjoibXluaHMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3MTk5NTg2NTcsImV4cCI6MTcxOTk2MjI1N30.WfegRo3j_0IhLjlJjlwMgDNUJH9eooCjNi5JL39UCp0';


onMount(async ()=>{ 
    const ZoomVideo = (await import('@zoom/videosdk')).default;
    client = ZoomVideo.createClient()
    if (client){
  // Handle new participant video streams
  
}
})


const startVideoCall=async()=>{
  await client.init('en-US', 'Global', { patchJsMedia: true }).then(() => {
    client.join('mynhs', token, 'userName', '1234')
    .then(() => {
     stream = client.getMediaStream()
     client.getAllUser().forEach((user) => {
      if (user.bVideoOn) {
        stream.renderVideo(
          document.querySelector('#participant-video'),
          user.userId, 500, 500, 0, 0, 3)
      }
    })
     console.log("stream: ",stream)
     client.on('peer-video-state-change', (payload) => {
      const { userId } = payload;
      if (payload.action==='Start'){
        const participantVideo = document.querySelector("#participant-video")
        console.log("participantVideo: ",participantVideo)
        stream.renderVideo(participantVideo,userId,500,500,0,0,3);
      }
      else if (payload.action==='Stop'){
        stream.stopRenderVideo(
        document.querySelector('#participant-video'),
        payload.userId
    )
    stream.detachVideo(payload.userId)
      }
        
      });
    }).then(()=>{stream.startVideo({ videoElement: document.querySelector('#my-self-view-video') })     
    })
  })
}

const stopVideoCall=async()=>{
  
    client.getAllUser().forEach((user) => {
      stream.stopRenderVideo(
        document.querySelector('#participant-video'),
        user.userId
    )
      stream.detachVideo(user.userId)
    })
  
  client.leave()

}

// const stopVideoCall=async()=>{
//   await stream.stopVideo().then(() => {
//     client.getAllUser().forEach((user) => {
//       stream.stopRenderVideo(
//         document.querySelector('#participant-video'),
//         payload.userId
//     )
//       stream.detachVideo(user.userId)
//     })
  
//   client.leave()
// })
// }

</script>

<style>

.video-player-container {
  width: 500px;
  height: 500px;
  background-color: black;
}

.video-player {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
  background-color: black;
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