let selecionada = null;

document.getElementById("home").onclick = async () => {
  document.getElementById("home").classList.add("hidden");
  document.getElementById("votacao").classList.remove("hidden");
  carregarChapas();
};

async function carregarChapas() {
  const { data } = await supabase.from("chapas").select("*");

  const container = document.getElementById("chapas");
  container.innerHTML = "";

  data.forEach(c => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${c.logo_url}" width="80"><br>
      <b>${c.nome}</b><br>
      <small>${c.lema || ""}</small>
    `;
    div.onclick = () => selecionar(c);
    container.appendChild(div);
  });

  // voto em branco
  const branco = document.createElement("div");
  branco.className = "card";
  branco.innerHTML = "<b>VOTO EM BRANCO</b>";
  branco.onclick = () => selecionar(null);
  container.appendChild(branco);
}

function selecionar(chapa) {
  selecionada = chapa;

  document.getElementById("votacao").classList.add("hidden");
  document.getElementById("confirmacao").classList.remove("hidden");

  document.getElementById("nomeChapa").innerText =
    chapa ? chapa.nome : "VOTO EM BRANCO";
}

function voltar() {
  document.getElementById("confirmacao").classList.add("hidden");
  document.getElementById("votacao").classList.remove("hidden");
}

async function confirmar() {
  const dispositivo = localStorage.getItem("id") || crypto.randomUUID();
  localStorage.setItem("id", dispositivo);

  await supabase.from("votos").insert({
    chapa_id: selecionada?.id || null,
    dispositivo_id: dispositivo
  });

  document.getElementById("urna").play();

  document.getElementById("confirmacao").classList.add("hidden");
  document.getElementById("final").classList.remove("hidden");

  setTimeout(() => location.reload(), 3000);
}
