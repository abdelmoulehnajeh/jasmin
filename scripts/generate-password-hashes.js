// Script pour générer les hash bcrypt valides
const bcrypt = require('bcryptjs');

async function generateHashes() {
  console.log('🔐 Génération des hash bcrypt...\n');
  
  // Admin password: Admin@123
  const adminHash = await bcrypt.hash('Admin@123', 10);
  console.log('Admin (Admin@123):');
  console.log(adminHash);
  console.log('');
  
  // User password: User@123
  const userHash = await bcrypt.hash('User@123', 10);
  console.log('User (User@123):');
  console.log(userHash);
  console.log('');
  
  // SQL Update statements
  console.log('📝 Commandes SQL à exécuter:\n');
  console.log(`UPDATE users SET password = '${adminHash}' WHERE email = 'admin@carrental.com';`);
  console.log(`UPDATE users SET password = '${userHash}' WHERE email = 'user@test.com';`);
  console.log('');
  
  // Test les hash
  console.log('✅ Test des hash:');
  console.log('Admin password match:', await bcrypt.compare('Admin@123', adminHash));
  console.log('User password match:', await bcrypt.compare('User@123', userHash));
}

generateHashes().catch(console.error);
