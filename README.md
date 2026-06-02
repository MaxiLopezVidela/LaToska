# La Toska — Sistema de Gestión de Stock y Ventas

Sistema de gestión de stock y ventas para el local de indumentaria femenina "La Toska", ubicado en Mendoza, Argentina.

## Integrantes

- Becerra, Micaela
- Laspada, Gonzalo
- López Videla, Maximiliano
- Malanca, Luciano
- Rossi, Franco

**Universidad Nacional de Cuyo — Grupo 7 — Metodología y Testing 2026**

## Tecnologías utilizadas

- HTML, CSS, JavaScript (Frontend)
- PHP 8.2 (Backend)
- MySQL / MariaDB (Base de datos)
- XAMPP (Servidor local)
- Playwright (Testing automatizado)

## Estructura del proyecto
LaToska/
├── api/                  # Endpoints PHP (login, registro, CRUD)
├── css/                  # Estilos
├── js/                   # Lógica frontend
├── login.html            # Pantalla de inicio de sesión
├── main.html             # Panel principal
└── BaseDatosLaToska.sql  # Script de base de datos

## Instalación y ejecución

1. Instalar [XAMPP](https://www.apachefriends.org/)
2. Copiar la carpeta del proyecto en `htdocs/latoska`
3. Iniciar Apache y MySQL desde el panel de XAMPP
4. Importar `BaseDatosLaToska.sql` en phpMyAdmin
5. Crear usuario de prueba ejecutando en phpMyAdmin:

```sql
INSERT INTO usuarios (nombre, email, password_hash, auth_provider)
VALUES ('Admin', 'admin@latoska.com', '$2y$10$TtkbusipGFQ0UJ8EDz92v.EZXWn2uZ3SSp31ERkZsjUn5gey069GO', 'local');
```

6. Acceder en el navegador: `http://localhost/latoska/login.html`

## Credenciales de prueba

- **Email:** admin@latoska.com
- **Contraseña:** 123456

## Funcionalidades principales

- Autenticación con email/contraseña y Google OAuth
- Gestión de stock (CRUD de productos)
- Registro de ventas por método de pago
- Calendario de eventos con feriados nacionales
- Cotización del dólar blue en tiempo real