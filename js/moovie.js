
/*-------------------------

Moovie.js - HTML5 Media player made for movies

Made by: Bruno Vieira

--------------------------- */

class Moovie {

    constructor({
        selector = 'defaultId',
        dimensions = {
          width: "700"
        }
    }) 
    {

        // Global
        var randomID = Math.floor(Math.random() * (9999 - 0 + 1)) + 0;
        var dimensions = dimensions;
        var _this = this;
        var parts, video, subtitles = 0, hassubtitles = 0,  moovie_controls, player, progress, progressBar, toggle, skipButtons, ranges, fullscreen, poster, progressBarBuffered, offsettime=0, submenu_main, moovie_submenu, isopen = 0, moovie_video, poster_layer;
        var selectedCaption = [];

        // Define Variables
        this.selector = selector.substring(1);
        this.dimensions = dimensions;
        this.randomID = randomID;

        // Main throttle function
        function throttle (func, interval) {
          var timeout;
          return function() {
            var context = this, args = arguments;
            var later = function () {
              timeout = false;
            };
            if (!timeout) {
              func.apply(context, args)
              timeout = true;
              setTimeout(later, interval)
            }
          }
        }

        // Change video status
        function togglePlay() {

            // Remove poster background.
            document.getElementById("poster_layer_"+randomID).style.backgroundImage = "none"; 
            if(video.paused == true) {
                video.play();
                document.getElementById("moovie_bplay_"+randomID).src = "icons/pause.svg"
                togglePoster("hide");
            } else {
                video.pause();
                document.getElementById("moovie_bplay_"+randomID).src = "icons/play.svg"
            }      
        }

        /* View in fullscreen */
        function SetFullScreen() {
            if (player.requestFullscreen) {
                player.requestFullscreen();
            } else if (player.webkitRequestFullscreen) { /* Safari */
                player.webkitRequestFullscreen();
            } else if (player.msRequestFullscreen) { /* IE11 */
                player.msRequestFullscreen();
            }

            if(1 >= outerHeight - innerHeight)
            {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { /* Safari */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { /* IE11 */
                    document.msExitFullscreen();
                }
            }

            CloseAllMenus();
        }

        // Focus player
        function focusPlayer() { video.focus();}

        // Show or Hide poster
        function togglePoster(order)
        {
            if(order == "show")
            {
                poster.style.display = "block";
                poster.classList.remove("posteroff");
                poster.classList.add("posteron");
            } else if(order == "hide")
            {
                poster.style.display = "none";
                poster.classList.remove("posteron");
                poster.classList.add("posteroff");
            }
        }

        // Skips part of video
        function skip() {
         video.currentTime += parseFloat(this.dataset.skip);
        }

        // Range value when drag
        function handleRangeUpdate() {

            video[this.name] = this.value;
            // Update volume icon
            if(this.value == 0) { document.getElementById("icon_volume_"+randomID).src = "icons/mute.svg"; } else { document.getElementById("icon_volume_"+randomID).src = "icons/volume.svg";}
        }

        // Change current playtime
        function movieVideo(time, direction)
        {
            switch (direction) {
                case "left":
                      var vid_currentTime = video.currentTime;
                      video.currentTime = vid_currentTime - time;
                      var ncurrentTime = document.getElementById("range_progress").value;
                      document.getElementById("range_progress").value = Number(ncurrentTime)-5;

                    break;
                case "right":
                      var vid_currentTime = video.currentTime;
                      video.currentTime = vid_currentTime + time;
                      var ncurrentTime = document.getElementById("range_progress").value;
                      document.getElementById("range_progress").value = Number(ncurrentTime)+5;

                break;   
             } 
        }

        // Mute/Unmute player
        function mutePlayer()
        {
            if(video.volume == 0)
            {
                video.volume = 1;
                document.getElementById("icon_volume_"+randomID).src = "icons/volume.svg";
                document.getElementById("mooviegrid_volume_"+randomID).value = "1";

            } else {
                video.volume = 0;
                document.getElementById("icon_volume_"+randomID).src = "icons/mute.svg";
                document.getElementById("mooviegrid_volume_"+randomID).value = "0";
            }
        }

        // Calculates video time
        function player_time(secs)
        {   
            var t = new Date(1970,0,1);
            t.setSeconds(secs);
            var s = t.toTimeString().substr(0,8);
            if(secs > 86399)
            s = Math.floor((t - Date.parse("1/1/70")) / 3600000) + s.substr(2);

            // Check if has less than a hour, if yes, remove hour digits
            if(secs < 3600) { s = s.substring(3); }

            return s;
        }

        // Update movie time
        function updateTime(){

            // Get percentage buffered
            var r = video.buffered;
            var total = video.duration;
            var start = r.start(0);
            var end = r.end(0);
            
            // Update current times
            document.getElementById("moovie_currentime").innerHTML = player_time(video.currentTime);
             if(video.currentTime >= video.duration) { video.currentTime = 0; togglePlay();  document.getElementById("range_progress").value = 0; }
        }

        // Progress bar
        var handleProgress = throttle(function() {

            // Get percentage buffered
            var r = video.buffered;
            var total = video.duration;
            var start = r.start(0);
            var end = r.end(0);
            
            if(!video.paused)
            {
                var ncurrentTime = document.getElementById("range_progress").value;
                document.getElementById("range_progress").value = Number(ncurrentTime)+1;
            }

        }, 1000);

        // Save offset time
        function OffsetChange()
        {
            offsettime =  document.getElementById("offset_range_input").value;
            document.getElementById("option_submenu_range").innerHTML = offsettime+"s"; 
        }

        // Jump to current time when clicked
        function Scrub(e) {
          const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
          if(scrubTime >= video.duration){ scrubTime = video.duration; }

          video.currentTime = scrubTime;
        }

        // Close all Menus
        function CloseAllMenus()
        {
            // Close all other submenus
            submenu_main.style.display = "none";
            document.getElementById("moovie_submenu_captions").style.display = "none";
            document.getElementById("moovie_range_captions").style.display = "none";

            moovie_submenu.classList.remove("menuopen");
            moovie_submenu.classList.add("menuclosed");
            moovie_submenu.classList.remove("menuopen");
            isopen = 0;
        }

        // Open main submenu
        function ToggleSubmenu()
        {
            // Close all other submenus
            submenu_main.style.display = "block";
            document.getElementById("moovie_submenu_captions").style.display = "none";
            document.getElementById("moovie_range_captions").style.display = "none";

            // Open mainsubmenu 
            if(moovie_submenu.classList.contains("menuclosed"))
            {
                moovie_submenu.style.display = "block";
                moovie_submenu.classList.add("menuopen");
                moovie_submenu.classList.remove("menuclosed");
                isopen = 1;
            } else {
                moovie_submenu.style.display = "none";
                moovie_submenu.classList.add("menuclosed");
                moovie_submenu.classList.remove("menuopen");
                isopen = 0;
            }
        }

        // Hide Controls
        function HideControls(order)
        {
            if(order == "close")
            {
                if(isopen == 0 && video.paused == false) 
                {   
                  CloseAllMenus();
                  document.getElementById("moovie__controls_"+randomID).style.display = "none";
                }

            } else if(order == "open")
            { document.getElementById("moovie__controls_"+randomID).style.display = "flex";
            }
        }

        // Activate subtitles
        function ActivateSubtitles()
        {
            console.log(hassubtitles);
            if(hassubtitles == 1)
            {

                if(subtitles == 0)
                {
                    subtitles = 1;
                    document.getElementById("moovie_subtitle_svg").classList.remove("opacity_svg");

                } else if(subtitles == 1)
                {
                    subtitles = 0;
                    document.getElementById("moovie_subtitle_svg").classList.add("opacity_svg");
                }

            } else {
                console.log("You must choose an Subtitle first.");
            }
        }

        // Open caption menu
        function OpenCaptionMenu(){
                submenu_main.style.display = "none";
                document.getElementById("moovie_submenu_captions").style.display = "block";  
        }

        // Close caption menu
        function CloseCaptionMenu(){
                submenu_main.style.display = "block";            
                document.getElementById("moovie_submenu_captions").style.display = "none"; 
        }

        // Open caption menu
        function OpenRangeMenu(){
                submenu_main.style.display = "none";
                document.getElementById("moovie_range_captions").style.display = "block";  
        }

        // Set caption size
        var SetCaptionSize = this.SetCaptionSize = function SetCaptionSize(caption) {

            var containerSize = moovie_video.offsetWidth;
            var fontSizeCap = containerSize*0.11;
            document.getElementById("caption_track_"+randomID).style.fontSize = fontSizeCap+"%";
           
        }

        // PLAY CAPTIONS ##############################################################################################################
        var PlayCaption = this.PlayCaption = function PlayCaption(caption) {

            // Format time
            function sec2time(timeInSeconds) {
                var pad = function(num, size) { return ('000' + num).slice(size * -1); },
                time = parseFloat(timeInSeconds).toFixed(3),
                hours = Math.floor(time / 60 / 60),
                minutes = Math.floor(time / 60) % 60,
                seconds = Math.floor(time - minutes * 60),
                milliseconds = time.slice(-3);
                return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2) + '.' + pad(milliseconds, 3);
            }

            // Run Caption Logic
            function RunCaption()
            {

                for (var i = 1; i < selectedCaption.length; i++) {

                    if(selectedCaption[i]['starttime'] != undefined && selectedCaption[i]['endtime'] != undefined)
                    {
                        var cap_starttime = selectedCaption[i]['starttime'];
                        var cap_endtime = selectedCaption[i]['endtime'];

                        if(offsettime >= 0)
                        {
                            var RealcurrentTime = video.currentTime-offsettime;
                        } else {

                            var offsettimeBelow0 = String(offsettime).substring(1);
                            var RealcurrentTime = video.currentTime+Number(offsettimeBelow0);
                        }

                        RealcurrentTime = sec2time(RealcurrentTime);

                        // Add caption if current time is between Start and End
                        if(RealcurrentTime >= cap_starttime && RealcurrentTime <= cap_endtime && subtitles == 1){ 

                                // Check if theres a undefined line
                                if(selectedCaption[i]["text2"] != undefined )
                                {
                                    document.getElementById("caption_track_"+randomID).innerHTML = selectedCaption[i]['text1']+"<br>"+selectedCaption[i]['text2'];
                                } else {
                                    document.getElementById("caption_track_"+randomID).innerHTML = selectedCaption[i]['text1'];
                                }
                        }

                        // After current time passes it removes caption
                        if(RealcurrentTime > cap_endtime){document.getElementById("caption_track_"+randomID).innerHTML = "";}
                    }
                }
            }

            // Loop trought selected VTT
            var request = new XMLHttpRequest();
            request.open('GET', caption["attributes"]["src"]["nodeValue"], true);

            request.onload = function() {
              if (this.status >= 200 && this.status < 400) {

                var resp = this.response;

                    resp.split("\n\n").map(function (item) {
                    parts = item.split("\n");

                    if(parts[1] != undefined)
                    {
                        if(isNaN(parts[0])) // If VTT Doesnt have cue number
                        {
                                var timeString = parts[0].replace(/-/g, '');

                                // Get starttime
                                var starttime = timeString.substr(0, timeString.indexOf('>')); 
                                starttime = starttime.replace(/ /g, '');
                                // Get endtime
                                var endtime = timeString.split('>', 2);
                                endtime = endtime[1].replace(/ /g, '');

                                // Push array with all info
                                selectedCaption.push(({'starttime': starttime, 'endtime': endtime, 'text1': parts[1], 'text2': parts[2]}));
                      
                        } else {

                                var timeString = parts[1].replace(/-/g, '');

                                // Get starttime
                                var starttime = timeString.substr(0, timeString.indexOf('>')); 
                                starttime = starttime.replace(/ /g, '');
                                // Get endtime
                                var endtime = timeString.split('>', 2);
                                endtime = endtime[1].replace(/ /g, '');

                                // Push array with all info
                                selectedCaption.push(({'starttime': starttime, 'endtime': endtime, 'text1': parts[2], 'text2': parts[3]}));
                        }
                    } else {

                        // Push array with all info
                        selectedCaption.push(({'starttime': undefined, 'endtime': undefined, 'text1': undefined, 'text2': undefined}));

                    }
                });

              } 
            };

            request.send();

            // Run caption
            video.addEventListener('timeupdate', RunCaption, false);
            // Set flag on hassubtitles
            hassubtitles = 1;
            ActivateSubtitles();
        }

        // ADD CAPTIONS ###############################################################################################################
        var SetCaptions = this.SetCaptions = function SetCaptions(caption) {

            // Generating a random ID for each caption
            var captionIDRandom = Math.floor(Math.random() * (9999 - 0 + 1)) + 0;
            // Add caption to list and add event listener to play it

            document.getElementById("moovie_submenu_captions").insertAdjacentHTML('beforeend', "<li id='captionid_"+captionIDRandom+"'><span>"+caption['track']['label']+"</span></li>");
            document.getElementById("captionid_"+captionIDRandom).addEventListener("click", function(){
                
                PlayCaption(caption);
                document.getElementById("option_submenu_caption").innerHTML = caption['track']['label'];
                ToggleSubmenu(); // Close menu
            });
        }

        // GET CAPTIONS ################################################################################################################
        var GetCaptions = this.GetCaptions = function GetCaptions() {

            // Get all captions inside video tag
            var vcaptions = document.getElementById(this.selector).getElementsByTagName('track');
            for (var i = 0; i < vcaptions.length; i++) {
                this.SetCaptions(vcaptions[i]);
            }
        }

        // KEYBINDS ###################################################################################################################
        var Keybinds = this.Keybinds = function Keybinds() {

            // Prevent window from scrolling down when space is used
            video.addEventListener('keydown', function(e) {
              if(e.keyCode == 32) {
                e.preventDefault();
              }
            });

            // Keybinds to player
            video.addEventListener('keydown', function (event) {
                if (event.keyCode == 32) { togglePlay(); }             // [Space bar] - Toogle play
                if (event.keyCode == 75) { togglePlay(); }             // [K] - Toggle play
                if (event.keyCode == 70) { SetFullScreen(); }          // [F] - Set fullscreen
                if (event.keyCode == 39) { movieVideo(5, "right"); }   // [Right Arrow] - Foward 5 seconds
                if (event.keyCode == 37) { movieVideo(5, "left"); }    // [Left Arrow] - backward 5 seconds
                if (event.keyCode == 77) { mutePlayer(); }             // [M] - Mute player   
            });
        }

        // SETUP EVENTS ################################################################################################################
        var SetupLogic = this.SetupLogic = function SetupLogic() {
 
            // Get elements
            player = document.querySelector('#moovie__video_'+randomID);
            video = player.querySelector('.viewer');
            this.video = video;

            video.addEventListener('timeupdate', handleProgress);
            video.addEventListener('timeupdate', updateTime);

            // Wait to load video and set duration
            video.oncanplay = (event) => {
              document.getElementById("moovie_fulltime").innerHTML = player_time(video.duration);
              document.getElementById("range_progress").setAttribute("max", video.duration); 
            };

            // Focus player so we can add bindings
            player.addEventListener('click', focusPlayer);

            // FullScreen
            fullscreen = player.querySelector(".fullscreen_button");
            fullscreen.addEventListener('click', SetFullScreen);

            // Toogle Functions
            toggle = player.querySelector('.toggle');
            toggle.addEventListener('click', togglePlay);

            // Poster Functions
            poster = player.querySelector('#poster_layer_'+randomID);
            poster.addEventListener('click', togglePlay);
            video.addEventListener('click', togglePlay);

            // Ranges & Sliders
            ranges = player.querySelectorAll('.player__slider');
            ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
            document.getElementById('offset_range_input').addEventListener('change', OffsetChange);

            // Mute
            document.getElementById("mooviegrid_mute_"+randomID).addEventListener('click', mutePlayer);

            // Progress bar
            progress = player.querySelector('.moovie_progress');
            progressBar = player.querySelector('.progress__filled');
            progressBarBuffered = player.querySelector('.progress__filled_buffered');
            
            let mousedown = false;
            progress.addEventListener('click', Scrub);
            progress.addEventListener('mousemove', (e) => mousedown && Scrub(e));
            progress.addEventListener('mousedown', () => mousedown = true);
            progress.addEventListener('mouseup', () => mousedown = false);

            // Submenu events
            document.getElementById("moovie_cog").addEventListener("click", ToggleSubmenu);
            document.getElementById("topic_submenu_caption").addEventListener("click", OpenCaptionMenu);
            document.getElementById("captions_back").addEventListener("click", CloseCaptionMenu);
            document.getElementById("moovie_subtitle").addEventListener("click", ActivateSubtitles);
            document.getElementById('moovie__video_'+randomID).addEventListener("mouseleave", CloseAllMenus);
            document.getElementById('captions_offset').addEventListener("click", OpenRangeMenu);

            // Esconde a div quando se está 3 segundos sem mexer o rato || 3 segundos é igual ao tempo do player
            HideControls("close");
            var i = null;
            document.getElementById("moovie__video_"+randomID).addEventListener('mousemove', e => {
                clearTimeout(i);
                HideControls("open");
                i = setTimeout(function(){ HideControls("close"); }, 2000);
            });
            document.getElementById("moovie__video_"+randomID).addEventListener('mouseleave', e => {
                clearTimeout(i);
                HideControls("close");
            });
            document.getElementById("moovie__controls_"+randomID).addEventListener('mouseover', e => { isopen = 1; });
            document.getElementById("moovie__controls_"+randomID).addEventListener('mouseleave', e => { isopen = 0; });

            document.getElementById("range_progress").addEventListener("input", function(event) { video.pause(); }, false);
            document.getElementById("range_progress").addEventListener("change", function(event) { video.play(); togglePoster("hide"); }, false);

        }

        // SETUP PLAYER STRUCTURE ########################################################################################################
        var SetupPlayer = this.SetupPlayer = function SetupPlayer() {

            // Get video source
            var vsource = document.getElementById(this.selector).getAttribute("src");
            if(vsource == null){ vsource = document.getElementById(this.selector).getElementsByTagName("source")[0].src }

            // Get poster if exists
            var vposter = document.getElementById(this.selector).getAttribute("poster");   
            // Hide video tag
            document.getElementById(this.selector).style.display = "none";
            // Main Div
            document.getElementById(this.selector).insertAdjacentHTML('afterend', "<div style='width:"+dimensions['width']+"' id='moovie__video_"+randomID+"' class='moovie'></div>");
                
                moovie_video = document.getElementById("moovie__video_"+randomID);
                this.videoelement = moovie_video;
                // Video tag
                moovie_video.insertAdjacentHTML('beforeend', "<video tabindex='1' preload='auto' class='player__video viewer' style='width:100%; height:100%;' src='"+vsource+"'></video>");              
                // Player Controls
                moovie_video.insertAdjacentHTML('beforeend', "<div id='moovie__controls_"+randomID+"' class='moovie_controls'></div>"); 
               
                    moovie_controls = document.getElementById("moovie__controls_"+randomID);

                    // Set main Play control when video is stopped
                    moovie_video.insertAdjacentHTML('afterbegin', "<div class='poster_layer posteron' id='poster_layer_"+randomID+"'></div>"); 

                    poster = document.getElementById("poster_layer_"+randomID);
                    poster.insertAdjacentHTML('afterbegin', "<div class='poster_center' id='poster_center_"+randomID+"' style=''></div>"); 
                    document.getElementById("poster_center_"+randomID).insertAdjacentHTML('afterbegin', "<div class='poster_button'><img src='icons/play.svg' style='width: 24px; position: relative; left: 3px;'></div>"); 

                    // Check if it has poster
                    if(vposter != null){  poster.style.backgroundImage = "url("+vposter+")"; poster.style.backgroundSize = "100%"; }
                   
                    // Add caption spot
                    moovie_video.insertAdjacentHTML('beforeend', "<div class='moovie_captionspot caption_size'><p class='moovie_caption' id='caption_track_"+randomID+"'></p></div>");
                    // Toogle play button
                    moovie_controls.insertAdjacentHTML('beforeend', "<button class='player__button toggle' id='tooglebutton' title='Toggle Play'><img id='moovie_bplay_"+randomID+"' src='icons/play.svg'></button>");
                    // Progress bar
                    moovie_controls.insertAdjacentHTML('beforeend', "<div class='moovie_progress player__slider' top:15px;><input type='range' id='range_progress' class='styled-slider slider-progress' min='0' value='0' step='0.01' autocomplete='off' style='width: 100%; cursor:pointer;' /></div>");  
                    // Current time / full time
                    moovie_controls.insertAdjacentHTML('beforeend', "<div class='player__button player_button_disabled moovie_currentime'><span id='moovie_currentime'>00:00</span> / <span id='moovie_fulltime'></span></div>");  
                    // Volume Icon
                    moovie_controls.insertAdjacentHTML('beforeend', "<button id='mooviegrid_mute_"+randomID+"' class='player__button'><img id='icon_volume_"+randomID+"' src='icons/volume.svg'></button>"); 
                    // Volume
                    moovie_controls.insertAdjacentHTML('beforeend', "<input type='range' id='mooviegrid_volume_"+randomID+"' style='max-width:100px; min-width:50px;' name='volume' class='moovie_progress_sound player__slider' min=0 max='1' step='0.01' value='1'>");  
                    // Subtitles
                    moovie_controls.insertAdjacentHTML('beforeend', "<button id='moovie_subtitle' style='margin-left:5px' class='player__button'><img class='opacity_svg' id='moovie_subtitle_svg' src='icons/cc.svg'></button>");  
                    // Config
                    moovie_controls.insertAdjacentHTML('beforeend', "<button id='moovie_cog' class='player__button'><img src='icons/cog.svg'></button>");  
                    // Fullscreen
                    moovie_controls.insertAdjacentHTML('beforeend', "<button class='player__button fullscreen_button'><img src='icons/fullscreen.svg'></button>");
                    // Create main sub-menu
                    moovie_controls.insertAdjacentHTML('beforeend', "<div style='display:none;' class='moovie_submenu menuclosed' id='moovie_submenu_"+randomID+"'><div class='arrow-down' style='position: absolute; margin-left: 148px;'></div></div>");  

                        moovie_submenu = document.getElementById("moovie_submenu_"+randomID);

                        // Menu main
                        moovie_submenu.insertAdjacentHTML('beforeend', "<ul id='moovie_submenu_main'></ul>");
                        submenu_main =  document.getElementById("moovie_submenu_main");

                        // Add lines to main
                        submenu_main.insertAdjacentHTML('beforeend', "<li class='topic_submenu'>Settings:</li>");
                        submenu_main.insertAdjacentHTML('beforeend', "<li id='topic_submenu_caption'><span>Captions</span><span class='option_submenu' id='option_submenu_caption'>Disabled</span></li>");
                        submenu_main.insertAdjacentHTML('beforeend', "<li id='captions_offset'><span >Caption Offset</span><span class='option_submenu' id='option_submenu_range'>0s</span></li>");
                        submenu_main.insertAdjacentHTML('beforeend', "<li id='topic_submenu_speed'><span >Speed</span><span class='option_submenu' id='option_submenu_speed'>Normal</span></li>");

                        /* CAPTIONS MENU */
                        moovie_submenu.insertAdjacentHTML('beforeend', "<ul style='display:none;' id='moovie_submenu_captions'><li class='topic_submenu'>Captions:</li><li id='captions_back' style='font-weight:bold;'>Back</li></ul>");
                             
                        /* RANGE CAPTION */
                        moovie_submenu.insertAdjacentHTML('beforeend', "<ul style='display:none; width:450px;' id='moovie_range_captions' style='display:none;'><li class='topic_submenu'>Adjust Caption Offset:<output style='position:absolute; right:22px;' id='valoffset'>0</output></li><li class='topic_submenu'><input type='range' oninput='valoffset.value = offset_range_input.value' id='offset_range_input' min='-5' max='5' step='0.2'></li>");
     
                    this.SetupLogic();
                    this.GetCaptions();
                    this.Keybinds(); 
                    SetCaptionSize();       
        }

        // ** SETUP player **
        this.SetupPlayer();

        // Function that will run repeatedly at each fixed interval of time.
        var ResizeWindow = throttle(function() {
            SetCaptionSize();
        }, 300);

        // Add EventListener
        window.addEventListener('resize', ResizeWindow);

    }

}