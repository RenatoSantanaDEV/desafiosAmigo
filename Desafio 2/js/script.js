// Ao entrar na tela o semáforo já inicia VERDE (aberto)
// O semáforo fecha a cada 10 segundos
// O semáforo deve permanecer 3 segundos no AMARELO
// O semáforo deve permanecer por 15 segundos fechado
// Crie um botão para simular a ação de um pedestre solicitando para fechar o sinal e atravessar a pista.
//ok

// Ao clicar no botão para FECHAR se o semáforo estiver verde, ele deve aguardar 3 segundos até fechar. 
// Se ao clicar para fechar estiver no amarelo continua o processo de fechamento.
// Informe ao lado do semáforo o tempo do sinal atual em segundos (menos para sinal amarelo)

const verde = document.getElementById('green');
const amarelo = document.getElementById('yellow');
const vermelho = document.getElementById('red');
const divBotao = document.querySelector('.wrapper');
const botao = document.getElementById('botao');
let segundos = 60;
let timer;

function criahoraDosSegundo(segundos){
    const data = new Date(segundos * 1000);
    return data.toLocaleTimeString('pt-br', { hour12 : false, timeZone: 'UTC' });
}
function Timer(callback, delay) {
    return setTimeout(callback, delay);
}   

function mostraHora(){
    timer = setInterval( function() { segundos--; relogio.innerHTML = criahoraDosSegundo(segundos); }, 1000 );

}
function inicia() {
    verde.style.backgroundColor = 'green';
    let flag = true;

    botao.addEventListener('click', function() {
        botao.disabled = true;
        Timer(function() {
            botao.disabled = true;
            verde.style.backgroundColor = 'rgba(0, 255, 0, 0.255)'; 
            amarelo.style.backgroundColor = 'yellow'; 
        }, 3000);
    });
    Timer(function() {
        botao.disabled = true;
        verde.style.backgroundColor = 'rgba(0, 255, 0, 0.255)'; 
        amarelo.style.backgroundColor = 'yellow'; 
    }, 10000);
    
    Timer(function() {
        botao.disabled = true;
        amarelo.style.backgroundColor = 'rgba(255, 255, 0, 0.225)';
        vermelho.style.backgroundColor = 'red';
    }, 13000);

    Timer(function() {
        vermelho.style.backgroundColor = 'rgba(255, 0, 0, 0.255)';
        inicia(); 
    }, 28000);
}

document.addEventListener('DOMContentLoaded', function() {
    inicia();
});


