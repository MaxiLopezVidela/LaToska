# 🛍️ La Toska — Sistema de Gestión de Stock y Ventas

Sistema web de administración interna para el local de indumentaria femenina **"La Toska"**, ubicado en Mendoza, Argentina. Diseñado para ejecutarse de forma local en el negocio mediante XAMPP en **Windows**.

---

## 👥 Integrantes — Grupo 7

- Becerra, Micaela
- Laspada, Gonzalo
- López Videla, Maximiliano
- Malanca, Luciano
- Rossi, Franco

**Universidad Nacional de Cuyo — Metodología y Testing — 2026**

---

## 🎯 Propósito

La Toska utilizaba planillas de Excel para registrar productos y ventas. Este sistema reemplaza esos registros manuales con una aplicación web centralizada que permite:

- Controlar el inventario de productos en tiempo real
- Registrar ventas con desglose por método de pago
- Organizar eventos y consultar feriados nacionales
- Ver la cotización del dólar blue actualizada

---

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript (ES Modules) |
| Backend | PHP 8.2 |
| Base de datos | MySQL / MariaDB 10.4 |
| Servidor local | XAMPP (Apache + MySQL) |
| Autenticación | Bcrypt + Google OAuth 2.0 |
| APIs externas | Nager.Date (feriados) · dolarapi.com (dólar blue) |
| Testing | Playwright (Node.js) |

---

## 📋 Requisitos previos

- **[XAMPP](https://www.apachefriends.org/download.html)** — servidor local con PHP 8.2 y MariaDB 10.4 o superior
- **Navegador web moderno** (Chrome, Firefox o Edge)
- **Conexión a internet** (para APIs externas: feriados y dólar blue)

> ⚠️ Esta aplicación está pensada para ejecutarse en **Windows** con XAMPP. También funciona en macOS siguiendo los mismos pasos.

---

## 🚀 Instalación y ejecución

### 1. Instalar XAMPP

1. Descargar XAMPP desde [https://www.apachefriends.org/download.html](https://www.apachefriends.org/download.html)
2. Ejecutar el instalador `.exe` y seguir el asistente (Next, Next, Finish)
3. Abrir el **Panel de Control de XAMPP** e iniciar **Apache** y **MySQL**

### 2. Clonar el repositorio

```bash
git clone https://github.com/MaxiLopezVidela/LaToska.git
```

### 3. Copiar al servidor local

Copiar la carpeta del proyecto a la carpeta `htdocs` de XAMPP:

```
C:\xampp\htdocs\latoska\          ← Windows
/Applications/XAMPP/htdocs/latoska/  ← macOS
```

### 4. Crear la base de datos

1. Abrir [phpMyAdmin](http://localhost/phpmyadmin) en el navegador
2. Crear una base de datos llamada `latoska`
3. Importar el archivo `BaseDatosLaToska.sql` desde la raíz del proyecto

### 5. Crear usuario administrador

Ejecutar el siguiente SQL en phpMyAdmin → pestaña SQL:

```sql
INSERT INTO usuarios (nombre, email, password_hash, auth_provider)
VALUES (
  'Admin',
  'admin@latoska.com',
  '$2y$10$TtkbusipGFQ0UJ8EDz92v.EZXWn2uZ3SSp31ERkZsjUn5gey069GO',
  'local'
);
```

### 6. Acceder al sistema

Abrir el navegador y navegar a:

```
http://localhost/latoska/login.html
```

---

## 🔑 Credenciales de prueba

| Campo | Valor |
|-------|-------|
| Email | `admin@latoska.com` |
| Contraseña | `123456` |

---

## ⚙️ Variables de entorno

Este proyecto no utiliza variables de entorno. La configuración de la base de datos se encuentra en `api/db.php`:

```php
$host = 'localhost';
$dbname = 'latoska';
$user = 'root';
$pass = '';
```

Si tu instalación de XAMPP usa una contraseña diferente para `root`, modificar el valor de `$pass` en ese archivo.

---

## 📁 Estructura del proyecto

```
LaToska/
├── api/                        # Endpoints PHP (backend)
│   ├── auth_login.php          # Login con email y contraseña
│   ├── auth_register.php       # Registro de usuarios
│   ├── auth_logout.php         # Cierre de sesión
│   ├── auth_session.php        # Verificación de sesión activa
│   ├── auth_google.php         # Login con Google OAuth
│   ├── db.php                  # Conexión a la base de datos
│   ├── get_productos.php       # Listar productos
│   ├── add_producto.php        # Agregar producto (con transacciones)
│   ├── edit_producto.php       # Editar producto (con transacciones)
│   ├── delete_producto.php     # Eliminar producto
│   ├── get_options.php         # Opciones para selects (marcas, etc.)
│   └── seed_data.php           # Datos iniciales de prueba
├── css/
│   ├── style.css               # Estilos del panel principal
│   └── login.css               # Estilos de la pantalla de login
├── js/
│   ├── auth.js                 # Lógica de autenticación (frontend)
│   └── app.js                  # Lógica del panel principal
├── docs/
│   ├── guia_usuario.md         # Guía de uso del sistema
│   ├── documentacion_tecnica.md# Arquitectura y decisiones técnicas
│   └── pruebas_regresion.md    # Reporte de pruebas de regresión
├── testing/
│   ├── tests/regression.spec.js# Suite de pruebas automatizadas
│   ├── evidencias/             # Capturas de pantalla por caso de prueba
│   └── playwright-report/      # Reporte HTML de Playwright
├── login.html                  # Pantalla de inicio de sesión y registro
├── main.html                   # Panel principal del sistema
├── BaseDatosLaToska.sql        # Script de creación e inicialización de BD
└── README.md                   # Este archivo
```

---

## 🧪 Pruebas automatizadas

Las pruebas de regresión se encuentran en `testing/` e incluyen 24 casos de prueba automatizados con Playwright cubriendo autenticación, CRUD de productos, navegación, APIs externas y registro de ventas.

Ver el reporte completo en [`docs/pruebas_regresion.md`](docs/pruebas_regresion.md).

---

## 📖 Documentación adicional

- [Guía de usuario](docs/guia_usuario.md)
- [Documentación técnica](docs/documentacion_tecnica.md)
- [Reporte de pruebas de regresión](docs/pruebas_regresion.md)

---

## 🖥️ Despliegue

Este sistema está diseñado para uso **local en el negocio** mediante XAMPP. No requiere conexión a un servidor externo. La aplicación se ejecuta en la computadora del local y se accede desde el navegador en `http://localhost/latoska/`.

---

*Proyecto académico — Metodología y Testing — Universidad Nacional de Cuyo — 2026*
