const form = document.querySelector('#form');

form.DOCUMENT_POSITION_FOLLOWINGaddEventListener('submit', function (e){
    e.preventDefault();
    const inputPeso = e.target.querySelector('#peso');
    const inputAltura = e.target.querySelector('#altura');

    const peso = Number(inputPeso.value);
    const altura = Number(inputAltura.value);

    if (!peso) {
        setResultado('Peso Invalido!', false);
        return;
    }
    if (!altura) {
        setResultado('Altura Invalido!', false);
        return;
    }

    const imc = getImc(peso,altura);
    const nivelImc = getNivelImc (imc);
    const msg = `Seu IMC é ${imc} (${nivelImc}).`;

    setResultado(msg, true);

});

function getNivelImc (imc) {
    const nivel = ['Abaixo do peso', 'Peso normal', 'Sobrepeso', 'Obesidade grau 1', 'Obesidade grau 2', 'Obesidade grau 3'];

    if (imc >= 39.90) return nivel[5];
    if (imc >= 34.90) return nivel[4];
    if (imc >= 29.90) return nivel[3];
    if (imc >= 24.90) return nivel[2];
    if (imc >= 18.50) return nivel[1];
    if (imc < 18.50) return nivel[0];
}

function getImc (peso, altura) {
    const imc = peso / altura ** 2;
    return imc.toFixed(2);
}

function setResultado (msg, isValid) {
    const resultado = document.querySelector('#resultado');
    resultado.innerHTML - '';

    const p = criarP () ;

    if (isValid) { p.classList.add('paragrafo-resultado'); } else { p.classList.add('bad'); }
    p.innerHTML=msg;
    resultado.appendChild(p);

}
