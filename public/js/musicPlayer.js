export async function fetchMusic() {
    // This function can be used to fetch music from a server if needed
    return [];
}

export function createMusicCard(music, container) {
    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    img.src = './assets/img1.jpg'; // Placeholder image
    img.alt = '';
    img.classList.add('card-img');

    const cardTitle = document.createElement('p');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = music.title;

    const cardInfo = document.createElement('p');
    cardInfo.classList.add('card-info');
    cardInfo.textContent = `Artist: ${music.artist}`;

    const playButton = document.createElement('button');
    playButton.textContent = 'Play';
    playButton.addEventListener('click', () => {
        loadMusic(music.title, music.artist, './assets/img1.jpg', music.file);
    });

    card.appendChild(img);
    card.appendChild(cardTitle);
    card.appendChild(cardInfo);
    card.appendChild(playButton);

    container.appendChild(card);
}

// ============================== AUDIO PLAYER =================================
const audioPlayer = document.getElementById("audioElement");
const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const progressBar = document.getElementById('progressBar');
const volumeIcon = document.getElementById('volumeIcon');
const volumeSlider = document.getElementById('volumeSlider');

const currentTimeElement = document.getElementById("currentTime");
const durationElement = document.getElementById("duration");

let muted = false;
let currentTrackIndex = 0;
let musicList = [];

// Play Audio Player
const playAudioPlayer = () => {
    if (audioPlayer) {
        audioPlayer.play();
    }
}




// Play button click event
if (playButton) {
    playButton.addEventListener('click', function () {
        if (audioPlayer) {
            audioPlayer.play();
            togglePlayPause();
        }
    });
}

// Pause button click event
if (pauseButton) {
    pauseButton.addEventListener('click', function () {
        if (audioPlayer) {
            audioPlayer.pause();
            togglePlayPause();
        }
    });
}

// UPDATE PLAYER INFORMATION
const updatePlayer = (artist, cover, title) => {
    // Update player UI with the current track information
}

// Load track to audio player
const loadMusic = (title, artist, cover, url) => {
    console.log("Track loaded: " + url);
    if (audioPlayer) {
        audioPlayer.src = url;
        playAudioPlayer();
        updatePlayer(artist, cover, title);
    }
}

// Load track by index
const loadTrackByIndex = (index) => {
    if (index >= 0 && index < musicList.length) {
        const track = musicList[index];
        loadMusic(track.title, track.artist, './assets/img1.jpg', track.file);
        currentTrackIndex = index;
    }
}

// Next track
const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % musicList.length;
    loadTrackByIndex(nextIndex);
}

// Previous track
const prevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + musicList.length) % musicList.length;
    loadTrackByIndex(prevIndex);
}

const convertSecondsToMinutes = (seconds) => {
    const minutes = Math.floor(seconds / 60); // Get the whole number of minutes
    const remainingSeconds = seconds % 60; // Get the remaining seconds

    // Format the minutes and seconds with leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    // Round the seconds 
    const roundedSeconds = Math.round(remainingSeconds);
    const formattedSeconds = String(roundedSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const updateTimers = () => {
    if (audioPlayer) {
        currentTimeElement.innerHTML = convertSecondsToMinutes(audioPlayer.currentTime);
        durationElement.innerHTML = convertSecondsToMinutes(audioPlayer.duration);
    }
}

// Update progress bar as the audio plays
if (audioPlayer) {
    audioPlayer.addEventListener('timeupdate', function () {
        updateTimers();
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;
        togglePlayPause();
    });
}

// Seek progress bar as user clicks
if (progressBar) {
    progressBar.addEventListener('input', () => {
        if (audioPlayer) {
            const seekTime = (progressBar.value / 100) * audioPlayer.duration;
            audioPlayer.currentTime = seekTime;
        }
    });
}

// Volume slider change event
const changeVolume = () => {
    if (audioPlayer) {
        audioPlayer.volume = volumeSlider.value;
    }
}
if (volumeSlider) {
    volumeSlider.addEventListener('input', () => changeVolume());
}

// Mute / Unmute event
const toggleVolume = () => {
    if (!muted) {
        volumeIcon.classList.remove('fa-volume-up');
        volumeIcon.classList.add('fa-volume-mute');
        muted = true;
    } else {
        volumeIcon.classList.add('fa-volume-up');
        volumeIcon.classList.remove('fa-volume-mute');
        muted = false;
    }
}
if (volumeIcon) {
    volumeIcon.addEventListener('click', () => {
        if (muted) {
            toggleVolume();
            if (audioPlayer) {
                audioPlayer.volume = 1;
                volumeSlider.value = 1;
            }
        } else {
            toggleVolume();
            if (audioPlayer) {
                audioPlayer.volume = 0;
                volumeSlider.value = 0;
            }
        }
    });
}

// Add event listeners for next and previous buttons
const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');
if (nextButton) {
    nextButton.addEventListener('click', nextTrack);
}
if (prevButton) {
    prevButton.addEventListener('click', prevTrack);
}