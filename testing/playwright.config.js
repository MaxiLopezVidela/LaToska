// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 120000, // 2 minutos por test (más margen)
  expect: {
    timeout: 15000
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost/latoska_v2/',
    // Graba VIDEO automáticamente (es lo que pide el profesor)
    video: 'on',
    // Desactivamos trace y screenshot automático para no sobrecargar la PC
    screenshot: 'off',
    trace: 'off',
    // Navegador visible
    browserName: 'chromium',
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    navigationTimeout: 30000,
    locale: 'es-AR',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
