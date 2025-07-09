// Teste simples para verificar se a API está funcionando
console.log("🧪 Testando API ISPMedia...");

const API_BASE_URL = "http://localhost:3000/api";

// Teste de health check
async function testHealthCheck() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log("✅ Health Check:", data);
    return true;
  } catch (error) {
    console.log("❌ Health Check falhou:", error.message);
    return false;
  }
}

// Teste de login
async function testLogin() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin",
        password: "password123",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Login Admin:", {
      user: data.user.username,
      role: data.user.role,
      tokenExists: !!data.token,
    });
    return data.token;
  } catch (error) {
    console.log("❌ Login falhou:", error.message);
    return null;
  }
}

// Teste de obter músicas
async function testGetMusics() {
  try {
    const response = await fetch(`${API_BASE_URL}/musics?limit=3`);
    const data = await response.json();
    console.log("✅ Obter Músicas:", {
      total: data.pagination.total,
      músicas: data.musics.map((m) => m.title),
    });
    return true;
  } catch (error) {
    console.log("❌ Obter músicas falhou:", error.message);
    return false;
  }
}

// Teste de criar artista (requer autenticação)
async function testCreateArtist(token) {
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/artists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: "Pink Floyd",
        bio: "Banda britânica de rock progressivo",
        genre: "Rock Progressivo",
        country: "Reino Unido",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    const data = await response.json();
    console.log("✅ Criar Artista:", data.artist.name);
    return true;
  } catch (error) {
    console.log("❌ Criar artista falhou:", error.message);
    return false;
  }
}

// Executar todos os testes
async function runTests() {
  console.log("🚀 Iniciando testes da API...\n");

  const healthOk = await testHealthCheck();
  if (!healthOk) {
    console.log("❌ Servidor não está rodando. Execute: npm start");
    return;
  }

  const token = await testLogin();
  await testGetMusics();
  await testCreateArtist(token);

  console.log("\n🏁 Testes concluídos!");
  console.log("\n📚 Para mais exemplos, veja API_EXAMPLES.md");
  console.log("🌐 API rodando em: http://localhost:3000");
}

// Executar se for chamado diretamente
if (typeof window === "undefined") {
  // Node.js
  const fetch = require("node-fetch");
  runTests();
} else {
  // Browser
  runTests();
}
