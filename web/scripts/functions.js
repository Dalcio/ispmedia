// Funções utilitárias SPA
function loadView(path, callback) {
  fetch(path)
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("conteudo").innerHTML = html;
      if (typeof callback === "function") callback();
    });
}

function loadComponent(path, selector) {
  fetch(path)
    .then((res) => res.text())
    .then((html) => {
      document.querySelector(selector).innerHTML = html;
    });
}

function renderAlert(message, type = "info") {
  // Placeholder para feedback visual
  alert(message);
}
