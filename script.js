// URL da API Flask
const API_URL = 'http://localhost:5000/api';

// ===== FUNÇÕES EXISTENTES NO CÓDIGO =====
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

// ===== NOVAS FUNÇÕES PARA INTEGRAÇÃO COM API =====

// Função para cadastrar usuário na API Flask
async function cadastrarUsuario(dadosUsuario) {
    try {
        console.log('Enviando dados para API:', dadosUsuario);
        
        const response = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosUsuario)
        });
        
        const resultado = await response.json();
        
        if (response.ok) {
            console.log('Usuário cadastrado com sucesso:', resultado);
            
            // Mostrar Usuario cadastrado com sucesso
            const modal = document.getElementById("modal-sucesso");
            if (modal) {
                modal.style.display = "flex";
            } else {
                alert('Usuário cadastrado com sucesso!');
            }
            
            // FUNCIONALIDADE: LIMPAR FORMULÁRIO 
            const form = document.querySelector("form");
            if (form) {
                form.reset();
                console.log('Formulário limpo para próximo cadastro');
            }
            
            
        } else {
            console.error('Erro ao cadastrar:', resultado);
            alert('Erro ao cadastrar: ' + resultado.erro);
        }
    } catch (error) {
        console.error('Erro de conexão:', error);
        alert('Erro de conexão com o servidor. Verifique se o Flask está rodando na porta 5000.');
    }
}

// Função para testar conexão com API
async function testarConexao() {
    try {
        const response = await fetch(`${API_URL}/health`);
        const status = await response.json();
        console.log('Status da API:', status);
        return status.status === 'healthy';
    } catch (error) {
        console.error('API nao esta respondendo:', error);
        return false;
    }
}

// ===== CÓDIGO PRINCIPAL =====
document.addEventListener("DOMContentLoaded", function () {
    // Configurações existentes do seu código
    const nomeInput = document.getElementById("nome");
    const cpfInput = document.getElementById("cpf");
    const susInput = document.getElementById("numero_sus");
    const senhaInput = document.getElementById("senha");
    const confirmaSenhaInput = document.getElementById("confirma_senha");

    if (nomeInput) nomeInput.maxLength = 150;
    if (cpfInput) cpfInput.maxLength = 11;
    if (susInput) susInput.maxLength = 15;
    if (senhaInput) senhaInput.maxLength = 50;
    if (confirmaSenhaInput) confirmaSenhaInput.maxLength = 50;

    if (cpfInput) cpfInput.addEventListener("input", forceNumeric);
    if (susInput) susInput.addEventListener("input", forceNumeric);

    if (cpfInput) cpfInput.inputMode = "numeric";
    if (susInput) susInput.inputMode = "numeric";

    const checkboxMostrarSenha = document.getElementById("mostrar-senha");
    const campoSenha = document.getElementById("senha");
    const campoConfirmaSenha = document.getElementById("confirma_senha");

    if (checkboxMostrarSenha && campoSenha && campoConfirmaSenha) {
        checkboxMostrarSenha.addEventListener("change", function () {
            if (checkboxMostrarSenha.checked) {
                campoSenha.type = "text";
                campoConfirmaSenha.type = "text";
            } else {
                campoSenha.type = "password";
                campoConfirmaSenha.type = "password";
            }
        });
    }

    // Modal
    const modal = document.getElementById("modal-sucesso");
    const fecharModal = document.getElementById("fechar-modal");

    if (fecharModal && modal) {
        fecharModal.addEventListener("click", function () {
            modal.style.display = "none";
            //  LIMPAR TAMBÉM AO FECHAR O MODAL 
            const form = document.querySelector("form");
            if (form) form.reset();
        });
    }

    // ===== INTEGRAÇÃO COM A API - FORMULÁRIO DE CADASTRO =====
    const form = document.querySelector("form");
    
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();

            // Validações existentes
            const cpfValor = cpfInput ? cpfInput.value : '';
            const cpfValido = validarCPF(cpfValor);
            if (!cpfValido) {
                alert("CPF inválido! Verifique e tente novamente.");
                return;
            }

            const senha = senhaInput ? senhaInput.value : '';
            const confirmaSenha = confirmaSenhaInput ? confirmaSenhaInput.value : '';

            if (senha !== confirmaSenha) {
                alert("As senhas digitadas não correspondem! Por favor, digite novamente.");
                return;
            }

            // Preparar dados para a API
            const dadosUsuario = {
                nome_completo: nomeInput ? nomeInput.value : '',
                cpf: cpfValor.replace(/\D/g, ''), // Remove formatação
                numero_sus: susInput ? susInput.value.replace(/\D/g, '') : '',
                senha: senha
            };

            console.log('Dados preparados para API:', dadosUsuario);

            // Enviar para a API Flask
            await cadastrarUsuario(dadosUsuario);
        });
    }

    // Testar conexão com API quando a página carregar
    testarConexao().then(conectado => {
        if (conectado) {
            console.log('Conectado com a API Flask');
        } else {
            console.log('API Flask nao esta respondendo');
            alert('Atenção: API Flask nao esta conectada. O cadastro nao funcionara.');
        }
    });
});
