//Exercício 6
//Monte uma função que retorna HTML dinâmico que serão os elementos utilizados para uma paginação. Siga as regras:
//A função receberá dois parâmetros: total geral de itens e items por página
//O total geral de itens são 15
//Você só pode exibir 2 itens por página
//O número da página deve vir acompanhado do código dado como exemplo: Página 1/Página 2/Página 3, etc...
const criaLi = () => document.createElement('li');

const retornaHtmlDinamico = (totalItens, itensPorPagina) => {
    const container = document.createElement('div');

    for (let i = 1; i <= totalItens; i += itensPorPagina) {
        const lista = document.createElement('ul'); 
        for (let j = i; j < i + itensPorPagina && j <= totalItens; j++) {
            const li = criaLi();
            li.innerText = `Item ${j}`;
            lista.appendChild(li);
        }

        container.appendChild(lista);
    }

    return container;
};

const totalItens = 15;
const itensPorPagina = 2;
const listaHtml = retornaHtmlDinamico(totalItens, itensPorPagina);

document.body.appendChild(listaHtml);
