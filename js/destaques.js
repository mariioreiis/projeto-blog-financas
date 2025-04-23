async function carregarDestaques() {
  const res = await fetch('js/views.json');
  const views = await res.json();

  const arquivosOrdenados = Object.entries(views)
    .sort((a, b) => b[1] - a[1]) // Ordena por número de visualizações (desc)
    .map(([arquivo]) => arquivo);

  const destaquePrincipal = arquivosOrdenados[0];
  const outrosDestaques = arquivosOrdenados.slice(1, 5); // 4 destaques abaixo

  await carregarPostCard(destaquePrincipal, 'post-destaque', true);

  for (const post of outrosDestaques) {
    await carregarPostCard(post, 'destaques-container', false);
  }

  await carregarTodosPosts([destaquePrincipal, ...outrosDestaques]);
}

async function carregarPostCard(arquivo, containerId, isPrincipal = false) {
  try {
    const res = await fetch(`posts/${arquivo}`);
    const texto = await res.text();

    const metaMatch = texto.match(/---([\s\S]*?)---/);
    const metaTexto = metaMatch ? metaMatch[1] : '';

    const metadados = {};
    metaTexto.split('\n').forEach(linha => {
      const [chave, ...resto] = linha.split(':');
      if (chave && resto.length) {
        metadados[chave.trim()] = resto.join(':').trim().replace(/"/g, '');
      }
    });

    const container = document.getElementById(containerId);

    if (isPrincipal) {
      container.innerHTML = `
        <img src="${metadados.image}" class="img-fluid rounded-start d-none d-md-block" alt="${metadados.title}" style="width: 40%; object-fit: cover;">
        <div class="card-body">
          <h2 class="card-title">${metadados.title}</h2>
          <p class="card-text"><small>${metadados.date}</small></p>
          <a href="post.html?post=${arquivo}" class="btn btn-primary">Leia mais</a>
        </div>
      `;
    } else {
      container.innerHTML += `
        <div class="col-md-3">
          <div class="card h-100">
            <img src="${metadados.image}" class="card-img-top" alt="${metadados.title}" style="height: 150px; object-fit: cover;">
            <div class="card-body">
              <h5 class="card-title">${metadados.title}</h5>
              <p class="card-text"><small>${metadados.date}</small></p>
              <a href="post.html?post=${arquivo}" class="btn btn-sm btn-outline-primary">Leia mais</a>
            </div>
          </div>
        </div>
      `;
    }
  } catch (err) {
    console.error("Erro ao carregar destaque:", err);
  }
}

async function carregarTodosPosts(excluirArquivos = []) {
  const viewsRes = await fetch('js/views.json');
  const views = await viewsRes.json();

  const todosArquivos = Object.keys(views).filter(arq => !excluirArquivos.includes(arq));

  for (const arq of todosArquivos) {
    await carregarPostVertical(arq, 'todos-posts');
  }
}

async function carregarPostVertical(arquivo, containerId) {
  try {
    const res = await fetch(`posts/${arquivo}`);
    const texto = await res.text();

    const metaMatch = texto.match(/---([\s\S]*?)---/);
    const metaTexto = metaMatch ? metaMatch[1] : '';

    const metadados = {};
    metaTexto.split('\n').forEach(linha => {
      const [chave, ...resto] = linha.split(':');
      if (chave && resto.length) {
        metadados[chave.trim()] = resto.join(':').trim().replace(/"/g, '');
      }
    });

    const container = document.getElementById(containerId);
    const postHTML = `
      <div class="card flex-row">
        <img src="${metadados.image}" class="img-fluid rounded-start" alt="${metadados.title}" style="width: 250px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${metadados.title}</h5>
          <p class="card-text"><small>${metadados.date}</small></p>
          <a href="post.html?post=${arquivo}" class="btn btn-sm btn-outline-primary">Leia mais</a>
        </div>
      </div>
    `;

    container.innerHTML += postHTML;
  } catch (err) {
    console.error("Erro ao carregar post completo:", err);
  }
}

carregarDestaques();
