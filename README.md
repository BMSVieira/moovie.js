moovie.js - Movie focused HTML5 Player 
--
<p align="center">
<img width="250" src="https://bmsvieira.github.io/moovie.js/demo-template/images/moovie_black.png">
</p>

◼️ Features:
-
- 🔧 Fully Customizable
- 💎 Built-in Caption Offset Adjust on the fly
- 🎬 Built-in support for `.vtt` and `.srt` caption files 
- 💪 No Dependencies, built with VanillaJS
- 🌎 Tested in All Modern Browsers
- 💻 Responsive
- ⌨️ Standardized Shortcuts
- 🛠 Standardized Events

◼️ Coming soon:
-
- 🔥 Add tracks dinamically
- 🔥 Caption customization
- 🔥 Adjust speed on the fly

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
   var demo1 = new Moovie({
     selector: "#example",
     dimensions: {
          width: "100%"
     }
   });
});
```

◼️ Captions:
-

Currently it has full support for WebVTT (.vtt) and SubRip (.srt).
<br>To add a track use the standard html as the example below.

```html
<track kind="captions" label="<<Language>>" srclang="<<SourceLang>>" src="<<path-to-caption.vtt/.srt>>">
```

◼️ Caption Offset Adjust:
-

It is possible to adjust the offset by a total of `10 seconds` (-5 / +5) on the fly.<br><br>
<img width="500" src="https://bmsvieira.github.io/moovie.js/demo-template/images/captionadjust.png">

◼️ Shortcuts:
-

| Key | Description |
| --- | --- |
| `Space Bar` | Toggle Play|
| `K`  | Toggle Play  |
| `F` | Toggle Fullscreen|
| `->`  | Forward 5 seconds  |
| `<-` | Backward 5 seconds |
| `M`  | Toggle Mute  |

Methods:
-
<b>GetPlayerElement:</b>
Get generated player element, so it can be added eventListeners.

```javascript
demo1.GetPlayerElement();
```

<b>TogglePlay:</b>
Play/Pause video

```javascript
demo1.TogglePlay();
```

<b>ToogleSubtitles:</b>
Enable/Disable subtitles

```javascript
demo1.ToogleSubtitles();
```

<b>ToogleFullscreen:</b>
Enable/Disable fullscreen

```javascript
demo1.ToogleFullscreen();
```
