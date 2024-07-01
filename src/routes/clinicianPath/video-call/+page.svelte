<script>
import { onMount } from 'svelte';

let client;
let stream;

onMount(async ()=>{ 
    const ZoomVideo = (await import('@zoom/videosdk')).default;
    client = ZoomVideo.createClient()
    client.init('en-US', 'Global', { patchJsMedia: true }).then(() => {
    client.join('sessionName', 'VIDEO_SDK_JWT', 'userName', 'sessionPasscode') //replace 'VIDEO_SDK_JWT with generated auth code (valid for 1hr)'
    .then(() => {
      stream = client.getMediaStream()
    })
})
await stream.startVideo()
// let userVideo = await stream.attachVideo(client.getCurrentUserInfo().userId, RESOLUTION)
let userVideo = await stream.attachVideo(client.getCurrentUserInfo().userId)

console.log("User video: ", userVideo)

document.querySelector('.video-player-container').appendChild(userVideo)
})

</script>

<style>

.video-player-container {
  width: 100%;
  height: 1000px;
  background-color: grey;
}

.video-player {
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;
}

</style>

<h1>Video Call</h1>

<div class = "video-player-container">

</div>