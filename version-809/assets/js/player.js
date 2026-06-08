import { H as Hls } from "./hls.js";

export function setupMoviePlayer(movieUrl, videoId, playButtonId, coverLayerId) {
  var video = document.getElementById(videoId);
  var playButton = document.getElementById(playButtonId);
  var coverLayer = document.getElementById(coverLayerId);
  var hls = null;
  var attached = false;
  var pendingPlay = false;

  if (!video || !movieUrl) {
    return;
  }

  function attachMedia() {
    if (attached) {
      return;
    }

    attached = true;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = movieUrl;
      return;
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });

      hls.loadSource(movieUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        if (pendingPlay) {
          video.play().catch(function () {});
        }
      });
      return;
    }

    video.src = movieUrl;
  }

  function hideCover() {
    if (coverLayer) {
      coverLayer.classList.add("is-hidden");
    }
  }

  function showCover() {
    if (coverLayer && video.paused) {
      coverLayer.classList.remove("is-hidden");
    }
  }

  function startPlayback() {
    attachMedia();
    pendingPlay = true;
    hideCover();

    video.play().catch(function () {
      window.setTimeout(function () {
        video.play().catch(function () {
          showCover();
        });
      }, 420);
    });
  }

  if (coverLayer) {
    coverLayer.addEventListener("click", startPlayback);
  }

  if (playButton) {
    playButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      startPlayback();
    });
  }

  video.addEventListener("play", hideCover);
  video.addEventListener("pause", showCover);
  video.addEventListener("ended", showCover);
  video.addEventListener("click", function () {
    if (video.paused) {
      startPlayback();
    }
  });

  window.addEventListener("pagehide", function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
