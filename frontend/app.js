// Elementos DOM
const btnAnunciar = document.getElementById('btn-anunciar');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const formAnuncio = document.getElementById('form-anuncio');
const itemsList = document.getElementById('items-list');
const filterCategoria = document.getElementById('filter-categoria');
const filterCondicao = document.getElementById('filter-condicao');

// Dados dos itens (simulados até a API estar pronta)
let itens = [];

// Função para buscar itens da API
async function buscarItens() {
    try {
        const response = await fetch('http://localhost:8000/items');
        if (response.ok) {
            itens = await response.json();
        } else {
            // Dados simulados se a API não estiver pronta
            itens = [
                {
                    id: 1,
                    titulo: 'Camiseta branca',
                    descricao: 'Camiseta branca tamanho M, em ótimo estado.',
                    categoria: 'Roupas',
                    condicao: 'usado'
                },
                {
                    id: 2,
                    titulo: 'Cadeira de escritório',
                    descricao: 'Cadeira ergonômica para escritório.',
                    categoria: 'Móveis',
                    condicao: 'novo'
                }
            ];
        }
        renderizarItens();
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        // Usar dados simulados em caso de erro
        itens = [
            {
                id: 1,
                titulo: 'Camiseta branca',
                descricao: 'Camiseta branca tamanho M, em ótimo estado.',
                categoria: 'Roupas',
                condicao: 'usado'
            },
            {
                id: 2,
                titulo: 'Cadeira de escritório',
                descricao: 'Cadeira ergonômica para escritório.',
                categoria: 'Móveis',
                condicao: 'novo'
            }
        ];
        renderizarItens();
    }
}

// Função para renderizar itens
function renderizarItens() {
    const categoriaFiltro = filterCategoria.value;
    const condicaoFiltro = filterCondicao.value;

    const itensFiltrados = itens.filter(item => {
        const matchCategoria = !categoriaFiltro || item.categoria === categoriaFiltro;
        const matchCondicao = !condicaoFiltro || item.condicao === condicaoFiltro;
        return matchCategoria && matchCondicao;
    });

    itemsList.innerHTML = '';

    itensFiltrados.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <img src="https://via.placeholder.com/300x200?text=Imagem+do+Item" alt="Imagem do item">
            <div class="content">
                <h3>${item.titulo}</h3>
                <p>${item.descricao}</p>
                <div class="meta">
                    <strong>Categoria:</strong> ${item.categoria}<br>
                    <strong>Condição:</strong> ${item.condicao}
                </div>
                <button class="btn-secondary" onclick="queroDoar(${item.id})">Quero doar</button>
            </div>
        `;
        itemsList.appendChild(card);
    });
}

// Função para criar anúncio
async function criarAnuncio(event) {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const categoria = document.getElementById('categoria').value;
    const condicao = document.getElementById('condicao').value;

    const novoItem = {
        titulo,
        descricao,
        categoria,
        condicao
    };

    try {
        const response = await fetch('http://localhost:8000/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoItem)
        });

        if (response.ok) {
            alert('Anúncio criado com sucesso!');
            formAnuncio.reset();
            modal.style.display = 'none';
            buscarItens(); // Recarregar lista
        } else {
            alert('Erro ao criar anúncio. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao criar anúncio:', error);
        alert('Erro ao criar anúncio. Verifique se a API está rodando.');
    }
}

// Função placeholder para "Quero doar"
function queroDoar(id) {
    alert(`Interesse registrado no item ${id}. Em breve entraremos em contato!`);
}

// Event listeners
btnAnunciar.addEventListener('click', () => {
    modal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

formAnuncio.addEventListener('submit', criarAnuncio);

filterCategoria.addEventListener('change', renderizarItens);
filterCondicao.addEventListener('change', renderizarItens);

// Inicializar
document.addEventListener('DOMContentLoaded', buscarItens);