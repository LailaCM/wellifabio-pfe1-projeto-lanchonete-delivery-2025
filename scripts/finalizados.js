const tbody = document.getElementById('finalizados');
const totalValorSpan = document.getElementById('totalValor');

const pedidosFinalizados = JSON.parse(localStorage.getItem('finalizados')) || [];

function exibirPedidosFinalizados() {
    tbody.innerHTML = ''; 
    let totalValor = 0; 

    pedidosFinalizados.forEach((pedido, index) => {
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
    if (confirm('Tem certeza que deseja deletar este pedido finalizado?')) {
        pedidosFinalizados.splice(index, 1);
        window.localStorage.setItem('finalizados', JSON.stringify(pedidosFinalizados));
        exibirPedidosFinalizados();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('table');
    const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());

    table.querySelectorAll('tbody tr').forEach(row => {
        row.querySelectorAll('td').forEach((td, index) => {
            td.setAttribute('data-label', headers[index]);
        });
    });
});



exibirPedidosFinalizados();