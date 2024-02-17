//loading

const preload = document.querySelector('[data-preload]');

window.addEventListener('load', function () {
    // setTimeout(() => {
    //     preload.classList.add('loaded');
    //     document.body.classList.add('loaded');
    // }, 500)

    preload.classList.add('loaded');
    document.body.classList.add('loaded');
    preload.innerHTML = '';
});

