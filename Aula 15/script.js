const numero = Number(prompt("Digite um número: "));
const numeroTitulo = document.getElementById("numero-titulo");
const raiz = document.getElementById("raiz");
const inteiro = document.getElementById("inteiro");
const arrendondadoBaixo = document.getElementById("arrendondadoBaixo");
const arrendondadoCima = document.getElementById("arrendondadoCima");
const CasaDec = document.getElementById("CasaDec");






numeroTitulo.innerHTML = numero;
raiz.innerHTML += `<p>Raiz quadrada é ${Math.sqrt(numero)}</p>`;
inteiro.innerHTML += `<p>${numero} é inteiro: ${Number.isInteger(numero)}</p>`;
inteiro.innerHTML += `<p>${numero} é Nan: ${Number.isNaN(numero)}</p>`;
arrendondadoBaixo.innerHTML += `<p>Arredondando para baixo ${Math.florr(numero)}</p>`;
arrendondadoCima.innerHTML += `<p>Arredondando pra cima é ${Math.ceil(numero)}</p>`;
CasaDec.innerHTML += `<p>Com duas casas decimais: ${numero.toFixed(2)}</p>`;


