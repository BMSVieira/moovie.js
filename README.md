# moovie.js

<p align="center">
<img width="300" src="https://bmsvieira.github.io/moovie.js/demo-template/images/moovie_black.png">
</p>

◼️ Features:
-
- 🔧 Fully Customizable
- 💎 Built-in Caption Offset Adjust on the fly
- 💪 No Dependencies, built with VanillaJS
- 🌎 Tested in All Modern Browsers
- 💻 Responsive
- ⌨️ Standardized Shortcuts
- 🛠 Standardized Events

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
   var demo1 = new moovie({
     selector: "#example",
     dimensions: {
          width: "100%"
     }
   });
});
```

◼️ Captions:
-

Currently it has full support for WebVTT (.vtt). To add a track use the standard html as the example above shows.

◼️ Caption Offset Ajust:
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
