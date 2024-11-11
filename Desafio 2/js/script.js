// Ao entrar na tela o semáforo já inicia VERDE (aberto)
// O semáforo fecha a cada 10 segundos
// O semáforo deve permanecer 3 segundos no AMARELO
// O semáforo deve permanecer por 15 segundos fechado
// Crie um botão para simular a ação de um pedestre solicitando para fechar o sinal e atravessar a pista.
//ok
// Ao clicar no botão para FECHAR se o semáforo estiver verde, ele deve aguardar 3 segundos até fechar. 
// Se ao clicar para fechar estiver no amarelo continua o processo de fechamento.

// Informe ao lado do semáforo o tempo do sinal atual em segundos (menos para sinal amarelo)

function Timer(callback, delay) {
    return setTimeout(callback, delay);
}
const verde = document.getElementById('green');
const amarelo = document.getElementById('yellow');
const vermelho = document.getElementById('red');
const divBotao = document.querySelector('.wrapper');
const botao = document.getElementById('botao');
const relogio = document.getElementById('relogio');
const leitorVerde = document.getElementById('leitor-verde');
const leitorVermelho = document.getElementById('leitor-vermelho');
const contadorDiv = document.getElementById('contador');
const contadores = document.querySelector('.contadores');

let flag = false;
let contador = 60;
let contadorVerde = 10;
var espera;

relogio.innerHTML = `FECHAR`;

function intervalo (contador){
    const intervaloGeral = setInterval(function(){
        if (contador >= 0) {
            contadores.innerHTML = `00:${String(contador).padStart(2, '0')}`;
            contador--;
        } else if (contador <= 0) {
            clearInterval(intervaloGeral);
            contadores.innerHTML = `00:00`;
        }
    }, 1000);
}



if(flag === false){
    botao.addEventListener('click', function(){
        contadorVerde = 3;
        flag = true;
        botao.disabled = true;

        inicia();
        setTimeout(() => {
            botao.style.backgroundColor = 'red';
            flag = false;
            botao.disabled = false;
            contador = 10;
        }, 60000);
        const intervalo = setInterval(function(){
            if (contador > 0) {
                relogio.innerHTML = `00:${String(contador).padStart(2, '0')}`;
                contador--;
            } else if (contador <= 0) {
                clearInterval(intervalo);
                relogio.innerHTML = `FECHAR`;
            }
        }, 1000);
    })
}
function inicia() {
    verde.style.backgroundColor = 'green';
    botao.style.backgroundColor = 'green';
    contadores.style.color = 'green';

    botao.disabled = flag;

    intervalo(contadorVerde-1);
    setTimeout(function() {
        botao.style.backgroundColor = 'red';
        console.log(flag);
        botao.disabled = true;
        verde.style.backgroundColor = 'rgba(0, 255, 0, 0.255)';
        amarelo.style.backgroundColor = 'yellow';
    }, contadorVerde*1000);
    
    Timer(function() {
        contadores.style.color = 'red';
        botao.style.backgroundColor = 'red';
        botao.disabled = true;
        amarelo.style.backgroundColor = 'rgba(255, 255, 0, 0.225)';
        vermelho.style.backgroundColor = 'red';
        intervalo(14);

    }, 13000);

    Timer(function() {
        vermelho.style.backgroundColor = 'rgba(255, 0, 0, 0.255)';
        inicia(); 
    }, 28000);
}

document.addEventListener('DOMContentLoaded', function() {
    inicia();
});

