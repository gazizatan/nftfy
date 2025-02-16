document.addEventListener('DOMContentLoaded', () => {
    const status = document.getElementById('status');
    const headerTitle = document.querySelector('.header h1');

    if (!status || !headerTitle) {
        console.error('Element with ID "status" or <h1> inside .header not found.');
        return;
    }

    // Проверяем, авторизован ли пользователь
    const username = localStorage.getItem('username');

    if (username) {
        headerTitle.textContent = `Good Morning, ${username}!`;
    } else {
        headerTitle.textContent = 'Good Morning!';
    }
});
