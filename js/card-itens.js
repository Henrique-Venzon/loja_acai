//arquivo para salvar o js do carrinho
// Função para obter a saudação com base no horário do dia
function getGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour >= 6 && currentHour < 12) {
        return "Bom dia!";
    } else if (currentHour >= 12 && currentHour < 18) {
        return "Boa tarde!";
    } else {
        return "Boa noite!";
    }
}

// Função para gerar a mensagem personalizada com os itens do carrinho
function generateMessage() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let message = `${getGreeting()}\n\nQuero realizar um pedido, aqui está:\n`;

    cart.forEach(item => {
        const adicionais = item.adicionais?.map(a => `${a.name} (+R$ ${item.price.toFixed(2).replace('.', ',')})`).join(', ') || 'Nenhum';
        message += `\n- ${item.name} (R$ ${item.price.toFixed(2).replace('.', ',')})\n  Adicionais: ${adicionais}\n  Quantidade: ${item.quantity}`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n\nTotal: R$ ${total.toFixed(2).replace('.', ',')}\n\nAguardo a confirmação do meu pedido!`;

    return encodeURIComponent(message); // Codifica a mensagem para ser usada na URL do WhatsApp
}

// Função para salvar o carrinho no localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Função para carregar o carrinho
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cartContainer');
    const cartCountElement = document.getElementById('cartCount');

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="span-container"><p>Seu carrinho está vazio.</p></div>';
        cartCountElement.textContent = 0;
        cartCountElement.style.display = 'none'; // Esconde o contador se o carrinho estiver vazio
        return;
    }

    let cartHTML = `
        <div class="titulo-carrinho">
            <p>CARRINHO</p>
        </div>
    `; 
    let total = 0;
    let totalCount = 0;

    cart.forEach((item, index) => {
        const adicionais = item.adicionais?.map(a => `${a.name} (+R$ ${a.price.toFixed(2).replace('.', ',')})`).join(', ') || 'Nenhum';
        cartHTML += `
            <div class="cart-item">
                <div class="alinhar-desc">
                    <strong>${item.name}</strong> <p style="margin-left:5px;">- R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                </div>
                <p class="adicionais">Adicionais: ${adicionais}</p>
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
        <div class="cart-total">
            <p><strong>Total:</strong> R$ ${total.toFixed(2).replace('.', ',')}</p>
        </div>
        <div class="actions">
            <button class="btn" id="clearCart">
                <ion-icon name="trash-bin-outline"></ion-icon>
            </button>
            <a href="https://wa.me/5547997334286?text=${generateMessage()}" target="_blank" class="btn-finalizar">
                FINALIZAR
            </a>
        </div>
    `;

    cartContainer.innerHTML = cartHTML;

    // Atualiza o contador de itens no cabeçalho
    cartCountElement.textContent = totalCount;
    cartCountElement.style.display = 'inline';

    // Eventos para botões de quantidade
    document.querySelectorAll('.btn-plus').forEach(button => {
        button.addEventListener('click', function () {
            const index = button.getAttribute('data-index');
            updateItemQuantity(index, 1); // Incrementa a quantidade
        });
    });

    document.querySelectorAll('.btn-minus').forEach(button => {
        button.addEventListener('click', function () {
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


// Função para atualizar a quantidade de itens no carrinho
function updateItemQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index]) {
        cart[index].quantity += change;

        // Remove o item do carrinho se a quantidade for zero ou menor
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        loadCart(); // Recarrega o carrinho para refletir as mudanças
    }
}

// Função para gerar a mensagem do WhatsApp para o pedido
function generateMessage() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return 'Seu carrinho está vazio.';

    let message = 'Olá, gostaria de fazer o seguinte pedido:\n\n';  // Quebra de linha simples para o WhatsApp
    let total = 0;

    cart.forEach(item => {
        const adicionais = item.adicionais?.map(a => `${a.name} (+R$ ${a.price.toFixed(2).replace('.', ',')})`).join(', ') || 'Nenhum';
        message += `- ${item.name} (x${item.quantity}): R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n   Adicionais: ${adicionais}\n`;
        total += item.price * item.quantity;
    });

    message += `\nTotal: R$ ${total.toFixed(2).replace('.', ',')}`;
    return encodeURIComponent(message);  // Agora a mensagem está formatada corretamente com quebras de linha
}


// Inicializa o carregamento do carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});
