// Aguardar o carregamento do DOM
document.addEventListener('DOMContentLoaded', function() {
    // Referência ao ID do caso (deve ser passado na URL ou armazenado globalmente)
    let casoId;
    
    // Referências aos elementos do formulário
    const idCasoSpan = document.getElementById('id-caso');
    const form = document.getElementById('detalhesCasoForm');
    const voltarBtn = document.getElementById('voltarBtn');
    const deletarBtn = document.getElementById('deletarBtn');
    const atualizarBtn = document.getElementById('atualizarBtn');
    const mensagemDiv = document.getElementById('mensagem');
    const selectPeritos = document.getElementById('responsavel_caso');
    
    // Obter o ID do caso armazenado (em uma situação real, seria passado via URL ou estado)
    casoId = localStorage.getItem('casoAtualId');
    if (idCasoSpan) idCasoSpan.textContent = `#${casoId}`;
    
    // Função para carregar os peritos
    async function carregarPeritos() {
        try {
            console.log('Iniciando carregamento de peritos...');
            
            // Fazer requisição para a API que retorna apenas os peritos
            const response = await fetch('https://acclp.onrender.com/api/usuarios/tipo/Perito');
            
            if (!response.ok) {
                throw new Error(`Erro ao carregar peritos: ${response.status} ${response.statusText}`);
            }
            
            const peritos = await response.json();
            console.log('Peritos carregados:', peritos);
            
            // Limpar o select antes de adicionar novas opções
            selectPeritos.innerHTML = '<option value="">Selecione um perito</option>';
            
            // Adicionar cada perito como uma opção no select
            peritos.forEach(perito => {
                const option = document.createElement('option');
                // Definimos o valor da option como o ID do perito (será enviado ao backend)
                option.value = perito.id || perito._id; // Tentando tanto id quanto _id (MongoDB costuma usar _id)
                // Definimos o texto visível como o nome do perito (será mostrado ao usuário)
                option.textContent = perito.nome || perito.nome_completo || perito.name; // Tentando diferentes campos de nome
                selectPeritos.appendChild(option);
            });
            
            // Após carregar os peritos, carregar os detalhes do caso
            carregarDetalhesCaso();
        } catch (error) {
            console.error('Erro ao carregar peritos:', error);
            mostrarMensagem('Erro ao carregar a lista de peritos. Por favor, atualize a página.', 'erro');
            
            // Mesmo com erro, tentamos carregar os detalhes do caso
            carregarDetalhesCaso();
        }
    }
    
    // Função para carregar os detalhes do caso
    async function carregarDetalhesCaso() {
        try {
            if (!casoId) {
                mostrarMensagem('Erro: ID do caso não encontrado.', 'erro');
                return;
            }
            
            const response = await fetch(`https://acclp.onrender.com/api/casos/${casoId}`);
            
            if (!response.ok) {
                throw new Error('Erro ao carregar detalhes do caso');
            }
            
            const data = await response.json();
            
            if (!data.success || !data.data) {
                throw new Error('Dados do caso não encontrados');
            }
            
            const caso = data.data;
            
            // Preencher o formulário com os dados do caso
            document.getElementById('titulo_caso').value = caso.titulo_caso || '';
            
            // Definir o responsável selecionado
            if (selectPeritos && caso.responsavel_caso) {
                // Tentar encontrar e selecionar o perito correto
                const opcoes = selectPeritos.options;
                let peritoEncontrado = false;
                
                for (let i = 0; i < opcoes.length; i++) {
                    if (opcoes[i].value === caso.responsavel_caso) {
                        selectPeritos.selectedIndex = i;
                        peritoEncontrado = true;
                        break;
                    }
                }
                
                // Se não encontrou o perito nas opções mas temos o ID, adicionamos uma opção temporária
                if (!peritoEncontrado && caso.responsavel_caso) {
                    const option = document.createElement('option');
                    option.value = caso.responsavel_caso;
                    option.textContent = "[Nome não disponível]";
                    selectPeritos.appendChild(option);
                    selectPeritos.value = caso.responsavel_caso;
                }
            }
            
            document.getElementById('processo_caso').value = caso.processo_caso || '';
            
            // Formatar a data para o formato do input date (YYYY-MM-DD)
            if (caso.data_abertura_caso) {
                const data = new Date(caso.data_abertura_caso);
                const dataFormatada = data.toISOString().split('T')[0];
                document.getElementById('data_abertura_caso').value = dataFormatada;
            }
            
            document.getElementById('descricao_caso').value = caso.descricao_caso || '';
            
            // Definir o status selecionado
            const statusSelect = document.getElementById('status_caso');
            if (statusSelect && caso.status_caso) {
                for (let i = 0; i < statusSelect.options.length; i++) {
                    if (statusSelect.options[i].value === caso.status_caso) {
                        statusSelect.selectedIndex = i;
                        break;
                    }
                }
            }
            
            // Preencher os campos da vítima
            // Nome da vítima
            if (document.getElementById('nome_completo_vitima_caso')) {
                document.getElementById('nome_completo_vitima_caso').value = caso.nome_completo_vitima_caso || '';
            }
            
            // Data de nascimento da vítima
            if (document.getElementById('data_nac_vitima_caso') && caso.data_nac_vitima_caso) {
                // Verifica se a data não é null antes de formatá-la
                if (caso.data_nac_vitima_caso) {
                    const dataNascimento = new Date(caso.data_nac_vitima_caso);
                    const dataNascFormatada = dataNascimento.toISOString().split('T')[0];
                    document.getElementById('data_nac_vitima_caso').value = dataNascFormatada;
                }
            }
            
            // Sexo da vítima
            const sexoSelect = document.getElementById('sexo_vitima_caso');
            if (sexoSelect && caso.sexo_vitima_caso) {
                for (let i = 0; i < sexoSelect.options.length; i++) {
                    if (sexoSelect.options[i].value === caso.sexo_vitima_caso) {
                        sexoSelect.selectedIndex = i;
                        break;
                    }
                }
            }
            
            // Observações sobre a vítima
            if (document.getElementById('observacao_vitima_caso')) {
                document.getElementById('observacao_vitima_caso').value = caso.observacao_vitima_caso || '';
            }
            
        } catch (error) {
            console.error('Erro:', error);
            mostrarMensagem('Erro ao carregar detalhes do caso. Por favor, tente novamente.', 'erro');
        }
    }
    
    // Função para mostrar mensagens
    function mostrarMensagem(texto, tipo) {
        mensagemDiv.textContent = texto;
        mensagemDiv.className = `mensagem ${tipo}`;
        mensagemDiv.style.display = 'block';
    }
    
    // Event listener para o botão de voltar
    if (voltarBtn) {
        voltarBtn.addEventListener('click', function() {
            // Se estivermos em uma página carregada dinamicamente, voltar para a listagem
            if (window.parent !== window) {
                window.parent.carregarListagemCasos(); // Função deve estar disponível no escopo pai
            } else {
                history.back(); // Ou simplesmente voltar na história do navegador
            }
        });
    }
    
    // Event listener para o botão de deletar
    if (deletarBtn) {
        deletarBtn.addEventListener('click', async function() {
            if (!casoId) {
                mostrarMensagem('Erro: ID do caso não encontrado.', 'erro');
                return;
            }
            
            if (!confirm('Tem certeza que deseja excluir este caso? Esta ação não pode ser desfeita.')) {
                return;
            }
            
            try {
                const response = await fetch(`https://acclp.onrender.com/api/casos/${casoId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    mostrarMensagem('Caso excluído com sucesso!', 'sucesso');
                    
                    // Após 2 segundos, voltar para a listagem
                    setTimeout(function() {
                        if (window.parent !== window) {
                            window.parent.carregarListagemCasos();
                        } else {
                            window.location.href = '/pages/cases/listagem-caso.html';
                        }
                    }, 2000);
                } else {
                    mostrarMensagem(data.error || 'Erro ao excluir o caso', 'erro');
                }
            } catch (error) {
                console.error('Erro:', error);
                mostrarMensagem('Erro ao conectar com o servidor', 'erro');
            }
        });
    }
    
    // Event listener para o formulário (atualização)
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!casoId) {
                mostrarMensagem('Erro: ID do caso não encontrado.', 'erro');
                return;
            }
            
            // Obter os dados do formulário
            const formData = {
                titulo_caso: document.getElementById('titulo_caso').value,
                responsavel_caso: document.getElementById('responsavel_caso').value,
                processo_caso: document.getElementById('processo_caso').value,
                data_abertura_caso: document.getElementById('data_abertura_caso').value,
                descricao_caso: document.getElementById('descricao_caso').value,
                status_caso: document.getElementById('status_caso').value,
                
                // Novos campos da vítima
                nome_completo_vitima_caso: document.getElementById('nome_completo_vitima_caso').value,
                data_nac_vitima_caso: document.getElementById('data_nac_vitima_caso').value || null,
                sexo_vitima_caso: document.getElementById('sexo_vitima_caso').value,
                observacao_vitima_caso: document.getElementById('observacao_vitima_caso').value
            };
            
            // Validar campos obrigatórios (excluindo os novos campos da vítima, que não são obrigatórios)
            const camposObrigatorios = ['titulo_caso', 'responsavel_caso', 'processo_caso', 'data_abertura_caso', 'descricao_caso'];
            
            for (const campo of camposObrigatorios) {
                if (!formData[campo]) {
                    mostrarMensagem('Por favor, preencha todos os campos obrigatórios.', 'erro');
                    return;
                }
            }
            
            try {
                const response = await fetch(`https://acclp.onrender.com/api/casos/${casoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    mostrarMensagem('Caso atualizado com sucesso!', 'sucesso');
                    
                    // Após 2 segundos, voltar para a listagem
                    setTimeout(function() {
                        if (window.parent !== window) {
                            window.parent.carregarListagemCasos();
                        } else {
                            window.location.href = '/pages/cases/listagem-caso.html';
                        }
                    }, 2000);
                } else {
                    mostrarMensagem(data.error || 'Erro ao atualizar o caso', 'erro');
                }
            } catch (error) {
                console.error('Erro:', error);
                mostrarMensagem('Erro ao conectar com o servidor', 'erro');
            }
        });
    }
    
    // Iniciar carregando os peritos, depois carrega os detalhes do caso
    carregarPeritos();
});