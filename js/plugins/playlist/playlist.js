/*-------------------------
moovie.js | Playlist Plugin
Made by: Bruno Vieira
--------------------------- */

class _Moovie_Playlist {

    constructor(options) {

        const defaults = {
            reference: 'defaultId',
            dimensions: {
                width: "240px",
                height: "100%"
            },
            sources: [{
                src: false,
                title: false
            }]
        };

        this.reference = options.reference || defaults.reference;
        this.sources = options.sources || defaults.sources;
        this.dimensions = options.dimensions || defaults.dimensions;
        var mooviePlayer = this.reference;
        var loopSrc = 0;
        var sources = this.sources;

        /*
         ** Plugin Structure
         */
        var InitModule = this.InitModule = function InitModule() {

            // Add List Style
            const listStyle = `
                .moovie_play_list {
                    z-index: 3;
                    right: calc(25px - ${this.dimensions.width});
                    top: 0px;
                    position: absolute;
                    height: 100%;
                    width: ${this.dimensions.width};
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    transition: transform 250ms,opacity .2s ease-in-out;
                }
                .moovie_play_list.show {
                    transform: translateX(calc(25px - ${this.dimensions.width}));
                }
                .moovie_play_list_content {
                    width: 100%;
                    height: ${this.dimensions.height};
                    display: flex;
                    align-items: center;
                }

                .moovie_play_list_arrow {
                    width: 25px;
                    height: 100px;
                    background: var(--moovie_bg_controls);
                    font-weight:900;
                    color:white;
                    border-radius:20px 0px 0px 20px;
                    text-align:center;
                    line-height:100px;
                }
                .moovie_play_list_arrow p{
                    transition: transform 250ms;
                }
                .moovie_play_list_arrow.show p{
                    transform:rotate(180deg);
                }


                .moovie_play_list_table_item{
                    color:white;
                    padding:5px 10px 5px 10px;
                }
                .moovie_play_list_table_item:hover{
                    background:rgb(134 141 152 / 74%);
                }
                .moovie_play_list_table_item.selected{
                    color:var(--moovie_main_color);
                }
            `;
            const style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = listStyle;
            document.getElementsByTagName('head')[0].appendChild(style);

            // Add List Panel
            mooviePlayer.moovie_el_video.insertAdjacentHTML('beforeend', "<div id='moovie_play_list_" + mooviePlayer.randomID + "' class='moovie_play_list'>" +
                "<div id='moovie_play_list_content_" + mooviePlayer.randomID + "' class='moovie_play_list_content'>" +
                "<div id='moovie_play_list_arrow_" + mooviePlayer.randomID + "' class='moovie_play_list_arrow'><p><</p></div>" +
                "<div id='moovie_play_list_table_" + mooviePlayer.randomID + "' style='height: 100%;background: var(--moovie_bg_controls);flex: 1;padding:10px 0px 10px 0px;overflow:auto;border-radius:5px 0px 0px 5px;'></div>" +
                "</div></div>");

            // Add Control Show Event to List Panel
            let listElement = document.getElementById("moovie_play_list_" + mooviePlayer.randomID);
            mooviePlayer.video.addEventListener("togglecontrolpanel", function(evt) {
                if (evt.detail.show) {
                    listElement.style.opacity = 1;
                } else {
                    listElement.style.opacity = 0;
                }
            })

            //Arror Toggle
            var arrowElement = document.getElementById("moovie_play_list_arrow_" + mooviePlayer.randomID);
            arrowElement.addEventListener("click", function() {
                let list = document.getElementById("moovie_play_list_" + mooviePlayer.randomID);
                if (list.classList.contains("show")) {
                    list.classList.remove("show");
                    arrowElement.classList.remove('show');
                } else {
                    list.classList.add("show");
                    arrowElement.classList.add('show');
                }
            });

            var listTable = document.getElementById("moovie_play_list_table_" + mooviePlayer.randomID);
            for (let index = 0; index < this.sources.length; index++) {
                const element = this.sources[index];
                let item = document.createElement("div");
                item.classList.add("moovie_play_list_table_item");
                item.innerText = element.title;
                // Add Click Event
                item.addEventListener("click", function() {
                    itemOnClick(index);
                });

                //change current Playing Index and Style
                //Be careful that src maybe encoded somewhere and make this code failed.
                if (mooviePlayer.video.src === element.src) {
                    item.classList.add("selected");
                    loopSrc = index;
                }

                listTable.appendChild(item);
            }

            function itemOnClick(index) {

                //check if same index
                if (loopSrc === index) { return; }

                playAtIndex(index);
            }

            function nextLoopSrc() {
                // Moves to new sourc
                let targetIndex = loopSrc + 1;
                if (targetIndex >= sources.length) targetIndex = 0;
                return targetIndex;
            }

            function playAtIndex(index) {
                // Check if src is the same
                if (mooviePlayer.video.src == sources[index].src) {
                    mooviePlayer.video.currentTime = 0;
                    mooviePlayer.medialoading.style.display = "none";
                    mooviePlayer.moovie_el_controlbar.style.opacity = 1;
                } else {

                    // Change Source
                    mooviePlayer.video.src = sources[index].src;

                    // New src is ready to play
                    mooviePlayer.video.addEventListener("loadedmetadata", function() {

                        mooviePlayer.medialoading.style.display = "none";
                        mooviePlayer.moovie_el_controlbar.style.opacity = 1;
                        mooviePlayer.video.play();

                    }, true);

                    //Change Style
                    listTable.children[index].classList.add("selected");
                    listTable.children[loopSrc].classList.remove("selected");

                    loopSrc = index;
                }
            }


            mooviePlayer.video.addEventListener("ended", function() {
                mooviePlayer.medialoading.style.display = "block";
                mooviePlayer.moovie_el_controlbar.style.opacity = 0;

                // Wait function 100ms
                setTimeout(function() {

                    playAtIndex(nextLoopSrc());

                    console.log("Now playing: " + sources[loopSrc].title);

                }, 100);

            }, true);
        }

        // Setup
        this.InitModule();
    }
}