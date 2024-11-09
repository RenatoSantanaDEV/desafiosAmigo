//Dado array abaixo, monte um novo array com apenas números (inteiros e decimais) seguindo as regras:
//Cada valor do novo array deve ser somado com o número anterior
//Se o novo valor não for par, deverá ser inserido um novo número anterior a ele somando + 0.5

const arrayNumeros = [0, '1', '1.5', 2, 3, 4, 5, 6, 7, '8', 9];

const novoArray = arrayNumeros
  .filter(valor => typeof valor === 'number')
  .map((valor, indice, array) => indice === 0 ? valor : valor + array[indice - 1])
  .reduce((ac, valor, indice, array) => {
    valor % 2 !== 0 ? ac.push(array[indice - 1] + 0.5) : ac.push(valor);
    return ac;
  }, []);

console.log(novoArray);
