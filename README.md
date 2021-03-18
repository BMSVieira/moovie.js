<p align="center">
<img width="250" src="https://bmsvieira.github.io/moovie.js/demo-template/images/moovie_black.png">
</p>


<p align="center" size="20pt"><font size="20pt"><b><a href="https://github.com/BMSVieira/moovie.js#%EF%B8%8F-demo">Demo</a></b>  ▪️  <b><a href="https://github.com/BMSVieira/moovie.js#%EF%B8%8F-installation">Installation</a></b>   ▪️  <b><a href="https://github.com/BMSVieira/moovie.js#%EF%B8%8F-shortcuts">Shortcuts</a></b>  ▪️  <b><a href="https://github.com/BMSVieira/moovie.js#%EF%B8%8F-api--methods">API</a></b>  ▪️  <b><a href="https://github.com/BMSVieira/moovie.js#%EF%B8%8F-events">Events</a></b>  ▪️  <b><a href="https://github.com/BMSVieira/moovie.js#%EF%B8%8F-settings">Settings</a></b></font></p>

◼️ Features:
-
- 🔧 Fully customizable
- 💎 Built-in caption offset adjust on the fly
- 🌠 Adjust speed on the fly
- 🎬 Built-in support for `.vtt` and `.srt` caption files 
- 🖊 Add tracks/captions dynamically
- 🛠 Standardized events / shortcuts / API
- 🖌 Caption customization
- 💪 No dependencies, built with VanillaJS
- 🌎 Tested in all modern browsers
- 💻 Responsive

◼️ Demo:
-
https://bmsvieira.github.io/moovie.js/

◼️ Installation:
-

1 - Include JavaScript Source.
```javascript
<script src="path/to/moovie.js"></script>
```
2 - Include Styles.
```javascript
<link rel="stylesheet" href="path/to/moovie.css">
```
3 - Set HTML.
```html
<video id="example" poster="<<path-to-poster>>">
  <source src="<<path-to-file.mp4>>" type="video/mp4">
  <track kind="captions" label="Portuguese" srclang="pt" src="<<path-to-caption.vtt>>">
  <track kind="captions" label="English" srclang="en" src="<<path-to-caption.vtt>>">
  Your browser does not support the video tag.
</video>
```
4 - Initilize.
```javascript
document.addEventListener("DOMContentLoaded", function() {
   var demo = new Moovie({
     selector: "#example",
     dimensions: {
          width: "100%"
     }
   });
});
```
###### Note: Do not forget to include "icons" folder.

◼️ CDN:
-
You can use our CDN (provided by JSDelivr) for the JavaScript and CSS files.

```html
// Javascript
<script src="https://cdn.jsdelivr.net/gh/BMSVieira/moovie.js@latest/js/moovie.min.js"></script>

// CSS
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/BMSVieira/moovie.js@latest/css/moovie.min.css">
```

◼️ Captions:
-

Currently it has full support for `WebVTT(.vtt)` and `SubRip(.srt)`.
<br>To add a track use the standard html as the example below.

```html
<track kind="captions" label="<<Language>>" srclang="<<SourceLang>>" src="<<path-to-caption.vtt/.srt>>">
```

◼️ Caption Offset Adjust:
-

It is possible to adjust the offset by a total of `10 seconds` (-5 / +5) on the fly.<br><br>
<img width="500" src="https://bmsvieira.github.io/moovie.js/demo-template/images/captionoffset.png">

◼️ Shortcuts:
-

A player will bind the following keyboard shortcuts when it has focus.

| Key | Description |
| --- | --- |
| `SpaceBar` | Toggle Play|
| `K`  | Toggle Play  |
| `F` | Toggle Fullscreen|
| `ArrowRight`  | Forward `5s`  |
| `ArrowLeft` | Backward `5s` |
| `M`  | Toggle Mute  |
| `Shift`+`W`| Increase caption's size|
| `Shift`+`S`| Decrease caption's size|

◼️ API > Methods:
-

<b>togglePlay:</b>
Play/Pause video

```javascript
demo.togglePlay();
```

<b>toggleSubtitles:</b>
Enable/Disable subtitles

```javascript
demo.toggleSubtitles();
```

<b>toggleFullscreen:</b>
Enable/Disable fullscreen

```javascript
demo.toggleFullscreen();
```

<b>addTrack:</b>
Add multiple/single captions to player

| Name | Type | Default | Description |
| --- | --- |--- | --- |
| `label` | `string` | `New Subtitle` | Name of the new subtitle in the caption box |
| `srclang` | `string` | `New` | Country designation |
| `src` | `string` | `---` |  Path to the file <b>[Can not be empty]</b> |

```javascript
demo.addTrack({
  options : {
        0: {
            label: 'Italian',
            srclang: "it",
            src: "<<path-to-file.vtt/.srt"
        },
        1: {
            label: 'Spanish',
            srclang: "es",
            src: "<<path-to-file.vtt/.srt"
        }
    }
}
```

<b>change:</b>
Apply changes to current player.

| Name | Type | Description |
| --- | --- | --- |
| `video` > `videoSrc` | `string` | New video's source|
| `video` > `posterSrc` | `string` | New poster's source |
| `captions` > `clearCaptions` | `boolean` |  Remove all available captions in the menu |

```javascript
demo.change({
     video: {
         videoSrc: "<<path-to-video>>",
         posterSrc: "<<path-to-poster>>"
     },
     captions:{
         clearCaptions: true
     }
});
```

◼️ API > Gets:
-
```javascript
// Returns player DOM element
demo.playerElement

// Returns a boolean indicating if the current player is playing.
demo.playing

// Returns a boolean indicating if the current player is paused.
demo.paused

// Returns a boolean indicating if the current player is stopped.
demo.stopped  

// Returns a boolean indicating if the current player has finished playback.
demo.ended    

// Returns currentTime of the player. 
demo.currentTime

// Returns the duration for the current media.
demo.duration

// Returns a boolean indicating if the current player is seeking.
demo.seeking

// Returns the volume of the player.
demo.volume

// Returns a boolean indicating if the current player is muted.
demo.muted

// Returns current playRate 
demo.speed

// Returns mininum speed allowed
demo.minimumSpeed

// Returns maximum speed allowed
demo.maximumSpeed

// Returns mininum caption offset allowed
demo.minimumOffset

// Returns maximum caption offset allowed
demo.maximumOffset

// Returns current caption offset
demo.captionOffset

// Returns current source of the player
demo.source
```

◼️ API > Sets:
-
```javascript
// Set currentTime to given number(seconds)
demo.currentTime = 60

// Set player's volume to given number (0.5 is half the volume)
demo.volume = 0.5

// Set player's playbackRate to given number (0.1 to 8)
demo.speed = 2

// Set player's caption offset to given number (-5 to 5)
demo.captionOffset = 2
```

◼️ Events:
-

Using <a href="https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events" target="_blank">Standard Media Events</a> you can listen for events on the target element you setup. check the example below:

```javascript
demo.video.addEventListener("canplay", function() {
    // Your Code Here
}, true);
```

| Event | Description 
| --- | --- |
| `abort`| Sent when playback is aborted; for example, if the media is playing and is restarted from the beginning, this event is sent. |
| `canplay`| Sent when enough data is available that the media can be played, at least for a couple of frames. |
| `canplaythrough`| Sent when the readyState changes to HAVE_ENOUGH_DATA, indicating that the entire media can be played without interruption, assuming the download rate remains at least at the current level.|
| `durationchange`| The metadata has loaded or changed, indicating a change in duration of the media. |
| `emptied`| The media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the load() method is called to reload it. |
| `error`| Sent when an error occurs.  The element's error attribute contains more information. |
| `interruptbegin`| Sent when audio playing on a Firefox OS device is interrupted, either because the app playing the audio is sent to the background, or audio in a higher priority audio channel begins to play. |
| `interruptend`| Sent when previously interrupted audio on a Firefox OS device commences playing again — when the interruption ends. |
| `loadeddata`| The first frame of the media has finished loading. |
| `loadedmetadata`| The media's metadata has finished loading; all attributes now contain as much useful information as they're going to. |
| `loadstart`| Sent when loading of the media begins. |
| `pause`| Sent when the playback state is changed to paused (paused property is true). |
| `play`| Sent when the playback state is no longer paused, as a result of the play method, or the autoplay attribute. |
| `playing`| Sent when the media has enough data to start playing, after the play event, but also when recovering from being stalled, when looping media restarts, and after seeked, if it was playing before seeking. |
| `progress`| Sent periodically to inform interested parties of progress downloading the media. Information about the current amount of the media that has been downloaded is available in the media element's buffered attribute. |
| `ratechange`| Sent when the playback speed changes. |
| `seeked`| Sent when a seek operation completes. |
| `seeking`| Sent when a seek operation begins. |
| `stalled`| Sent when the user agent is trying to fetch media data, but data is unexpectedly not forthcoming. |
| `suspend`| Sent when loading of the media is suspended; this may happen either because the download has completed or because it has been paused for any other reason. |
| `timeupdate`| The time indicated by the element's currentTime attribute has changed. |
| `volumechange`| Sent when the audio volume changes (both when the volume is set and when the muted attribute is changed). |
| `waiting`| Sent when the requested operation (such as playback) is delayed pending the completion of another operation (such as a seek). |


◼️ Settings:
-
| Option | Type | Description |
| --- | --- | --- |
| `selector` | `String`  | Specify ID of the element|
| `dimensions` > `width` | `string` | Width of the player (you must specify the type: `px`, `%`, etc..)|
| `config` > `storage` > `captionOffset`| `boolean`  | Indicates whether caption's offset adjust will be stored or not|
| `config` > `storage` > `playrateSpeed`| `boolean`  | Indicates whether Play Speed will be stored or not|
| `config` > `storage` > `captionSize`| `boolean`  | Indicates whether caption's size will be stored or not|

<b>Full Example:</b>

```javascript
document.addEventListener("DOMContentLoaded", function() {
  var demo = new Moovie({
    selector: "#example",
    dimensions: {
         width: "100%"
    },
    config: {
        storage: {
           captionOffset: false,
           playrateSpeed: false,
           captionSize: false
        }
    }
  });
});
```
