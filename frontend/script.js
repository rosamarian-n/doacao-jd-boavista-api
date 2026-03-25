// Elementos DOM (se não existir, evita erro em index.html)
const btnAnunciar = document.getElementById('btn-anunciar');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const formAnuncio = document.getElementById('form-anuncio');
const itemsList = document.getElementById('items-list');
const filterCategoria = document.getElementById('filter-categoria');
const filterCondicao = document.getElementById('filter-condicao');

let itens = [];

async function buscarItens() {
    if (!itemsList) return;

    try {
        const response = await fetch('http://localhost:8000/items');
        if (response.ok) {
            itens = await response.json();
        } else {
            itens = getItensMock();
        }
    } catch (error) {
        console.error('Erro ao buscar itens:', error);
        itens = getItensMock();
    }

    renderizarItens();
}

function getItensMock() {
    return [
        { id: 1, titulo: 'Camiseta branca', descricao: 'Camiseta branca tamanho M, em ótimo estado.', categoria: 'Roupas', condicao: 'usado' },
        { id: 2, titulo: 'Cadeira de escritório', descricao: 'Cadeira ergonômica para escritório.', categoria: 'Móveis', condicao: 'novo' }
    ];
}

function renderizarItens() {
    if (!itemsList) return;

    const categoriaFiltro = filterCategoria ? filterCategoria.value : '';
    const condicaoFiltro = filterCondicao ? filterCondicao.value : '';

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

async function criarAnuncio(event) {
    if (!formAnuncio) return;

    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descricao = document.getElementById('descricao').value;
    const categoria = document.getElementById('categoria').value;
    const condicao = document.getElementById('condicao').value;

    const novoItem = { titulo, descricao, categoria, condicao };

    try {
        const response = await fetch('http://localhost:8000/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoItem)
        });

        if (response.ok) {
            alert('Anúncio criado com sucesso!');
            formAnuncio.reset();
            if (modal) modal.style.display = 'none';
            buscarItens();
        } else {
            alert('Erro ao criar anúncio. Tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao criar anúncio:', error);
        alert('Erro ao criar anúncio. Verifique se a API está rodando.');
    }
}

function queroDoar(id) {
    alert(`Interesse registrado no item ${id}. Em breve entraremos em contato!`);
}

if (btnAnunciar && modal) {
    btnAnunciar.addEventListener('click', () => {
        modal.style.display = 'block';
    });
}

if (closeModal && modal) {
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

if (formAnuncio) formAnuncio.addEventListener('submit', criarAnuncio);
if (filterCategoria) filterCategoria.addEventListener('change', renderizarItens);
if (filterCondicao) filterCondicao.addEventListener('change', renderizarItens);

window.addEventListener('DOMContentLoaded', buscarItens);
