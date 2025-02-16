document.addEventListener('DOMContentLoaded', () => {
    // Находим элементы
    const creatorInfo = document.querySelector('.creator-info span');
    const creatorInfoImage = document.querySelector(".creator-info img");

    if (!creatorInfo || !creatorInfoImage) {
        console.error('Не найдены элементы .creator-info');
        return;
    }

    function loadCreatorInfo() {
        const savedUsername = localStorage.getItem("username") || "Гость";
        const savedProfilePic = localStorage.getItem("profilePic") || "default-avatar.png";

        creatorInfo.textContent = savedUsername;
        creatorInfoImage.src = savedProfilePic;
    }

    loadCreatorInfo();

    const trackNumbers = document.querySelectorAll('.track span:first-child');
    trackNumbers.forEach(numberSpan => {
        numberSpan.dataset.trackNumber = numberSpan.textContent;

        numberSpan.addEventListener('mouseover', () => {
            numberSpan.innerHTML = '<i class="fa-sharp fa-solid fa-circle-play" style="color:#cc0a92;"></i>';
        });

        numberSpan.addEventListener('mouseout', () => {
            numberSpan.textContent = numberSpan.dataset.trackNumber;
        });
    });

    const buyButtons = document.querySelectorAll('.buy-button');

    buyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const track = button.closest('.track');
            const buyForm = track.querySelector('.buy-form');
            const cancelBuy = buyForm.querySelector('.cancel-buy');
            buyForm.style.display = 'block';

            const confirmBuy = buyForm.querySelector('.confirm-buy');

            confirmBuy.addEventListener('click', async () => {
                console.log("🟡 Запрашиваем доступ к кошельку...");

                if (window.ethereum) {
                    try {
                        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                        const web3 = new Web3(window.ethereum);

                        if (!accounts || accounts.length === 0) {
                            alert('❌ Кошелек не подключен. Подключите MetaMask.');
                            return;
                        }

                        const from = accounts[0];
                        const to = '0x6F383552acE74a142dE095d40E7E5527E7338F6d'; // Адрес получателя
                        const amount = web3.utils.toWei('0.1', 'ether'); // Цена покупки

                        console.log("🟢 MetaMask подключен. Аккаунт:", from);
                        console.log("💰 Проверяем баланс...");

                        const balance = await web3.eth.getBalance(from);
                        if (BigInt(balance) < BigInt(amount)) {
                            alert("❌ Недостаточно средств на балансе.");
                            return;
                        }

                        console.log("⛽ Получаем параметры газа...");
                        const gasPrice = await web3.eth.getGasPrice();
                        const gasEstimate = await web3.eth.estimateGas({ from, to, value: amount });

                        const maxFeePerGas = Math.floor(Number(gasPrice) * 1.5);
                        const maxPriorityFeePerGas = Math.floor(Number(gasPrice) * 0.2);
                        const gasLimit = Math.floor(Number(gasEstimate) * 1.3);

                        console.log(`💨 gasPrice: ${gasPrice}, gasEstimate: ${gasEstimate}, gasLimit: ${gasLimit}`);

                        const tx = {
                            from,
                            to,
                            value: amount,
                            maxFeePerGas,
                            maxPriorityFeePerGas,
                            gas: gasLimit
                        };

                        console.log("📤 Отправляем транзакцию:", tx);

                        const receipt = await web3.eth.sendTransaction(tx);

                        console.log("✅ Транзакция выполнена:", receipt);
                        alert('✅ Покупка успешна! Транзакция: ' + receipt.transactionHash);
                        buyForm.style.display = 'none';

                    } catch (error) {
                        console.error('❌ Ошибка покупки:', error);

                        if (error.code === 4001) {
                            alert('⛔ Запрос на подключение отклонен пользователем.');
                        } else if (error.message.includes("insufficient funds")) {
                            alert("💰 Недостаточно средств на балансе.");
                        } else if (error.message.includes("max fee per gas less than block base fee")) {
                            alert("⚠️ Установи более высокий `maxFeePerGas`.");
                        } else {
                            alert('❌ Ошибка покупки. Проверь консоль.');
                        }
                    }
                } else {
                    alert('⚠️ MetaMask не установлен! Установите его.');
                    window.open("https://metamask.io/", "_blank");
                }
            });

            cancelBuy.addEventListener('click', () => {
                buyForm.style.display = 'none';
            });
        });
    });
});
