let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');

const contents = [
    {
        title: "DRINK DA CASA",
        namePrice: "Corona sunset R$ 25,00",
        description: "A vida é bonita e eu posso provar combinamos corona, tequila, limão, laranja, xarope de groselha, pedaço de morango e limão com sal na borda, SÓ VAI."
    },
    {
        title: "DRINK DA CASA",
        namePrice: "Caipirona R$ 25,00",
        description: "Uma releitura da clássica caipira brasileira com R$0,10 de ousadia. Servido em uma caneca geladissima, e a mistura de vodka, limão macerado, açúcar gelo e uma long neck de corona, que vai misturado ao drink conforme você vai bebendo."
    },
    {
        title: "DRINK DA CASA",
        namePrice: "Marioca R$ 25,00",
        description: "Gosto de nostalgia, trazemos um suco da bala framboesa 7 belo (a melhor das melhores) com vodka, água tônica e gelo."
    }
];


function showSlide(index) {
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;

    slides.forEach(slide => slide.classList.remove('active'));
    slides[currentSlide].classList.add('active');

    document.getElementById("drink-title").innerText = contents[currentSlide].title;
    document.getElementById("drink-name-price").innerText = contents[currentSlide].namePrice;
    document.getElementById("drink-description").innerText = contents[currentSlide].description;
}


function adicionarPedidoNoLocalStorage() {
    const productName = contents[currentSlide].namePrice.split(" R$")[0].trim();
    const priceText = contents[currentSlide].namePrice.split(" R$")[1];
    const price = priceText ? priceText.trim() : '0';

    const pedido = {
        nome: productName,
        preco: price,
        quantidade: 1,
        tipo: 'bebida'
    };


    let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    pedidos.push(pedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    updatePedidoCount();


    window.location.href = './pedidos.html';
}


function moveCarousel(step) {
    showSlide(currentSlide + step);
}


document.getElementById("btn-pedir-drink").addEventListener("click", function () {
    adicionarPedidoNoLocalStorage();
});

showSlide(currentSlide); 
