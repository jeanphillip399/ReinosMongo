const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
    try {
        await prisma.$connect();
        console.log("✅ Conexão com MongoDB estabelecida!");
        
        const users = await prisma.user.findMany();
        console.log("Usuários encontrados:", users);
    } catch (error) {
        console.error("❌ Erro ao conectar com MongoDB:", error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();