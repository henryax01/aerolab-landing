# 🗄️ Configurar MongoDB para la Plataforma

## Opción 1: MongoDB Local (Rápido - Sin registrarse)

### Windows:
1. **Descargar MongoDB Community**: https://www.mongodb.com/try/download/community
2. **Instalar**: Ejecuta el instalador y sigue los pasos (usar opciones por defecto)
3. **Crear carpeta de datos**:
   ```powershell
   mkdir C:\data\db
   ```
4. **Iniciar MongoDB** (en PowerShell como Administrador):
   ```powershell
   "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --dbpath C:\data\db
   ```
5. **Verificar en otra terminal**: 
   ```powershell
   mongosh
   ```
   Deberías ver `test>` si está conectado ✅

### macOS/Linux:
```bash
brew install mongodb-community
brew services start mongodb-community
mongosh
```

---

## Opción 2: MongoDB Atlas (Cloud - RECOMENDADO para producción)

### Pasos:
1. **Crear cuenta**: https://www.mongodb.com/cloud/atlas (gratis)
2. **Crear un cluster gratuito**: 
   - Click "Create" → "Database"
   - Selecciona "Shared" (gratis)
   - Elige región más cercana
3. **Crear usuario de base de datos**:
   - Ve a "Database Access" → "Add New Database User"
   - Crea usuario: `admin` / contraseña aleatoria
4. **Permitir conexiones**:
   - Ve a "Network Access" → "Add IP Address"
   - Permite acceso desde cualquier lugar: `0.0.0.0/0`
5. **Obtener conexión string**:
   - Click "Connect" → "Drivers"
   - Copia la URL (reemplaza `<password>` con tu contraseña)
6. **Editar `.env`**:
   ```
   MONGODB_URL=mongodb+srv://admin:PASSWORD@cluster0.xxxxx.mongodb.net/landing-project?retryWrites=true&w=majority
   ```

---

## ✅ Verificar que funciona

```powershell
npm start
```

Deberías ver:
```
✅ Conectado a MongoDB
✅ Usuario administrador creado: admin@miempresa.com / admin123
🚀 Servidor iniciado en http://localhost:8080
```

---

## 🔧 Comandos útiles MongoDB

```powershell
# Conectar a MongoDB local
mongosh

# Ver bases de datos
show dbs

# Usar una base de datos
use landing-project

# Ver colecciones
show collections

# Ver documentos de usuarios
db.users.find()

# Ver pedidos
db.orders.find()

# Ver mensajes
db.messages.find()
```

---

Si necesitas ayuda, pregunta en la terminal 💬
