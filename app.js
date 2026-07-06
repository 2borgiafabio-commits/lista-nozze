const euro = n => "€" + n.toLocaleString("it-IT");

async function carica() {
  const res = await fetch("items.json", { cache: "no-store" });
  const dati = await res.json();

  // Regali con foto
  const grid = document.getElementById("grid-regali");
  grid.innerHTML = dati.regali.map(r => `
    <article class="card ${r.regalato ? "regalato" : ""}" id="${r.id}">
      <div class="didascalia">${r.titolo}</div>
      <div class="foto-wrap">
        <img src="${r.foto}" alt="${r.titolo}" loading="lazy">
        <span class="nastro">Già regalato ❤</span>
      </div>
      <div class="prezzo">${euro(r.prezzo)}</div>
    </article>
  `).join("");

  // Corredo
  const riga = v => `
    <li class="${v.regalato ? "regalato-riga" : ""}" id="${v.id}">
      <span class="voce">${v.titolo}</span>
      ${v.regalato
        ? '<span class="badge">Già regalato ❤</span>'
        : `<span class="prezzo-riga">${euro(v.prezzo)}</span>`}
    </li>`;
  document.getElementById("lista-letto").innerHTML = dati.corredo_letto.map(riga).join("");
  document.getElementById("lista-bagno").innerHTML = dati.corredo_bagno.map(riga).join("");

  // Viaggio
  if (dati.viaggio.regalato) {
    const fig = document.getElementById("viaggio-fig");
    fig.classList.add("regalato");
    fig.querySelector("img").insertAdjacentHTML("afterend", '<span class="nastro">Già regalato ❤</span>');
    fig.querySelector(".nastro").style.display = "block";
  }
}

carica();

// Copia IBAN
document.getElementById("copia-iban").addEventListener("click", async e => {
  const iban = document.getElementById("iban").textContent.trim();
  try {
    await navigator.clipboard.writeText(iban);
    e.target.textContent = "Copiato ✓";
  } catch {
    // fallback per browser datati
    const sel = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(document.getElementById("iban"));
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand("copy");
    e.target.textContent = "Copiato ✓";
  }
  setTimeout(() => { e.target.textContent = "Copia IBAN"; }, 2500);
});
