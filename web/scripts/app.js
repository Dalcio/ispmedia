// SPA router + carregamento de views
const routes = {
  home: "app/home/home.html",
};

function handleRoute(route) {
  loadView(routes[route] || routes.home);
}

function setupLinks() {
  document.body.addEventListener("click", function (e) {
    const link = e.target.closest("[data-page]");
    if (link) {
      e.preventDefault();
      handleRoute(link.getAttribute("data-page"));
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadComponent("components/navbar.html", "#header");
  loadComponent("components/footer.html", "#footer");
  loadView("app/home/home.html", function () {
    if (window.initHomePage) window.initHomePage();
  });
  setupLinks();
});
