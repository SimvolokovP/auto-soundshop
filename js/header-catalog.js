window.onload = function () {
    //header
    const headerEl = document.querySelector('.header-catalog');
    const headerWrapper = document.querySelector('.header-catalog__wrapper');
    const headerBody = document.querySelector('.header-catalog__body');

    const callback = function(entries, observer) {
        if (entries[0].isIntersecting) {
            headerEl.classList.remove('header-scroll');
            headerWrapper.classList.remove('header-catalog__wrapper--scroll');
            headerBody.classList.remove('header__body--scroll');
            headerBody.style.minHeight = '40px';

        } else {
            headerEl.classList.add('header-scroll')
            headerWrapper.classList.add('header-catalog__wrapper--scroll')
            headerBody.classList.add('header__body--scroll');
            headerBody.style.minHeight = '60px';
        }
    }

    const headerObserver = new IntersectionObserver(callback);
    headerObserver.observe(headerEl);

}