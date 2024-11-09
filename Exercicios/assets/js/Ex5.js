/*

Exercício 5
Crie uma função que retorne a data passada formatada de acordo com os patterns abaixo:

DIA (DD)
DIA/MES (DD/MM)
DIA/MES/ANO (DD/MM/YYYY)

*/

function formatarData(data, pattern) {
    switch (pattern) {
        case 'DD':
            return data.toLocaleDateString('pt-BR', {
                timeZone: 'UTC',
                day: '2-digit'
            });
        case 'DD/MM':
            return data.toLocaleDateString('pt-BR', {
                timeZone: 'UTC',
                day: '2-digit',
                month: '2-digit'
            });
        case 'DD/MM/YYYY':
            return data.toLocaleDateString('pt-BR', {
                timeZone: 'UTC',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        default:
            return 'Padrão inválido';
    }
}

const data = new Date('2022-06-07T01:01:06.336Z');

console.log(formatarData(data, 'DD/MM/YYYY')); // resultado: 07/06/2022

