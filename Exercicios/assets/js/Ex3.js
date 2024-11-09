//Exercício 3
//Retorne a data abaixo (no formato ISO) nos seguintes padrões:
//DIA/MÊS/ANO
//DIA/MÊS/ANO HORA:MINUTO

const date = new Date('2022-06-07T01:01:06.336Z');

const formatoDataHora = date.toLocaleString('pt-BR', {
  timeZone: 'UTC',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

console.log(formatoDataHora);

