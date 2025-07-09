const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'password123';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    console.log('Password:', password);
    console.log('Hash:', hash);
    
    // Verificar se o hash funciona
    const isValid = await bcrypt.compare(password, hash);
    console.log('Hash válido:', isValid);
  } catch (error) {
    console.error('Erro:', error);
  }
}

generateHash();
