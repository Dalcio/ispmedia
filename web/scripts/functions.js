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

if (!Session.getToken) {
  Session.getToken = function() {
    return sessionStorage.getItem('token');
  };
}

async function uploadMusic(file, onProgress) {
  const token = Session.getToken ? Session.getToken() : sessionStorage.getItem('token');
  if (!token) {
    throw new Error("Faça login para enviar ficheiros.");
  }
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("music", file);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/api/upload/music", true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          resolve(res);
        } catch (e) {
          reject(new Error("Resposta inválida do servidor."));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.error || "Falha no upload"));
        } catch (e) {
          reject(new Error("Falha no upload"));
        }
      }
    };
    xhr.onerror = function() {
      reject(new Error("Erro de conexão."));
    };
    if (xhr.upload && typeof onProgress === 'function') {
      xhr.upload.onprogress = function(e) {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent);
        }
      };
    }
    xhr.send(formData);
  });
}
