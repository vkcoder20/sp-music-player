let CurrentSong =new Audio() ; 
let songs;
let currfolder;

document.designMode='off'
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs(folder) {
    currfolder=folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    // console.log(response)
    var newDiv = document.createElement("div");
    newDiv.innerHTML = response;
    // console.log(newDiv)
    let as = newDiv.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    return songs
}

const  playSong =(track,pause=false)=>{
    CurrentSong.src=`/${currfolder}/`+track
    if(!pause){
        CurrentSong.play()
        play.src= "img/pose.svg"

    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track) 
    document.querySelector(".songtime").innerHTML="00:00/00:00"
}



async function main() {

    //grt songs
    let songs = await getsongs("songs/cs")
    playSong(songs[0],true)
 
   let songURL= document.querySelector(".songList").getElementsByTagName("ul")[0]    
for (const song of songs) {
    songURL.innerHTML=songURL.innerHTML+`<li>
    <img class="invert" src="img/music.svg" alt="">
    <div class="info">
    <div>${song.replaceAll("%20"," ")}</div>
    <div>Vivek</div>
    </div><span>Play now</span>
    <img class="invert" src="img/play.svg" alt=""> 
    </li>`;
    
}

//Attach an event listener to each song
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
        // console.log(e.querySelector(".info").firstElementChild.innerHTML)
     playSong(e.querySelector(".info").firstElementChild.innerHTML)
    })
})


play.addEventListener("click",()=> {
if(CurrentSong.paused){
    CurrentSong.play()
    play.src= "img/pose.svg"
}
else{
    CurrentSong.pause()
    play.src= "img/play.svg"
}
})
CurrentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(CurrentSong.currentTime)}/${secondsToMinutesSeconds(CurrentSong.duration)}`
    document.querySelector(".circle").style.left = (CurrentSong.currentTime / CurrentSong.duration) * 100 + "%";
})
document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    CurrentSong.currentTime = ((CurrentSong.duration) * percent) / 100
})


document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
})

// Add an event listener for close button
document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%"
})
    // Add an event listener to previous
    previous.addEventListener("click", () => {
        CurrentSong.pause()
        // console.log("Previous clicked")
        let index = songs.indexOf(CurrentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playSong(songs[index - 1])
        }
    })
    // Add an event listener to next
    next.addEventListener("click", () => {
        CurrentSong.pause()
        // console.log("Next clicked")
        let index = songs.indexOf(CurrentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playSong(songs[index + 1])
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
       
     
        CurrentSong.volume = parseInt(e.target.value) / 100
    
        if (CurrentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("img/mute.svg", "img/volume.svg")
        }
    })
    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            CurrentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
         
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            CurrentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
            
        }

    })
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
        songs = await getsongs(`songs/${item.dataset.folder}`)
            playMusic(songs[0])
            

        })
    })
 }


main()




