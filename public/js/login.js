document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const status = document.getElementById('status');
    const usernameInput = document.getElementById('username');
    const profilePicInput = document.getElementById('profilePic');
    const profilePreview = document.getElementById('profilePreview');
    const saveProfileButton = document.getElementById('saveProfile');

    loginButton.addEventListener('click', async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                const userAddress = accounts[0];
                localStorage.setItem('userHash', userAddress);
                status.textContent = `Connected: ${userAddress}`;
            } catch (error) {
                status.textContent = 'Connection failed.';
            }
        } else {
            status.textContent = 'MetaMask not detected.';
        }
    });

    profilePicInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePreview.src = e.target.result;
                profilePreview.style.display = 'block';
                localStorage.setItem('profilePic', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    saveProfileButton.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        if (username) {
            localStorage.setItem('username', username);
            alert('Profile saved successfully!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            alert('Please enter a username.');
        }
    });

    // Load saved data
    const savedUsername = localStorage.getItem('username');
    const savedProfilePic = localStorage.getItem('profilePic');
    if (savedUsername) usernameInput.value = savedUsername;
    if (savedProfilePic) {
        profilePreview.src = savedProfilePic;
        profilePreview.style.display = 'block';
    }
});
