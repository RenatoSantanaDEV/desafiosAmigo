// Escreva uma funcao que recebe 2 numeros e retorne o maior deles
const ps = document.createElement("p");

function maiorDeles() {
    const num1 = Number(document.querySelector('#numero-1').value);
    const num2 = Number(document.querySelector('#numero-2').value);
    let resultado = 0;
    // Criar uma variável única que pode ser reatribuída 
    // dependendo dos ifs e dar um appendChild na div principal 
    // pra exibir ela na tela

    resultado = num1 > num2 ? num1 : num2;
    resultado = num1 === num2 ? 'Iguais' : resultado;

    const divPrin = document.querySelector('.paragrafos');

    ps.innerHTML = resultado;

    divPrin.appendChild(ps);
}

// maiorDeles(numer1, numer2)
