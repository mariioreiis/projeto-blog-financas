function obterParametroURL(nome) {
  const params = new URLSearchParams(window.location.search);
  return params.get(nome);
}

async function carregarPost() {
  const nomePost = obterParametroURL("post");
  const container = document.getElementById("post-content");
  if (!container || !nomePost) return;

  try {
    const res = await fetch(`posts/${nomePost}`);
    if (!res.ok) throw new Error(`Post ${nomePost} não encontrado.`);
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

    const htmlContent = marked.parse(markdown);

    container.innerHTML = `
      <article>
        <h1>${metadados.title}</h1>
        <p><small>${metadados.date}</small></p>
        <img src="${metadados.image}" class="img-fluid mb-3" />
        <div>${htmlContent}</div>
      </article>
    `;
  } catch (erro) {
    container.innerHTML = `<p>Erro ao carregar post.</p>`;
    console.error(erro);
  }
}

document.addEventListener('DOMContentLoaded', carregarPost);
