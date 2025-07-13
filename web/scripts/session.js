const Session = {
  login: async function (username, password) {
    if (!username || !password) {
      return { error: "Preencha todos os campos." };
    }
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) {
        return { error: data.error || "Credenciais inválidas." };
      }
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("user", JSON.stringify(data.user));
      return { user: data.user, token: data.token };
    } catch (err) {
      return { error: "Erro de conexão." };
    }
  },
  isAuthenticated: function () {
    return !!sessionStorage.getItem("token");
  },
  logout: function () {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  },
  getUser: function () {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
