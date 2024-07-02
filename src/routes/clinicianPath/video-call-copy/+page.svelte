<script>
  import { onMount } from 'svelte';

  let client;
  let stream;

  async function generateJWT() {
    // Replace with your backend endpoint to get the JWT
    const response = await fetch('/generate-zoom-jwt');
    const data = await response.json();
    return data.jwt;
  }

  onMount(async () => {
    const ZoomVideo = (await import('@zoom/videosdk')).default;
    client = ZoomVideo.createClient();
    
    const jwt = await generateJWT();

    client.init('en-US', 'Global', { patchJsMedia: true }).then(() => {
      client.join('sessionName', jwt, 'userName', 'sessionPasscode') //replace 'sessionName', 'userName', and 'sessionPasscode'
        .then(async () => {
          stream = client.getMediaStream();
          await stream.startVideo();
          
          let userVideo = await stream.attachVideo(client.getCurrentUserInfo().userId);
          console.log("User video: ", userVideo);
          document.querySelector('.video-player-container').appendChild(userVideo);
        })
        .catch((error) => {
          console.error('Error joining session:', error);
        });
    });
  });
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

<div class="video-player-container"></div>
