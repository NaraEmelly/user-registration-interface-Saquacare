function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, ''); 
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let soma = 0, resto;

  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;

  return true;
}


function forceNumeric() {
  this.value = this.value.replace(/\D/g, ''); 
}

document.addEventListener("DOMContentLoaded", function() {

  document.getElementById("nome").maxLength = 150;
  document.getElementById("cpf").maxLength = 11;
  document.getElementById("numero_sus").maxLength = 15;
  document.getElementById("cep").maxLength = 8;
  document.getElementById("rua").maxLength = 200;
  document.getElementById("numero").maxLength = 10;
  document.getElementById("bairro").maxLength = 150;
  document.getElementById("complemento").maxLength = 70;
  document.getElementById("telefone").maxLength = 11;
  document.getElementById("email").maxLength = 170;
  document.getElementById("senha").maxLength = 50;
  document.getElementById("confirma_senha").maxLength = 50;

  document.getElementById("cpf").addEventListener("input", forceNumeric);
  document.getElementById("numero_sus").addEventListener("input", forceNumeric);
  document.getElementById("cep").addEventListener("input", forceNumeric);
  document.getElementById("telefone").addEventListener("input", forceNumeric);
  
  document.getElementById("cpf").inputMode = "numeric";
  document.getElementById("numero_sus").inputMode = "numeric";
  document.getElementById("cep").inputMode = "numeric";
  document.getElementById("telefone").inputMode = "numeric";

  const checkboxMostrarSenha = document.getElementById("mostrar-senha");
  const campoSenha = document.getElementById("senha");
  const campoConfirmaSenha = document.getElementById("confirma_senha");

  if (checkboxMostrarSenha) {
    checkboxMostrarSenha.addEventListener("change", function() {
      
      if (checkboxMostrarSenha.checked) {
        campoSenha.type = "text";
        campoConfirmaSenha.type = "text";
      } else {
        campoSenha.type = "password";
        campoConfirmaSenha.type = "password";
      }
    });
  }

}); 

const form = document.querySelector("form");
const modal = document.getElementById("modal-sucesso");
const fecharModal = document.getElementById("fechar-modal");


form.addEventListener("submit", function (event) {
<<<<<<< HEAD
  event.preventDefault();

=======
  event.preventDefault();  
>>>>>>> f6d75ed78dbb4a7820063766abd77aff404adf20

  const cpfValido = validarCPF(document.getElementById("cpf").value);
  if (!cpfValido) {
    alert("CPF inválido! Verifique e tente novamente.");
    return; 
  }

  const senha = document.getElementById("senha").value;
  const confirmaSenha = document.getElementById("confirma_senha").value;

<<<<<<< HEAD
  form.reset();
  modal.style.display = "flex";
=======
  if (senha !== confirmaSenha) {
    alert("As senhas digitadas não correspondem! Por favor, digite novamente.");
    return; 
  }

  form.reset();  
  modal.style.display = "flex";  
>>>>>>> f6d75ed78dbb4a7820063766abd77aff404adf20
});


fecharModal.addEventListener("click", function () {
  modal.style.display = "none";
});
