# Documentación Técnica — La Toska

## Arquitectura general del sistema

El sistema sigue una arquitectura **cliente-servidor de tres capas** ejecutada localmente mediante XAMPP:

```
┌─────────────────────────────────────────────────────┐
│                    NAVEGADOR (Cliente)               │
│   HTML5 + CSS3 + JavaScript (ES Modules)             │
│   login.html · main.html · js/auth.js · js/app.js   │
└──────────────────────────┬──────────────────────────┘
                           │ HTTP (fetch / XMLHttpRequest)
┌──────────────────────────▼──────────────────────────┐
│                   APACHE / PHP 8.2                   │
│   api/auth_login.php · api/auth_register.php         │
│   api/get_productos.php · api/add_producto.php       │
│   api/edit_producto.php · api/delete_producto.php    │
└──────────────────────────┬──────────────────────────┘
                           │ PDO / MySQLi
┌──────────────────────────▼──────────────────────────┐
│                  MySQL / MariaDB 10.4                │
│   Base de datos: latoska                             │
│   Tablas: usuarios · productos · marcas              │
│            colecciones · tipos_prenda                │
└─────────────────────────────────────────────────────┘
```

---

## Stack tecnológico

| Componente | Tecnología | Versión |
|------------|-----------|---------|
| Frontend | HTML5, CSS3, JavaScript | ES Modules |
| Backend | PHP | 8.2 |
| Base de datos | MySQL / MariaDB | 10.4 |
| Servidor local | XAMPP (Apache) | 8.2.4 |
| Autenticación Google | Google Identity Services | OAuth 2.0 |
| API feriados | Nager.Date | v3 |
| API dólar blue | dolarapi.com | REST pública |
| Testing | Playwright | 1.x (Node.js) |

---

## Organización del proyecto

```
LaToska/
├── api/                    # Backend PHP (endpoints REST)
├── css/                    # Hojas de estilo
├── js/                     # Lógica frontend
├── docs/                   # Documentación
├── login.html              # Punto de entrada: autenticación
├── main.html               # Panel principal de la aplicación
└── BaseDatosLaToska.sql    # Script de BD con estructura y datos seed
```

---

## Módulos y componentes principales

### Frontend

**`js/auth.js`** — Gestión de autenticación:
- Manejo del formulario de login y registro
- Validaciones en cliente (formato de email, longitud de contraseña, coincidencia)
- Integración con Google Identity Services (OAuth 2.0)
- Manejo de sesión: verificación al cargar `main.html`, redirección sin sesión

**`js/app.js`** — Lógica del panel principal:
- Módulo Stock: CRUD de productos con llamadas a la API PHP
- Módulo Ventas: registro y visualización de ventas con totales acumulados
- Módulo Calendario: renderizado, navegación de meses, eventos personalizados
- Widget dólar: consumo de dolarapi.com con manejo de error degradado
- Widget feriados: consumo de Nager.Date con caché por año y manejo de error degradado

### Backend

**`api/db.php`** — Conexión PDO a MySQL.

**`api/auth_login.php`** — Verifica email y contraseña con `password_verify()`. Inicia sesión PHP.

**`api/auth_register.php`** — Valida datos, hashea contraseña con `PASSWORD_BCRYPT`, inserta usuario con transacción.

**`api/auth_logout.php`** — Destruye la sesión PHP y redirige al login.

**`api/auth_session.php`** — Verifica si hay sesión activa y devuelve datos del usuario.

**`api/auth_google.php`** — Verifica el token de Google, crea o recupera el usuario en la BD.

**`api/add_producto.php`** — Inserta producto con `beginTransaction/commit/rollBack`.

**`api/edit_producto.php`** — Actualiza producto con `beginTransaction/commit/rollBack`.

**`api/delete_producto.php`** — Elimina producto por ID.

**`api/get_productos.php`** — Devuelve lista de productos con JOINs a marcas, colecciones y tipos_prenda.

**`api/get_options.php`** — Devuelve opciones para los selects del formulario de producto.

**`api/seed_data.php`** — Inserta datos de prueba iniciales.

---

## Modelo de datos

### Diagrama de tablas

```
usuarios                    productos
─────────────              ────────────────────
id_usuario (PK)            id_producto (PK)
nombre                     id_marca (FK → marcas)
email (UNIQUE)             id_coleccion (FK → colecciones)
password_hash              id_tipo (FK → tipos_prenda)
google_id                  talle
avatar_url                 color
auth_provider              cantidad
fecha_creacion             precio
                           fecha_ingreso

marcas                     colecciones             tipos_prenda
───────────                ─────────────           ─────────────
id_marca (PK)              id_coleccion (PK)       id_tipo (PK)
nombre_marca               nombre_coleccion        nombre_tipo
```

### Descripción de tablas

**`usuarios`** — Almacena los usuarios del sistema. El campo `auth_provider` indica si el registro fue por `'local'` (email/contraseña) o `'google'` (OAuth). El `password_hash` contiene el hash bcrypt o `NULL` para usuarios de Google.

**`productos`** — Inventario del negocio. Referencia las tablas de marcas, colecciones y tipos de prenda mediante Foreign Keys. El precio se almacena como `DECIMAL(12,2)`.

**`marcas`**, **`colecciones`**, **`tipos_prenda`** — Tablas de referencia que populan los selects del formulario de productos.

---

## Integración con APIs externas

### API dólar blue (dolarapi.com)

- **Endpoint:** `GET https://dolarapi.com/v1/dolares/blue`
- **Consumida desde:** `js/app.js` (frontend)
- **Respuesta:** JSON con campos `compra` y `venta`
- **Manejo de error:** Si la API falla, muestra "No disponible" con tooltip. El resto del sistema continúa funcionando sin interrupciones.

### API feriados nacionales (Nager.Date)

- **Endpoint:** `GET https://date.nager.at/api/v3/PublicHolidays/{año}/AR`
- **Consumida desde:** `js/app.js` (frontend)
- **Respuesta:** Array JSON con fecha y nombre del feriado
- **Caché:** Los feriados se almacenan en memoria por año para evitar llamadas repetidas al navegar entre meses
- **Manejo de error:** Si la API no responde, muestra un aviso amarillo en el calendario. Los eventos personalizados siguen funcionando.

### Google Identity Services (OAuth 2.0)

- **Biblioteca:** `https://accounts.google.com/gsi/client`
- **Flujo:** El usuario hace click en el botón Google → el popup devuelve un `credential` (JWT) → se envía al backend (`api/auth_google.php`) → se verifica con la API de Google → se crea o recupera el usuario en la BD.
- **Limitación:** El `client_id` está hardcodeado en `auth.js`. Por diseño del protocolo OAuth, el `client_id` es un dato público y no representa un riesgo de seguridad.

---

## Consideraciones de seguridad y validaciones

### Autenticación

- Las contraseñas se hashean con `password_hash($pass, PASSWORD_BCRYPT)` y se verifican con `password_verify()`. Nunca se almacenan en texto plano.
- Las sesiones se gestionan con PHP sessions nativas (`session_start()`). Al hacer logout se destruye la sesión con `session_destroy()`.
- El acceso a `main.html` verifica la sesión mediante `api/auth_session.php`. Sin sesión activa, redirige automáticamente a `login.html`.

### Validaciones de datos

**Frontend (`auth.js`):**
- Email con formato válido (regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- Contraseña mínimo 6 caracteres (atributo `minlength` + validación JS)
- Confirmación de contraseña coincidente
- Campos obligatorios no vacíos

**Backend (PHP):**
- `filter_var($email, FILTER_VALIDATE_EMAIL)` para validar email
- `strlen($password) >= 6` para longitud mínima
- Verificación de email duplicado antes de insertar
- `htmlspecialchars()` y prepared statements con PDO en todas las consultas para prevenir SQL injection y XSS

### Integridad de datos

- Las operaciones de escritura en la base de datos usan transacciones (`beginTransaction / commit / rollBack`) en `auth_register.php`, `add_producto.php` y `edit_producto.php`. Si una operación falla, los cambios se revierten automáticamente.

---

## Instrucciones de instalación y ejecución local

Ver [README.md](../README.md) para las instrucciones completas.

**Resumen:**
1. Instalar XAMPP e iniciar Apache y MySQL
2. Copiar proyecto a `htdocs/latoska/`
3. Crear BD `latoska` e importar `BaseDatosLaToska.sql`
4. Insertar usuario admin (ver README)
5. Acceder a `http://localhost/latoska/login.html`

---

## Decisiones técnicas relevantes

| Decisión | Alternativa considerada | Justificación |
|----------|------------------------|---------------|
| PHP + MySQL (XAMPP) | Node.js + MongoDB | El equipo tenía mayor experiencia con PHP y el stack de XAMPP es familiar para el contexto académico |
| JavaScript vanilla | React / Vue | Menor complejidad de configuración; suficiente para el alcance del proyecto |
| Sesiones PHP nativas | JWT | Más simple de implementar para una app local de usuario único |
| PDO con prepared statements | MySQLi directo | Mayor seguridad contra SQL injection; más portable |
| Bcrypt (PASSWORD_BCRYPT) | MD5 / SHA1 | Algoritmo de hashing seguro y recomendado para contraseñas |
| Transacciones en escrituras | Operaciones directas | Garantizan integridad de datos ante fallos parciales |
| Modo degradado en APIs externas | Falla total si API no responde | El sistema debe funcionar en el negocio incluso sin internet |
