// contador.js

document.addEventListener('DOMContentLoaded', function () {
    const cartCountElement = document.getElementById('cartCount');

    // Função para atualizar o contador do carrinho
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let cartCount = 0;

        // Somando a quantidade total de itens no carrinho
        cart.forEach(item => {
            cartCount += item.quantity;  // Soma a quantidade de cada item
        });

        // Atualiza o contador
        cartCountElement.textContent = cartCount;

        if (cartCount > 0) {
            cartCountElement.style.display = 'flex'; // Exibe o contador
        } else {
            cartCountElement.style.display = 'none'; // Oculta o contador
        }
    }

    // Função para aplicar a animação no contador
    function animateCartCount() {
        cartCountElement.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCountElement.style.transform = 'scale(1)';
        }, 300); // 300ms é a duração da animação
    }

    // Expor as funções para atualizar o contador de itens
    window.updateCartCount = updateCartCount;
    window.animateCartCount = animateCartCount;

    // Inicializa o contador de itens
    updateCartCount();
});
