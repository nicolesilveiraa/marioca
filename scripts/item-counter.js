document.addEventListener("DOMContentLoaded", function () {
  const controllers = document.querySelectorAll(".controller");

  controllers.forEach((controller) => {
    const addButton = controller.querySelector(".btn-add");
    const counterDisplay = controller.querySelector(".counter");
    let counter = 0;

    addButton.addEventListener("click", function () {
      counter++;
      counterDisplay.textContent = counter;
    });

    addButton.addEventListener("click", function () {
      const productName = controller
        .closest(".content-box")
        .querySelector("h2")
        .textContent.trim();

      const priceText = controller
        .closest(".content-box")
        .querySelector(".product-price").textContent;
      const price = priceText.replace("R$", "").trim();

      const productType = controller
        .closest(".content")
        .classList.contains("comidas")
        ? "comida"
        : "bebida";

      if (counter > 0) {
        const pedido = {
          nome: productName,
          preco: price,
          quantidade: counter,
          tipo: productType,
        };

        adicionarPedidoNoLocalStorage(pedido);
        counter = 0;
        counterDisplay.textContent = counter;

        setTimeout(function () {
          window.location.href = "./pedidos.html";
        }, 500);
      }
    });
  });

  function adicionarPedidoNoLocalStorage(pedido) {
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    const index = pedidos.findIndex(
      (p) => p.nome === pedido.nome && p.tipo === pedido.tipo
    );
    if (index > -1) {
      pedidos[index].quantidade += pedido.quantidade;
    } else {
      pedidos.push(pedido);
    }

    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    updatePedidoCount();
    atualizarTotal();
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2400,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });

    Toast.fire({
      icon: "success",
      html: `<span style="color: #da1852;">${pedido.nome}</span> foi adicionado aos pedidos! O valor é de <span style="color: #da1852;">R$${pedido.preco}</span>`,
    });
  }


  function carregarPedidos() {
    const pedidosContainer = document.querySelector(".pedidos-container");
    if (!pedidosContainer) return;

    pedidosContainer.innerHTML = "";
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    pedidos.forEach((pedido, index) => {
      const pedidoDiv = document.createElement("div");
      pedidoDiv.classList.add("pedido");
      pedidoDiv.setAttribute("data-index", index);

      pedidoDiv.innerHTML = `
        <button class="remove-pedido">X</button>
        <p>${pedido.nome} (${pedido.tipo})</p>
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
        } else {
          removerPedidoDoLocalStorage(index);
        }
      });

      const removePedidoButton = pedidoDiv.querySelector(".remove-pedido");
      removePedidoButton.addEventListener("click", function () {
        removerPedidoDoLocalStorage(index);
      });
    });

    updatePedidoCount();
    atualizarTotal();
  }


  function atualizarPedidoNoLocalStorage(pedido, index) {
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos[index] = pedido;
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    carregarPedidos();
    updatePedidoCount();
  }


  function removerPedidoDoLocalStorage(index) {
    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.splice(index, 1);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
    carregarPedidos();
    updatePedidoCount();
  }


  function calcularTotal(pedidos) {
    return pedidos
      .reduce((total, pedido) => {
        const preco = parseFloat(pedido.preco.replace("R$", "").trim());
        const quantidade = pedido.quantidade;
        if (isNaN(preco) || isNaN(quantidade)) {
          return total;
        }
        return total + preco * quantidade;
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


  function updatePedidoCount() {
    const pedidoCount = document.getElementById("pedido-count");
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    const totalCount = pedidos.reduce(
      (acc, pedido) => acc + pedido.quantidade,
      0
    );

    if (pedidoCount) {
      pedidoCount.innerText = totalCount;
    }

    localStorage.setItem("pedidoCount", totalCount);
  }


  carregarPedidos();
  updatePedidoCount();
});
