/**
 * SBP Admin Dashboard Logic
 * Uses LocalStorage for data persistence
 */

/**
 * PIN Authentication System
 */
const DEFAULT_PIN = '1234';

function appendPin(num) {
    const input = document.getElementById('pinInput');
    if(input.value.length < 4) {
        input.value += num;
    }
    if(input.value.length === 4) {
        setTimeout(() => verifyPin(), 200);
    }
}

function clearPin() {
    document.getElementById('pinInput').value = '';
    document.getElementById('loginError').innerText = '';
}

function verifyPin() {
    const pin = document.getElementById('pinInput').value;
    const savedPin = localStorage.getItem('sbp_admin_pin') || DEFAULT_PIN;
    
    if(pin === savedPin) {
        document.getElementById('loginOverlay').classList.add('hidden');
        document.querySelector('.dashboard-wrap').style.display = 'flex';
        setTimeout(() => { if(map) map.invalidateSize(); }, 300);
    } else {
        document.getElementById('loginError').innerText = 'Incorrect PIN. Try again.';
        document.getElementById('pinInput').value = '';
        const box = document.querySelector('.login-box');
        box.style.animation = 'shake 0.3s';
        setTimeout(() => box.style.animation = '', 300);
    }
}

function lockDashboard() {
    document.getElementById('loginOverlay').classList.remove('hidden');
    document.querySelector('.dashboard-wrap').style.display = 'none';
    document.getElementById('pinInput').value = '';
    document.getElementById('loginError').innerText = '';
}

// Data State
let state = {
    ledger: JSON.parse(localStorage.getItem('sbp_ledger')) || [],
    inventory: JSON.parse(localStorage.getItem('sbp_inventory')) || [],
    expenses: JSON.parse(localStorage.getItem('sbp_expenses')) || [],
    fleet: JSON.parse(localStorage.getItem('sbp_fleet')) || [],
    employees: JSON.parse(localStorage.getItem('sbp_employees')) || [],
    attendance: JSON.parse(localStorage.getItem('sbp_attendance')) || {},
    messages: JSON.parse(localStorage.getItem('sbw_messages')) || []
};

let map; // Global map instance

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    initSidebar();
    initMap();
    loadDashboardData();
    
    // Set default date for attendance picker
    if(document.getElementById('attendanceDatePicker')) {
        document.getElementById('attendanceDatePicker').valueAsDate = new Date();
        document.getElementById('attendanceDatePicker').addEventListener('change', loadAttendance);
    }

    // Form Submissions
    document.getElementById('ledgerForm')?.addEventListener('submit', handleLedgerSubmit);
    document.getElementById('employeeForm')?.addEventListener('submit', handleEmployeeSubmit);
    document.getElementById('inventoryForm')?.addEventListener('submit', handleInventorySubmit);
    document.getElementById('expenseForm')?.addEventListener('submit', handleExpenseSubmit);
    document.getElementById('dispatchForm')?.addEventListener('submit', handleDispatchSubmit);

    // Initial table loads
    refreshAllTables();
});

function refreshAllTables() {
    loadLedgerTable();
    loadInventoryTable();
    loadExpenseTable();
    loadFleetTable();
    loadEmployeeTable();
    loadAttendance();
    loadPayroll();
    loadMessagesTable();
}

function updateDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').innerText = new Date().toLocaleDateString(undefined, options);
}

function initSidebar() {
    const navItems = document.querySelectorAll('.sidebar-nav li');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section');
            switchSection(sectionId);
            
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function switchSection(sectionId) {
    const sections = document.querySelectorAll('.dashboard-section');
    sections.forEach(sec => sec.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    // Refresh relevant data
    if(sectionId === 'overview') {
        loadDashboardData();
        setTimeout(() => map.invalidateSize(), 100); // UI fix for hidden map
    }
    refreshAllTables();
}

/**
 * Map Integration
 */
function initMap() {
    if(!document.getElementById('factoryMap')) return;
    
    // Actual Factory coordinates from User
    const factoryCoords = [30.1185467, 77.2461462]; 
    
    map = L.map('factoryMap').setView(factoryCoords, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const factoryIcon = L.divIcon({
        html: '<i class="fa-solid fa-industry" style="color: #8b5a2b; font-size: 24px;"></i>',
        className: 'factory-marker'
    });

    L.marker(factoryCoords, {icon: factoryIcon}).addTo(map)
        .bindPopup('<b>Shree Balaji Wood Factory</b><br>Active Production Center<br><br><a href="https://www.google.com/maps/dir/?api=1&destination=30.1185467,77.2461462" target="_blank" style="color: #8b5a2b; font-weight: 600; text-decoration: none;"><i class="fa-solid fa-diamond-turn-right"></i> Get Directions</a>')
        .openPopup();
}

/**
 * Ledger Management
 */
function handleLedgerSubmit(e) {
    e.preventDefault();
    const entry = {
        id: Date.now(),
        customer: document.getElementById('custName').value,
        date: document.getElementById('saleDate').value,
        desc: document.getElementById('saleDesc').value,
        qty: parseInt(document.getElementById('saleQty').value),
        amount: parseFloat(document.getElementById('saleAmount').value)
    };

    state.ledger.unshift(entry);
    saveState();
    loadLedgerTable();
    closeModal();
    e.target.reset();
}

function loadLedgerTable() {
    const bodies = [
        document.querySelector('#recentLedgerTable tbody'),
        document.querySelector('#fullLedgerTable tbody')
    ];

    bodies.forEach((tbody, idx) => {
        if(!tbody) return;
        tbody.innerHTML = '';
        const dataSet = idx === 0 ? state.ledger.slice(0, 5) : state.ledger;

        dataSet.forEach(item => {
            const row = `
                <tr>
                    <td>${item.date}</td>
                    <td>${item.customer}</td>
                    ${idx === 1 ? `<td>${item.desc}</td>` : ''}
                    <td>${item.qty} units</td>
                    <td>₹${item.amount.toLocaleString()}</td>
                    ${idx === 1 ? `<td><button class="delete-btn" onclick="deleteRecord('ledger', ${item.id})"><i class="fa-solid fa-trash"></i></button></td>` : ''}
                </tr>
            `;
            tbody.innerHTML += row;
        });
    });
}

/**
 * Employee Management
 */
function handleEmployeeSubmit(e) {
    e.preventDefault();
    const emp = {
        id: 'EMP' + Date.now().toString().slice(-4),
        name: document.getElementById('empName').value,
        role: document.getElementById('empRole').value,
        wage: parseFloat(document.getElementById('empWage').value),
        joinDate: document.getElementById('empJoinDate').value
    };

    state.employees.push(emp);
    saveState();
    loadEmployeeTable();
    closeModal();
    e.target.reset();
}

function loadEmployeeTable() {
    const tbody = document.querySelector('#employeeTable tbody');
    if(!tbody) return;
    tbody.innerHTML = '';

    state.employees.forEach(emp => {
        const row = `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.name}</td>
                <td>${emp.role}</td>
                <td>₹${emp.wage}</td>
                <td>${emp.joinDate}</td>
                <td><button class="delete-btn" onclick="deleteRecord('employees', '${emp.id}')"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

/**
 * Attendance Management
 */
function loadAttendance() {
    const date = document.getElementById('attendanceDatePicker').value;
    const tbody = document.querySelector('#attendanceTable tbody');
    if(!tbody) return;
    tbody.innerHTML = '';

    const dailyLog = state.attendance[date] || {};

    state.employees.forEach(emp => {
        const status = dailyLog[emp.id] || 'Absent';
        const row = `
            <tr>
                <td>${emp.name}</td>
                <td>${emp.role}</td>
                <td>
                    <span class="status-pill status-toggle ${status === 'Present' ? 'status-present' : 'status-absent'}" 
                          onclick="toggleStatus(this, '${emp.id}')">
                        ${status}
                    </span>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function toggleStatus(el, empId) {
    if(el.innerText === 'Present') {
        el.innerText = 'Absent';
        el.classList.replace('status-present', 'status-absent');
    } else {
        el.innerText = 'Present';
        el.classList.replace('status-absent', 'status-present');
    }
}

function saveAttendance() {
    const date = document.getElementById('attendanceDatePicker').value;
    const rows = document.querySelectorAll('#attendanceTable tbody tr');
    const dailyLog = {};

    rows.forEach((row, idx) => {
        const emp = state.employees[idx];
        const status = row.querySelector('.status-pill').innerText;
        dailyLog[emp.id] = status;
    });

    state.attendance[date] = dailyLog;
    saveState();
    alert('Attendance saved for ' + date);
}

/**
 * Payroll Logic
 */
function loadPayroll() {
    const month = parseInt(document.getElementById('payrollMonth').value);
    const year = new Date().getFullYear();
    const tbody = document.querySelector('#payrollTable tbody');
    if(!tbody) return;
    tbody.innerHTML = '';

    state.employees.forEach(emp => {
        let daysPresent = 0;
        
        // Calculate days present in selected month
        Object.keys(state.attendance).forEach(dateStr => {
            const date = new Date(dateStr);
            if(date.getMonth() === month && date.getFullYear() === year) {
                if(state.attendance[dateStr][emp.id] === 'Present') {
                    daysPresent++;
                }
            }
        });

        const totalPay = daysPresent * emp.wage;

        const row = `
            <tr>
                <td>${emp.name}</td>
                <td>₹${emp.wage}</td>
                <td>${daysPresent} days</td>
                <td><strong>₹${totalPay.toLocaleString()}</strong></td>
                <td><button class="btn outline-btn" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;" onclick="alert('Payment receipt generated for ${emp.name}')">Pay Now</button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

/**
 * Inventory Management
 */
function handleInventorySubmit(e) {
    e.preventDefault();
    const item = {
        id: Date.now(),
        name: document.getElementById('prodName').value,
        type: document.getElementById('prodType').value,
        qty: parseInt(document.getElementById('prodQty').value),
        date: document.getElementById('prodDate').value
    };

    state.inventory.unshift(item);
    saveState();
    loadInventoryTable();
    closeModal();
    e.target.reset();
}

function loadInventoryTable() {
    const tbody = document.querySelector('#inventoryTable tbody');
    if(!tbody) return;
    tbody.innerHTML = '';

    state.inventory.forEach(item => {
        const row = `
            <tr>
                <td>${item.date}</td>
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>${item.qty} units</td>
                <td><button class="delete-btn" onclick="deleteRecord('inventory', ${item.id})"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

/**
 * Expense Management
 */
function handleExpenseSubmit(e) {
    e.preventDefault();
    const expense = {
        id: Date.now(),
        date: document.getElementById('expDate').value,
        category: document.getElementById('expCategory').value,
        desc: document.getElementById('expDesc').value,
        amount: parseFloat(document.getElementById('expAmount').value)
    };

    state.expenses.unshift(expense);
    saveState();
    loadExpenseTable();
    closeModal();
    e.target.reset();
}

function loadExpenseTable() {
    const tbody = document.querySelector('#expenseTable tbody');
    if(!tbody) return;
    tbody.innerHTML = '';

    state.expenses.forEach(exp => {
        const row = `
            <tr>
                <td>${exp.date}</td>
                <td>${exp.category}</td>
                <td>${exp.desc}</td>
                <td>₹${exp.amount.toLocaleString()}</td>
                <td><button class="delete-btn" onclick="deleteRecord('expenses', ${exp.id})"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

/**
 * Fleet Management (Dispatch)
 */
function handleDispatchSubmit(e) {
    e.preventDefault();
    const dispatch = {
        id: Date.now(),
        vehicle: document.getElementById('trolleyId').value,
        driver: "Driver " + (state.fleet.length + 1), // Auto-assign driver for demo
        destination: document.getElementById('destination').value,
        time: document.getElementById('dispatchTime').value,
        status: 'Dispatched'
    };

    state.fleet.unshift(dispatch);
    saveState();
    loadFleetTable();
    closeModal();
    e.target.reset();
}

function loadFleetTable() {
    const tbody = document.querySelector('#fleetTable tbody');
    if(!tbody) return;
    tbody.innerHTML = '';

    state.fleet.forEach(dispatch => {
        const row = `
            <tr>
                <td>${dispatch.time}</td>
                <td>${dispatch.vehicle}</td>
                <td>${dispatch.driver}</td>
                <td>${dispatch.destination}</td>
                <td><span class="status-pill ${dispatch.status === 'Delivered' ? 'status-present' : 'status-toggle'}" 
                          onclick="markDelivered(${dispatch.id})" style="cursor: pointer">
                    ${dispatch.status}</span></td>
                <td><button class="delete-btn" onclick="deleteRecord('fleet', ${dispatch.id})"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function markDelivered(id) {
    const item = state.fleet.find(f => f.id === id);
    if(item) {
        item.status = 'Delivered';
        saveState();
        loadFleetTable();
    }
}

/**
 * Message Management
 */
function loadMessagesTable() {
    const tbody = document.querySelector('#messagesTable tbody');
    if(!tbody) return;
    tbody.innerHTML = '';

    state.messages.forEach(msg => {
        const row = `
            <tr>
                <td>${msg.date}</td>
                <td>${msg.name}</td>
                <td>${msg.email}<br><small>${msg.phone}</small></td>
                <td><div class="msg-content" title="${msg.message}">${msg.message}</div></td>
                <td><span class="status-pill ${msg.status === 'Read' ? 'status-present' : 'status-toggle'}">${msg.status}</span></td>
                <td>
                    ${msg.status === 'New' ? `<button class="btn outline-btn" style="padding: 0.2rem 0.5rem; font-size: 0.7rem; margin-right: 0.3rem;" onclick="markMessageRead(${msg.id})"><i class="fa-solid fa-check"></i></button>` : ''}
                    <button class="delete-btn" onclick="deleteRecord('messages', ${msg.id})"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function markMessageRead(id) {
    const msg = state.messages.find(m => m.id === id);
    if(msg) {
        msg.status = 'Read';
        saveState();
        loadMessagesTable();
    }
}


/**
 * Overview Calculations
 */
function loadDashboardData() {
    const totalRev = state.ledger.reduce((sum, item) => sum + item.amount, 0);
    const totalExp = state.expenses.reduce((sum, item) => sum + item.amount, 0);
    
    // Calculate payroll for profit summary
    let payrollCosts = 0;
    Object.keys(state.attendance).forEach(date => {
        state.employees.forEach(emp => {
            if(state.attendance[date][emp.id] === 'Present') payrollCosts += emp.wage;
        });
    });

    const netProfit = totalRev - (totalExp + payrollCosts);
    
    document.getElementById('totalRevenue').innerText = '₹' + totalRev.toLocaleString();
    if(document.getElementById('totalExpenses')) document.getElementById('totalExpenses').innerText = '₹' + (totalExp + payrollCosts).toLocaleString();
    if(document.getElementById('grossProfit')) document.getElementById('grossProfit').innerText = '₹' + netProfit.toLocaleString();
    
    const totalQty = state.ledger.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('totalSales').innerText = totalQty.toLocaleString() + ' Units';
    
    const today = new Date().toISOString().split('T')[0];
    const todayLog = state.attendance[today] || {};
    const presentCount = Object.values(todayLog).filter(s => s === 'Present').length;
    
    if(document.getElementById('todayAttendance')) document.getElementById('todayAttendance').innerText = `${presentCount}/${state.employees.length}`;
}

/**
 * Utility Functions
 */
function saveState() {
    localStorage.setItem('sbp_ledger', JSON.stringify(state.ledger));
    localStorage.setItem('sbp_inventory', JSON.stringify(state.inventory));
    localStorage.setItem('sbp_expenses', JSON.stringify(state.expenses));
    localStorage.setItem('sbp_fleet', JSON.stringify(state.fleet));
    localStorage.setItem('sbp_employees', JSON.stringify(state.employees));
    localStorage.setItem('sbp_attendance', JSON.stringify(state.attendance));
    localStorage.setItem('sbw_messages', JSON.stringify(state.messages));
}

function deleteRecord(type, id) {
    if(!confirm('Are you sure you want to delete this record?')) return;
    
    if(type === 'ledger') state.ledger = state.ledger.filter(item => item.id !== id);
    if(type === 'inventory') state.inventory = state.inventory.filter(item => item.id !== id);
    if(type === 'expenses') state.expenses = state.expenses.filter(item => item.id !== id);
    if(type === 'fleet') state.fleet = state.fleet.filter(item => item.id !== id);
    if(type === 'employees') state.employees = state.employees.filter(emp => emp.id !== id);
    if(type === 'messages') state.messages = state.messages.filter(msg => msg.id !== id);
    
    saveState();
    refreshAllTables();
    loadDashboardData();
}

function openModal(type) {
    document.getElementById('modalOverlay').style.display = 'flex';
    document.querySelectorAll('.dashboard-modal').forEach(m => m.style.display = 'none');
    
    if(type === 'ledger') {
        document.getElementById('ledgerModal').style.display = 'block';
        document.getElementById('saleDate').valueAsDate = new Date();
    } else if(type === 'employee') {
        document.getElementById('employeeModal').style.display = 'block';
        document.getElementById('empJoinDate').valueAsDate = new Date();
    } else if(type === 'inventory') {
        document.getElementById('inventoryModal').style.display = 'block';
        document.getElementById('prodDate').valueAsDate = new Date();
    } else if(type === 'expense') {
        document.getElementById('expenseModal').style.display = 'block';
        document.getElementById('expDate').valueAsDate = new Date();
    } else if(type === 'dispatch') {
        document.getElementById('dispatchModal').style.display = 'block';
        const now = new Date();
        document.getElementById('dispatchTime').value = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    }
}


function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
}

function exportData(type) {
    const data = state[type];
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sbp_${type}_export.json`;
    a.click();
}
