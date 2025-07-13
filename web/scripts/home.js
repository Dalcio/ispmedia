// Interações JS específicas da home
window.initHomePage = function () {
  updateNavbarAuth();

  // Garante que o botão Login sempre abre o modal
  document.body.addEventListener("click", function (e) {
    const loginLink = e.target.closest('a[data-page="login"]');
    if (loginLink) {
      e.preventDefault();
      showLoginModal();
    }
  });

  // Card upload abre modal login se não logado
  const uploadCard = document.getElementById("upload-card");
  if (uploadCard) {
    uploadCard.addEventListener("click", function () {
      if (!Session.isAuthenticated()) {
        showLoginModal();
      } else {
        // abrir modal de upload futuramente
        renderAlert("Upload disponível em breve!");
      }
    });
  }
};

function showLoginModal() {
  fetch("components/modal-auth.html")
    .then((res) => res.text())
    .then((html) => {
      let modalDiv = document.createElement("div");
      modalDiv.innerHTML = html;
      document.body.appendChild(modalDiv);
      let modal = new bootstrap.Modal(document.getElementById("modalAuth"));
      document
        .getElementById("modalAuth")
        .classList.add("animate__animated", "animate__fadeInDown");
      modal.show();
      // Form handler
      const loginForm = document.getElementById("loginForm");
      loginForm.onsubmit = async function (e) {
        e.preventDefault();
        const username = loginForm.username.value.trim();
        const password = loginForm.password.value.trim();
        document.getElementById("loginError").style.display = "none";
        if (!username || !password) {
          document.getElementById("loginError").textContent =
            "Preencha todos os campos.";
          document.getElementById("loginError").style.display = "block";
          return;
        }
        const result = await Session.login(username, password);
        if (result.error) {
          document.getElementById("loginError").textContent = result.error;
          document.getElementById("loginError").style.display = "block";
        } else {
          modal.hide();
          document.body.removeChild(modalDiv);
          updateNavbarAuth();
        }
      };
      // Remove modal from DOM on close
      document
        .getElementById("modalAuth")
        .addEventListener("hidden.bs.modal", () => {
          document.body.removeChild(modalDiv);
        });
    });
}

function updateNavbarAuth() {
  const user = Session.getUser();
  const nav = document.querySelector(".navbar-nav");
  if (!nav) return;
  nav.innerHTML = "";
  if (Session.isAuthenticated() && user) {
    nav.innerHTML = `
      <li class="nav-item">
        <span class="nav-link text-primary fw-bold">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" style="vertical-align:middle;margin-right:4px;"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5z" stroke="#FDC500" stroke-width="2"/></svg>
          ${user.username}
        </span>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" id="logoutBtn">Sair</a>
      </li>
    `;
    document.getElementById("logoutBtn").onclick = function (e) {
      e.preventDefault();
      Session.logout();
      updateNavbarAuth();
    };
  } else {
    nav.innerHTML = `
      <li class="nav-item">
        <a class="nav-link active" aria-current="page" href="#" data-page="home">Início</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" data-page="upload">Upload</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" id="loginBtn">Login</a>
      </li>
    `;
    document.getElementById("loginBtn").onclick = function (e) {
      e.preventDefault();
      showLoginModal();
    };
  }
}

// SPA: bloqueia rotas protegidas se não logado
function isProtectedRoute(route) {
  return ["upload", "dashboard", "profile"].includes(route);
}

// Executa apenas uma vez ao carregar a view home
if (typeof window.ISPMediaHomeInit === "undefined") {
  window.ISPMediaHomeInit = true;
  document.addEventListener("DOMContentLoaded", initHomePage);
}
