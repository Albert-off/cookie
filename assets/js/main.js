// localStorage.clear();

// Constants
const levelUpPoints = [5000, 25000, 100000, 500000, 1000000, 2000000, 5000000, 10000000];
const levelNames = ["NOOB", "BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT", "MASTER", "GRANDMASTER", "LEGEND"];


// RANDOM SCORE COUNT
let randValue = 0;
const scoreValues = [20, 40, 60, 20, 40, 20, 80];

function randScore() {
    randValue = scoreValues[Math.floor(Math.random() * scoreValues.length)];
    return randValue;
}


document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const countClicksElement = document.getElementById('countClicks');

    const mainScoreElement = document.getElementById('mainScore');
    const levelScoreElement = document.getElementById('levelScore');
    const tempScoreElement = document.getElementById('tempScore');

    const cookieElement = document.getElementById('cookie');
    const cookieParticlesElement = document.querySelector('.cookie__particles');

    const levelRangeElement = document.getElementById('levelRange');
    const levelNameElement = document.getElementById('levelName');

    const neededPointsElement = document.getElementById('needed__points');

    const cookieCoinElement = document.getElementById('cookieCoins');
    const cookieGemElement = document.getElementById('cookieGems');

    const progressBarContainer = document.getElementById('levelProgressBar');


    // Variables
    let countClicks = localStorage.getItem('countClicks') ? parseInt(localStorage.getItem('countClicks'), 10) : 0;
    let mainScore = localStorage.getItem('mainScore') ? parseInt(localStorage.getItem('mainScore'), 10) : 0;
    let levelScore = localStorage.getItem('levelScore') ? parseInt(localStorage.getItem('levelScore'), 10) : 0;
    let level = localStorage.getItem('level') ? parseInt(localStorage.getItem('level'), 10) : 0;
    let cookieCoin = localStorage.getItem('cookieCoin') ? parseInt(localStorage.getItem('cookieCoin'), 10) : 0;
    let cookieGem = localStorage.getItem('cookieGem') ? parseInt(localStorage.getItem('cookieGem'), 10) : 0;

    let tempScore = 0;
    let tempScoreTimeout;


    // Update UI  |  Вызов функции при загрузке страницы
    updateUI();


    // Event Listeners
    cookieElement.addEventListener('click', handleClick);


    /*================ FUNCTIONS ================*/

    function handleClick() {

        incrementClick();

        incrementRandScore(randScore());
        
        updateUI();


        /*================ ANIMATIONS ================*/
        // ---- (80) HIGH SCORE ANIMATION ----
        if (randValue == 80) {
            tempScoreElement.style.animation = 'tempScoreSizeChangeAnimation .4s';
        }

        // ---- COOKiE ANIMATION ----
        // Перезапуск анимации для cookieElement
        cookieElement.classList.remove('cookie-click-animation');
        void cookieElement.offsetWidth;  // Принудительный пересчет стилей
        cookieElement.classList.add('cookie-click-animation');


        // ---- COOKiE PARTICLES ANIMATION ----
        if (randValue == 80) {
            // Перезапуск анимации для cookieParticlesElement
            cookieParticlesElement.classList.remove('cookie-particles-animation');
            void cookieParticlesElement.offsetWidth;  // Принудительный пересчет стилей
            cookieParticlesElement.classList.add('cookie-particles-animation');
        }


        // animateCookieClick();

        checkLevelUp();
    }


    function incrementClick() {
        countClicks++;
        localStorage.setItem('countClicks', countClicks);
    }


    function updateProgressBar() {
        const progressPercentage = (levelScore / levelUpPoints[level]) * 100;
        progressBarContainer.style.setProperty('--level-progress-bar-width', progressPercentage);
    }


    async function resetTempScore() {
        // tempScore = 0;
        // tempScoreElement.textContent = tempScore;

        let showSpeed = 1;
        let activeClick = false;
        document.addEventListener('click', () => { activeClick = true; });

        while (tempScore > 0) {
            tempScore = Math.max(0, tempScore - (10 * showSpeed));
            showSpeed++;

            if (activeClick) { return; }
            tempScoreElement.textContent = tempScore;

            await sleep(100);
        }
        
        tempScoreElement.style.opacity = '.5';
    }
    async function sleep(miliseconds) {
        return new Promise(resolve => setTimeout(resolve, miliseconds));
    }


    function incrementRandScore(points) {
        tempScore += points;
        mainScore += points;
        levelScore += points;

        localStorage.setItem('mainScore', mainScore);
        localStorage.setItem('levelScore', levelScore);

        // Temp Score Timeout
        clearTimeout(tempScoreTimeout);
        tempScoreElement.style.opacity = '1';
        tempScoreTimeout = setTimeout(resetTempScore, 5000);
    }


    function checkLevelUp() {
        if (levelScore >= levelUpPoints[level]) {
            level++;
            levelScore = 0;
            localStorage.setItem('level', level);
            localStorage.setItem('levelScore', levelScore);
            updateUI();
            // Here you can add any additional logic for leveling up, like rewards
        }
    }


    // // Сброс анимации после её завершения
    // function animateCookieClick() {
    //     cookieElement.classList.add('cookie-click-animation');
    //     setTimeout(() => {
    //         cookieElement.classList.remove('cookie-click-animation');
    //     }, 100);

    //     cookieParticlesElement.classList.add('cookie-particles-animation');
    //     setTimeout(() => {
    //         cookieParticlesElement.classList.remove('cookie-particles-animation');
    //     }, 400);
    // }

    // Сброс анимации после её завершения
    tempScoreElement.addEventListener('animationend', function() {
        tempScoreElement.style.animation = '';
    });

    cookieElement.addEventListener('animationend', function() {
        cookieElement.style.animation = '';
    });

    cookieParticlesElement.addEventListener('animationend', function() {
        cookieParticlesElement.style.animation = '';
    });


    // ======== Mouse Click Animation (score displaying) ========
    document.onclick = function(e) {
        let x = e.pageX;
        let y = e.pageY;

        if (e.target === cookieElement) {
            let span = document.createElement("span");
            span.classList.add('click-effect');
            span.style.top = y + "px";
            span.style.left = x + "px";

            // ---- (80) HIGH SCORE ANIMATION ----
            if (randValue == 80) {
                span.style.fontSize = 'clamp(1.2rem, 5vw, 2rem)';

                if (window.innerWidth >= 600) {
                    span.style.width = '120px';
                    span.style.height = '120px';
                    span.style.marginTop = '-60px';
                    span.style.marginLeft = '-60px';
                } else {
                    span.style.width = '90px';
                    span.style.height = '90px';
                    span.style.marginTop = '-45px';
                    span.style.marginLeft = '-45px';
                }
            }

            document.body.appendChild(span);
            span.textContent = '+' + randValue;
    
            setTimeout(() => {
                span.remove();
            }, 400);
        }
    }


    function updateUI() {
        countClicksElement.textContent = countClicks;

        tempScoreElement.textContent = tempScore;
        mainScoreElement.textContent = mainScore;
        levelScoreElement.textContent = levelScore;

        neededPointsElement.textContent = levelUpPoints[level] || 'MAX';
        levelRangeElement.textContent = level;
        levelNameElement.textContent = levelNames[level] || 'LEGEND';

        cookieCoinElement.textContent = cookieCoin;
        cookieGemElement.textContent = cookieGem;

        updateProgressBar();
    }

});





// const progressBar = document.getElementsByClassName('level__progress-bar')[0];

// setInterval(() => {
//     const computedStyle = getComputedStyle(progressBar);

//     const progressBarWidth = 
//     parseFloat(computedStyle.getPropertyValue('--level-progress-bar-width')) || 0

//     progressBar.style.setProperty('--level-progress-bar-width', progressBarWidth + .1)
// }, 5);





/*=============== SHOW MENU ===============*/
const menuContainer = document.querySelector('.menu__container'),
    cookieLink = document.getElementById('cookie-link'),
    shopLink = document.getElementById('shop-link'),
    exchangeLink = document.getElementById('exchange-link'),
    buildingsLink = document.getElementById('buildings-link'),
    errandLink = document.getElementById('errand-link');

    
/* Menu show */
shopLink.addEventListener('click', () =>{
    menuContainer.classList.add('show-menu');
});
exchangeLink.addEventListener('click', () =>{
    menuContainer.classList.add('show-menu');
});
buildingsLink.addEventListener('click', () =>{
    menuContainer.classList.add('show-menu');
});
errandLink.addEventListener('click', () =>{
    menuContainer.classList.add('show-menu');
});


/* Menu hidden */
cookieLink.addEventListener('click', () =>{
    menuContainer.classList.remove('show-menu');
});









// /*=============== SHOW MENU ===============*/
// const navMenu = document.getElementById('nav-menu'),
//       navToggle = document.getElementById('nav-toggle'),
//       navClose = document.getElementById('nav-close');

// /* Menu show */
// if(navToggle){
//     navToggle.addEventListener('click', () =>{
//         navMenu.classList.add('show-menu');
//     })
// }

// /* Menu hidden */
// if(navClose){
//     navClose.addEventListener('click', () =>{
//         navMenu.classList.remove('show-menu');
//     })
// }


// /*=============== REMOVE MENU MOBILE ===============*/
// const navLink = document.querySelectorAll('.nav__link');

// const linkAction = () =>{
//     const navMenu = document.getElementById('nav-menu');
//     // When we click on each nav__link, we remove the show-menu class
//     navMenu.classList.remove('show-menu');
// }
// navLink.forEach(n => n.addEventListener('click', linkAction));
