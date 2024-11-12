/*
const h1 = document.querySelector('.container h1');
const data = new Date ();
h1.innerHTML = data.toString();

function getDiaSemanaTexto(diaSemana) {
    let diaSemanaTexto;

    switch (diaSemana){
        case 0:
            diaSemanaTexto = 'Domingo';
            return diaSeamanaTexto;
        case 1:
            diaSemanaTexto = 'Segunda-Feira';
            return diaSeamanaTexto;
        case 2:
            diaSemanaTexto = 'Terca-Feira';
            return diaSeamanaTexto;
        case 3:
            diaSemanaTexto = 'Quarta-Feira';
            return diaSeamanaTexto;
        case 4:
            diaSemanaTexto = 'Quinta-Feira';
            return diaSeamanaTexto;
        case 5:
            diaSemanaTexto = 'Sexta-Feira';
            return diaSeamanaTexto;
        case 6:
            diaSemanaTexto = 'Sabado';
            return diaSeamanaTexto;
    }
}

function getNomeMes(numeroMes) {
    let nomeMes;

    switch (numeroMes){
        case 0:
            nomeMes = 'Janeiro';
            return nomeMes;
        case 1:
            nomeMes = 'Fevereiro';
            return nomeMes;
        case 2:
            nomeMes = 'Marco';
            return nomeMes;
        case 3:
            nomeMes = 'Abril';
            return nomeMes;
        case 4:
            nomeMes = 'Maio';
            return nomeMes;
        case 5:
            nomeMes = 'Junho';
            return nomeMes;
        case 6:
            nomeMes = 'Julho';
            return nomeMes;
        case 7:
            nomeMes = 'Agosto';
            return nomeMes;
        case 8:
            nomeMes = 'Setembro';
            return nomeMes;
        case 9:
            nomeMes = 'Outubro';
            return nomeMes;
        case 10:
            nomeMes = 'Novembro';
            return nomeMes;
        case 11:
            nomeMes = 'Dezembro';
            return nomeMes;
    }
}

function zeroAEsquerda (num) {
    return num >= 10 ? num: `0${num}`;
}

function criarDate( data ) {
    const diaSemana = data.getDay();
    const numeroMes = data.getMonth();

    const NomeDia = getDiaSemanaTexto(diaSemana);
    const nomeMes = getNomeMes(numeroMes);

    return `${nomeDia}, ${data.getDate()} de ${nomeMes}` + `de ${data.getFullYear()}:${data.getMinutes()}`;
}

h1.innerHTML = getDiaSemanaTexto(data.getDate())
*/
const h1 = document.querySelector('.container-h1');
const data = new Date();
h1.innerHTML = data.toLocaleDateString('pt-br', { dateStyle: 'full'});
