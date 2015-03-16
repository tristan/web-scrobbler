(function() {
    'use strict';

    function getDuration() {
        var start = $(".m-abcradioplayer__controls__position").text();
        var end = $(".m-abcradioplayer__controls__duration").text();
        start = /^(\d+):(\d+) (am|pm)$/.exec(start);
        end = /^(\d+):(\d+) (am|pm)$/.exec(end);
        if (start === null || end === null) {
            return 90; // default 90 seconds
        }
        start = new Date(0, 0, 0, (start[1] === "12" ? 0 : parseInt(start[1])) + (start[3] == "pm" ? 12 : 0), parseInt(start[2]), 0, 0);
        end = new Date(0, 0, 0, (end[1] === "12" ? 0 : parseInt(end[1])) + (end[3] == "pm" ? 12 : 0), parseInt(end[2]), 0, 0);
        return (end.getTime() - start.getTime()) / 1000;
    }

    var lastArtist = null;
    var lastTrack = null;
    function scrobbleTrack(artist, track, duration) {
        if (duration === undefined || duration > 3600) {
           duration = 90; // just cut it down to 90 seconds
        }
        if (artist === '' || track === '' || (lastArtist === artist && lastTrack === track)) {
            return;
        }

        lastArtist = artist;
        lastTrack = track;

        console.log("Scrobbled - Artist: " + artist + ", Track: " + track + " (" + duration + ")");
        chrome.runtime.sendMessage({type: 'validate', artist: artist, track: track}, function(response) {
            if (response !== false) {
                chrome.runtime.sendMessage({type: 'nowPlaying', artist: artist, track: track, duration: duration});
            }
        });
    }

    function isPlaying() {
        return $(".m-abcradioplayer__controls__playback").hasClass("m-abcradioplayer__controls__playback--stop");
    }

    var config = {childList: true, subtree: true, attributes: true};
    var target = document.querySelector("[rmp-radioplayer-content]");
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(update);
    });
    function update() {
        if (isPlaying()) {
            var track = $(".m-abcradioplayer__programItem--now .m-abcradioplayer__programItem__title").text();
            var artist = $(".m-abcradioplayer__programItem--now .m-abcradioplayer__programItem__description").text();
            scrobbleTrack(artist, track, getDuration());
        }
    }
    observer.observe(target, config);
})();

/*
(function () {
    $.ajax("http://program.abcradio.net.au/api/v1/now_next_previous/doublej.json").done(function(data) {
        console.log(data);
    });
})();
*/
