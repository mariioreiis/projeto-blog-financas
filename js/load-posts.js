async function carregarPosts() {
  const container = document.getElementById('posts-container');
  if (!container) return;

  const arquivos = ['como-comecar-a-investir.md','como-montar-carteira-2025.md', 'fundos-imobiliarios-2025.md', 'investimentos-sustentaveis.md', 'renda-fixa-em-alta.md', 'setores-promissores-2025.md'];

  for (let arquivo of arquivos) {
    try {
      const res = await fetch(`posts/${arquivo}`);
      if (!res.ok) throw new Error(`Erro ao carregar ${arquivo}`);
      const texto = await res.text();

      const metaRegex = /---([\s\S]*?)---/;
      const metaMatch = texto.match(metaRegex);
      const metaTexto = metaMatch ? metaMatch[1] : '';
      const markdown = texto.replace(metaRegex, '');

      const metadados = {};
      metaTexto.split('\n').forEach(linha => {
        const [chave, ...resto] = linha.split(':');
        if (chave && resto.length) {
          metadados[chave.trim()] = resto.join(':').trim().replace(/"/g, '');
        }
      });

      const postHTML = `
        <div class="card-post" >
          <img src="${metadados.image}" />
          <h2>${metadados.title}</h2>
          <p><small>${metadados.date}</small></p>
          <a href="post.html?post=${arquivo}" class="btn btn-primary" text-center back-button>Leia mais</a>
        </div>
      `;

      container.innerHTML += postHTML;

    } catch (erro) {
      console.error("Erro ao carregar post:", erro);
    }
  }
}

document.addEventListener('DOMContentLoaded', carregarPosts);
