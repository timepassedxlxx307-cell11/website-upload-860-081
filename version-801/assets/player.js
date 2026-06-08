(function() {
    function bindMoviePlayer(options) {
        var settings = options || {};
        var video = document.getElementById(settings.videoId || "moviePlayer");
        var cover = document.getElementById(settings.coverId || "playerCover");
        var source = settings.source;
        var ready = false;
        var hlsInstance = null;

        if (!video || !source) {
            return;
        }

        function prepare() {
            if (ready) {
                return;
            }
            ready = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function play() {
            prepare();
            if (cover) {
                cover.classList.add("is-hidden");
            }
            video.controls = true;
            var action = video.play();
            if (action && typeof action.catch === "function") {
                action.catch(function() {});
            }
        }

        if (cover) {
            cover.addEventListener("click", play);
        }

        video.addEventListener("click", function() {
            if (!ready) {
                play();
            }
        });

        video.addEventListener("play", function() {
            if (cover) {
                cover.classList.add("is-hidden");
            }
        });

        window.addEventListener("pagehide", function() {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    }

    window.bindMoviePlayer = bindMoviePlayer;
})();
