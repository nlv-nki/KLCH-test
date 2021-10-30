'use strict';
 const genConrolsBtn = () => {
 const btnWrap = document.querySelectorAll('.button');
 const button = document.querySelectorAll('.btn-success');
 button.forEach(item => {
    item.innerHTML = 'Добавить в абонемент';
    item.classList.add('btn-add');
    item.style.background = 'linear-gradient(to right, #095bd6, #69b0f6)';
    item.style.borderRadius = '15px';
 });

 btnWrap.forEach(item => item.insertAdjacentHTML('beforeend', '<a href="#" class="btn-link">Подробнее</a>'));

};

const addSticky = () => {
   const imageIcard = document.querySelectorAll('.image-card');
   imageIcard.forEach(item => item.insertAdjacentHTML('beforeend', '<div class="round-sticky">NEW</div>'));
};

const addInfoBar = () => {
    const container = document.querySelectorAll('.lt-tsr-content');
    container.forEach(item => item.insertAdjacentHTML('afterbegin', '<div class="info-bar"><span class="info-bar__lessons">29 уроков</span><span class="info-bar__pupils">129 учеников</span></div>'))
}


genConrolsBtn();
addSticky();
addInfoBar() 