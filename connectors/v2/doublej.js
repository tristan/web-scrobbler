
Connector.playerSelector = '.m-abcradioplayer';

Connector.artistSelector = '.m-abcradioplayer__programItem--now .m-abcradioplayer__programItem__description';

Connector.trackSelector = ".m-abcradioplayer__programItem--now .m-abcradioplayer__programItem__title";

Connector.getCurrentTime = function() {
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

Connector.isPlaying = function() {
    return $(".m-abcradioplayer__controls__playback").hasClass("m-abcradioplayer__controls__playback--stop");
};
