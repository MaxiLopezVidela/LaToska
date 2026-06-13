// tests/regression.spec.js
// Pruebas de Regresión Automatizadas — LaToska v2
// Materia: Metodología y Testing — Etapa 5

const { test, expect } = require('@playwright/test');

// Datos de prueba — email único por ejecución
const TEST_USER = {
  nombre: 'Usuario Test Playwright',
  email: `test.pw.${Date.now()}@latoska.com`,
  password: 'Test123456'
};

// Helper: hacer login súper robusto (con auto-registro si falla)
async function doLogin(page) {
  await page.goto('./login.html');
  await page.waitForSelector('#login-email', { state: 'visible' });
  await page.fill('#login-email', TEST_USER.email);
  await page.fill('#login-password', TEST_USER.password);
  await page.locator('#form-login .btn-login').click();
  
  try {
    // Intentar esperar a que cargue la app principal
    await page.waitForSelector('.sidebar', { state: 'visible', timeout: 8000 });
  } catch (e) {
    console.log("Login falló, intentando registrar al usuario automáticamente...");
    // Si falló, posiblemente el usuario no existe en la base de datos actual. Lo registramos.
    await page.goto('./login.html');
    await page.waitForSelector('[data-tab="form-register-container"]', { state: 'visible' });
    await page.locator('[data-tab="form-register-container"]').click();
    await page.waitForTimeout(500);
    await page.fill('#register-nombre', TEST_USER.nombre);
    await page.fill('#register-email', TEST_USER.email);
    await page.fill('#register-password', TEST_USER.password);
    await page.fill('#register-password-confirm', TEST_USER.password);
    await page.locator('#form-register .btn-login').click();
    await page.waitForSelector('.sidebar', { state: 'visible', timeout: 15000 });
  }
  await page.waitForTimeout(1000); // Darle tiempo a que cargue todo el DOM
}

async function takeEvidence(page, name) {
    // Tomamos screenshot solo de lo visible para no sobrecargar
    await page.screenshot({ path: `evidencias/${name}.png`, fullPage: false });
}

// ================================================================
// MÓDULO 1: AUTENTICACIÓN
// ================================================================

test.describe('Módulo 1: Autenticación', () => {

  test('TC-01: La página de login carga correctamente', async ({ page }) => {
    await page.goto('./login.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#form-login', { state: 'visible' });
    
    await expect(page.locator('#form-login')).toBeVisible();
    await expect(page.locator('#login-email')).toBeVisible();
    await expect(page.locator('#login-password')).toBeVisible();
    await expect(page.locator('#form-login .btn-login')).toBeVisible();
    
    await takeEvidence(page, 'TC-01_login_carga');
  });

  test('TC-02: Validación de email inválido en login', async ({ page }) => {
    await page.goto('./login.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#login-email');
    
    await page.fill('#login-email', 'emailsinformato');
    await page.fill('#login-password', 'unapassword');
    
    const emailInput = page.locator('#login-email');
    const isValid = await emailInput.evaluate(el => el.checkValidity());
    expect(isValid).toBe(false);
    
    await takeEvidence(page, 'TC-02_login_email_invalido');
  });

  test('TC-03: Login con credenciales incorrectas muestra error', async ({ page }) => {
    await page.goto('./login.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#login-email');
    
    await page.fill('#login-email', 'noexiste@test.com');
    await page.fill('#login-password', 'passwordmal');
    await page.locator('#form-login .btn-login').click();
    
    // Esperar a que el error tenga texto
    const errorBox = page.locator('#login-error');
    await expect(errorBox).toHaveClass(/visible/);
    
    await takeEvidence(page, 'TC-03_login_credenciales_incorrectas');
  });

  test('TC-04: Cambio entre pestañas Login y Registro', async ({ page }) => {
    await page.goto('./login.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#form-login-container');
    
    await expect(page.locator('#form-login-container')).toHaveClass(/active/);
    
    await page.locator('[data-tab="form-register-container"]').click();
    await page.waitForTimeout(500);
    
    await expect(page.locator('#form-register-container')).toHaveClass(/active/);
    await expect(page.locator('#register-nombre')).toBeVisible();
    
    await takeEvidence(page, 'TC-04_formulario_registro');
  });

  test('TC-05: Validación de contraseña corta en registro', async ({ page }) => {
    await page.goto('./login.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-tab="form-register-container"]');
    
    await page.locator('[data-tab="form-register-container"]').click();
    await page.waitForTimeout(500);
    
    await page.fill('#register-nombre', 'Test');
    await page.fill('#register-email', 'test@test.com');
    await page.fill('#register-password', '123');
    await page.fill('#register-password-confirm', '123');
    
    const passInput = page.locator('#register-password');
    const isValid = await passInput.evaluate(el => el.checkValidity());
    expect(isValid).toBe(false);
    
    await takeEvidence(page, 'TC-05_registro_password_corta');
  });

  test('TC-06: Validación de contraseñas que no coinciden', async ({ page }) => {
    await page.goto('./login.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-tab="form-register-container"]');
    
    await page.locator('[data-tab="form-register-container"]').click();
    await page.waitForTimeout(500);
    
    await page.fill('#register-nombre', 'Test');
    await page.fill('#register-email', 'test@test.com');
    await page.fill('#register-password', 'Password123');
    await page.fill('#register-password-confirm', 'OtraPassword456');
    
    await page.locator('#form-register').evaluate(form => {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
    
    const errorBox = page.locator('#register-error');
    await expect(errorBox).toHaveClass(/visible/);
    
    await takeEvidence(page, 'TC-06_registro_passwords_no_coinciden');
  });

  test('TC-07: Registro exitoso de nuevo usuario', async ({ page }) => {
    await page.goto('./login.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-tab="form-register-container"]');
    
    await page.locator('[data-tab="form-register-container"]').click();
    await page.waitForTimeout(500);
    
    await page.fill('#register-nombre', TEST_USER.nombre);
    await page.fill('#register-email', TEST_USER.email);
    await page.fill('#register-password', TEST_USER.password);
    await page.fill('#register-password-confirm', TEST_USER.password);
    
    await takeEvidence(page, 'TC-07_registro_formulario_lleno');
    
    await page.locator('#form-register .btn-login').click();
    
    await page.waitForURL('**/main.html', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.sidebar', { state: 'visible' });
    
    await takeEvidence(page, 'TC-07_registro_exitoso_redireccion');
  });

  test('TC-08: Logout funciona correctamente', async ({ page }) => {
    await doLogin(page);
    
    await page.locator('#btn-logout').click();
    
    await page.waitForURL('**/login.html', { timeout: 15000, waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/login\.html/);
    
    await takeEvidence(page, 'TC-08_logout_exitoso');
  });

  test('TC-09: Login exitoso con usuario registrado', async ({ page }) => {
    await page.goto('./login.html', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#login-email');
    
    await page.fill('#login-email', TEST_USER.email);
    await page.fill('#login-password', TEST_USER.password);
    
    await takeEvidence(page, 'TC-09_login_formulario_lleno');
    
    await page.locator('#form-login .btn-login').click();
    
    await page.waitForURL('**/main.html', { timeout: 30000, waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.sidebar', { state: 'visible' });
    
    await takeEvidence(page, 'TC-09_login_exitoso');
  });
});

// ================================================================
// MÓDULO 2: CRUD DE PRODUCTOS
// ================================================================

test.describe('Módulo 2: CRUD de Productos', () => {

  test.beforeEach(async ({ page }) => {
    await doLogin(page);
  });

  test('TC-10: Vista de Stock carga correctamente', async ({ page }) => {
    await page.waitForSelector('.data-table');
    await expect(page.locator('.data-table').first()).toBeVisible();
    await expect(page.locator('#btn-add-product')).toBeVisible();
    
    await takeEvidence(page, 'TC-10_vista_stock');
  });

  test('TC-11: Abrir modal de agregar producto', async ({ page }) => {
    await page.locator('#btn-add-product').click();
    
    const modal = page.locator('#modal-product');
    await expect(modal).toHaveClass(/active/);
    await expect(page.locator('#modal-product .modal-header h3')).toContainText('Agregar Producto');
    
    // Esperar a que los selects tengan data (esto es fetch dinámico)
    await page.waitForTimeout(1000); 
    
    await takeEvidence(page, 'TC-11_modal_agregar_producto');
  });

  test('TC-12: Crear un producto nuevo', async ({ page }) => {
    await page.locator('#btn-add-product').click();
    await page.waitForSelector('#p-marca option:nth-child(2)', { state: 'attached' });
    
    await page.locator('#p-marca').selectOption({ index: 1 });
    await page.locator('#p-coleccion').selectOption({ index: 1 });
    await page.locator('#p-tipo').selectOption({ index: 1 });
    await page.fill('#p-talle', 'XL');
    await page.fill('#p-color', 'Violeta Test');
    await page.fill('#p-cantidad', '99');
    await page.fill('#p-precio', '15000.50');
    
    await takeEvidence(page, 'TC-12_formulario_producto_lleno');
    
    await page.locator('#form-product button[type="submit"]').click();
    
    // Esperar que la tabla se actualice y contenga el nuevo color
    await expect(page.locator('.data-table tbody').first()).toContainText('Violeta Test', { timeout: 10000 });
    
    await takeEvidence(page, 'TC-12_producto_creado');
  });

  test('TC-13: Editar un producto existente', async ({ page }) => {
    // Si la tabla esta vacia (por los deletes anteriores), creamos uno rápido
    const rows = page.locator('.data-table tbody tr:not(.empty-state-row)');
    const count = await rows.count();
    
    if (count === 0) {
        // Fallback: si no hay productos, creamos uno
        await page.locator('#btn-add-product').click();
        await page.waitForSelector('#p-marca option:nth-child(2)', { state: 'attached' });
        await page.locator('#p-marca').selectOption({ index: 1 });
        await page.locator('#p-coleccion').selectOption({ index: 1 });
        await page.locator('#p-tipo').selectOption({ index: 1 });
        await page.fill('#p-talle', 'L');
        await page.fill('#p-color', 'Temp');
        await page.fill('#p-cantidad', '1');
        await page.fill('#p-precio', '100');
        await page.locator('#form-product button[type="submit"]').click();
        await page.waitForTimeout(1000);
    }
    
    const editBtn = page.locator('.action-btn.edit').first();
    await editBtn.click();
    
    await expect(page.locator('#modal-product .modal-header h3')).toContainText('Editar Producto');
    
    await page.fill('#p-color', 'Azul Editado');
    await takeEvidence(page, 'TC-13_editando_producto');
    
    await page.locator('#form-product button[type="submit"]').click();
    
    await expect(page.locator('.data-table tbody').first()).toContainText('Azul Editado', { timeout: 10000 });
    
    await takeEvidence(page, 'TC-13_producto_editado');
  });

  test('TC-14: Eliminar un producto', async ({ page }) => {
     // Si la tabla esta vacia, creamos uno rápido
     const rows = page.locator('.data-table tbody tr:not(.empty-state-row)');
     let count = await rows.count();
     
     if (count === 0) {
         await page.locator('#btn-add-product').click();
         await page.waitForSelector('#p-marca option:nth-child(2)', { state: 'attached' });
         await page.locator('#p-marca').selectOption({ index: 1 });
         await page.locator('#p-coleccion').selectOption({ index: 1 });
         await page.locator('#p-tipo').selectOption({ index: 1 });
         await page.fill('#p-talle', 'M');
         await page.fill('#p-color', 'TempDelete');
         await page.fill('#p-cantidad', '1');
         await page.fill('#p-precio', '100');
         await page.locator('#form-product button[type="submit"]').click();
         await page.waitForTimeout(1000);
         count = await rows.count();
     }
     
    const rowsBefore = count;
    await takeEvidence(page, 'TC-14_antes_eliminar');
    
    page.on('dialog', dialog => dialog.accept());
    
    const deleteBtn = page.locator('.action-btn.delete').first();
    await deleteBtn.click();
    
    // Esperar que la cantidad de filas sea menor, o que esté vacía
    await page.waitForTimeout(2000);
    const rowsAfter = await page.locator('.data-table tbody tr:not(.empty-state-row)').count();
    expect(rowsAfter).toBeLessThan(rowsBefore);
    
    await takeEvidence(page, 'TC-14_producto_eliminado');
  });

  test('TC-15: Cerrar modal con botón cancelar', async ({ page }) => {
    await page.locator('#btn-add-product').click();
    await expect(page.locator('#modal-product')).toHaveClass(/active/);
    
    await page.locator('#btn-cancel-modal').click();
    await expect(page.locator('#modal-product')).not.toHaveClass(/active/);
    
    await takeEvidence(page, 'TC-15_modal_cerrado');
  });
});

// ================================================================
// MÓDULO 3: NAVEGACIÓN Y UI
// ================================================================

test.describe('Módulo 3: Navegación y UI', () => {

  test.beforeEach(async ({ page }) => {
    await doLogin(page);
  });

  test('TC-16: Navegación al Calendario', async ({ page }) => {
    await page.locator('[data-target="view-calendar"]').click();
    await expect(page.locator('#view-calendar')).toHaveClass(/active-view/);
    
    const monthDisplay = page.locator('#current-month-display');
    await expect(monthDisplay).toBeVisible();
    
    await takeEvidence(page, 'TC-16_vista_calendario');
  });

  test('TC-17: Navegación de meses en Calendario', async ({ page }) => {
    await page.locator('[data-target="view-calendar"]').click();
    await page.waitForSelector('#current-month-display');
    
    const mesActual = await page.locator('#current-month-display').textContent();
    
    await page.locator('#btn-next-month').click();
    await page.waitForTimeout(500); // Pequeña pausa visual
    
    const mesSiguiente = await page.locator('#current-month-display').textContent();
    expect(mesSiguiente).not.toBe(mesActual);
    
    await takeEvidence(page, 'TC-17_calendario_mes_siguiente');
    
    await page.locator('#btn-prev-month').click();
    await page.waitForTimeout(500);
    
    const mesVuelta = await page.locator('#current-month-display').textContent();
    expect(mesVuelta).toBe(mesActual);
    
    await takeEvidence(page, 'TC-17_calendario_mes_anterior');
  });

  test('TC-18: Navegación a Resumen de Ventas', async ({ page }) => {
    await page.locator('[data-target="view-sales"]').click();
    await expect(page.locator('#view-sales')).toHaveClass(/active-view/);
    await expect(page.locator('#btn-add-sale')).toBeVisible();
    
    await takeEvidence(page, 'TC-18_vista_ventas');
  });

  test('TC-19: Volver a Control de Stock desde otra vista', async ({ page }) => {
    await page.locator('[data-target="view-sales"]').click();
    await page.locator('[data-target="view-stock"]').click();
    
    await expect(page.locator('#view-stock')).toHaveClass(/active-view/);
    await takeEvidence(page, 'TC-19_volver_stock');
  });
});

// ================================================================
// MÓDULO 4: INTEGRACIÓN CON APIs EXTERNAS
// ================================================================

test.describe('Módulo 4: Integración con APIs Externas', () => {

  test.beforeEach(async ({ page }) => {
    await doLogin(page);
  });

  test('TC-20: Cotización del dólar se muestra', async ({ page }) => {
    // A veces la API del dólar es lenta
    await page.waitForTimeout(4000);
    
    const dollarWidget = page.locator('#dollar-value');
    await expect(dollarWidget).toBeVisible();
    
    await takeEvidence(page, 'TC-20_cotizacion_dolar');
  });

  test('TC-21: Feriados se cargan en el calendario', async ({ page }) => {
    await page.locator('[data-target="view-calendar"]').click();
    
    // Esperar a que haya días renderizados (esperamos a la API)
    await page.waitForTimeout(3000);
    
    const calendarDays = page.locator('.calendar-day:not(.other-month)');
    const dayCount = await calendarDays.count();
    expect(dayCount).toBeGreaterThan(25);
    
    await takeEvidence(page, 'TC-21_calendario_feriados');
  });
});

// ================================================================
// MÓDULO 5: REGISTRO DE VENTAS
// ================================================================

test.describe('Módulo 5: Registro de Ventas', () => {

  test.beforeEach(async ({ page }) => {
    await doLogin(page);
    await page.locator('[data-target="view-sales"]').click();
    await expect(page.locator('#view-sales')).toHaveClass(/active-view/);
  });

  test('TC-22: Abrir modal de nueva venta', async ({ page }) => {
    await page.locator('#btn-add-sale').click();
    await expect(page.locator('#modal-sale')).toHaveClass(/active/);
    
    await takeEvidence(page, 'TC-22_modal_nueva_venta');
  });

  test('TC-23: Registrar una venta con método Contado', async ({ page }) => {
    await page.locator('#btn-add-sale').click();
    await page.waitForSelector('#s-marca');
    
    await page.fill('#s-marca', 'Nike');
    await page.fill('#s-coleccion', 'Verano 2026');
    await page.fill('#s-tipo', 'Remera');
    await page.fill('#s-color', 'Blanco');
    await page.fill('#s-talle', 'L');
    await page.fill('#s-cantidad', '2');
    await page.fill('#s-total', '25000');
    
    await page.locator('.method-btn[data-method="Contado"]').click();
    
    await takeEvidence(page, 'TC-23_formulario_venta_lleno');
    
    await page.locator('#form-sale button[type="submit"]').click();
    
    // Verificar que aparece en la tabla
    await expect(page.locator('#sales-table tbody')).toContainText('Nike', { timeout: 10000 });
    
    await takeEvidence(page, 'TC-23_venta_registrada');
  });

  test('TC-24: Seleccionar diferentes métodos de pago', async ({ page }) => {
    await page.locator('#btn-add-sale').click();
    await page.waitForSelector('.method-btn');
    
    await page.locator('.method-btn[data-method="Débito"]').click();
    await expect(page.locator('.method-btn[data-method="Débito"]')).toHaveClass(/active/);
    await takeEvidence(page, 'TC-24_metodo_debito');
    
    await page.locator('.method-btn[data-method="Crédito"]').click();
    await expect(page.locator('.method-btn[data-method="Crédito"]')).toHaveClass(/active/);
    await takeEvidence(page, 'TC-24_metodo_credito');
    
    await page.locator('.method-btn[data-method="Contado"]').click();
    await expect(page.locator('.method-btn[data-method="Contado"]')).toHaveClass(/active/);
    await takeEvidence(page, 'TC-24_metodo_contado');
  });
});
