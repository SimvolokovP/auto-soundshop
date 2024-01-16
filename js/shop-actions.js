document.addEventListener('click', documentActions);
const btnMore = document.querySelector('.products__more');
const btnsAddToCart = document.querySelectorAll('.actions-product__button');

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
        const productCategory = item.category;
        
        let template = `<article data-id="${productId}" class="products__item item-product">
        <div class="item-product__img">
            <img class="item-product__image" src="img/products/${productImage}" alt="">
        </div>
        <div class="item-product__body">
            <div class="item-product__content">
                <h5 class="item-product__title">${productTitle}</h5>
                <button class="item-product__details" data-graph-path="cardModal" data-graph-animation="fadeInUp" data-graph-speed="700">подробнее</button>
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
    console.log(titlesArray);
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

    quantitySpan.remove();
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
            message += `<b>Текущий заказ: </b> ${ JSON.stringify(productsArray)}`;
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



function filterProduct(value) {
    //Button class code
    let buttons = document.querySelectorAll(".button-value");
    buttons.forEach((button) => {
      //check if value equals innerText
      if (value.toUpperCase() == button.innerText.toUpperCase()) {
        button.classList.add("button-value--active");
      } else {
        button.classList.remove("button-value--active");
      }
    });

    value.toLowerCase();
  
    //select all cards
    let elements = document.querySelectorAll(".products__item");
    //loop through all cards
    elements.forEach((element) => {
        let category = element.querySelector('.item-product__category').innerHTML.toLowerCase();;
      //display all cards on 'all' button click
      if (value == "Все") {
        element.classList.remove("products__item--hide");
      } else {
        //Check if element contains category class
        if (value.toLowerCase() == category) {
          //display element based on category
          element.classList.remove("products__item--hide");
        } else {
          //hide other elements
          element.classList.add("products__item--hide");
        }
      }
    });

    const searchInp = document.querySelector('.search-input');

    searchInp.value = '';
}

// document.getElementById("search").addEventListener("click", () => {
    
//     let searchInput = document.getElementById("search-input").value.replace(' ', '');
//     let elements = document.querySelectorAll(".item-product__title");
//     let cards = document.querySelectorAll(".products__item");
//     const categoryBtns = document.querySelectorAll('.button-value');

//     categoryBtns.forEach(el => {
//         el.classList.remove("button-value--active");
//     })
    
//     elements.forEach((element, index) => {
//         let elementText = element.innerText.toUpperCase();
//       //check if text includes the search value
//       if (elementText.includes(searchInput.toUpperCase())) {
//         //display matching card
//         cards[index].classList.remove("products__item--hide");
//       } else {
//         //hide others
//         cards[index].classList.add("products__item--hide");
//       }
//     });
// });


document.querySelector('.search-input').addEventListener('input', (e) => {
    const list = document.querySelector('.products__items');
    const items = list.querySelectorAll('.item-product');
    let value = document.querySelector('.search-input').value;
    const btns = document.querySelectorAll('.button-value');

    btns.forEach(btn => {
        btn.classList.remove('button-value--active');
    })

    items.forEach(el => {
        el.classList.add('products__item--hide');

        const itemTitle = el.querySelector('.item-product__title').innerHTML;

        let filterArray = titlesArray;
        for (let i = 0; i < filterArray.length; i++) {
            if (itemTitle.toLowerCase().includes(value.toLowerCase())) {
                el.classList.remove('products__item--hide');
            }
        }
    });
    


    // let filteredArray = serverArray;
    // const inputValue = e.currentTarget.value.toLowerCase();
    // for (let i = 0; i < serverArray.length; i++) {
    //   if(serverArray[i].toLowerCase().startsWith(inputValue)) {
    //     filteredArray = serverArray.filter(el => el === serverArray[i]);
    //     updateList(filteredArray)
    //   }
    // }
  
    
  });