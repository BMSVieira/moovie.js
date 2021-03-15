moovie.js - Movie focused HTML5 Player 
--
<p align="center">
<img width="250" src="https://bmsvieira.github.io/moovie.js/demo-template/images/moovie_black.png">
</p>

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
4 - Set HTML.
```html
<video id="example" poster="<<path-to-poster>>">
  <source src="<<path-to-file.mp4>>" type="video/mp4">
  <track kind="captions" label="Portuguese" srclang="pt" src="<<path-to-caption.vtt>>">
  <track kind="captions" label="English" srclang="en" src="<<path-to-caption.vtt>>">
  Your browser does not support the video tag.
</video>
```
3 - Initilize.
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
| `Shift`+`PageUp`| Increase caption's size|
| `Shift`+`PageDown`| Decrease caption's size|
| `Shift`+`ArrowUp`| Move caption up|
| `Shift`+`ArrowDown`| Move caption down|

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

| Name | Default | Description |
| --- | --- | --- |
| `label` | `New Subtitle` |  Name of the new subtitle in the caption box |
| `srclang` | `New` | Country designation |
| `src` | `---` |  Path to the file <b>[Can not be empty]</b> |

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

◼️ Settings:
-
| Option | Type | Description |
| --- | --- | --- |
| `selector` | `String`  | Specify ID of the element|
| `dimensions` > `width` | `string` | Width of the player (you must specify the type: `px`, `%`, etc..)|
| `config` > `storage` > `captionOffset`| `boolean`  | Indicates whether caption's offset adjust will be stored or not|
| `config` > `storage` > `playrateSpeed`| `boolean`  | Indicates whether Play Speed will be stored or not|
| `config` > `storage` > `captionSize`| `boolean`  | Indicates whether caption's size will be stored or not|
| `config` > `storage` > `captionPosition`| `boolean`  | Indicates whether caption's position will be stored or not|

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
           captionSize: false,
           captionPosition: false
        }
    }
  });
});
```
