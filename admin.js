// 🔐 LOGIN REAL
async function login() {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: senha
  });

  if (error) {
    alert("Email ou senha inválidos");
  } else {
    iniciarDashboard();
  }
}

// 🔁 VERIFICAR SESSÃO AO ABRIR
async function verificarSessao() {
  const { data } = await supabase.auth.getSession();

  if (data.session) {
    iniciarDashboard();
  }
}

// 🚀 INICIAR DASHBOARD
function iniciarDashboard() {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");

  carregar();
}

// 🚪 LOGOUT
async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

// 📊 CARREGAR DADOS
async function carregar() {
  const { data: chapas } = await supabase.from("chapas").select("*");
  const { data: votos } = await supabase.from("votos").select("*");

  let total = votos.length;

  let html = `<h3>Total de votos: ${total}</h3>`;

  chapas.forEach(c => {
    const count = votos.filter(v => v.chapa_id === c.id).length;
    const percent = total ? ((count / total) * 100).toFixed(1) : 0;

    html += `
      <p><b>${c.nome}</b>: ${count} votos (${percent}%)</p>
    `;
  });

  const branco = votos.filter(v => v.chapa_id === null).length;
  html += `<p><b>Branco:</b> ${branco}</p>`;

  document.getElementById("resultados").innerHTML = html;
}

// ➕ CRIAR CHAPA
async function criar() {
  const nome = document.getElementById("nome").value;
  const lema = document.getElementById("lema").value;
  const logo = document.getElementById("logo").value;

  const { error } = await supabase.from("chapas").insert({
    nome,
    lema,
    logo_url: logo
  });

  if (error) {
    alert("Erro ao criar chapa");
  } else {
    alert("Chapa criada com sucesso!");
    carregar();
  }
}

// 🔄 INICIAR AO CARREGAR
verificarSessao();
