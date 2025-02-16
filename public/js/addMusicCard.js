export function addMusicCard(title, artist, info, imgSrc, musicSrc) {
    const cardContainer = document.querySelector('.card-container');

    const card = document.createElement('div');
    card.classList.add('card');

    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = '';
    img.classList.add('card-img');

    const cardTitle = document.createElement('p');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = title;

    const cardInfo = document.createElement('p');
    cardInfo.classList.add('card-info');
    cardInfo.textContent = info;

    card.appendChild(img);
    card.appendChild(cardTitle);
    card.appendChild(cardInfo);

    card.addEventListener('click', () => {
        const audioElement = document.getElementById('audioElement');
        audioElement.src = musicSrc;
        audioElement.play();
    });

    cardContainer.appendChild(card);
}