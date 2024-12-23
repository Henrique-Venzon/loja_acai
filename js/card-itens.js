const cartContainer = document.getElementById('cartContainer');
const cartCountElement = document.getElementById('cartCount');

// Função para salvar o carrinho no localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Função para carregar o carrinho
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        cartCountElement.textContent = 0;
        cartCountElement.style.display = 'none'; // Esconde o contador se o carrinho estiver vazio
        return;
    }

    let cartHTML = '';
    let total = 0;
    let totalCount = 0; // Variável para contar a quantidade total de itens

    cart.forEach((item, index) => {
        const adicionais = item.adicionais?.map(a => `${a.name} (+R$ ${a.price.toFixed(2)})`).join(', ') || 'Nenhum';
        cartHTML += `
            <div class="cart-item">
                <strong>${item.name}</strong> - R$ ${item.price.toFixed(2)}
                <br>Adicionais: ${adicionais}
                <div class="quantity-controls">
                    <button class="btn-minus" data-index="${index}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="btn-plus" data-index="${index}">+</button>
                </div>
            </div>
        `;
        total += item.price * item.quantity; // Calcula o total baseado na quantidade
        totalCount += item.quantity; // Soma a quantidade de itens
    });

    cartHTML += `
        <div class="cart-total">Total: R$ ${total.toFixed(2)}</div>
        <div class="actions">
            <button class="btn" id="clearCart">Limpar Carrinho</button>
            <a href="https://wa.me/?text=Meu pedido:..." class="btn">Finalizar no WhatsApp</a>
        </div>
    `;
    cartContainer.innerHTML = cartHTML;

    // Atualiza o contador de itens no cabeçalho
    cartCountElement.textContent = totalCount;
    cartCountElement.style.display = 'inline'; // Exibe o contador se houver itens

    // Adiciona eventos para os botões de mais e menos
    document.querySelectorAll('.btn-plus').forEach(button => {
        button.addEventListener('click', function() {
            const index = button.getAttribute('data-index');
            updateItemQuantity(index, 1); // Incrementa a quantidade
        });
    });

    document.querySelectorAll('.btn-minus').forEach(button => {
        button.addEventListener('click', function() {
            const index = button.getAttribute('data-index');
            updateItemQuantity(index, -1); // Decrementa a quantidade
        });
    });

    // Evento para limpar o carrinho
    document.getElementById('clearCart').addEventListener('click', () => {
        localStorage.removeItem('cart');
        loadCart();
    });
}

// Função para atualizar a quantidade do item
function updateItemQuantity(index, delta) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Atualiza a quantidade do item
    const item = cart[index];
    item.quantity += delta;

    // Se a quantidade for 0 ou negativa, remove o item do carrinho
    if (item.quantity <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index] = item;
    }

    // Salva o carrinho atualizado
    saveCart(cart);

    // Recarrega o carrinho
    loadCart();
}

document.addEventListener('DOMContentLoaded', loadCart);
