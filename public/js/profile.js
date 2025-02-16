document.addEventListener("DOMContentLoaded", () => {
    const profileIcon = document.querySelector(".fa-user");
    const profilePopup = document.getElementById("profilePopup");
    const closeProfile = document.getElementById("closeProfile");
    const logoutButton = document.getElementById("logoutButton");

    // Элементы профиля
    const profileName = document.getElementById("profileName");
    const profileImage = document.getElementById("profileImage");
    const walletAddress = document.getElementById("walletAddress");

    // Функция загрузки сохраненных данных
    function loadProfile() {
        const savedUsername = localStorage.getItem("username") || "Guest";
        const savedProfilePic = localStorage.getItem("profilePic") || "default-avatar.png";
        const savedWallet = localStorage.getItem("userHash") || "Not connected";

        profileName.textContent = savedUsername;
        profileImage.src = savedProfilePic;
        walletAddress.textContent = `Wallet: ${savedWallet}`;
    }

    // Открытие профиля
    profileIcon.addEventListener("click", () => {
        loadProfile();
        profilePopup.style.display = "block";
    });

    // Закрытие окна профиля
    closeProfile.addEventListener("click", () => {
        profilePopup.style.display = "none";
    });

    // Выход из аккаунта
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("username");
        localStorage.removeItem("profilePic");
        localStorage.removeItem("userHash");
        alert("Logged out successfully!");
        profilePopup.style.display = "none";
    });

    // Закрытие при клике вне окна
    window.addEventListener("click", (event) => {
        if (event.target === profilePopup) {
            profilePopup.style.display = "none";
        }
    });
});
