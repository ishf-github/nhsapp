<script>
import { onMount } from 'svelte';

let client;
let stream;
let userVideo;
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfa2V5IjoiYWgxU0pqVDlSNk8yRUl5bGZJODQ2USIsInJvbGVfdHlwZSI6MSwidHBjIjoibXluaHMiLCJ2ZXJzaW9uIjoxLCJpYXQiOjE3MTk5NDUwMDAsImV4cCI6MTcxOTk0ODYwMH0.gmIlAN1jFr0XvR-Ke-MGfoyPJHOVGXgizDmSZpgATuw';


onMount(async ()=>{ 
    const ZoomVideo = (await import('@zoom/videosdk')).default;
    client = ZoomVideo.createClient()
})


const startVideoCall=async()=>{
  await client.init('en-US', 'Global', { patchJsMedia: true }).then(() => {
    client.join('mynhs', token, 'userName', '1234') //replace 'VIDEO_SDK_JWT with generated auth code (valid for 1hr)'
    .then(() => {
      stream = client.getMediaStream()
    }).then(()=>{stream.startVideo({ videoElement: document.querySelector('#my-self-view-video') })})
    // .then(()=>{
    //     stream.attachVideo(client.getCurrentUserInfo().userId)
    // })
  })
  // let userVideo = await stream.attachVideo(client.getCurrentUserInfo().userId, RESOLUTION)
  
  // console.log("User video: ", userVideo)
  // console.log("Element:", document.querySelector('.video-player-container'))
  // document.querySelector('.video-player-container').appendChild(userVideo)
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

</style>

<h1>Video Call</h1>
<button on:click={()=>startVideoCall()}>
  start video
</button>
<button on:click={()=>stopVideoCall()}>
  stop video
</button>
<div class = "video-player-container">
  <video id="my-self-view-video" width="500" height="500"></video>
</div>