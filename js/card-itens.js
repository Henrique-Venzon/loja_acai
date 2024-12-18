function loadCart() {
    const cartContainer = document.getElementById('cartContainer');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Seu carrinho está vazio.</p>';
        return;
    }

    let cartHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const adicionais = item.adicionais.map(a => `${a.name} (+R$ ${a.price.toFixed(2)})`).join(', ') || 'Nenhum';
        cartHTML += `
            <div class="cart-item" id="item-${index}">
                <strong>${item.name}</strong> - R$ ${item.price.toFixed(2)}
                <br>Adicionais: ${adicionais}
                <div class="quantity-controls">
                    <button class="decrease" onclick="changeQuantity(${index}, -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
            </div>
        `;
        total += item.price * item.quantity;
    });

    cartHTML += `<div class="cart-total">Total: R$ ${total.toFixed(2)}</div>`;
    cartHTML += `
        <div class="actions">
            <button class="btn" id="clearCart">Limpar Carrinho</button>
            <a href="https://wa.me/?text=Meu pedido:..." class="btn">Finalizar no WhatsApp</a>
        </div>
    `;
    cartContainer.innerHTML = cartHTML;

    document.getElementById('clearCart').addEventListener('click', clearCart);
}

function changeQuantity(index, delta) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart[index];
    item.quantity += delta;
    
    if (item.quantity <= 0) {
        cart.splice(index, 1); // Remove item do carrinho se a quantidade for 0
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); // Recarrega o carrinho

    // Atualiza o contador de itens no carrinho
    updateCartCount();
}

function clearCart() {
    localStorage.removeItem('cart');
    loadCart(); // Atualiza o carrinho após limpar
}

document.addEventListener('DOMContentLoaded', loadCart);
