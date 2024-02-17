document.addEventListener('click', documentActions);
const btnMore = document.querySelector('.products__more');
const btnsAddToCart = document.querySelectorAll('.actions-product__button');

let currentPage = 1;
const productsPerPage = 12;

let productsList = [];

let productsArray = [];
let fullPrice = 0;

let titlesArray = [];

getProducts(btnMore);




function documentActions(e) {
    const targetElement = e.target;
    if (targetElement.classList.contains('products__more')) {
        getProducts(targetElement);
        console.log("click");
    }
    if (targetElement.classList.contains('actions-product__button')) {
        
        const productId = targetElement.closest('.item-product').dataset.id;
        console.log(productId);
        
        addToCart(targetElement, productId);
        
    }

    if (targetElement.classList.contains('cart-header__icon') || targetElement.closest('.cart-header__icon')) {
        if (document.querySelector('.cart-list').children.length > 0) {
            getFullPrice(targetElement);
            document.querySelector('.cart-header__body').classList.toggle('cart-header__body--active');
        } else {
            alert('Добавьте товар в корзину!');
        }
        e.preventDefault();
    } else if (!targetElement.closest('.cart-header') && !targetElement.classList.contains('actions-product__button')) {
        document.querySelector('.cart-header__body').classList.remove('cart-header__body--active');
    }

    if (targetElement.classList.contains('cart-list__delete')) {
        const productId = targetElement.closest(".cart-list__item").dataset.cartId;
        updateCart(targetElement, productId, false);
        
        e.preventDefault();
    }

    if (targetElement.classList.contains('item-product__details')) {
        const productId = targetElement.closest('.item-product').dataset.id;
        console.log(productId);
        showDetails(targetElement, productId);
    }

    if (targetElement.classList.contains('cart-header__order')) {
        document.querySelector('.cart-header__body').classList.remove('cart-header__body--active');
        getOrder(targetElement);
        showPrice(targetElement);
        console.log('order');
    }

    if (targetElement.classList.contains('order__btn')) {
        pushOrder(targetElement);
        modal.close();
    }
}

async function getProducts(button) {
    if (!button.classList.contains('hold')) {
        button.classList.add('hold');
        const file = '/json/products.json?timestamp=' + new Date().getTime();
        let response = await fetch(file, {
            method: "GET"
        });
        if (response.ok) {
            let result = await response.json();
            productsList = result;
            products = result.products;
            
            loadProducts(result);
            console.log()
            button.classList.remove('hold');
            button.remove();
        } else {
            alert("Ошибка");
        }
    }
}


function loadProducts(data) {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const products = data.products;
    let items = [];
    let st = data.products.length;
    const value = document.querySelector('.search-input').value;
    const categoryDropDown = document.querySelector('.category__dropdown');
    products.forEach(el => {
        const productTitle = el.title;
        const productCategory = el.category;
        const productSubCategory = el.subCategory;
        if (productTitle.toUpperCase().includes(value.toUpperCase())) {
            if (categoryDropDown.classList.contains('category__dropdown--active')) {
                const categorySelected = document.querySelector('.category__selected');
                if (categorySelected.innerHTML.toUpperCase() == productCategory.toUpperCase()) {
                    
                    if (document.querySelector('.sub-category__selected').innerHTML.toUpperCase() != 'Все'.toUpperCase()) {
                        if (document.querySelector('.sub-category__selected').innerHTML.toUpperCase() == productSubCategory.toUpperCase()) {
                            items.push(el);
                        }
                    } else {
                        items.push(el);
                    }

                    
                }
            } else {
                items.push(el);
            }
            
        };
    });
    let en = items.length;
    let r = st - en;
    items = items.slice(startIndex, endIndex);
    
    
    const productsItems = document.querySelector('.products__items');
    productsItems.innerHTML = '';
    createPaginationButtons(data, r);

    items.forEach(item => {
        const productId = item.id;
        const productTitle = item.title;
        const productImage = item.image;
        const productPrice = item.price;
        const productDescr = item.descr;
        const productCategory = item.category;
        const productAvaibility = item.availability;
        
        let template = `<article data-id="${productId}" class="products__item item-product">
        <div class="item-product__img">
            <img class="item-product__image" src="img/products/${productImage}" alt="">
        </div>
        <div class="item-product__body">
            <div class="item-product__content">
                <h5 class="item-product__title">${productTitle}</h5>
                <div class="item-product__inner">
                    <button class="item-product__details" data-graph-path="cardModal" data-graph-speed="300">подробнее</button>
                    <div class="avaibility">
                        <div class="item-product__point"></div>
                        <div class="item-product__availability">${productAvaibility}</div>
                    </div>    
                </div>
            </div>
            <div class="item-product__price">${productPrice} руб.</div>
            <div class="item-product__actions actions-product">
                <button class="btn actions-product__button">В корзину</button>
                <div class="item-product__descr visually-hidden">${productDescr}</div>
                <div class="item-product__category visually-hidden">${productCategory}</div>
            </div>
        </div>
    </article>`;
    
    titlesArray.push(productTitle);
    // const value = document.querySelector('.search-input').value;
    // if (productTitle.toUpperCase().includes(value.toUpperCase())) {
        
    //     productsItems.insertAdjacentHTML('beforeend', template);
    //     console.log(data);
    //     createPaginationButtons(data);
    // }
    productsItems.insertAdjacentHTML('beforeend', template);
    availabilityCheck();
    });
}

function createPaginationButtons(totalProducts, number) {
    const totalPages = Math.ceil((totalProducts.products.length - number) / productsPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; 

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.classList.add('pagination__btn');
        button.addEventListener('click', (event) => {
            currentPage = event.target.innerText; 
            getProducts(button); 

            document.getElementById('catalog-id').scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });

        

        paginationContainer.appendChild(button);

        checkActivePagination();
    }

}

function addToCart(productBtn, productId) {
    if (!productBtn.classList.contains('hold')) {
        productBtn.classList.add('hold');
        productBtn.classList.add('fly');

        const cart = document.querySelector('.cart-header__icon');
        const product = document.querySelector(`[data-id="${productId}"]`);
        const productImg = product.querySelector('.item-product__image');

        const productImageFly = productImg.cloneNode(true);

        const productImageFlyWidth = productImg.offsetWidth;
        const productImageFlyHeight = productImg.offsetHeight;
        const productImageFlyTop = productImg.getBoundingClientRect().top;
        const productImageFlyLeft = productImg.getBoundingClientRect().left;

        productImageFly.setAttribute('class', 'flyImage ibg');
        productImageFly.style.cssText = 
        `
        left: ${productImageFlyLeft}px;
        top: ${productImageFlyTop}px;
        width: ${productImageFlyWidth}px;
        height: ${productImageFlyHeight}px;
        `;

        document.body.append(productImageFly);

        const cartFlyLeft = cart.getBoundingClientRect().left;
        const cartFlyTop = cart.getBoundingClientRect().top;

        productImageFly.style.cssText = 
        `
        left: ${cartFlyLeft}px;
        top: ${cartFlyTop}px;
        width: 0px;
        height: 0px;
        opacity: 0;
        `;

        productImageFly.addEventListener('transitionend', function () {
            if (productBtn.classList.contains('fly')) {
                productImageFly.remove();
                updateCart(productBtn, productId);
                productBtn.classList.remove('fly');
            }
        })
    }
}

function showDetails(productBtn, productId) {
    const product = document.querySelector(`[data-id="${productId}"]`);
    const cartProductImage = product.querySelector('.item-product__img').innerHTML;
    const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
    const cartProductPrice = product.querySelector('.item-product__price').innerHTML;
    const cartProductDescr = product.querySelector('.item-product__descr').innerHTML;
    const cardModal = document.querySelector('.card-modal');
    console.log(cartProductTitle);

    const cardModalTemp = `<div class="modal__content card-modal__content">
    <div class="card-modal__img">${cartProductImage}</div>
    <div class="card-modal__info">
        <h3 class="card-modal__title">${cartProductTitle}</h3>
        <span class="card-modal__price">${cartProductPrice}</span>
        <div class="card-modal__box">
            <p class="card-modal__descr">${cartProductDescr}</p>
        </div>
    </div>
    </div>`;
    document.querySelector('.card-modal__content').remove();
    cardModal.insertAdjacentHTML('beforeend', cardModalTemp);
}

function updateCart(productBtn, productId, productAdd = true) {
    const cart = document.querySelector('.cart-header');
    const cartBody = document.querySelector('.cart-header__body')
    const cartIcon = cart.querySelector('.cart-header__icon');
    const cartQuantity = cartIcon.querySelector('span');
    const cartProduct = document.querySelector(`[data-cart-id="${productId}"]`);
    const cartList = document.querySelector('.cart-list');
    
    if (productAdd) {
        if (cartQuantity) {
            cartQuantity.innerHTML = ++cartQuantity.innerHTML;
        } else {
            cartIcon.insertAdjacentHTML('beforeend', `<span>1</span>`)
        }

        if (!cartProduct) {
            const product = document.querySelector(`[data-id="${productId}"]`);
            const cartProductImage = product.querySelector('.item-product__img').innerHTML;
            const cartProductTitle = product.querySelector('.item-product__title').innerHTML;
            const cartProductPrice = product.querySelector('.item-product__price').innerHTML;

            // let obj = {};
            // obj.title = cartProductTitle;
            // obj.price = cartProductPrice;
            // productsArray.push(obj);
            // console.log(productsArray);

            const cartProductContent = `
                <div class="cart-list__image ibg">${cartProductImage}</div>
                <div class="cart-list__body">
                    <div class="cart-list__title">${cartProductTitle}</div>
                    <div class="cart-list__price">Цена за шт: ${cartProductPrice}</div>
                    <div class="cart-list__quantity">Кол-во: <span>1</span></div>
                    <a href="" class="cart-list__delete">Удалить</a>
            `;
            cartList.insertAdjacentHTML('beforeend', `<li data-cart-id="${productId}" class="cart-list__item">${cartProductContent}</li>`);
        } else {
            const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
            cartProductQuantity.innerHTML = ++cartProductQuantity.innerHTML;
        }
        
        getFullPrice();
        productBtn.classList.remove('hold');
    } else {
        const cartProductQuantity = cartProduct.querySelector('.cart-list__quantity span');
        cartProductQuantity.innerHTML = --cartProductQuantity.innerHTML;

        if (!parseInt(cartProductQuantity.innerHTML)) {
            cartProduct.remove();
            
            updateStorage();
        }

        const cartQuantityValue = --cartQuantity.innerHTML;
        console.log(cartQuantityValue)
        if (cartQuantityValue) {
            cartQuantity.innerHTML = cartQuantityValue;
            
        } else {
            
            cartBody.classList.remove('cart-header__body--active');
            
        }
        
        getFullPrice();
    }
    updateStorage();
}

function getOrder() {
    productsArray.length = 0;
    const cartList = document.querySelector('.cart-header__list');
    const cartListItems = cartList.querySelectorAll('.cart-list__item');
    // console.log(cartListItems);
    
    cartListItems.forEach(el => {
        const targetTitle = el.querySelector('.cart-list__title').innerHTML;
        const targerQuantity = el.querySelector('.cart-list__quantity span').innerHTML;
        const targetPrice = el.querySelector('.cart-list__price').innerHTML;
        const normalPrice = targetPrice.replace('Цена за шт: ', '').replace(/\s/g, '').replace('руб', '').replace('.','').replace('.','').replace('.','');
        const targetFullPrice = targerQuantity * normalPrice;
        console.log(normalPrice);
        
        let obj = {};
        obj.title = targetTitle;
        obj.quantity = targerQuantity;
        obj.price = targetPrice;
        obj.fullPrice = targetFullPrice;
        productsArray.push(obj);
    });
    console.log(productsArray);
}

function getFullPrice() {
    const cartList = document.querySelector('.cart-header__list');
    const cartListItems = cartList.querySelectorAll('.cart-list__item');

    fullPrice = 0;
    cartListItems.forEach(el => {
        const targetPrice = el.querySelector('.cart-list__price').innerHTML;
        const targerQuantity = el.querySelector('.cart-list__quantity span').innerHTML;
        const normalPrice = targetPrice.replace('Цена за шт: ', '').replace(/\s/g, '').replace('руб.', '').replace('.','').replace('.','');
        console.log(normalPrice);
        const targetFullPrice = targerQuantity * normalPrice;
        fullPrice = fullPrice + targetFullPrice;
        console.log(fullPrice);
    });


    const cartBody = document.querySelector('.cart-header__body');
    const tempPrice = `
    <div class="cart-header__full-price">Сумма заказа: <span>${fullPrice} руб</span></div>
    `;
    document.querySelector('.cart-header__full-price').remove();
    cartBody.insertAdjacentHTML('beforeend',tempPrice);
}

const modal = new GraphModal({
    isOpen: (modal) => {
        console.log('open');
    },
    isClose: (modal) => {
        console.log('close');
    }
});


function showPrice() {
    const orderTop = document.querySelector('.order-modal__top');
    const tempSpan = `<div class="order-modal__full-price">Общая сумма заказа: <span>${fullPrice} руб.</span></div>`;
    document.querySelector('.order-modal__full-price').remove();
    orderTop.insertAdjacentHTML('beforeend', tempSpan);
};

function clearCart() {
    const items = document.querySelectorAll('.cart-list__item');
    const quantitySpan = document.querySelector('.cart-header__icon span');
    items.forEach(el => {
        el.remove();
    });
    quantitySpan.innerHTML = '0';
    updateStorage();
    
}


function pushOrder(button) {
        const  TOKEN = "6668168914:AAFG9NKZDC3yUIe3eorTW8mo1PmgyThLU_4";
        const CHAT_ID = "-1001928711471";
        const URI_API = `https://api.telegram.org/bot${ TOKEN }/sendMessage`;

        

        document.getElementById('tg').addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("!!!!!");

            let message = `<b>Заявка с сайта</b>\n`;
            message += `<b>Отправитель: </b> ${ this.name.value}\n`;
            message += `<b>Номер телефона: </b> ${ this.phone.value}\n`;
            message += `<b>Текущий заказ: </b> ${ JSON.stringify(productsArray).replace(/title/g,'название').replace(/,/g, '\n').replace(/quantity/g,'кол-во')}`;
            console.log(message);

            if (!button.classList.contains('hold')) {
                button.classList.add('hold');
                axios.post(URI_API, {
                    chat_id: CHAT_ID,
                    parse_mode: 'html',
                    text: message
                })

                .then((res) => {
                    this.name.value = "";
                    this.phone.value = "";
                    this.email.value = "";
                })
                .catch((err) => {
                    console.warn(err);
                })
                .finally(() => {
                    
                    console.log("end");
                    clearCart();
                    
                    button.classList.remove('hold');
                    alert("Заказ отправлен!");
                })
        };
        })
}


const input = document.getElementById("searchInput");
input.addEventListener("input", () => {
    document.querySelector('.sub-category__selected').innerHTML = 'Все';
    document.querySelector('.category__selected').innerHTML = 'Все';
    document.querySelector('.category__dropdown').classList.remove('category__dropdown--active');
    currentPage = 1;
    loadProducts(productsList);
    checkItemsList();
});

const initState = () => {
    if (localStorage.getItem('products') != null) {
        document.querySelector('.cart-list').innerHTML = localStorage.getItem('products');
        document.querySelector('.cart-icon span').innerHTML = localStorage.getItem('quantity');
    }           
}

initState();

const updateStorage = () => {
    let parent = document.querySelector('.cart-list');
    let html = parent.innerHTML;
    html = html.trim();
    console.log(html);
    console.log(html.length);

    let quantity = document.querySelector('.cart-icon span').innerHTML;
    localStorage.setItem('quantity', quantity);
    console.log(quantity);
    if (html.length) {
        localStorage.setItem('products', html);
        
    } else {
        localStorage.removeItem('products');
        
    }
}

function availabilityCheck() {
    const productsBox = document.querySelectorAll('.item-product');
    productsBox.forEach(el => {
        const prouductAv = el.querySelector('.item-product__availability');
        console.log(prouductAv);
        const productButton = el.querySelector('.actions-product__button');
        const point = el.querySelector('.item-product__point');

        if (prouductAv.innerHTML.toUpperCase() == 'Нет в наличии'.toUpperCase()) {
            productButton.classList.add('hold');
            point.classList.add('not-available');
        }
    })
}

function checkActivePagination() {
    const pagBtns = document.querySelectorAll('.pagination__btn');
    console.log(pagBtns);

    pagBtns.forEach(el => {
        if (el.innerHTML == currentPage) {
            console.log(el.innerHTML);
            el.classList.add('pagination__btn--active');
        }
    });
}

function checkItemsList() {
    if (document.querySelector('.products__items').innerHTML == '') {
        const empty = `<div class="catalog__empty">
        <img class="empty__img" src="img/logo.png" alt="Логотип сайта">
        <span>К сожалению, <br> по вашему запросу ничего не найдено :(</span>
        </div>`;
        document.querySelector('.products__items').insertAdjacentHTML("beforeend", empty);
    }
}