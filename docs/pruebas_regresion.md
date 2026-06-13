# Reporte de Pruebas de Regresión — La Toska

**Fecha de ejecución:** Junio 2026  
**Framework automatizado:** Playwright (Node.js / Chromium)  
**Versión del sistema:** latoska_v2 (Etapa 5)  
**Resultado global:** ✅ 24/24 tests automatizados PASS · ✅ Todos los tests manuales PASS

---

## Resumen ejecutivo

| Tipo | Casos | PASS | FAIL |
|------|-------|------|------|
| Automatizados (Playwright) | 24 | 24 | 0 |
| Manuales | 9 suites | 9 | 0 |
| **Total** | **—** | **✅ 100%** | **0** |

---

## Pruebas automatizadas

### Módulo 1: Autenticación

**Precondiciones:** XAMPP iniciado, BD `latoska` importada, servidor disponible en `http://localhost/latoska/`.

| ID | Descripción | Pasos | Resultado esperado | Resultado obtenido |
|----|-------------|-------|-------------------|-------------------|
| TC-01 | La página de login carga correctamente | 1. Navegar a `login.html` · 2. Esperar a que cargue el DOM | Formulario de login visible con campos email, contraseña y botón | ✅ PASS |
| TC-02 | Validación de email inválido en login | 1. Ir a `login.html` · 2. Ingresar "emailsinformato" en email · 3. Verificar validez del input | El input email reporta `checkValidity() = false` | ✅ PASS |
| TC-03 | Login con credenciales incorrectas muestra error | 1. Ir a `login.html` · 2. Ingresar email y contraseña incorrectos · 3. Click en "Iniciar Sesión" | El div `#login-error` es visible con clase `visible` | ✅ PASS |
| TC-04 | Cambio entre pestañas Login y Registro | 1. Ir a `login.html` · 2. Click en pestaña "Registrarse" | El formulario `#form-register-container` tiene clase `active` y el campo nombre es visible | ✅ PASS |
| TC-05 | Validación de contraseña corta en registro | 1. Ir a registro · 2. Ingresar contraseña de 3 caracteres · 3. Verificar validez | El input contraseña reporta `checkValidity() = false` | ✅ PASS |
| TC-06 | Validación de contraseñas que no coinciden | 1. Ir a registro · 2. Ingresar contraseñas distintas · 3. Enviar formulario | El div `#register-error` es visible con clase `visible` | ✅ PASS |
| TC-07 | Registro exitoso de nuevo usuario | 1. Ir a registro · 2. Completar formulario con email único · 3. Click en "Crear Cuenta" | Redirección a `main.html`, sidebar visible | ✅ PASS |
| TC-08 | Logout funciona correctamente | 1. Login · 2. Click en "Cerrar Sesión" | Redirección a `login.html` | ✅ PASS |
| TC-09 | Login exitoso con usuario registrado | 1. Ir a `login.html` · 2. Ingresar credenciales válidas · 3. Click en "Iniciar Sesión" | Redirección a `main.html`, sidebar visible | ✅ PASS |

---

### Módulo 2: CRUD de Productos

**Precondiciones:** Usuario logueado en el sistema.

| ID | Descripción | Pasos | Resultado esperado | Resultado obtenido |
|----|-------------|-------|-------------------|-------------------|
| TC-10 | Vista de Stock carga correctamente | 1. Login · 2. Esperar carga del panel | Tabla de productos y botón "Agregar Producto" visibles | ✅ PASS |
| TC-11 | Abrir modal de agregar producto | 1. Login · 2. Click en "+ Agregar Producto" | Modal `#modal-product` con clase `active`, título "Agregar Producto" | ✅ PASS |
| TC-12 | Crear un producto nuevo | 1. Login · 2. Abrir modal · 3. Completar formulario (color: "Violeta Test") · 4. Click en "Guardar Producto" | Tabla contiene "Violeta Test" dentro de los 10 segundos | ✅ PASS |
| TC-13 | Editar un producto existente | 1. Login · 2. Click en ícono de lápiz · 3. Cambiar color a "Azul Editado" · 4. Guardar | Tabla contiene "Azul Editado" | ✅ PASS |
| TC-14 | Eliminar un producto | 1. Login · 2. Click en ícono de papelera · 3. Aceptar confirm() | Cantidad de filas en tabla disminuye en 1 | ✅ PASS |
| TC-15 | Cerrar modal con botón cancelar | 1. Login · 2. Abrir modal · 3. Click en "Cancelar" | Modal `#modal-product` no tiene clase `active` | ✅ PASS |

---

### Módulo 3: Navegación y UI

**Precondiciones:** Usuario logueado en el sistema.

| ID | Descripción | Pasos | Resultado esperado | Resultado obtenido |
|----|-------------|-------|-------------------|-------------------|
| TC-16 | Navegación al Calendario | 1. Login · 2. Click en "Calendario" en sidebar | Vista `#view-calendar` tiene clase `active-view`, mes actual visible | ✅ PASS |
| TC-17 | Navegación de meses en Calendario | 1. Login · 2. Ir a Calendario · 3. Click en "▶" · 4. Click en "◀" | El título del mes cambia y vuelve al mes original | ✅ PASS |
| TC-18 | Navegación a Resumen de Ventas | 1. Login · 2. Click en "Ventas" en sidebar | Vista `#view-sales` tiene clase `active-view`, botón "Registrar Venta" visible | ✅ PASS |
| TC-19 | Volver a Control de Stock desde otra vista | 1. Login · 2. Ir a Ventas · 3. Click en "Stock" | Vista `#view-stock` tiene clase `active-view` | ✅ PASS |

---

### Módulo 4: Integración con APIs externas

**Precondiciones:** Usuario logueado, conexión a internet disponible.

| ID | Descripción | Pasos | Resultado esperado | Resultado obtenido |
|----|-------------|-------|-------------------|-------------------|
| TC-20 | Cotización del dólar se muestra | 1. Login · 2. Esperar 4 segundos | Widget `#dollar-value` visible en barra superior | ✅ PASS |
| TC-21 | Feriados se cargan en el calendario | 1. Login · 2. Ir a Calendario · 3. Esperar 3 segundos | Más de 25 días del calendario renderizados | ✅ PASS |

---

### Módulo 5: Registro de Ventas

**Precondiciones:** Usuario logueado, en la vista de Ventas.

| ID | Descripción | Pasos | Resultado esperado | Resultado obtenido |
|----|-------------|-------|-------------------|-------------------|
| TC-22 | Abrir modal de nueva venta | 1. Login · 2. Ir a Ventas · 3. Click en "Registrar Venta" | Modal `#modal-sale` con clase `active` | ✅ PASS |
| TC-23 | Registrar una venta con método Contado | 1. Login · 2. Abrir modal · 3. Completar datos (marca: Nike) · 4. Seleccionar "Contado" · 5. Guardar | Tabla de ventas contiene "Nike" | ✅ PASS |
| TC-24 | Seleccionar diferentes métodos de pago | 1. Login · 2. Abrir modal · 3. Click en cada método (Débito, Crédito, Contado) | Cada botón tiene clase `active` al ser seleccionado | ✅ PASS |

---

## Pruebas manuales

### T1: Base de Datos

**Precondiciones:** BD `latoska` importada, phpMyAdmin accesible en `http://localhost/phpmyadmin`.

| Escenario | Pasos | Resultado esperado | Resultado obtenido |
|-----------|-------|-------------------|-------------------|
| Verificar estructura de tablas | Abrir phpMyAdmin → latoska → revisar tablas | Tablas: usuarios, productos, marcas, colecciones, tipos_prenda presentes con columnas correctas | ✅ PASS |
| Verificar relaciones (Foreign Keys) | Ver estructura de tabla productos | FK a marcas, colecciones y tipos_prenda presentes | ✅ PASS |
| Verificar datos seed | Ejecutar `SELECT * FROM productos` | 5 productos de prueba presentes (Nike, Levis, Zara) | ✅ PASS |

---

### T2: Autenticación — Registro

**Precondiciones:** Sistema accesible en `http://localhost/latoska/login.html`.

| Escenario | Pasos | Resultado esperado | Resultado obtenido |
|-----------|-------|-------------------|-------------------|
| Registro exitoso | Ir a Registrarse → completar todos los campos correctamente → Crear Cuenta | Redirección a main.html, usuario guardado en BD | ✅ PASS |
| Campos vacíos | Ir a Registrarse → no completar campos → intentar enviar | Validación HTML5 muestra "Completa este campo" | ✅ PASS |
| Email inválido | Ingresar "noesunmail" en email → enviar | Error: "El email no tiene un formato válido" | ✅ PASS |
| Contraseña corta | Ingresar contraseña de 3 caracteres → enviar | Validación HTML5: "Aumenta la longitud del texto a 6 caracteres" | ✅ PASS |
| Contraseñas no coinciden | Ingresar contraseñas distintas → enviar | Error: "Las contraseñas no coinciden" | ✅ PASS |
| Email duplicado | Intentar registrar un email ya existente | Error: "Ya existe una cuenta con ese email" | ✅ PASS |

---

### T3: Autenticación — Google OAuth

**Precondiciones:** Conexión a internet, cuenta de Google disponible.

| Escenario | Pasos | Resultado esperado | Resultado obtenido |
|-----------|-------|-------------------|-------------------|
| Login con Google (cuenta nueva) | Click en "G Google" → seleccionar cuenta → confirmar | Redirección a main.html, usuario creado en BD | ✅ PASS |
| Registro con cuenta Google ya existente | Intentar registrar email de cuenta Google via formulario | Error: "Ya existe una cuenta con ese email" | ✅ PASS |

---

### T4: Sesión y Logout

**Precondiciones:** Usuario logueado en el sistema.

| Escenario | Pasos | Resultado esperado | Resultado obtenido |
|-----------|-------|-------------------|-------------------|
| Persistencia de sesión | Login → cerrar pestaña → abrir nueva pestaña → ir a main.html | Sigue logueado, no redirige al login | ✅ PASS |
| Redirección sin sesión | Abrir ventana incógnito → ir a main.html | Redirección automática a login.html | ✅ PASS |
| Cerrar sesión | Click en "Cerrar Sesión" → intentar volver a main.html | Redirige a login.html | ✅ PASS |

---

### T5: CRUD de Productos

**Precondiciones:** Usuario logueado, datos seed cargados.

| Escenario | Pasos | Resultado esperado | Resultado obtenido |
|-----------|-------|-------------------|-------------------|
| Ver productos existentes | Ir a Stock | Tabla con 5 productos seed, precios en formato ARS | ✅ PASS |
| Agregar producto nuevo | Click "+ Agregar Producto" → completar (Marca: Adidas, Color: Verde, Precio: 28000) → Guardar | Producto aparece en tabla y en phpMyAdmin | ✅ PASS |
| Validación campos requeridos | Abrir modal → dejar campos vacíos → guardar | Validación HTML5 muestra campos requeridos | ✅ PASS |
| Editar producto | Click lápiz → cambiar color a "Amarillo" → Guardar | Producto actualizado en tabla y en phpMyAdmin | ✅ PASS |
| Eliminar producto | Click papelera → Aceptar confirm() | Producto desaparece de tabla y de phpMyAdmin | ✅ PASS |
| Tabla vacía | Eliminar todos los productos | Mensaje: "No hay productos en stock. Agrega tu primer producto." | ✅ PASS |

---

### T7: Calendario y Feriados

**Precondiciones:** Usuario logueado, conexión a internet.

| Escenario | Pasos | Resultado esperado | Resultado obtenido |
|-----------|-------|-------------------|-------------------|
| Visualización inicial | Ir a Calendario | Mes actual visible, hoy resaltado en violeta, feriados en rojo | ✅ PASS |
| Feriados de Argentina | Ver calendario Junio 2026 | Feriados nacionales marcados con emoji 🎉 | ✅ PASS |
| Navegación entre meses | Click ▶ y ◀ | Título del mes se actualiza, días se recalculan | ✅ PASS |
| Navegación entre años | Retroceder hasta Enero → Click ◀ | Pasa a Diciembre del año anterior | ✅ PASS |
| Crear evento personalizado | Click "+ Nuevo Evento" → completar datos → Guardar | Evento aparece en el día correspondiente con el color elegido | ✅ PASS |
| Múltiples eventos en un día | Crear dos eventos en la misma fecha | Ambos eventos se muestran apilados en el mismo día | ✅ PASS |
| Caché de feriados | Navegar a otro mes y volver | Feriados se muestran instantáneamente sin nuevo fetch | ✅ PASS |

---

### T8: Ventas

**Precondiciones:** Usuario logueado, en vista de Ventas.

| Escenario | Pasos | Resultado esperado | Resultado obtenido |
|-----------|-------|-------------------|-------------------|
| Estado vacío | Ir a Ventas sin registros | Mensaje "No hay ventas registradas aún." y 4 contadores en $0.00 | ✅ PASS |
| Registrar venta en Contado | Registrar venta (Nike, Total: $25.000) en Efectivo | Badge "Contado", Total Contado = $25.000,00 | ✅ PASS |
| Registrar venta en Débito | Registrar venta (Total: $15.000) en Débito | Badge "Débito", Total Débito = $15.000,00, Total = $40.000,00 | ✅ PASS |
| Registrar venta en Crédito | Registrar venta (Total: $85.000) en Crédito | Badge "Crédito", Total Crédito = $85.000,00, Total = $125.000,00 | ✅ PASS |

---

### T9: APIs Externas

**Precondiciones:** Usuario logueado.

| Escenario | Pasos | Resultado esperado | Resultado obtenido |
|-----------|-------|-------------------|-------------------|
| Cotización dólar blue disponible | Ir a main.html con internet | Widget muestra "DÓLAR BLUE" y valor numérico (ej: $1.460) | ✅ PASS |
| Cotización sin internet | Desconectar internet → ir a main.html | Widget muestra "No disponible" (corrección R02 Etapa 5) | ✅ PASS |

---

## Evidencia de ejecución automatizada

```json
// testing/test-results/.last-run.json
{
  "status": "passed",
  "failedTests": []
}
```

Las capturas de pantalla de cada test se encuentran en `testing/evidencias/` (TC-01 a TC-24). Los videos de ejecución se encuentran en `testing/test-results/`.
