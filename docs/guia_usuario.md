# Guía de Usuario — La Toska

## Objetivo de la aplicación

La Toska es un sistema de gestión de stock y ventas diseñado para el local de indumentaria femenina "La Toska" (Mendoza, Argentina). Permite administrar el inventario, registrar ventas, organizar eventos y consultar información relevante del negocio en tiempo real, reemplazando el uso de planillas de Excel.

---

## Perfil de usuario

El sistema está diseñado para ser utilizado por las **propietarias y encargadas del local**, con conocimientos básicos de informática. No se requiere experiencia técnica para operar el sistema. Se asume que el usuario:

- Conoce los productos que maneja el negocio
- Realiza cobros y registra ventas diariamente
- Necesita consultar el stock disponible en cualquier momento

---

## Acceso al sistema

**URL de acceso:** `http://localhost/latoska/login.html`

### Iniciar sesión

1. Ingresar el **email** registrado
2. Ingresar la **contraseña**
3. Hacer click en **"Iniciar Sesión"**

También es posible iniciar sesión con una cuenta de Google mediante el botón **"G Google"**.

### Crear una cuenta nueva

1. Hacer click en la pestaña **"Registrarse"**
2. Completar nombre, email, contraseña y confirmación de contraseña
3. Hacer click en **"Crear Cuenta"**

El sistema valida que el email tenga formato correcto, que la contraseña tenga al menos 6 caracteres y que las contraseñas coincidan.

### Cerrar sesión

Hacer click en **"Cerrar Sesión"** en la parte inferior del menú lateral. El sistema redirige automáticamente a la pantalla de login.

---

## Funciones principales

### 1. Control de Stock

**Acceso:** Click en "Stock" en el menú lateral izquierdo.

Muestra una tabla con todos los productos del inventario con sus datos: marca, colección, tipo de prenda, talle, color, cantidad y precio.

**Agregar un producto:**
1. Click en **"+ Agregar Producto"**
2. Completar el formulario: marca, colección, tipo de prenda, talle, color, cantidad y precio
3. Click en **"Guardar Producto"**
4. El producto aparece inmediatamente en la tabla

**Editar un producto:**
1. Click en el ícono de **lápiz ✏️** en la fila del producto
2. Modificar los campos deseados en el formulario
3. Click en **"Guardar Producto"**

**Eliminar un producto:**
1. Click en el ícono de **papelera 🗑️** en la fila del producto
2. Confirmar la eliminación en el cuadro de diálogo

---

### 2. Resumen de Ventas

**Acceso:** Click en "Ventas" en el menú lateral izquierdo.

Muestra el historial de ventas registradas con contadores acumulados por método de pago (Contado, Débito, Crédito) e ingresos totales.

**Registrar una venta:**
1. Click en **"Registrar Venta"**
2. Completar el formulario: marca, colección, tipo de prenda, talle, color, cantidad y total a cobrar
3. Seleccionar el **método de pago**: Efectivo, Débito o Crédito
4. Click en **"Guardar Venta"**
5. La venta aparece en la tabla y los contadores se actualizan automáticamente

---

### 3. Calendario

**Acceso:** Click en "Calendario" en el menú lateral izquierdo.

Muestra el calendario del mes actual con:
- **Día de hoy** resaltado en violeta
- **Feriados nacionales** marcados en rojo con emoji 🎉 (cargados automáticamente desde internet)
- **Eventos personalizados** creados por el usuario

**Agregar un evento:**
1. Click en **"+ Nuevo Evento"**
2. Ingresar el título del evento
3. Seleccionar la fecha
4. Elegir un color (opcional)
5. Click en **"Guardar Evento"**

**Navegar entre meses:**
- Click en **◀** para retroceder un mes
- Click en **▶** para avanzar un mes

---

### 4. Cotización del Dólar Blue

En la barra superior del panel principal se muestra la cotización actual del **dólar blue** en pesos argentinos, actualizada automáticamente al cargar el sistema. Si no hay conexión a internet, muestra **"No disponible"**.

---

## Flujos principales del sistema

### Flujo 1: Inicio de día

```
Login → Panel principal → Ver cotización del dólar → Revisar stock disponible
```

### Flujo 2: Registrar una venta

```
Ventas → "Registrar Venta" → Completar datos → Seleccionar método de pago → Guardar
→ Verificar que el total se actualizó
```

### Flujo 3: Actualizar inventario

```
Stock → "Agregar Producto" → Completar formulario → Guardar
→ Verificar que aparece en la tabla
```

### Flujo 4: Consultar feriados

```
Calendario → Navegar al mes deseado → Ver feriados marcados en rojo
```

---

## Consideraciones importantes

- El sistema funciona **localmente** en la computadora del negocio. No requiere internet para funcionar, excepto para la cotización del dólar y los feriados nacionales.
- La sesión se mantiene activa aunque se cierre la pestaña del navegador. Para salir completamente, usar el botón "Cerrar Sesión".
- Si se accede a `main.html` sin estar logueado, el sistema redirige automáticamente al login.
