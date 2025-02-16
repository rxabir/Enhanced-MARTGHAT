let cart = [];
let totalPrice = 0;
let appliedPromo = null;

fetch('https://dummyjson.com/products')
    .then(response => response.json())
    .then(data => {
        data.products.forEach(product => {
            const cardHTML = `
                <div class="col-6 col-md-4 col-lg-3 col-xl-2 d-flex">  
                    <div class="card shadow-sm h-100 w-100">
                        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}" style="height: 180px; object-fit: contain;">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-center">${product.title}</h5>
                            <p class="card-text fs-6">${product.description}</p>
                            <div class="mt-auto">
                               <div class="d-flex justify-content-between mb-2">
                                  <p><strong>Price:</strong> $${product.price}</p>
                                  <p><strong>Rating:</strong> ${product.rating}</p>
                               </div>
                            </div>
                            <button class="btn btn-warning mt-2 w-100" onclick="addToCart(${product.id}, '${product.thumbnail}', '${product.title}', ${product.price})">
                                <i class="fa-solid fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.querySelector('.row').insertAdjacentHTML('beforeend', cardHTML);
        });
    })
    .catch(error => console.error('Error fetching data:', error));

function addToCart(id, thumbnail, title, price) {
    const productInCart = cart.find(item => item.id === id);
    if (productInCart) {
        productInCart.quantity++;
    } else {
        cart.push({ id, thumbnail, title, price, quantity: 1 });
    }
    updateCartButton();
    updateOffcanvas();
}

function updateCartButton() {
    const cartButton = document.querySelector('.btn-cart');
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    cartButton.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> ${totalItems}`;
}

function updateOffcanvas() {
    const offcanvasBody = document.querySelector('.offcanvas-body');
    offcanvasBody.innerHTML = '';

    cart.forEach(item => {
        offcanvasBody.insertAdjacentHTML('beforeend', `
            <div class="cart-item d-flex align-items-center w-100 p-2">
                <img src="${item.thumbnail}" alt="${item.title}" style="width: 60px; margin-right: 10px;">
                <div class="flex-grow-1">
                    <div>${item.title} - $${item.price}</div>
                    <div class="d-flex align-items-center justify-content-between mt-2">
                        <div class="d-flex align-items-center">
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="btn btn-sm btn-danger" onclick="removeItem(${item.id})">
                            <i class="fa-solid fa-x"></i>
                        </button>
                    </div>
                </div>
            </div>
            <hr>
        `);
    });

    totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let discount = applyDiscount(totalPrice);
    let finalTotal = totalPrice - discount;

    if (cart.length > 0) {
        offcanvasBody.insertAdjacentHTML('beforeend', `
            <div class="mb-2 d-flex">
                <input type="text" id="promoCode" class="form-control me-2" placeholder="Enter promo code">
                <button class="btn btn-sm btn-primary" onclick="applyPromoCode()">Apply</button>
            </div>
            <p id="promoMessage" class="text-danger mt-1"></p>
            <div class="d-flex justify-content-between">
                <strong>Subtotal:</strong> <span>$${totalPrice.toFixed(2)}</span>
            </div>
            <div class="d-flex justify-content-between text-success">
                <strong>Discount:</strong> <span>-$${discount.toFixed(2)}</span>
            </div>
            <div class="d-flex justify-content-between">
                <strong>Total:</strong> <span>$${finalTotal.toFixed(2)}</span>
            </div>
            <div class="d-flex justify-content-between mt-2">
                <button class="btn btn-warning w-50" onclick="checkout()">Checkout</button>
                <button class="btn btn-secondary w-50 ms-2" onclick="cancelOrder()">Cancel Order</button>
            </div>
        `);
    }
    updateCartButton();
}

function applyPromoCode() {
    const promoInput = document.getElementById("promoCode").value.trim().toLowerCase();
    const promoMessage = document.getElementById("promoMessage");
    if (promoInput === "ostad10" || promoInput === "ostad5") {
        if (appliedPromo) {
            promoMessage.textContent = "Promo code already applied.";
        } else {
            appliedPromo = promoInput;
            promoMessage.textContent = "Promo code applied successfully!";
            updateOffcanvas();
        }
    } else {
        promoMessage.textContent = "Invalid promo code.";
    }
}

function applyDiscount(total) {
    return appliedPromo === "ostad10" ? total * 0.10 : appliedPromo === "ostad5" ? total * 0.05 : 0;
}

function updateQuantity(id, delta) {
    const productInCart = cart.find(item => item.id === id);
    if (productInCart) {
        productInCart.quantity = Math.max(1, productInCart.quantity + delta);
    }
    updateOffcanvas();
}

function removeItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateOffcanvas();
}

function checkout() {
    alert(`Thank you for your purchase! Total: $${(totalPrice - applyDiscount(totalPrice)).toFixed(2)}`);
    cart = [];
    appliedPromo = null;
    updateOffcanvas();
}

function cancelOrder() {
    cart = [];
    appliedPromo = null;
    updateOffcanvas();
}
