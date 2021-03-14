    
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
        var parts, video, subtitles = 0, cuevalue = 0, speed = 1, moovie_el_sinput, moovie_el_rinput, hassubtitles = 0, moovie_el_range, moovie_el_speed, moovie_ishiden = 0, moovie_el_cuetimer, moovie_el_player, moovie_elprogress, moovie_el_toggle, ranges, fullscreen, progressBarBuffered, offsettime=0, isopen = 0, moovie_el_volume, moovie_el_video, moovie_el_poster, moovie_el_submenu, moovie_el_controls,  moovie_el_progress, moovie_el_captions, moovie_el_submain;
        var selectedCaption = [];

        // Define Variables
        this.selector = selector.substring(1);
        this.element = document.getElementById(this.selector);
        this.dimensions = dimensions;
        this.randomID = randomID;

        /*
        ** Main throttle function
        */
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

        /*
        ** Change play/pause function and change all icons
        */
        var togglePlay = this.togglePlay = function togglePlay() {

            // Remove poster background.
            document.getElementById("poster_layer_"+randomID).style.backgroundImage = "none"; 
            if(video.paused == true) {
                video.play();
                document.getElementById("moovie_bplay_"+randomID).src = "icons/pause.svg"
                togglePoster("hide");
            } else {
                video.pause();
                document.getElementById("moovie_bplay_"+randomID).src = "icons/play.svg"
                togglePoster("show");
            }      
        }

        /*
        ** Fullscreen handler
        */
        var SetFullScreen = this.SetFullScreen = function SetFullScreen(){

            if (moovie_el_player.requestFullscreen) {
                moovie_el_player.requestFullscreen();
            } else if (moovie_el_player.webkitRequestFullscreen) { // Safari
                moovie_el_player.webkitRequestFullscreen();
            } else if (moovie_el_player.msRequestFullscreen) { // IE11
                moovie_el_player.msRequestFullscreen();
            }

            if(1 >= outerHeight - innerHeight)
            {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) { // Safari
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE11
                    document.msExitFullscreen();
                }
            }

            Submenu("CAll");
        }

        /*
        ** Focus player to add keybinds
        */
        function focusPlayer() { video.focus();}

        /*
        ** Toggle Poster
        */
        function togglePoster(order)
        {
            if(order == "show")
            {
                moovie_el_poster.style.display = "block";
                moovie_el_poster.classList.remove("posteroff");
                moovie_el_poster.classList.add("posteron");
            } else if(order == "hide")
            {
                moovie_el_poster.style.display = "none";
                moovie_el_poster.classList.remove("posteron");
                moovie_el_poster.classList.add("posteroff");
            }
        }

        /*
        ** Skips video on click
        */
        function skip() {
         video.currentTime += parseFloat(this.dataset.skip);
        }

        /*
        ** Change Mute/Unmute Audio icon
        */
        var checkMute = this.checkMute = function checkMute() { if(video.volume == 0) { document.getElementById("icon_volume_"+randomID).src = "icons/mute.svg"; } else { document.getElementById("icon_volume_"+randomID).src = "icons/volume.svg";}}

        /*
        ** Range value update
        */
        function handleRangeUpdate() {
            video[this.name] = this.value;
            // Update volume icon
            checkMute();
        }

        /*
        ** Current time handler
        */
        function movieVideo(time, direction)
        {
            switch (direction) {
                case "left":
                      var vid_currentTime = video.currentTime;
                      video.currentTime = vid_currentTime - time;
                      var ncurrentTime = moovie_el_progress.value;
                      moovie_el_progress.value = Number(ncurrentTime)-5;

                    break;
                case "right":
                      var vid_currentTime = video.currentTime;
                      video.currentTime = vid_currentTime + time;
                      var ncurrentTime = moovie_el_progress.value;
                      moovie_el_progress.value = Number(ncurrentTime)+5;

                break;   
             } 
        }

        /*
        ** Slide position
        */
        function calcSliderPos(e) { return (e.offsetX / e.target.clientWidth) *  parseInt(e.target.getAttribute('max'));}

        /*
        ** Progress bar cue timer function
        */
        function cueTime(e)
        {
            cuevalue = calcSliderPos(e).toFixed(2);
            moovie_el_cuetimer.style.display = "block";
            moovie_el_cuetimer.style.left = e.offsetX+"px";
            moovie_el_cuetimer.innerHTML = player_time(cuevalue);
        }

        /*
        ** Detect touchscreen function so it can be added diff eventlisteners
        */
        function detectTouchScreen()
        {
            var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            return isMobile;
        }

        /*
        ** Mute/UnMute function
        */
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

        /*
        ** Formar player time
        */
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

        /*
        ** Update moovie time on "timeupdate" event listener
        */
        function updateTime(){

            // Get percentage buffered
            var r = video.buffered;
            var total = video.duration;
            var start = r.start(0);
            var end = r.end(0);
            
            // Update current times
            if(moovie_ishiden == 0){ document.getElementById("moovie_currentime").innerHTML = player_time(video.currentTime); }
            if(video.currentTime >= video.duration) { video.currentTime = 0; togglePlay();  moovie_el_progress.value = 0; }
        }

        /*
        ** Progress bar
        */
        var handleProgress = throttle(function() {

            // Get percentage buffered
            var r = video.buffered;
            var total = video.duration;
            var start = r.start(0);
            var end = r.end(0);
            
            if(!video.paused)
            {
                var ncurrentTime = moovie_el_progress.value;
                moovie_el_progress.value = Number(ncurrentTime)+1;
            }

        }, 1000);

        /*
        ** Offset change function
        */
        var OffsetChange = this.OffsetChange = function OffsetChange()
        {
            offsettime =  document.getElementById("offset_range_input").value;
            document.getElementById("option_submenu_range").innerHTML = offsettime+"s"; 
            document.getElementById("valoffset").value = offsettime;
        }

        /*
        ** Speed change functions
        */
        var SpeedChange = this.SpeedChange = function SpeedChange()
        {
            speed = document.getElementById("offset_range_speed").value;
            document.getElementById("option_submenu_speed").innerHTML = speed+"x"; 
            document.getElementById("valoffset_speed").value = speed;
            video.playbackRate = speed;
        }

        /*
        ** Handler progress bar click/mousemove/touch events
        */
        function Scrub(e) {

            if(!detectTouchScreen())
            {
                var offsetEvent = e.offsetX;
                const scrubTime = (offsetEvent / moovie_elprogress.offsetWidth) * video.duration;
                if(scrubTime >= video.duration){ scrubTime = video.duration; }
                video.currentTime = scrubTime;

            } else {

                var offsetEvent = document.getElementById("range_progress").value;

                if(offsetEvent == undefined)
                {
                    offsetEvent = e.touches[0].clientX;
                    const scrubTime = (offsetEvent / moovie_elprogress.offsetWidth) * video.duration;
                    if(scrubTime >= video.duration){ scrubTime = video.duration; }
                    video.currentTime = scrubTime;
                } else {
                    video.currentTime = offsetEvent;
                }
            }
        }

        /*
        ** Hide Controls
        */
        function HideControls(order)
        {
            if(order == "close")
            {
                if(isopen == 0 && video.paused == false) 
                {   
                  Submenu("CAll");
                  document.getElementById("moovie__controls_"+randomID).style.display = "none";
                }

            } else if(order == "open")
            { document.getElementById("moovie__controls_"+randomID).style.display = "flex";
            }
        }

        /*
        ** Activate Subtitles
        */
        var ActivateSubtitles = this.ActivateSubtitles = function ActivateSubtitles()
        {
            if(hassubtitles == 1)
            {
                    if(subtitles == 0){ subtitles = 1; document.getElementById("moovie_subtitle_svg").classList.remove("opacity_svg");
                    } else if(subtitles == 1) { subtitles = 0; document.getElementById("moovie_subtitle_svg").classList.add("opacity_svg");}

            } else {
                console.log("You must choose an Subtitle first.");
            }
        }

        /*
        ** Submenu handler function
        */
        function Submenu(order)
        {
            switch(order) {

                case "toggleSubmenu": // Close caption menu

                    // Close all other submenus
                    moovie_el_submain.style.display = "block";
                    moovie_el_captions.style.display = "none";
                    moovie_el_speed.style.display = "none";
                    moovie_el_range.style.display = "none";

                    // Open mainsubmenu 
                    if(moovie_el_submenu.classList.contains("menuclosed"))
                    {
                        moovie_el_submenu.style.display = "block";
                        moovie_el_submenu.classList.add("menuopen");
                        moovie_el_submenu.classList.remove("menuclosed");
                        isopen = 1;
                    } else {
                        moovie_el_submenu.style.display = "none";
                        moovie_el_submenu.classList.add("menuclosed");
                        moovie_el_submenu.classList.remove("menuopen");
                        isopen = 0;
                    }

                break;
                case "CAll": // Close caption menu

                    // Close all other submenus
                    moovie_el_submain.style.display = "none";

                    moovie_el_captions.style.display = "none";
                    moovie_el_speed.style.display = "none";
                    moovie_el_range.style.display = "none";

                    moovie_el_submenu.classList.add("menuclosed");
                    isopen = 0;

                break;                
                case "OCaption": // Open menu caption

                    moovie_el_submain.style.display = "none";
                    moovie_el_captions.style.display = "block"; 

                break;
                case "CCaption": // Close caption menu

                    moovie_el_submain.style.display = "block";            
                    moovie_el_captions.style.display = "none"; 

                break;
                case "OSpeed": // Open menu caption

                    moovie_el_submain.style.display = "none";
                    document.getElementById("moovie_range_speed").style.display = "block";  

                break;
                case "ORange": // Close caption menu

                    moovie_el_submain.style.display = "none";
                    document.getElementById("moovie_range_captions").style.display = "block"; 

                break;
              default:
            
            } 
        }

        /*
        ** Responsive Improveness
        */
        var TransformPlayer = this.TransformPlayer = function TransformPlayer(caption) {

            var containerWidth = moovie_el_video.offsetWidth;
            if(containerWidth <= 460)
            {
                // Set Flag
                moovie_ishiden = 1;
                // Set player transformations
                document.getElementById("moovie_el_current").style.display = "none";
                document.getElementById("moovie_progressbar").classList.add("responsive_bar"); 
                moovie_el_cuetimer.classList.add("moovie_cuetime_small");

            } else {

                // Set Flag
                moovie_ishiden = 0;
                // Set player transformations
                document.getElementById("moovie_el_current").style.display = "block";
                document.getElementById("moovie_progressbar").classList.remove("responsive_bar"); 
                document.getElementById("moovie_fulltime").innerHTML = player_time(video.duration); 
                moovie_el_cuetimer.classList.remove("moovie_cuetime_small");
            }
         
        }

        /*
        ** Set caption size when container changes size
        */
        var SetCaptionSize = this.SetCaptionSize = function SetCaptionSize(caption) {

            var containerSize = moovie_el_video.offsetWidth;
            var fontSizeCap = containerSize*0.11;
            document.getElementById("caption_track_"+randomID).style.fontSize = fontSizeCap+"%";
        }

        /*
        **  Play Captions
        */
        var PlayCaption = this.PlayCaption = function PlayCaption(caption) {

            // Reset variables
            selectedCaption = [];

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

                // if it is .SRT format, add a cue to the beginning of the file to match VTT style
                var CheckFormat = caption["attributes"]["src"]["nodeValue"].substr(caption["attributes"]["src"]["nodeValue"].length - 4);
                if(CheckFormat == '.srt'){ resp = "STR\n\n"+resp; }

                    resp.split("\n\n").map(function (item) {
                    parts = item.split("\n");

                    if(parts[1] != undefined)
                    {
                        if(isNaN(parts[0])) // If VTT Doesnt have cue number
                        {
                                var timeString = parts[0].replace(/-/g, '');
                                if(CheckFormat == '.srt'){ timeString = parts[0].replace(/,/g, '.'); }

                                // Get starttime
                                var starttime = timeString.substr(0, timeString.indexOf('>')); 
                                starttime = starttime.replace(/ /g, '');
                                // Get endtime
                                var endtime = timeString.split('>', 2);
                                endtime = endtime[1].replace(/ /g, '');

                                // If it is .srt, change ","" to ".""
                                if(CheckFormat == '.srt'){ endtime = endtime.replace(/,/g, '.'); starttime = starttime.replace(/,/g, '.'); }

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

                                // If it is .srt, change ","" to ".""
                                if(CheckFormat == '.srt'){ endtime = endtime.replace(/,/g, '.'); starttime = starttime.replace(/,/g, '.'); }

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
            video.addEventListener('timeupdate', RunCaption, true);
            if(hassubtitles == 1) { video.removeEventListener('timeupdate', RunCaption, true); } else {

            // Set flag on hassubtitles
            hassubtitles = 1; 
            ActivateSubtitles();

            }
        }

        /*
        ** Add Captions
        */

        var SetCaptions = this.SetCaptions = function SetCaptions(caption) {

            // Get Caption Format
            const CaptionFormat = caption["attributes"]["src"]["nodeValue"].substr(caption["attributes"]["src"]["nodeValue"].length - 4);
            
            // Generating a random ID for each caption
            var captionIDRandom = Math.floor(Math.random() * (9999 - 0 + 1)) + 0;
            // Add caption to list and add event listener to play it

            moovie_el_captions.insertAdjacentHTML('beforeend', "<li class='caption_track' id='captionid_"+captionIDRandom+"'><span>"+caption['track']['label']+"</span><span class='labelformat'>"+CaptionFormat+"</span></li>");
            document.getElementById("captionid_"+captionIDRandom).addEventListener("click", function(){
                
                PlayCaption(caption);
                document.getElementById("option_submenu_caption").innerHTML = caption['track']['label'];
                Submenu("toggleSubmenu"); // Close menu
            });
        }

        /*
        ** Get Captions
        */
        var GetCaptions = this.GetCaptions = function GetCaptions() {

            // Get all captions inside video tag
            var vcaptions = document.getElementById(this.selector).getElementsByTagName('track');
            for (var i = 0; i < vcaptions.length; i++) {
                this.SetCaptions(vcaptions[i]);
            }
        }

        /*
        ** Keybinds
        */
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

        /*
        ** Setup Events
        */
        var SetupLogic = this.SetupLogic = function SetupLogic() {
 
            // Get elements
            moovie_el_player = document.querySelector('#moovie__video_'+randomID);
            video = moovie_el_player.querySelector('.viewer');
            this.video = video;

            // Wait media to load, to make sure it doesnt add eventlisteners to a empty container
            video.oncanplay = (event) => {
                    // Hide loading screen
                    document.getElementById("medialoading").style.display = "none";

                    if(moovie_ishiden == 0){
                        document.getElementById("moovie_fulltime").innerHTML = player_time(video.duration);
                        moovie_el_progress.setAttribute("max", video.duration); 
                    }
                };

                video.addEventListener('timeupdate', handleProgress);
                video.addEventListener('timeupdate', updateTime);

                // Focus player so we can add bindings
                moovie_el_player.addEventListener('click', focusPlayer);

                // FullScreen
                fullscreen = moovie_el_player.querySelector(".fullscreen_button");
                fullscreen.addEventListener('click', SetFullScreen);

                // Toogle Functions
                moovie_el_toggle = moovie_el_player.querySelector('.toggle');
                moovie_el_toggle.addEventListener('click', togglePlay);

                // Poster Functions
                moovie_el_poster = moovie_el_player.querySelector('#poster_layer_'+randomID);
                moovie_el_poster.addEventListener('click', togglePlay);
                video.addEventListener('click', togglePlay);

                // Ranges & Sliders
                ranges = moovie_el_player.querySelectorAll('.player__slider');
                ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));
                this.rangeinput.addEventListener('change', OffsetChange);
                this.speedinput.addEventListener('change', SpeedChange);

                // Mute
                document.getElementById("mooviegrid_mute_"+randomID).addEventListener('click', mutePlayer);

                // Progress bar
                moovie_elprogress = moovie_el_player.querySelector('.moovie_progress');
                
                if(!detectTouchScreen())
                {
                        /* Mouse related eventListeners */
                        let mousedown = false;
                        moovie_elprogress.addEventListener('click', Scrub);
                        moovie_elprogress.addEventListener('mousemove', (e) => mousedown && Scrub(e));

                        // Cue Time
                        document.getElementById('range_progress').addEventListener('mousemove', function(e) { cueTime(e); });
                        document.getElementById('range_progress').addEventListener('mouseleave', function(e) { moovie_el_cuetimer.style.display = "none"; });
                        
                        moovie_elprogress.addEventListener('mousedown', () => mousedown = true);
                        moovie_elprogress.addEventListener('mouseup', () => mousedown = false);

                        moovie_el_controls.addEventListener('mouseover', e => { isopen = 1; });
                        moovie_el_controls.addEventListener('mouseleave', e => { isopen = 0; });

                        moovie_el_progress.addEventListener("input", function(event) { video.pause(); }, false);
                        moovie_el_progress.addEventListener("change", function(event) { togglePlay(); togglePoster("hide"); }, false);

                } else {
                        /* Touch related eventListeners */
                        moovie_el_progress.addEventListener("touchmove", function(event) { Scrub(event); });
                        moovie_el_progress.addEventListener("change", function(event) { Scrub(event); togglePoster("hide"); }, false);
                }

                // Submenu events
                this.moovie_cog.addEventListener("click", function() { Submenu("toggleSubmenu") }, true);
                this.topic_submenu_caption.addEventListener("click", function() { Submenu("OCaption") }, true);
                this.topic_submenu_speed.addEventListener("click", function() { Submenu("OSpeed") }, true);
                this.captions_back.addEventListener("click", function() { Submenu("CCaption") }, true);
                this.moovie_subtitle.addEventListener("click", ActivateSubtitles);
                moovie_el_video.addEventListener("mouseleave", function() { Submenu("CAll") }, false);
                this.captions_offset.addEventListener("click", function() { Submenu("ORange") }, true);

                // Hide div on mouse stop
                HideControls("close");
                var i = null;
                moovie_el_video.addEventListener('mousemove', e => {
                    clearTimeout(i);
                    HideControls("open");
                    i = setTimeout(function(){ HideControls("close"); }, 2000);
                });
                moovie_el_video.addEventListener('mouseleave', e => {
                    clearTimeout(i);
                    HideControls("close");
                });
             
        }

        /*
        ** Player Structure
        */
        var SetupPlayer = this.SetupPlayer = function SetupPlayer() {

            // Get video source
            var vsource = this.element.getAttribute("src");
            if(vsource == null){ vsource = this.element.getElementsByTagName("source")[0].src }

            // Get poster if exists
            var vposter = document.getElementById(this.selector).getAttribute("poster");   
            // Hide video tag
            this.element.style.display = "none";
            // Main Div
            this.element.insertAdjacentHTML('afterend', "<div style='width:"+dimensions['width']+"' id='moovie__video_"+randomID+"' class='moovie'></div>");
                
                moovie_el_video = document.getElementById("moovie__video_"+randomID);
                // Video tag
                moovie_el_video.insertAdjacentHTML('beforeend', "<video tabindex='1' preload='auto' class='player__video viewer' style='width:100%; height:100%;' src='"+vsource+"'></video>");              
                // Player Controls
                moovie_el_video.insertAdjacentHTML('beforeend', "<div id='moovie__controls_"+randomID+"' class='moovie_controls'></div>"); 
               
                    moovie_el_controls = document.getElementById("moovie__controls_"+randomID);

                    // Set main Play control when video is stopped
                    moovie_el_video.insertAdjacentHTML('afterbegin', "<div id='medialoading' class='loadingv'><div class='lds-ellipsis'><div></div><div></div><div></div><div></div></div></div><div class='poster_layer posteron' id='poster_layer_"+randomID+"'></div>"); 

                    moovie_el_poster = document.getElementById("poster_layer_"+randomID);
                    moovie_el_poster.insertAdjacentHTML('afterbegin', "<div class='poster_center' id='poster_center_"+randomID+"' style=''></div>"); 
                    document.getElementById("poster_center_"+randomID).insertAdjacentHTML('afterbegin', "<div class='poster_button'><img src='icons/play.svg' style='width: 24px; position: relative; left: 3px;'></div>"); 
                    if(vposter != null){  moovie_el_poster.style.backgroundImage = "url("+vposter+")"; moovie_el_poster.style.backgroundSize = "100%"; }
                   
                    // Add caption spot
                    moovie_el_video.insertAdjacentHTML('beforeend', "<div class='moovie_captionspot caption_size'><p class='moovie_caption' id='caption_track_"+randomID+"'></p></div>");
                    // Toogle play button
                    moovie_el_controls.insertAdjacentHTML('beforeend', "<button class='player__button toggle' id='tooglebutton' title='Toggle Play'><img id='moovie_bplay_"+randomID+"' src='icons/play.svg'></button>");
                    // Progress bar
                    moovie_el_controls.insertAdjacentHTML('beforeend', "<div class='moovie_cuetime' id='moovie_cue_timer'>loading...</div><div id='moovie_progressbar' class='moovie_progress player__slider' top:15px;><input type='range' id='range_progress' class='styled-slider slider-progress' min='0' value='0' step='0.01' autocomplete='off' style='width: 100%; cursor:pointer;' /></div>");  
                   // Current time / full time
                    moovie_el_controls.insertAdjacentHTML('beforeend', "<div id='moovie_el_current' class='player__button player_button_disabled moovie_currentime'><span id='moovie_currentime'>00:00</span> / <span id='moovie_fulltime'></span></div>");  
                    // Volume Icon
                    moovie_el_controls.insertAdjacentHTML('beforeend', "<button id='mooviegrid_mute_"+randomID+"' class='player__button'><img id='icon_volume_"+randomID+"' src='icons/volume.svg'></button>"); 
                    // Volume
                    moovie_el_controls.insertAdjacentHTML('beforeend', "<input type='range' id='mooviegrid_volume_"+randomID+"' style='max-width:100px; min-width:50px;' name='volume' class='moovie_progress_sound player__slider' min=0 max='1' step='0.01' value='1'>");  
                    // Subtitles
                    moovie_el_controls.insertAdjacentHTML('beforeend', "<button id='moovie_subtitle' style='margin-left:5px' class='player__button'><img class='opacity_svg' id='moovie_subtitle_svg' src='icons/cc.svg'></button>");  
                    // Config
                    moovie_el_controls.insertAdjacentHTML('beforeend', "<button id='moovie_cog' class='player__button'><img src='icons/cog.svg'></button>");  
                    // Fullscreen
                    moovie_el_controls.insertAdjacentHTML('beforeend', "<button class='player__button fullscreen_button'><img src='icons/fullscreen.svg'></button>");
                    // Create main sub-menu
                    moovie_el_controls.insertAdjacentHTML('beforeend', "<div style='display:none;' class='moovie_submenu menuclosed' id='moovie_submenu_"+randomID+"'><div class='arrow-down' style='position: absolute; margin-left: 148px;'></div></div>");  

                        /* SUBMENU */

                        moovie_el_submenu = document.getElementById("moovie_submenu_"+randomID);
                        moovie_el_progress = document.getElementById("range_progress");
                        // Menu main
                        moovie_el_submenu.insertAdjacentHTML('beforeend', "<ul id='moovie_submenu_main'></ul>");
                        moovie_el_submain =  document.getElementById("moovie_submenu_main");
                        // Add lines to main
                        moovie_el_submain.insertAdjacentHTML('beforeend', "<li class='topic_submenu'>Settings:</li>");
                        moovie_el_submain.insertAdjacentHTML('beforeend', "<li id='topic_submenu_caption'><span>Captions</span><span class='option_submenu' id='option_submenu_caption'>Disabled</span></li>");
                        moovie_el_submain.insertAdjacentHTML('beforeend', "<li id='captions_offset'><span >Caption Offset</span><span class='option_submenu' id='option_submenu_range'>0s</span></li>");
                        moovie_el_submain.insertAdjacentHTML('beforeend', "<li id='topic_submenu_speed'><span >Speed</span><span class='option_submenu' id='option_submenu_speed'>Default</span></li>");
                        // Captions Menu
                        moovie_el_submenu.insertAdjacentHTML('beforeend', "<ul style='display:none;' id='moovie_submenu_captions'><li class='topic_submenu'>Captions:</li><li id='captions_back' style='font-weight:bold;'>Back</li></ul>");
                        moovie_el_captions = document.getElementById("moovie_submenu_captions");
                        // Range Caption
                        moovie_el_submenu.insertAdjacentHTML('beforeend', "<ul style='display:none; width:250px;' id='moovie_range_captions' style='display:none;'><li class='topic_submenu'>Adjust Caption Offset:<output style='position:absolute; right:22px;' id='valoffset'>0</output></li><li class='topic_submenu'><span>-5s</span><span style='float: right;'>+5s</span><input type='range' oninput='valoffset.value = offset_range_input.value' id='offset_range_input' min='-5' max='5' step='0.2'></li>");
                        moovie_el_range = document.getElementById("moovie_range_captions");
                        // Speed rate 
                        moovie_el_submenu.insertAdjacentHTML('beforeend', "<ul style='display:none; width:250px;' id='moovie_range_speed' style='display:none;'><li class='topic_submenu'>Adjust Speed:<output style='position:absolute; right:22px;' id='valoffset_speed'>1</output></li><li class='topic_submenu'><span>0.1x</span><span style='float: right;'>8x</span><input type='range' value='1' oninput='valoffset_speed.value = offset_range_speed.value' id='offset_range_speed' min='0.1' max='8' step='0.1'></li>");
                        moovie_el_speed = document.getElementById("moovie_range_speed");

                    // Update variables
                    this.moovie_cog = document.getElementById("moovie_cog");
                    this.topic_submenu_caption = document.getElementById("topic_submenu_caption");
                    this.topic_submenu_speed = document.getElementById("topic_submenu_speed");
                    this.captions_back = document.getElementById("captions_back");
                    this.moovie_subtitle = document.getElementById("moovie_subtitle");
                    this.captions_offset = document.getElementById("captions_offset");
                    this.speedinput = moovie_el_sinput = document.getElementById("offset_range_speed");
                    this.rangeinput = moovie_el_rinput = document.getElementById("offset_range_input");
                    this.progressbar = moovie_el_progress;
                    this.moovie_el_volume = moovie_el_volume = document.getElementById("mooviegrid_volume_"+randomID);
                    this.moovie_el_cuetimer = moovie_el_cuetimer = document.getElementById("moovie_cue_timer");

                    // Call events
                    this.SetupLogic();
                    this.GetCaptions();
                    this.Keybinds(); 
                    SetCaptionSize();  
                    TransformPlayer();     
        }

        // Setup
        this.SetupPlayer();

        // Function that will run repeatedly at each fixed interval of time.
        var ResizeWindow = throttle(function() {
            SetCaptionSize();
            TransformPlayer();
        }, 100);

        // Add EventListener
        window.addEventListener('resize', ResizeWindow);

    }

    /*
    ** Methods
    */

    // Trigger toggle play
    togglePlay(){ this.togglePlay(); }
    // Trigger toggle subtitles
    toggleSubtitles(){ this.ActivateSubtitles(); }
    // Trigger toggle Fullscreen
    toggleFullscreen(){ this.SetFullScreen(); }
     // Add new track
    addTrack(properties){ 

        if(properties.options && typeof(properties.options) === 'object')
        {
            // Loop object and add new options to original select box
            var prop = Object.keys(properties.options).length;
            for (var i = 0; i < prop; i++) {

                var addlabel, srclang, tracksrc;
                if(properties.options[i].label){ addlabel = "label='"+properties.options[i].label+"'"; } else {  addlabel = "label='New Subtitle'"; }
                if(properties.options[i].srclang){ srclang = "srclang='"+properties.options[i].srclang+"'" } else { srclang = "srclang='New'" }
                if(properties.options[i].src){ tracksrc = "src='"+properties.options[i].src+"'" } else { tracksrc = ""; }

                if(!tracksrc) { console.log("Error, 'src' can not be empty.");} else {
                    document.getElementById(this.selector).insertAdjacentHTML("beforeend", "<track "+addlabel+" "+srclang+" "+tracksrc+">");   
                }
            }

            // Remove all caption itens
            document.querySelectorAll('.caption_track').forEach((item) => {
                item.remove();
            });

            // fetch all track itens again
            this.GetCaptions();

        } else {
            console.error("Options must be and Object. Read documentation.");
        }
    
    }   

    /*
    ** API > Gets
    */

    // Get player element
    get playerElement() { return this.video; }
    // Get playing state
    get playing() { return Boolean(this.video.ready && !this.video.paused && !this.video.ended); }
    // Get stopped state
    get paused() {  return Boolean(this.video.paused); }
    // Get stopped state
    get stopped() {  return Boolean(this.video.paused && this.video.currentTime === 0); }
    // Get ended state
    get ended() { return Boolean(this.video.ended); }
    // Get duration
    get duration() {
        const Duration = parseFloat(this.video.duration);
        const realDuration = (this.video.media || {}).duration;
        const duration = realDuration || realDuration === Infinity ? 0 : realDuration;
        return Duration || duration;
    }
    // Get Seeking
    get seeking() { return Boolean(this.video.seeking); }
    // Get CurrentTime
    get currentTime() { return Number(this.video.currentTime); }
    // Get CurrentTime
    get volume() {  return this.video.volume; }
    // Get muted state
    get muted() {  return Boolean(this.video.muted); }
    // Get playrate
    get speed() { return Number(this.video.playbackRate); }
    // Get Mininum Speed
    get minimumSpeed() { return 0.1; }
    // Get Maximum Speed
    get maximumSpeed() { return 8; }
    // Get Mininum Offset
    get minimumOffset() { return -5; }
    // Get Maximum Offset
    get maximumOffset() { return 5; }
    // Get Source
    get source() { return this.video.currentSrc; }
    // Get Source
    get captionOffset() { return this.rangeinput.value; }

    /*
    ** API > Sets
    */

    // Set current time
    set currentTime (input) { this.video.currentTime = input; this.progressbar.value = input; }
    // Set volume
    set volume (input) { this.video.volume = input; this.moovie_el_volume.value = input; this.checkMute(); }
    // Set speed
    set speed (input) { if(input < -0.1 || input > 8) { return "Value must be between -0.1 and 8"; } else { this.video.playbackRate = input; this.speedinput.value = input; this.SpeedChange();}}
    // Set caption offset
    set captionOffset (input) { if(input < -5 || input > 5) { return "Value must be between -5 and 5"; } else { this.rangeinput.value = input; this.OffsetChange();}}

}
