# Plataforma de Calistenia

Ver `.env.example` para las variables de entorno necesarias.

## Deploy en Vercel

1. Importa este repositorio en https://vercel.com/new
2. Configura las variables de entorno (copiadas de `.env.example`, con tus valores reales)
3. Deploy
4. Corre las migraciones y el seed una vez desplegado:
   - `npx prisma migrate deploy`
   - `npx tsx prisma/seed.ts`

## Admin

Usuario admin inicial: variable `ADMIN_EMAIL` / `ADMIN_PASSWORD` (por defecto en `.env.example`).
Cambia la contraseña después de tu primer ingreso.
