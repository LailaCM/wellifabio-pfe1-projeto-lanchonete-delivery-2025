let pedidos = JSON.parse(window.localStorage.getItem('pedidos'));
if (!pedidos) {
    window.localStorage.setItem('pedidos', JSON.stringify([]));
    pedidos = [];
}

let pedidosConcluidos = JSON.parse(window.localStorage.getItem('finalizados'));
if (!pedidosConcluidos) {
    window.localStorage.setItem('finalizados', JSON.stringify([]));
    pedidosConcluidos = [];
}

const orderForm = document.getElementById('orderForm');
const orderList = document.getElementById('orderList');
const deliveryList = document.getElementById('deliveryList');
const toggleCompleted = document.getElementById('toggleCompleted');
const deliverySection = document.getElementById('deliverySection');
const tbody = document.getElementById('finalizados');
const totalValorSpan = document.getElementById('totalValor');

const produtos = [
    { id: 1, nome: "Hamburguer", preco: 15.00 },
    { id: 2, nome: "X-Burguer", preco: 0 }, // Não tem preço no JSON original
    { id: 3, nome: "X-Salada", preco: 20.00 },
    { id: 4, nome: "X-Bacon", preco: 25.00 },
    { id: 5, nome: "X-Egg", preco: 30.00 },
    { id: 6, nome: "X-Tudo", preco: 35.00 }
];

function formatarDataHora(dataHora) {
    const data = dataHora.toLocaleDateString('pt-BR');
    const hora = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    return { data, hora };
}

function exibirPedidos() {
    orderList.innerHTML = '';
    pedidos.forEach((pedido, index) => {
        if (pedido.status === 'execucao') {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${pedido.cliente}</strong> - ${pedido.produto} (R$ ${pedido.preco?.toFixed(2) || '0.00'})<br>
                    <small>${pedido.endereco}</small><br>
                    <small>Data do Pedido: ${pedido.dataPedido}</small><br>
                    <small>Hora do Pedido: ${pedido.horaPedido}</small>
                </div>
                <button class="btn-finalizar" onclick="enviarPedido(${index})">Enviar</button>
            `;
            orderList.appendChild(li);
        }
    });
}

function enviarPedido(index) {
    if (confirm('Tem certeza que deseja enviar este pedido?')) {
        const { data, hora } = formatarDataHora(new Date());
        pedidos[index].status = 'a_caminho';
        pedidos[index].dataSaida = data;
        pedidos[index].horaSaida = hora;
        window.localStorage.setItem('pedidos', JSON.stringify(pedidos));
        exibirPedidos();
        exibirPedidosACaminho();
    }
}

function exibirPedidosACaminho() {
    deliveryList.innerHTML = '';
    pedidos.forEach((pedido, index) => {
        if (pedido.status === 'a_caminho') {
            const li = document.createElement('li');
            li.innerHTML = `
                <div>
                    <strong>${pedido.cliente}</strong> - ${pedido.produto} (R$ ${pedido.preco?.toFixed(2) || '0.00'})<br>
                    <small>${pedido.endereco}</small><br>
                    <small>Data do Pedido: ${pedido.dataPedido}</small><br>
                    <small>Hora do Pedido: ${pedido.horaPedido}</small><br>
                    <small>Data Saída: ${pedido.dataSaida}</small><br>
                    <small>Hora Saída: ${pedido.horaSaida}</small>
                </div>
                <button class="btn-entrega" onclick="concluirEntrega(${index})">Entrega Concluída</button>
            `;
            deliveryList.appendChild(li);
        }
    });
}

function concluirEntrega(index) {
    if (confirm('Tem certeza que deseja concluir a entrega deste pedido?')) {
        const { data, hora } = formatarDataHora(new Date());
        pedidos[index].status = 'concluido';
        pedidos[index].dataEntrega = data;
        pedidos[index].horaEntrega = hora;
        pedidosConcluidos.push(pedidos[index]);
        window.localStorage.setItem('finalizados', JSON.stringify(pedidosConcluidos));
        pedidos.splice(index, 1);
        window.localStorage.setItem('pedidos', JSON.stringify(pedidos));
        exibirPedidosACaminho();
    }
}

orderForm.addEventListener('submit', e => {
    e.preventDefault();
    const { data, hora } = formatarDataHora(new Date());
    const produtoSelecionado = document.getElementById('product').value;
    const produtoInfo = produtos.find(prod => prod.nome === produtoSelecionado);

    const pedido = {
        id: pedidos.length + 1,
        cliente: document.getElementById('name').value.trim(),
        endereco: document.getElementById('endereco').value.trim(),
        produto: produtoInfo?.nome || produtoSelecionado,
        preco: produtoInfo?.preco || 0,
        dataPedido: data,
        horaPedido: hora,
        dataSaida: null,
        horaSaida: null,
        dataEntrega: null,
        horaEntrega: null,
        status: 'execucao'
    };
    pedidos.push(pedido);
    window.localStorage.setItem('pedidos', JSON.stringify(pedidos));
    orderForm.reset();
    exibirPedidos();
});

function exibirPedidosFinalizados() {
    tbody.innerHTML = '';
    let totalValor = 0;
    pedidosConcluidos.forEach((pedido, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${pedido.cliente}</td>
            <td>${pedido.endereco || 'Não informado'}</td>
            <td>${pedido.produto}</td>
            <td>R$ ${pedido.preco?.toFixed(2) || '0.00'}</td>
            <td>${pedido.dataPedido || 'Não informado'}</td>
            <td>${pedido.horaPedido || 'Não informado'}</td>
            <td>${pedido.dataSaida || 'Não informado'}</td>
            <td>${pedido.horaSaida || 'Não informado'}</td>
            <td>${pedido.dataEntrega || 'Não informado'}</td>
            <td>${pedido.horaEntrega || 'Não informado'}</td>
            <td>
                <button class="btn-deletar" onclick="deletarPedidoFinalizado(${index})">Deletar</button>
            </td>
        `;
        tbody.appendChild(tr);
        totalValor += pedido.preco || 0;
    });
    totalValorSpan.textContent = totalValor.toFixed(2);
}

function deletarPedidoFinalizado(index) {
    if (confirm('Deseja deletar este pedido finalizado?')) {
        pedidosConcluidos.splice(index, 1);
        window.localStorage.setItem('finalizados', JSON.stringify(pedidosConcluidos));
        exibirPedidosFinalizados();
    }
}

toggleCompleted.addEventListener('click', function () {
    if (deliverySection.style.display === 'none') {
        deliverySection.style.display = 'block';
        toggleCompleted.textContent = 'Ocultar A Caminho';
    } else {
        deliverySection.style.display = 'none';
        toggleCompleted.textContent = 'A Caminho';
    }
});

exibirPedidos();
exibirPedidosACaminho();
exibirPedidosFinalizados();
