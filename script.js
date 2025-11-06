function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, ''); // remove pontos e traços
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


const form = document.querySelector("form");
const modal = document.getElementById("modal-sucesso");
const fecharModal = document.getElementById("fechar-modal");


form.addEventListener("submit", function (event) {
  event.preventDefault();


  const cpfValido = validarCPF(document.getElementById("cpf").value);
  if (!cpfValido) {
    alert("CPF inválido! Verifique e tente novamente.");
    return;
  }


  form.reset();
  modal.style.display = "flex";
});


fecharModal.addEventListener("click", function () {
  modal.style.display = "none";
});