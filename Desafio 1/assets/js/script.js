document.getElementById('cpf').addEventListener('input', function () {
    let cpf = this.value;
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length > 6) {
        cpf = cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})$/, '$1.$2.$3-$4');
    } else if (cpf.length > 3) {
        cpf = cpf.replace(/^(\d{3})(\d{3})(\d{0,3})$/, '$1.$2.$3');
    } else {
        cpf = cpf.replace(/^(\d{3})$/, '$1.');
    }
    this.value = cpf.slice(0, 14);
});

document.getElementById('nascimento').addEventListener('input', function () {
    let nascimento = this.value;
    nascimento = nascimento.replace(/\D/g, '');
    if (nascimento.length > 4) {
        nascimento = nascimento.replace(/^(\d{2})(\d{2})(\d{0,4})$/, '$1/$2/$3');
    } else if (nascimento.length > 2) {
        nascimento = nascimento.replace(/^(\d{2})(\d{0,2})$/, '$1/$2');
    }
    this.value = nascimento.slice(0, 10);
});

document.getElementById('telefone').addEventListener('input', function(){
    let telefone = this.value;
    telefone = telefone.replace(/\D/g, '');
    if (telefone.length > 7) {
        telefone = telefone.replace(/^(\d{2})(\d{5})(\d{0,4})$/, '($1) $2-$3');
    }
    else if (telefone.length > 2) {
        telefone = telefone.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    }
    this.value = telefone.slice(0,15)
});

document.getElementById('pessoa').addEventListener('input', function () {
    const nome = this.value;
    this.value = nome.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s]/g, '');
    if (nome.length < 3) {
        console.log("O nome deve ter pelo menos 3 caracteres.");
    } else if (nome.length > 50) {
        console.log("O nome deve ter no máximo 50 caracteres.");
    }
});