document.addEventListener('click', documentActions);
const btnMore = document.querySelector('.products__more');
const btnsAddToCart = document.querySelectorAll('.actions-product__button');

let productsArray = [];
let fullPrice = 0;

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

    if (targetElement.classList.contains('cart-header__order')) {
        getOrder(targetElement);
        console.log('order');
    }
}

async function getProducts(button) {
    if (!button.classList.contains('hold')) {
        button.classList.add('hold');
        const file = "/json/products.json";
        let response = await fetch(file, {
            method: "GET"
        });
        if (response.ok) {
            let result = await response.json();
            loadProducts(result);
            button.classList.remove('hold');
            button.remove();
        } else {
            alert("Ошибка");
        }
    }
}

function loadProducts(data) {
    const productsItems = document.querySelector('.products__items');

    data.products.forEach(item => {
        const productId = item.id;
        const productTitle = item.title;
        const productImage = item.image;
        const productPrice = item.price;
        const productDescr = item.descr;

        let template = `<article data-id="${productId}" class="products__item item-product">
        <div class="item-product__img">
            <img class="item-product__image" src="img/${productImage}" alt="">
        </div>
        <div class="item-product__body">
            <div class="item-product__content">
                <h5 class="item-product__title">${productTitle}</h5>
                <button class="item-product__details">подробнее</button>
            </div>
            <div class="item-product__price">${productPrice} руб.</div>
            <div class="item-product__actions actions-product">
                <button class="btn actions-product__button">В корзину</button>
            </div>
        </div>
    </article>`;

    productsItems.insertAdjacentHTML('beforeend', template);
    });
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
                <a href="" class="cart-list__image ibg">${cartProductImage}</a>
                <div class="cart-list__body">
                    <a href="" class="cart-list__title">${cartProductTitle}</a>
                    <a href="" class="cart-list__price">${cartProductPrice}</a>
                    <div class="cart-list__quantity">Quantity: <span>1</span></div>
                    <a href="" class="cart-list__delete">Delete</a>
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
        }

        const cartQuantityValue = --cartQuantity.innerHTML;

        if (cartQuantityValue) {
            cartQuantity.innerHTML = cartQuantityValue;
        } else {
            cartQuantity.remove();
            cartBody.classList.remove('cart-header__body--active')
        }
        getFullPrice();
    }
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
        const normalPrice = targetPrice.replace(/\s/g, '').replace('руб', '').replace('.','').replace('.','').replace('.','');
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
        const normalPrice = targetPrice.replace(/\s/g, '').replace('руб.', '').replace('.','').replace('.','');
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