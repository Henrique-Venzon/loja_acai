document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productName = this.dataset.name; // Nome do produto
            const productPrice = parseFloat(this.dataset.price); // Preço do produto

            // Recupera o carrinho do localStorage
            const cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Verifica se o produto já está no carrinho
            const existingProduct = cart.find(item => item.name === productName);

            if (existingProduct) {
                // Incrementa a quantidade do produto
                existingProduct.quantity += 1;
            } else {
                // Adiciona o novo produto ao carrinho
                cart.push({
                    name: productName,
                    price: productPrice,
                    quantity: 1,
                });
            }

            // Salva o carrinho atualizado no localStorage
            localStorage.setItem('cart', JSON.stringify(cart));

            // Atualiza o contador e aplica a animação
            updateCartCount();
            animateCartCount();
        });
    });
});
