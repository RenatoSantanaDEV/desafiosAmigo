/*
Exercício 4
Crie uma função que retorna o mês por extenso de uma data qualquer passada por parâmetro, exemplo:

const dataAtual = new Date(); // 2022-06-07T01:01:06.336Z
const mesExtenso = retornaMesPorExtenso(dataAtual);
console.log(mesExtenso); // Junho
Obs.: Como exemplo o mês da data passada seria Junho.
*/
const dataAtual = new Date('2022-06-07T01:01:06.336Z'); 

function retornaMesPorExtenso(data) {
    return data.toLocaleDateString('pt-BR', { month: 'long', timeZone: 'UTC' });
}

const mesExtenso = retornaMesPorExtenso(dataAtual);

console.log(mesExtenso); // "junho"

