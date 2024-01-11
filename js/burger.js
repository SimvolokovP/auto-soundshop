const burgerBtn = document.querySelector('.btn__burger');
const menu = document.querySelector('.menu');
const body = document.body;
const navItems = menu.querySelectorAll('a');
const burgerItems = menu.querySelectorAll('.burger__link');

burgerBtn.addEventListener('click', () => {
    burgerBtn.classList.toggle('btn__burger--active');
    menu.classList.toggle('menu--active');
    body.classList.toggle('stop-scroll');

    navItems.forEach(el => {
        el.classList.toggle('burger__link')
    })
});


navItems.forEach(el => {
    el.addEventListener('click', () => {
        if (menu.classList.contains('menu--active')) {
            burgerBtn.classList.toggle('btn__burger--active');
            menu.classList.toggle('menu--active');
            body.classList.toggle('stop-scroll');
        }
        
    })
})