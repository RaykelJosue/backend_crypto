# 🚀 API de Criptomonedas

Backend en Node.js, TypeScript y PostgreSQL para la gestión de criptomonedas, autenticación y replicación de datos históricos.

---

## 📌 🔹 **Instrucciones de instalación**

### **1️⃣ Requisitos previos**
✔ Tener **Node.js** instalado (`v18+`).  
✔ Tener **PostgreSQL** configurado (`v14+`).  
✔ Tener **Git** instalado.  

### **2️⃣ Clonar el repositorio**
```bash
git clone https://github.com/RaykelJosue/backend_crypto.git
cd backend_crypto
```


### **3️⃣ Instalar dependencias**
```bash
npm install
```

### **4️⃣ Configurar variables de entorno**
📌 Copia .env.example, renómbralo a .env, y ajusta los valores:
```bash
cp .env.example .env
📌 Modifica valores si es necesario (credenciales de PostgreSQL).
```

### **5️⃣ Ejecutar las migraciones en PostgreSQL**
```bash
npm run migrate
📌 Esto creará la estructura de la base de datos.
```

### **6️⃣ Iniciar el servidor**
```bash
npm start
📌 El backend correrá en http://localhost:3000.
```

📌 🔹 Ejemplo de peticiones en Postman
✅ Registro de usuario (POST /auth/register)
URL: http://localhost:3000/auth/register

Body (JSON):
```bash
json
{
    "email": "email_of_user@example.com",
    "password": "12345678"
}
```
✅ Debe devolver un usuario registrado.

✅ Login de usuario (POST /auth/login)
URL: http://localhost:3000/auth/login

Body (JSON):
```bash
json
{
    "email": "email_of_user@example.com",
    "password": "12345678"
}
```
✅ Debe devolver un token JWT que se usará en las siguientes solicitudes.

✅ Obtener todas las criptomonedas (GET /criptomoneda)
URL: http://localhost:3000/criptomoneda

Headers:

Authorization: Bearer <TOKEN> ✅ Debe devolver un array con las criptomonedas registradas.

✅ Crear una criptomoneda (POST /criptomoneda)
URL: http://localhost:3000/criptomoneda

Headers:

Authorization: Bearer <TOKEN>

Body (JSON):
```bash
json
{
    "nombre": "Ethereum",
    "simbolo": "ETH",
    "precio": 3200,
    "codigoMoneda": "USD"
}
```
✅ Debe devolver la criptomoneda creada y vinculada a la moneda.

✅ Ejecutar replicación de datos históricos
📌 Ejecuta la replicación manualmente para mover registros antiguos:

```bash
npm run replicar
```
📌 Esto moverá registros de criptomoneda a historico_criptomonedas.