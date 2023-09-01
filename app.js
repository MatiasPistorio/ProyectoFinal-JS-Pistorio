const cart = []; // Array para almacenar productos en el carrito

document.addEventListener('DOMContentLoaded', () => {
  const cartList = document.getElementById('cart');
  const productList = document.getElementById('product-list');
  const checkoutButton = document.getElementById('checkout');
  const purchaseInfo = document.getElementById('purchase-info');
  const purchaseDetailsElement = document.getElementById('purchase-details');
  const cartSummaryElement = document.getElementById('cart-summary');

  let totalQuantity = 0;
  let totalPrice = 0;

  loadProducts();
  loadCart();

  function loadProducts() {
    fetch('productos.json')
      .then(response => response.json())
      .then(products => {
        displayProducts(products);
      })
      .catch(error => console.error('Error al cargar productos:', error));
  }

  function displayProducts(products) {
    products.forEach(product => {
      const productItem = document.createElement('li');
      productItem.innerHTML = `
        <div>
          <img src="${product.image}" alt="${product.name}" width="50">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <p>$${product.price}</p>
          <button class="add-to-cart">Agregar al Carrito</button>
        </div>
      `;
      productItem.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product));
      productList.appendChild(productItem);
    });
  }

  function addToCart(product) {
    cart.push(product);
    totalQuantity += 1;
    totalPrice += product.price;
    updateCartUI();
    saveCart(); // Guardar el carrito en el "localStorage" después de agregar un producto
  }

  function removeFromCart(index) {
    const product = cart[index];
    cart.splice(index, 1);
    totalQuantity -= 1;
    totalPrice -= product.price;
    updateCartUI();
    saveCart(); // Guardar el carrito en el "localStorage" después de eliminar un producto
  }

  function updateCartUI() {
    cartList.innerHTML = '';

    cart.forEach((product, index) => {
      const cartItem = document.createElement('li');
      cartItem.textContent = `${product.name} - $${product.price}`;
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Eliminar';
      removeButton.addEventListener('click', () => removeFromCart(index));
      cartItem.appendChild(removeButton);
      cartList.appendChild(cartItem);
    });

    // Actualizar el resumen del carrito
    cartSummaryElement.textContent = `Cantidad de productos: ${totalQuantity}, Total a pagar: $${totalPrice.toFixed(2)}`;
  }

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function loadCart() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      cart.length = 0; // Vacía el carrito existente
      cart.push(...JSON.parse(storedCart)); // Agrega los productos cargados desde localStorage
      totalQuantity = cart.length;
      totalPrice = cart.reduce((total, product) => total + product.price, 0);
      updateCartUI();
    }
  }

  function checkout() {
    if (cart.length === 0) {
      alert('El carrito está vacío. Agrega productos antes de finalizar la compra.');
      return;
    }

    const purchaseDetails = cart.map(product => `${product.name} - $${product.price}`).join('<br>');
    purchaseDetailsElement.innerHTML = purchaseDetails;

    purchaseInfo.style.display = 'block';

    // Simular una solicitud AJAX para procesar la compra
    // Puedes enviar el carrito al servidor para el procesamiento y recibir una respuesta

    // Luego de un exitoso proceso, guardar el carrito en localStorage antes de limpiarlo
    saveCart();

    // Limpiar el carrito y actualizar la interfaz
    cart.length = 0;
    totalQuantity = 0;
    totalPrice = 0;
    updateCartUI();
  }

  checkoutButton.addEventListener('click', checkout);
});
