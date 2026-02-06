document.addEventListener("DOMContentLoaded", function () {
  carregarPedidos();
  updatePedidoCount();


  function carregarPedidos() {
    const pedidosContainer = document.querySelector(".pedidos-container");
    pedidosContainer.innerHTML = "";
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    if (pedidos.length === 0) {
      pedidosContainer.innerHTML = "<p>Nenhum pedido foi feito ainda.</p>";
      return;
    }

    pedidos.forEach((pedido, index) => {
      const pedidoDiv = document.createElement("div");
      pedidoDiv.classList.add("pedido");
      pedidoDiv.setAttribute("data-index", index);

      pedidoDiv.innerHTML = `
        <button class="remove-pedido">X</button>
        <p>${pedido.nome} <span class="product-price">R$ ${pedido.preco}</span></p> 
        <div class="controller">
          <button class="add">+</button>
          <div class="counter">${pedido.quantidade}</div>
          <button class="remove">-</button>
        </div>
      `;
      pedidosContainer.appendChild(pedidoDiv);

      const addButton = pedidoDiv.querySelector(".add");
      const removeButton = pedidoDiv.querySelector(".remove");
      const counterDisplay = pedidoDiv.querySelector(".counter");

      addButton.addEventListener("click", function () {
        pedido.quantidade++;
        counterDisplay.textContent = pedido.quantidade;
        atualizarPedidoNoLocalStorage(pedido, index);
      });

      removeButton.addEventListener("click", function () {
        if (pedido.quantidade > 1) {
          pedido.quantidade--;
          counterDisplay.textContent = pedido.quantidade;
          atualizarPedidoNoLocalStorage(pedido, index);
        }
      });


      const removePedidoButton = pedidoDiv.querySelector(".remove-pedido");
      removePedidoButton.addEventListener("click", function () {
        removerPedidoDoLocalStorage(index);
      });
    });

    atualizarTotal();
  }


  function atualizarPedidoNoLocalStorage(pedido, index) {
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos[index] = pedido;
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    atualizarTotal();
    updatePedidoCount();
  }


  function removerPedidoDoLocalStorage(index) {
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.splice(index, 1);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    atualizarTotal();
    updatePedidoCount();
    carregarPedidos();
  }


  function calcularTotal(pedidos) {
    return pedidos
      .reduce((total, pedido) => {
        const preco = parseFloat(pedido.preco.replace('R$', '').trim());
        const quantidade = pedido.quantidade;
        if (isNaN(preco) || isNaN(quantidade)) {
          return total;
        }
        return total + (preco * quantidade);
      }, 0)
      .toFixed(2);
  }


  function atualizarTotal() {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const total = calcularTotal(pedidos);
    const precoTotalElement = document.querySelector(".preco-total");
    if (precoTotalElement) {
      precoTotalElement.textContent = `TOTAL R$ ${total}`;
    }
  }


  function gerarLinkWhatsApp() {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    if (pedidos.length === 0) {
      alert("Não há pedidos no carrinho.");
      return;
    }

    let mensagem = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
    pedidos.forEach((pedido) => {
      mensagem += `${pedido.quantidade}x ${pedido.nome} - R$ ${parseFloat(pedido.preco.replace('R$', '').trim()).toFixed(2)} cada\n`;
    });
    mensagem += `\nTotal: R$ ${calcularTotal(pedidos)}\n\nPor favor, aguardo confirmação.`;

    const mensagemCodificada = encodeURIComponent(mensagem);
    const numeroWhatsApp = "71992092359";
    const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

    const link = document.createElement("a");
    link.href = linkWhatsApp;
    link.target = "_blank";
    link.click();
  }


  document.querySelector(".btn-whatsapp").addEventListener("click", function (event) {
    event.preventDefault();
    gerarLinkWhatsApp();
  });

  function updatePedidoCount() {
    const pedidoCount = document.getElementById("pedido-count");
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];


    const totalCount = pedidos.reduce((acc, pedido) => acc + pedido.quantidade, 0);


    if (pedidoCount) {
      pedidoCount.innerText = totalCount;
    }
  }


  window.onload = atualizarTotal;
});
