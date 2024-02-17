const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    
    const select = dropdown.querySelector('.select');
    const caret = dropdown.querySelector('.caret');
    const droplist = dropdown.querySelector('.droplist');
    
    const selected = dropdown.querySelector('.selected');
    
    

    select.addEventListener('click', () => {
        const items = dropdown.querySelectorAll('.droplist__item');
        console.log(items);
        droplist.classList.toggle('droplist--open');
        select.classList.toggle('select--active');
        caret.classList.toggle('caret--active');

        items.forEach(item => {
            item.addEventListener('click', () => {
                console.log('drop!')
                selected.innerText = item.innerText;
                droplist.classList.remove('droplist--open');
                select.classList.remove('select--active');
                caret.classList.remove('caret--active');
                items.forEach(item => {
                    item.classList.remove('droplist__item--active');
                });
                item.classList.add('droplist__item--active');
                checkCategory();
                currentPage = 1;
                document.querySelector('.search-input').value = '';
                loadProducts(productsList);
                
            });
        });
    }); 
});


document.addEventListener('click', function(event) 
{ const dropdowns = document.querySelectorAll('.dropdown'); 
dropdowns.forEach(dropdown => { const select = dropdown.querySelector('.select'); 
const caret = dropdown.querySelector('.caret'); const droplist = dropdown.querySelector('.droplist'); 
if (event.target !== select && event.target !== caret && event.target !== droplist) 
{ droplist.classList.remove('droplist--open'); select.classList.remove('select--active'); 
caret.classList.remove('caret--active'); 
} }); 
});


function checkCategory() {
    const categoryDropDown = document.querySelector('.category__dropdown');
    const categorySelected = document.querySelector('.category__selected');
    const subCategoryDropDown = document.querySelector('.sub-category__dropdown');
    console.log(categorySelected.innerHTML);

    if (categorySelected.innerHTML.toUpperCase() != 'Все'.toUpperCase()) {
        categoryDropDown.classList.add('category__dropdown--active');
        subCategoryDropDown.style.display = 'block';
        
        if (categorySelected.innerHTML.toUpperCase() == 'Категория 1'.toUpperCase()) {
            const subCategoryList = document.querySelector('.sub-category__list');
            subCategoryList.innerHTML = '';
            subCategoryList.insertAdjacentHTML('beforeend', `<li class="droplist__item sub-category__item">Все</li>`);
            subCategoryList.insertAdjacentHTML('beforeend', `<li class="droplist__item sub-category__item">Подкатегория 1</li>`);
            subCategoryList.insertAdjacentHTML('beforeend', `<li class="droplist__item sub-category__item">Подкатегория 2</li>`);
        }
        if (categorySelected.innerHTML.toUpperCase() == 'Категория 2'.toUpperCase()) {
            const subCategoryList = document.querySelector('.sub-category__list');
            subCategoryList.innerHTML = '';
            subCategoryList.insertAdjacentHTML('beforeend', `<li class="droplist__item sub-category__item">Все</li>`);
            subCategoryList.insertAdjacentHTML('beforeend', `<li class="droplist__item sub-category__item">Подкатегория 3</li>`);
            subCategoryList.insertAdjacentHTML('beforeend', `<li class="droplist__item sub-category__item">Подкатегория 4</li>`);
        }


    } else {
        categoryDropDown.classList.remove('category__dropdown--active');
        subCategoryDropDown.style.display = 'none';
    };

    
}

const categoryItems = document.querySelectorAll('.category__item');

categoryItems.forEach(el => {
    el.addEventListener('click', () => {
        document.querySelector('.sub-category__selected').innerHTML = 'Все';
    })
})