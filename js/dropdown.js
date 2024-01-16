const dropdowns = document.querySelectorAll('.order__dropdown');

dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const droplist = dropdown.querySelector('.droplist');
    const items = dropdown.querySelectorAll('.droplist__item');
    const selected = dropdown.querySelector('.selected');
    


    select.addEventListener('click', () => {

        droplist.classList.toggle('droplist--open');
        select.classList.toggle('select--active');
        caret.classList.toggle('caret--active');
    });




    items.forEach(item => {
        item.addEventListener('click', () => {
            selected.innerText = item.innerText;
            droplist.classList.remove('droplist--open');
            select.classList.remove('select--active');
            caret.classList.remove('caret--active');
            items.forEach(item => {
                item.classList.remove('droplist__item--active');
            });
            item.classList.add('droplist__item--active');
            
            if (document.querySelector('.select span').innerHTML == 'РФ') {
                const labels = document.querySelectorAll('.order__label--condition');

                labels.forEach(el => {
                    el.style.display = 'flex';
                })
            } else {
                const labels = document.querySelectorAll('.order__label--condition');

                labels.forEach(el => {
                    el.style.display = 'none';
                })
            }
        });
    });
});