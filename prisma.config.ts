import { defineConfig } from 'prisma/config';
import 'dotenv/config'; // Charge les variables d'environnement

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});