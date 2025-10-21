const wordList = [
    'академия', 'академический', 'акварель', 'акварельный', 'аккомпанемент', 'аккомпанировать',
    'аннотация', 'аплодировать', 'аплодисменты', 'аппетит', 'аромат', 'ароматный', 'аукцион',
    'багаж', 'багажный', 'багровый', 'багроветь', 'балкон', 'балконный', 'берёза'
];

const wordsData = {
    "академия": "audio/0.mp3",
    "академический": "audio/1.mp3",
    "акварель": "audio/2.mp3",
    "акварельный": "audio/3.mp3",
    "аккомпанемент": "audio/4.mp3",
    "аккомпанировать": "audio/5.mp3",
    "аннотация": "audio/6.mp3",
    "аплодировать": "audio/7.mp3",
    "аплодисменты": "audio/8.mp3",
    "аппетит": "audio/9.mp3",
    "аромат": "audio/10.mp3",
    "ароматный": "audio/11.mp3",
    "аукцион": "audio/12.mp3",
    "багаж": "audio/13.mp3",
    "багажный": "audio/14.mp3",
    "багровый": "audio/15.mp3",
    "багроветь": "audio/16.mp3",
    "балкон": "audio/17.mp3",
    "балконный": "audio/18.mp3",
    "берёза": "audio/19.mp3"
};

let currentWordIndex = 0;
let currentAudio = null;
let mainBlock = null; // главный блок
let currentWord = null;

const container = document.getElementById('container');

// Функция перемешивания массива
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Перемешиваем слова при запуске
shuffleArray(wordList);

function playAudio(audioPath) {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    currentAudio = new Audio(audioPath);
    currentAudio.play().catch(err => console.error(err));
}

function createMainBlock(wordIndex) {
    currentWord = wordList[wordIndex];
    const audioPath = wordsData[currentWord];

    mainBlock = document.createElement('div');
    mainBlock.className = 'word-block';
    mainBlock.innerHTML = `
        <div class="error-message">❌ Хмм... буквы не дружат сегодня!</div>
        <div class="input-container">
            <button class="sound-button" data-audio="${audioPath}">
                <span class="sound-icon">🔊</span>
            </button>
            <input type="text" class="input-field" placeholder="Введите слово..." autocomplete="off">
        </div>
    `;

    container.prepend(mainBlock);

    const input = mainBlock.querySelector('.input-field');
    const errorMsg = mainBlock.querySelector('.error-message');
    const soundButton = mainBlock.querySelector('.sound-button');

    // Автовоспроизведение нового слова
    setTimeout(() => playAudio(audioPath), 300);

    soundButton.addEventListener('click', () => playAudio(soundButton.dataset.audio));
    setTimeout(() => input.focus(), 100);

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer(input.value.trim(), errorMsg, input, soundButton);
        }
    });
}

function checkAnswer(userInput, errorMsg, input, soundButton) {
    if (userInput.toLowerCase() === currentWord.toLowerCase()) {
        const historyBlock = document.createElement('div');
        historyBlock.className = 'history-block';
        historyBlock.textContent = `✓ ${currentWord}`;
        container.insertBefore(historyBlock, mainBlock.nextSibling);

        input.value = '';
        currentWordIndex++;

        if (currentWordIndex < wordList.length) {
            currentWord = wordList[currentWordIndex];
            const audioPath = wordsData[currentWord];
            soundButton.dataset.audio = audioPath;

            // Автовоспроизведение нового слова
            playAudio(audioPath);

            input.placeholder = "Введите слово...";
            input.focus();
        } else {
            showCompletion();
        }
    } else {
        input.value = '';
        mainBlock.classList.add('shake');
        errorMsg.classList.add('show');
        setTimeout(() => {
            mainBlock.classList.remove('shake');
            errorMsg.classList.remove('show');
        }, 600);
    }
}

function showCompletion() {
    // Заменяем главный блок на сообщение
    const completionMsg = document.createElement('div');
    completionMsg.className = 'word-block';
    completionMsg.style.color = '#ffffff';
    completionMsg.innerHTML = '✅ Отлично! Ты прошёл диктант.<br><small style="font-size: 1.2rem;color: #ffffff; opacity: 0.9; display: block; margin-top: 10px;">Все слова написаны правильно!</small>';

    container.replaceChild(completionMsg, mainBlock);
}

document.addEventListener('DOMContentLoaded', () => {
    createMainBlock(0);
});
