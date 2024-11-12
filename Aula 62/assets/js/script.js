function checagem (){
    const num = Number(document.querySelector('#numero-1').value);
    let resultado;
    
    if ( num % 3 === 0 ) resultado = "Fizz";
    else if ( num % 5 === 0 ) resultado = "Buzz"; 
    else resultado = "FizzBuzz";

    console.log(resultado);
}