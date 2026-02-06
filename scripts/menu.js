
document.getElementById('btn-pedir-drink').addEventListener('click', function () {
    const productName = document.getElementById("drink-title").textContent.trim();
    const price = document.querySelector(".product-price").textContent.replace("R$", "").trim();
    const counter = 1;


    const pedido = {
        nome: productName,
        preco: price,
        quantidade: counter,
        tipo: "bebida"
    };


    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));


    updatePedidoCount();


    setTimeout(function () {
        window.location.href = "./pedidos.html";
    }, 500);
});


function updatePedidoCount() {
    const pedidoCount = document.getElementById("pedido-count");
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const totalCount = pedidos.reduce((acc, pedido) => acc + pedido.quantidade, 0);

    if (pedidoCount) {
        pedidoCount.innerText = totalCount;
    }
    localStorage.setItem("pedidoCount", totalCount);
}
