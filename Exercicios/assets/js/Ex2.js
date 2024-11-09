//Utilize o forEach e o filter para gerar um novo array filtrando apenas os números pares.

//Realize com o forEach
//Realize com o filter


const arrayNumeros = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const novoArrayFilter = arrayNumeros.filter(valor => valor % 2 === 0);
const novoArrayForEach = [];

arrayNumeros.forEach(valor => {
    if (valor % 2 !== 0) {
        return;
    }

    novoArrayForEach.push(valor);
});

console.log(novoArrayFilter);
console.log(novoArrayForEach);