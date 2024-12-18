// acai-500.js

document.addEventListener('DOMContentLoaded', function () {
    const basePrice = 20;
    const totalPriceElement = document.getElementById('totalPrice');
    const adicionais = document.querySelectorAll('input[name="adicional"]');
    const addToCartButton = document.getElementById('addToCart');

    // Função para recalcular o preço total
    function recalculatePrice() {
        let total = basePrice;
        adicionais.forEach(item => {
            if (item.checked) {
                const [, price] = item.value.split('|');
                total += parseFloat(price);
            }
        });
        totalPriceElement.textContent = `Total: R$ ${total.toFixed(2)}`;
    }

    // Atualiza o preço ao selecionar adicionais
    adicionais.forEach(adicional => {
        adicional.addEventListener('change', recalculatePrice);
    });

    // Adiciona o produto ao carrinho
    addToCartButton.addEventListener('click', function () {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Coleta os adicionais selecionados
        const adicionaisSelecionados = Array.from(adicionais)
            .filter(adicional => adicional.checked)
            .map(adicional => {
                const [name, price] = adicional.value.split('|');
                return { name, price: parseFloat(price) };
            });

        // Verifica se o produto já existe no carrinho
        const produtoExistente = cart.find(item => item.name === "Açaí 500ml" && 
            JSON.stringify(item.adicionais) === JSON.stringify(adicionaisSelecionados));

        if (produtoExistente) {
            // Incrementa a quantidade do produto existente
            produtoExistente.quantity += 1;
        } else {
            // Calcula o preço total
            const totalPrice = parseFloat(totalPriceElement.textContent.split(': R$ ')[1]);

            // Cria o produto
            const produto = {
                name: "Açaí 500ml",
                adicionais: adicionaisSelecionados,
                price: totalPrice,
                quantity: 1  // Inicializa a quantidade como 1
            };

            // Adiciona o produto ao carrinho
            cart.push(produto);
        }

        // Salva o carrinho atualizado no localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Atualiza o contador de itens no carrinho
        window.updateCartCount();

        // Aplica a animação no contador
        window.animateCartCount();
    });

    // Inicializa o preço
    recalculatePrice();
});
