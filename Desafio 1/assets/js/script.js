function criahoraDosSegundo(segundos){
    const data = new Date(segundos * 1000);
    return data.toLocaleTimeString('pt-br', { hour12 : false, timeZone: 'UTC' });
}
const relogio = document.querySelector('.relogio');
const iniciado = document.querySelector('.inicar');
const pausado = document.querySelector('.pausar');
const zerado = document.querySelector('.zerar');
const estilosBotao = getComputedStyle(document.body);
let segundos =0;
let timer;

function mostraHora(){
    timer = setInterval( function() { segundos++; relogio.innerHTML = criahoraDosSegundo(segundos); }, 1000 );
}
function inicia(){
    iniciado.style.background = "green";
    pausado.style.background = null;
    zerado.style.background = null;
    relogio.classList.remove('pausado-cor');
    mostraHora();
}
function pausa(){
    relogio.classList.add('pausado-cor');
    pausado.style.background = "green";
    iniciado.style.background = null;
    zerado.style.background = null;
    
    clearInterval(timer);
}
function zera(){
    iniciado.style.background = null;
    zerado.style.background = "green";
    pausado.style.background = null;
    clearInterval(timer);
    relogio.innerHTML = "00:00:00";
    segundos = 0;
}