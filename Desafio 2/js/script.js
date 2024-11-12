document.addEventListener('DOMContentLoaded', function() {
    inicia();
});

const verde = document.getElementById('green');
const amarelo = document.getElementById('yellow');
const vermelho = document.getElementById('red');
const botao = document.getElementById('botao');
const relogio = document.querySelector('.contadores');
const cronometro = document.getElementById('relogio');
const passagem = document.querySelector('.passagem');
const verdePedestre = document.getElementById('pedestrian-green');
const vermelhoPedestre = document.getElementById('pedestrian-red');

let isPedestrianRequest = false;
let timerIntervalVerde, timerIntervalAmarelo, timerIntervalVermelho;
let time = 60;

cronometro.innerHTML = `FECHAR`;

function atualizaRelogio(tempo) {
    tempoPed = 13;
    relogio.innerHTML = `00:${String(tempo).padStart(2, '0')}`;
    
}

function atualizaCronometro() {
    botao.disabled = true;
    cronometro.innerHTML = `00:${String(time).padStart(2, '0')}`;

    const countdownInterval = setInterval(() => {
        time--;
        cronometro.innerHTML = `00:${String(time).padStart(2, '0')}`;

        if (time === 0) {
            clearInterval(countdownInterval);
            botao.disabled = false;
            cronometro.innerHTML = `FECHAR`;
            time = 60;
        }
    }, 1000);
}

function inicia() {
    mudaParaVerde(10);
    botao.addEventListener('click', () => {
        if (!isPedestrianRequest) {
            isPedestrianRequest = true;
            if (verde.style.backgroundColor === 'green') {
                atualizaCronometro();
                clearInterval(timerInterval);
                tempoVerde = 2;
                mudaParaVerde(tempoVerde);
                setTimeout(() => mudaParaAmarelo(4), 3000);
            }
        }
    });
}

function mudaParaVerde(tempoVerde) {
    verde.style.backgroundColor = 'green';
    amarelo.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
    vermelho.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
    verdePedestre.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
    vermelhoPedestre.style.backgroundColor = 'red';
    passagem.innerHTML = 'PARE';

    atualizaRelogio(tempoVerde);

    timerIntervalVerde = setInterval(() => {
        tempoVerde--;
        atualizaRelogio(tempoVerde);
        if (tempoVerde === 0) {
            clearInterval(timerIntervalVerde);
            mudaParaAmarelo(4);
        }
    }, 1000);
}

function mudaParaAmarelo(tempoAmarelo) {
    verde.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
    amarelo.style.backgroundColor = 'yellow';
    verdePedestre.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
    vermelhoPedestre.style.backgroundColor = 'red';
    passagem.innerHTML = 'PARE';

    atualizaRelogio(tempoAmarelo);

    timerIntervalAmarelo = setInterval(() => {
        tempoAmarelo--;
        atualizaRelogio(tempoAmarelo);
        if (tempoAmarelo === 0) {
            clearInterval(timerIntervalAmarelo);
            mudaParaVermelho(15);
        }
    }, 1000);
}

function mudaParaVermelho(tempoVermelho) {
    amarelo.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
    vermelho.style.backgroundColor = 'red';
    vermelhoPedestre.style.backgroundColor = 'rgba(255, 0, 0, 0.255)'
    verdePedestre.style.backgroundColor = 'green';
    passagem.innerHTML = 'SIGA';
    passagem.style.color = 'green';

    atualizaRelogio(tempoVermelho);

    timerIntervalVermelho = setInterval(() => {
        tempoVermelho--;
        atualizaRelogio(tempoVermelho);
        if (tempoVermelho === 0) {
            clearInterval(timerIntervalVermelho);
            isPedestrianRequest = false;
            tempoVerde = 10;
            mudaParaVerde(tempoVerde);
            passagem.style.color = 'red';
        }
    }, 1000);
}
