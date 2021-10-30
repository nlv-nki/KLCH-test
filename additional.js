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
   console.log(imageIcard, 111111111111111);
   imageIcard.forEach(item => item.insertAdjacentHTML('beforeend', '<div class="round-sticky">NEW</div>'));
};


genConrolsBtn();
addSticky();