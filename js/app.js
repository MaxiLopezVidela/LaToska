document.addEventListener('DOMContentLoaded', () => {
    /* =======================================
       0. SESIÓN DE USUARIO
    ======================================= */
    async function loadUserSession() {
        try {
            const res = await fetch('api/auth_session.php');
            const data = await res.json();
            if (data.logged_in && data.user) {
                document.getElementById('user-name-display').textContent = data.user.nombre;
                // Si tiene avatar de Google, mostrarlo
                if (data.user.avatar_url) {
                    const avatarDiv = document.getElementById('user-avatar');
                    avatarDiv.innerHTML = `<img src="${data.user.avatar_url}" alt="Avatar" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">`;
                }
            }
        } catch (e) {
            console.error('Error cargando sesión:', e);
        }
    }
    loadUserSession();

    // Logout
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            try {
                await fetch('api/auth_logout.php');
                window.location.href = 'login.html';
            } catch (e) {
                window.location.href = 'login.html';
            }
        });
    }

    /* =======================================
       1. NAVEGACIÓN (Sidebar)
    ======================================= */
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');
    const viewTitle = document.getElementById('current-view-title');

    const viewTitlesMap = {
        'view-stock': 'Control de Stock',
        'view-calendar': 'Calendario',
        'view-sales': 'Resumen de Ventas'
    };

    navItems.forEach(item => {
        if (!item.getAttribute('data-target')) return; // Skip logout button
        item.addEventListener('click', () => {
            // Eliminar clase active de todos
            navItems.forEach(nav => { if (nav.getAttribute('data-target')) nav.classList.remove('active'); });
            viewSections.forEach(view => view.classList.remove('active-view'));

            // Activar el clickeado
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active-view');
            viewTitle.textContent = viewTitlesMap[targetId];
        });
    });

    // Format currency helper
    const formatter = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    });

    /* =======================================
       0. DOLAR API (DolarAPI.com)
    ======================================= */
    async function fetchDolar() {
        try {
            // Obtenemos la cotización del dólar blue desde la API
            const response = await fetch('https://dolarapi.com/v1/dolares/blue');
            const data = await response.json();

            // Reemplazamos el texto con el valor actual de Venta
            // Hacemos que parpadee un momento con un color verde más fuerte para notar el cambio y reiniciamos íconos lucide
            const widget = document.getElementById('dollar-value');
            widget.textContent = `$${data.venta}`;
        } catch (error) {
            console.error('Error al obtener el dólar:', error);
            const w = document.getElementById('dollar-value');
            w.textContent = 'No disponible';
            w.title = 'No se pudo obtener la cotización. Verificá tu conexión a internet.';
        }
    }

    // Llamamos a la API apenas carga
    fetchDolar();

    /* =======================================
       2. LÓGICA DE STOCK
    ======================================= */
    const modalStock = document.getElementById('modal-product');
    const btnAddProduct = document.getElementById('btn-add-product');
    const btnCloseModalStock = document.getElementById('btn-close-modal');
    const btnCancelModalStock = document.getElementById('btn-cancel-modal');
    const formProduct = document.getElementById('form-product');

    const tableBody = document.querySelector('.data-table tbody');
    const emptyStateRow = document.querySelector('.empty-state-row');

    let products = [];
    let editingIndex = null;
    let editingId = null;

    // Load form options (marcas, colecciones, tipos)
    async function loadOptions() {
        try {
            const res = await fetch('api/get_options.php');
            const data = await res.json();
            
            if (data.success) {
                const { marcas, colecciones, tipos } = data.data;
                
                const marcaSelect = document.getElementById('p-marca');
                const colSelect = document.getElementById('p-coleccion');
                const tipoSelect = document.getElementById('p-tipo');
                
                marcas.forEach(m => marcaSelect.add(new Option(m.nombre, m.id)));
                colecciones.forEach(c => colSelect.add(new Option(c.nombre, c.id)));
                tipos.forEach(t => tipoSelect.add(new Option(t.nombre, t.id)));
            }
        } catch (e) {
            console.error('Error cargando opciones:', e);
        }
    }

    // Load products from DB
    async function loadProducts() {
        try {
            const res = await fetch('api/get_productos.php');
            const data = await res.json();
            if (data.success) {
                products = data.data;
                renderTable();
            }
        } catch (e) {
            console.error('Error cargando productos:', e);
        }
    }

    // Load initial data
    loadOptions();
    loadProducts();

    function openModalStock(editIndex = null) {
        modalStock.classList.add('active');
        if (editIndex !== null) {
            editingIndex = editIndex;
            const p = products[editIndex];
            editingId = p.id;
            
            // Find option by text to select it (since 'p' contains names, not IDs, from the JOIN query)
            // But we need to set the value. Let's find the correct options.
            const marcaSelect = document.getElementById('p-marca');
            Array.from(marcaSelect.options).forEach(opt => { if(opt.text === p.marca) opt.selected = true; });
            
            const colSelect = document.getElementById('p-coleccion');
            Array.from(colSelect.options).forEach(opt => { if(opt.text === p.coleccion) opt.selected = true; });
            
            const tipoSelect = document.getElementById('p-tipo');
            Array.from(tipoSelect.options).forEach(opt => { if(opt.text === p.tipo) opt.selected = true; });
            
            document.getElementById('p-talle').value = p.talle;
            document.getElementById('p-color').value = p.color;
            document.getElementById('p-cantidad').value = p.cantidad;
            document.getElementById('p-precio').value = p.precio;
            document.querySelector('#modal-product .modal-header h3').textContent = 'Editar Producto';
        } else {
            editingIndex = null;
            editingId = null;
            formProduct.reset();
            document.querySelector('#modal-product .modal-header h3').textContent = 'Agregar Producto';
        }
        setTimeout(() => document.getElementById('p-marca').focus(), 100);
    }

    function closeModalStock() {
        modalStock.classList.remove('active');
        formProduct.reset();
        editingIndex = null;
        editingId = null;
    }

    btnAddProduct.addEventListener('click', () => openModalStock(null));
    btnCloseModalStock.addEventListener('click', closeModalStock);
    btnCancelModalStock.addEventListener('click', closeModalStock);

    modalStock.addEventListener('click', (e) => {
        if (e.target === modalStock) closeModalStock();
    });

    function renderTable() {
        const rows = tableBody.querySelectorAll('tr:not(.empty-state-row)');
        rows.forEach(row => row.remove());

        if (products.length === 0) {
            emptyStateRow.style.display = 'table-row';
            return;
        }

        emptyStateRow.style.display = 'none';

        products.forEach((product, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${product.marca}</strong></td>
                <td>${product.coleccion}</td>
                <td>${product.tipo}</td>
                <td>${product.talle}</td>
                <td>${product.color}</td>
                <td>
                    <span style="background:#f1f5f9; padding:2px 8px; border-radius:12px; font-weight:600;">
                        ${product.cantidad}
                    </span>
                </td>
                <td><strong>${formatter.format(product.precio)}</strong></td>
                <td>
                    <button class="action-btn edit" data-index="${index}" title="Editar">
                        <i data-lucide="edit-2"></i>
                    </button>
                    <button class="action-btn delete" data-index="${index}" title="Eliminar">
                        <i data-lucide="trash-2"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });

        lucide.createIcons();

        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                const p = products[index];
                
                if (confirm('¿Seguro que deseas eliminar este producto?')) {
                    try {
                        const res = await fetch('api/delete_producto.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: p.id })
                        });
                        const data = await res.json();
                        if (data.success) {
                            loadProducts(); // Reload from DB
                        } else {
                            alert(data.message);
                        }
                    } catch(err) {
                        console.error(err);
                        alert('Error al eliminar producto');
                    }
                }
            });
        });

        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                openModalStock(index);
            });
        });
    }

    formProduct.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const obj = {
            id_marca: document.getElementById('p-marca').value,
            id_coleccion: document.getElementById('p-coleccion').value,
            id_tipo: document.getElementById('p-tipo').value,
            talle: document.getElementById('p-talle').value,
            color: document.getElementById('p-color').value,
            cantidad: parseInt(document.getElementById('p-cantidad').value, 10),
            precio: parseFloat(document.getElementById('p-precio').value)
        };

        try {
            if (editingId !== null) {
                // EDIT
                obj.id_producto = editingId;
                const res = await fetch('api/edit_producto.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(obj)
                });
                const data = await res.json();
                if(data.success) {
                    loadProducts();
                    closeModalStock();
                } else {
                    alert(data.message);
                }
            } else {
                // ADD
                const res = await fetch('api/add_producto.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(obj)
                });
                const data = await res.json();
                if(data.success) {
                    loadProducts();
                    closeModalStock();
                } else {
                    alert(data.message);
                }
            }
        } catch (err) {
            console.error(err);
            alert('Error al guardar el producto.');
        }
    });

    /* =======================================
       3. LÓGICA DE CALENDARIO Y FERIADOS API
    ======================================= */
    const calendarGrid = document.querySelector('.calendar-grid');
    const displayMonth = document.getElementById('current-month-display');
    const btnPrevMonth = document.getElementById('btn-prev-month');
    const btnNextMonth = document.getElementById('btn-next-month');

    // Configuración inicial del calendario
    let today = new Date();
    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();

    // Almacenamiento
    const cachedHolidays = {};
    let customEvents = [];

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    function updateMonthDisplay() {
        displayMonth.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    }

    // 1. Función para obtener los feriados de Argentina
    async function loadFeriadosAndRender() {
        updateMonthDisplay();

        if (cachedHolidays[currentYear]) {
            renderCalendar(cachedHolidays[currentYear]);
            return;
        }

        try {
            // Usamos la API de Nager.Date. Gratita y no requiere Key (Auth)
            const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/AR`);
            const holidays = await response.json();
            cachedHolidays[currentYear] = holidays;
            renderCalendar(holidays);
        } catch (error) {
            console.error('Error al obtener feriados:', error);
            renderCalendar([]);
            const grid = document.querySelector('.calendar-grid');
            if (grid) {
                const notice = document.createElement('div');
                notice.style.cssText = 'grid-column:1/-1;text-align:center;padding:8px;font-size:12px;color:#b45309;background:#fef3c7;border-radius:6px;margin-bottom:4px;';
                notice.textContent = '⚠️ No se pudieron cargar los feriados. El calendario funciona con eventos personalizados.';
                grid.prepend(notice);
            }
        }
    }

    // 2. Renderizar Calendario y Feriados
    function renderCalendar(holidays) {
        // A. Insertamos la fila de cabecera con los Nombres de los días
        const dayNamesHTML = `
            <div class="day-name">Lun</div>
            <div class="day-name">Mar</div>
            <div class="day-name">Mié</div>
            <div class="day-name">Jue</div>
            <div class="day-name">Vie</div>
            <div class="day-name">Sáb</div>
            <div class="day-name">Dom</div>
        `;
        calendarGrid.innerHTML = dayNamesHTML;

        // Obtenemos la fecha del día 1 del mes para saber qué día cae.
        const date = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate(); // Último día del mes

        // getDay() devuelve 0 (Dom) hasta 6 (Sab). Ajustamos para que Lun sea 0 y Dom sea 6
        let firstDayIndex = date.getDay() - 1;
        if (firstDayIndex === -1) firstDayIndex = 6;

        // B. Rellenar bloques grises para los días del final del mes anterior
        const prevLastDay = new Date(currentYear, currentMonth, 0).getDate();
        for (let x = firstDayIndex; x > 0; x--) {
            const div = document.createElement('div');
            div.className = 'calendar-day other-month';
            div.innerHTML = `<span class="day-number">${prevLastDay - x + 1}</span>`;
            calendarGrid.appendChild(div);
        }

        // Formatear hoy para resaltar
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        // C. Rellenar los días del mes actual y cruzarlos con los feriados
        for (let i = 1; i <= lastDay; i++) {
            const div = document.createElement('div');
            div.className = 'calendar-day';

            // Armamos la fecha como texto (ej. "2026-03-24") para cruzarlo con el feriado
            const monthStr = String(currentMonth + 1).padStart(2, '0');
            const dayStr = String(i).padStart(2, '0');
            const dateString = `${currentYear}-${monthStr}-${dayStr}`;

            const holiday = holidays.find(h => h.date === dateString);
            const dailyCustomEvents = customEvents.filter(e => e.date === dateString);

            let html = `<span class="day-number">${i}</span>`;

            // Highlight today
            if (dateString === todayStr) {
                div.classList.add('today');
                html = `<span class="day-number" style="background-color: #6366f1; color: white;">${i}</span>`;
            }

            // Añadir Feriados
            if (holiday) {
                div.classList.add('holiday');
                // Coloreamos rojo solo si no es hoy
                if (dateString !== todayStr) {
                    html = `<span class="day-number" style="background-color: #ef4444; color: white;">${i}</span>`;
                }
                html += `<div class="event-marker feriado" style="background-color: #fee2e2; color: #b91c1c; border-left: 2px solid #ef4444; margin-top: 4px;">🎉 ${holiday.localName}</div>`;
            }

            // Añadir Custom Events
            dailyCustomEvents.forEach(evt => {
                html += `<div class="event-marker" style="background-color: ${evt.color}20; color: ${evt.color}; border-left: 2px solid ${evt.color}; margin-top: 4px;">${evt.title}</div>`;
            });

            div.innerHTML = html;
            calendarGrid.appendChild(div);
        }

        // D. Completar los días del próximo mes para llenar 5 ó 6 filas perfectas
        const totalAddedDays = firstDayIndex + lastDay;
        const nextDays = (7 - (totalAddedDays % 7)) % 7; // Lo que falta para llegar a multiplo de 7

        for (let j = 1; j <= nextDays; j++) {
            const div = document.createElement('div');
            div.className = 'calendar-day other-month';
            div.innerHTML = `<span class="day-number">${j}</span>`;
            calendarGrid.appendChild(div);
        }
    }

    // Navegación de mes
    btnPrevMonth.addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        loadFeriadosAndRender();
    });

    btnNextMonth.addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        loadFeriadosAndRender();
    });

    // Modal Eventos
    const modalEvent = document.getElementById('modal-event');
    const btnAddEvent = document.getElementById('btn-add-event');
    const btnCloseModalEvent = document.getElementById('btn-close-modal-event');
    const btnCancelModalEvent = document.getElementById('btn-cancel-modal-event');
    const formEvent = document.getElementById('form-event');
    const inputEventDate = document.getElementById('e-fecha');

    function openModalEvent() {
        modalEvent.classList.add('active');
        formEvent.reset();

        // Preseleccionar fecha hoy o la visualizada
        let defMonth = String(currentMonth + 1).padStart(2, '0');
        let defDate = '01';

        // Si el mes que veo es el actual, sugiero hoy. Si no el primero del mes que veo.
        if (currentYear === today.getFullYear() && currentMonth === today.getMonth()) {
            defDate = String(today.getDate()).padStart(2, '0');
        }

        inputEventDate.value = `${currentYear}-${defMonth}-${defDate}`;
        setTimeout(() => document.getElementById('e-titulo').focus(), 100);
    }

    function closeModalEvent() {
        modalEvent.classList.remove('active');
    }

    btnAddEvent.addEventListener('click', openModalEvent);
    btnCloseModalEvent.addEventListener('click', closeModalEvent);
    btnCancelModalEvent.addEventListener('click', closeModalEvent);

    modalEvent.addEventListener('click', (e) => {
        if (e.target === modalEvent) closeModalEvent();
    });

    formEvent.addEventListener('submit', (e) => {
        e.preventDefault();

        const newEvent = {
            title: document.getElementById('e-titulo').value,
            date: document.getElementById('e-fecha').value,
            color: document.getElementById('e-color').value
        };

        customEvents.push(newEvent);

        // Re-render the calendar to show new events
        loadFeriadosAndRender();
        closeModalEvent();
    });

    // 3. Disparar consulta al servidor!
    loadFeriadosAndRender();

    /* =======================================
       4. LÓGICA DE VENTAS
    ======================================= */
    const salesTableBody = document.querySelector('#sales-table tbody');
    const emptyStateSales = document.querySelector('.empty-state-row-sales');
    const btnAddSale = document.getElementById('btn-add-sale');

    let sales = [];

    // Totals
    let totalContado = 0;
    let totalDebito = 0;
    let totalCredito = 0;

    function renderSalesTable() {
        // Clear all rows except empty state
        const rows = salesTableBody.querySelectorAll('tr:not(.empty-state-row-sales)');
        rows.forEach(row => row.remove());

        if (sales.length === 0) {
            emptyStateSales.style.display = 'table-row';
            return;
        }

        emptyStateSales.style.display = 'none';

        sales.forEach(sale => {
            const tr = document.createElement('tr');
            let colorMap = {
                'Contado': '#10b981', // green
                'Débito': '#3b82f6',  // blue
                'Crédito': '#8b5cf6'  // purple
            };

            tr.innerHTML = `
                <td>${sale.fecha}</td>
                <td><strong>${sale.producto}</strong></td>
                <td>
                    <span style="background:${colorMap[sale.metodo]}20; color:${colorMap[sale.metodo]}; padding:2px 8px; border-radius:12px; font-weight:600; font-size: 0.8rem;">
                        ${sale.metodo}
                    </span>
                </td>
                <td><strong>${formatter.format(sale.total)}</strong></td>
                <td>
                    <button class="action-btn" title="Ver detalle">
                        <i data-lucide="eye"></i>
                    </button>
                </td>
            `;
            salesTableBody.appendChild(tr);
        });

        lucide.createIcons();
    }

    function updateCounters() {
        document.getElementById('total-contado').textContent = formatter.format(totalContado);
        document.getElementById('total-debito').textContent = formatter.format(totalDebito);
        document.getElementById('total-credito').textContent = formatter.format(totalCredito);
        document.getElementById('total-general').textContent = formatter.format(totalContado + totalDebito + totalCredito);
    }

    // Modal Elements for Sales
    const modalSale = document.getElementById('modal-sale');
    const btnCloseModalSale = document.getElementById('btn-close-modal-sale');
    const btnCancelModalSale = document.getElementById('btn-cancel-modal-sale');
    const formSale = document.getElementById('form-sale');
    const methodBtns = document.querySelectorAll('.method-btn');

    let selectedMethod = 'Contado';

    methodBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            methodBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            selectedMethod = e.target.getAttribute('data-method');
        });
    });

    function openModalSale() {
        modalSale.classList.add('active');
        formSale.reset();

        // Reset method selection
        methodBtns.forEach(b => b.classList.remove('active'));
        methodBtns[0].classList.add('active');
        selectedMethod = 'Contado';

        setTimeout(() => document.getElementById('s-marca').focus(), 100);
    }

    function closeModalSale() {
        modalSale.classList.remove('active');
    }

    btnAddSale.addEventListener('click', openModalSale);
    btnCloseModalSale.addEventListener('click', closeModalSale);
    btnCancelModalSale.addEventListener('click', closeModalSale);

    modalSale.addEventListener('click', (e) => {
        if (e.target === modalSale) closeModalSale();
    });

    // Handle Form Submission
    formSale.addEventListener('submit', (e) => {
        e.preventDefault();

        const sMarca = document.getElementById('s-marca').value;
        const sTipo = document.getElementById('s-tipo').value;
        const sColor = document.getElementById('s-color').value;
        const sTalle = document.getElementById('s-talle').value;
        const sCantidad = document.getElementById('s-cantidad').value;

        // Componer un nombre descriptivo para la tabla de ventas
        const productoName = `${sTipo} ${sMarca} (${sColor} - ${sTalle}) x${sCantidad}`;
        const totalVenta = parseFloat(document.getElementById('s-total').value);

        const newSale = {
            fecha: new Date().toLocaleDateString('es-AR'),
            producto: productoName,
            metodo: selectedMethod,
            total: totalVenta
        };

        sales.push(newSale);

        if (selectedMethod === 'Contado') totalContado += totalVenta;
        if (selectedMethod === 'Débito') totalDebito += totalVenta;
        if (selectedMethod === 'Crédito') totalCredito += totalVenta;

        renderSalesTable();
        updateCounters();
        closeModalSale();
    });
});


