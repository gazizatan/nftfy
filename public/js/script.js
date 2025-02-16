document.addEventListener('DOMContentLoaded', async () => {
    const playButton = document.getElementById('playButton');
    const audioElement = document.getElementById('audioElement');
    const progressBar = document.getElementById('progressBar');
    const currentTimeElement = document.getElementById('currentTime');
    const durationElement = document.getElementById('duration');
    const uploadMusicButton = document.getElementById('uploadMusicButton');
    const uploadMusicForm = document.getElementById('uploadMusicForm');
    const musicForm = document.getElementById('musicForm');
    const cardContainer = document.querySelector('.card-container');
    const closeButton = document.querySelector('.close-button');

    if (playButton && audioElement) {
        // Add an event listener to the play button
        playButton.addEventListener('click', function () {
            if (audioElement.paused) {
                audioElement.play();
                playButton.classList.add('fa-pause');
                playButton.classList.remove('fa-play');
            } else {
                audioElement.pause();
                playButton.classList.add('fa-play');
                playButton.classList.remove('fa-pause');
            }
        });

        // Update the progress bar and time display as the audio plays
        audioElement.addEventListener('timeupdate', function () {
            const currentTime = audioElement.currentTime;
            const duration = audioElement.duration;
            const progressPercentage = (currentTime / duration) * 100;
            progressBar.value = progressPercentage;

            // Update time display
            currentTimeElement.textContent = formatTime(currentTime);
            durationElement.textContent = formatTime(duration);
        });

        // Handle user interaction with the progress bar
        progressBar.addEventListener('input', function () {
            const seekTime = (progressBar.value / 100) * audioElement.duration;
            audioElement.currentTime = seekTime;
        });
    }

    if (uploadMusicButton && uploadMusicForm) {
        // Show the upload music form when the button is clicked
        uploadMusicButton.addEventListener('click', function () {
            uploadMusicForm.style.display = 'flex';
        });

        // Close the form when the close button is clicked
        closeButton.addEventListener('click', function () {
            uploadMusicForm.style.display = 'none';
        });

        // Close the form when the Esc key is pressed
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                uploadMusicForm.style.display = 'none';
            }
        });
    }

    if (musicForm) {
        // Function to upload file to Pinata
        async function uploadToPinata(file, jwt) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Failed to upload file to Pinata');
                }

                const data = await response.json();
                return data.IpfsHash;
            } catch (error) {
                console.error('Error uploading file to Pinata:', error);
                throw error;
            }
        }

        // Handle the music upload form submission
        musicForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const title = document.getElementById('title').value;
            const artist = document.getElementById('artist').value;
            const price = document.getElementById('price').value;
            const musicFile = document.getElementById('musicFile').files[0];

            if (!musicFile) {
                alert('Please select a music file.');
                return;
            }

            if (typeof window.ethereum !== 'undefined') {
                const web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const accounts = await web3.eth.getAccounts();
                    const contract = new web3.eth.Contract(window.contractABI, window.contractAddress);

                    const priceInWei = web3.utils.toWei(price, 'ether');

                    console.log('Uploading file to Pinata...');
                    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlYTc2NmRmNS02NTc2LTRkOTktYjgyYS1hZjQ3YzgzYTBiOTIiLCJlbWFpbCI6IjIzMTE5OUBhc3RhbmFpdC5lZHUua3oiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiODcwZjNkMDIxMWQ2ZTU1ZjU0MjUiLCJzY29wZWRLZXlTZWNyZXQiOiI3NDNiZjU4NTgzZmYxZjMyMGVlM2RkZmZhNTlkODdiMzZiYmJiN2QyZGMyYzFiZmNmNzY5YWQ5OTZjNTQxNzU0IiwiZXhwIjoxNzY5Nzg3NDM0fQ.eMRcoIHvZXXytlnJlADHi5Tjx7bQZNeQeYZdSbRAbTo'; // Replace with your Pinata JWT
                    const musicFileHash = await uploadToPinata(musicFile, jwt);
                    console.log('File uploaded to Pinata with hash:', musicFileHash);

                    console.log('Sending transaction to blockchain...');
                    await contract.methods.createMusic(title, artist, priceInWei, musicFileHash).send({ from: accounts[0] });
                    console.log('Transaction sent to blockchain');

                    // Dynamically import musicPlayer module and add new music card
                    const { createMusicCard } = await import('./musicPlayer.js');
                    createMusicCard({ title, artist, file: `https://gateway.pinata.cloud/ipfs/${musicFileHash}` }, cardContainer);

                    alert('Music uploaded successfully!');
                    uploadMusicForm.style.display = 'none';
                } catch (error) {
                    console.error('An error occurred:', error);
                    alert('An error occurred while uploading music.');
                }
            } else {
                alert('MetaMask is not installed.');
            }
        });
    }

    // Fetch and display music on page load
    const { fetchMusic, createMusicCard } = await import('./musicPlayer.js');
    try {
        const musicList = await fetchMusic();
        musicList.forEach(music => createMusicCard(music, cardContainer));
    } catch (error) {
        console.error('Error loading music:', error);
    }

    // Helper function to format time in minutes and seconds
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    }
});