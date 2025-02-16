document.addEventListener('DOMContentLoaded', () => {
    // Находим элемент с классом .creator-info span
    const creatorInfo = document.querySelector('.creator-info span');
    // Элемент для отображения аватара в .creator-info
    const creatorInfoImage = document.querySelector(".creator-info img");

    if (!creatorInfo) {
        console.error('Element with class ".creator-info span" not found.');
        return;
    }

    if (!creatorInfoImage) {
        console.error('Element with class ".creator-info img" not found.');
        return;
    }

    // Функция загрузки сохраненных данных
    function loadCreatorInfo() {
        const savedUsername = localStorage.getItem("username") || "Guest";
        const savedProfilePic = localStorage.getItem("profilePic") || "default-avatar.png";

        // Обновляем текст и аватар в .creator-info
        creatorInfo.textContent = savedUsername;
        creatorInfoImage.src = savedProfilePic;
    }

    // Проверяем, авторизован ли пользователь
    const username = localStorage.getItem('username');

    if (username) {
        // Если пользователь авторизован, обновляем текст
        creatorInfo.textContent = username;
    } else {
        // Если пользователь не авторизован, очищаем текст
        creatorInfo.textContent = 'Гость';
    }

    // Загружаем информацию о пользователе при старте
    loadCreatorInfo();

    const trackNumbers = document.querySelectorAll('.track span:first-child');

    trackNumbers.forEach(numberSpan => {
        numberSpan.addEventListener('mouseover', () => {
            numberSpan.innerHTML = '<i class="fa-sharp fa-solid fa-circle-play" style="color:#cc0a92;"></i>';
        });

        numberSpan.addEventListener('mouseout', () => {
            numberSpan.textContent = numberSpan.dataset.trackNumber || numberSpan.textContent;
        });

        // Сохраняем исходный номер трека в атрибуте data-track-number
        numberSpan.dataset.trackNumber = numberSpan.textContent;
    });

    const buyButtons = document.querySelectorAll('.buy-button');

    buyButtons.forEach(button => {
        const track = button.closest('.track');
        const buyForm = track.querySelector('.buy-form');
        const cancelBuy = buyForm.querySelector('.cancel-buy');

        button.addEventListener('click', () => {
            buyForm.style.display = 'block';

            // Получаем confirmBuy ТОЛЬКО ЗДЕСЬ, ВНУТРИ ЭТОГО ОБРАБОТЧИКА
            const confirmBuy = buyForm.querySelector('.confirm-buy');

            confirmBuy.addEventListener('click', async () => {
                if (window.ethereum) {
                    try {
                        // Запрашиваем доступ к аккаунтам MetaMask
                        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                        const web3 = new Web3(window.ethereum);
            
                        if (!accounts || accounts.length === 0) {
                            alert('Кошелек не подключен. Пожалуйста, подключите MetaMask.');
                            return;
                        }
            
                        const amount = web3.utils.toWei('0.1', 'ether'); // Сумма в ETH
                        const from = accounts[0]; // Адрес отправителя
                        const to = '0x6F383552acE74a142dE095d40E7E5527E7338F6d'; // Адрес получателя
            
                        // Получаем текущую цену газа
                        const gasPrice = await web3.eth.getGasPrice();
            
                        // Оцениваем количество газа для транзакции
                        const gasEstimate = await web3.eth.estimateGas({
                            from: from,
                            to: to,
                            value: amount
                        });
            
                        // Преобразуем gasEstimate в число и увеличиваем на 20%
                        const gasLimit = Math.floor(Number(gasEstimate) * 1.2);
            
                        // Создаем объект транзакции
                        const tx = {
                            from: from,
                            to: to,
                            value: amount,
                            gasPrice: gasPrice,
                            gas: gasLimit.toString(), // Преобразуем gasLimit в строку
                        };
            
                        // Отправляем транзакцию через MetaMask
                        const receipt = await web3.eth.sendTransaction(tx);
            
                        alert('Покупка совершена успешно! Транзакция: ' + receipt.transactionHash);
                        buyForm.style.display = 'none';
            
                    } catch (error) {
                        console.error('Ошибка покупки:', error);
            
                        if (error.code === 4001) {
                            alert('Запрос на подключение отклонен пользователем.');
                        } else if (error.message.includes("insufficient funds")) {
                            alert("Недостаточно средств на балансе.");
                        } else if (error.message.includes("Non-200 status code")) {
                            alert("Ошибка подключения к сети или неверный адрес контракта. Проверьте настройки MetaMask и адрес контракта.");
                            console.error("Детали ошибки:", error);
                        } else {
                            alert('Ошибка покупки. Проверьте консоль для подробностей.');
                            console.error("Детали ошибки:", error);
                        }
                    }
                } else {
                    alert('MetaMask не установлен! Пожалуйста, установите его.');
                    window.open("https://metamask.io/", "_blank");
                }
            });
        });
});
});