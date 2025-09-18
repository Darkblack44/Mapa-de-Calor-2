// Ruta: graficos-botones.js

// Variables para gráficos
let charts = {};
let showDataLabels = false;
let currentTopN = 10;

// FUNCIONES DE UTILIDAD FALTANTES
function formatNumber(num) {
    if (typeof num !== 'number' || isNaN(num)) return '0';
    return new Intl.NumberFormat('es-ES').format(num);
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    if (notification && notificationText) {
        notificationText.textContent = message;
        notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// FUNCIONES DE BLOQUEO DE SCROLL
function bloquearScrollBody() {
    document.body.classList.add('overlay-active');
}

function desbloquearScrollBody() {
    document.body.classList.remove('overlay-active');
}

// FUNCIÓN PARA VERIFICAR DATOS
function verificarDatos() {
    if (!window.currentData) {
        console.warn('⚠️ currentData no está disponible, intentando usar datos globales');
        
        if (window.datosColombiaTexto && typeof parseData === 'function') {
            try {
                window.currentData = parseData(window.datosColombiaTexto);
                console.log('✅ Datos procesados desde datosColombiaTexto');
            } catch (error) {
                console.error('❌ Error procesando datos:', error);
                return false;
            }
        } else {
            console.error('❌ No se encontraron datos para procesar');
            return false;
        }
    }
    
    const data = window.currentData;
    
    if (!data || typeof data !== 'object') {
        console.error('❌ currentData no es válido');
        return false;
    }
    
    // Asegurar que las propiedades básicas existan
    if (!data.departamentos) data.departamentos = {};
    if (!data.municipios) data.municipios = {};
    if (!data.paises) data.paises = {};
    if (!data.nivelesAcademicos) data.nivelesAcademicos = { Pregrado: 0, Posgrado: 0 };
    if (!data.registrosTotales) data.registrosTotales = 0;
    if (!data.topPaises) data.topPaises = [];
    
    // Crear topPaises si no existe
    if (data.topPaises.length === 0) {
        data.topPaises = Object.entries(data.paises)
            .map(([nombre, data]) => ({ nombre, total: data.total || 0 }))
            .sort((a, b) => b.total - a.total);
    }
    
    console.log('✅ Datos verificados correctamente');
    return true;
}

// FUNCIÓN PARA ALTERNAR DASHBOARD CON BLOQUEO DE SCROLL
function toggleDashboard() {
    const overlay = document.getElementById('overlay-dashboard');
    if (!overlay) {
        console.error('❌ Elemento overlay-dashboard no encontrado');
        return;
    }
    
    const isShowing = overlay.classList.contains('show');
    
    if (isShowing) {
        overlay.classList.remove('show');
        desbloquearScrollBody();
    } else {
        if (!verificarDatos()) {
            showNotification('❌ No hay datos disponibles para mostrar', 'error');
            return;
        }
        overlay.classList.add('show');
        bloquearScrollBody();
        setTimeout(() => {
            updateDashboardCharts();
        }, 100);
    }
}

// FUNCIÓN PARA ALTERNAR ESTADÍSTICAS CON BLOQUEO DE SCROLL
function toggleStats() {
    const overlay = document.getElementById('overlay-stats');
    if (!overlay) {
        console.error('❌ Elemento overlay-stats no encontrado');
        return;
    }
    
    const isShowing = overlay.classList.contains('show');
    
    if (isShowing) {
        overlay.classList.remove('show');
        desbloquearScrollBody();
    } else {
        if (!verificarDatos()) {
            showNotification('❌ No hay datos disponibles para mostrar', 'error');
            return;
        }
        overlay.classList.add('show');
        bloquearScrollBody();
        setTimeout(() => {
            updateStatsCharts();
        }, 100);
    }
}

// FUNCIÓN PARA OBTENER VALOR DE TOP N
function getTopNValue(selectId) {
    const selectElement = document.getElementById(selectId);
    if (!selectElement) return 10;
    const value = selectElement.value;
    return value === 'all' ? 999999 : parseInt(value);
}

// ============= DASHBOARD CHARTS =============

// FUNCIÓN PARA ACTUALIZAR GRÁFICOS DEL DASHBOARD
function updateDashboardCharts() {
    if (!verificarDatos()) {
        showNotification('❌ Error: No hay datos para mostrar gráficos', 'error');
        return;
    }
    
    const data = window.currentData;
    
    const topNControl = document.getElementById('topN-control');
    if (topNControl) {
        currentTopN = getTopNValue('topN-control');
    }
    
    try {
        updateDepartamentosTab();
        updateMunicipiosTab();
        updatePaisesTab();
        console.log('✅ Gráficos del dashboard actualizados');
    } catch (error) {
        console.error('❌ Error al actualizar gráficos del dashboard:', error);
        showNotification('❌ Error al cargar gráficos del dashboard', 'error');
    }
}

// ============= TAB DEPARTAMENTOS =============
function updateDepartamentosTab() {
    const data = window.currentData;
    
    // Actualizar estadísticas
    const elements = {
        deptTotalRegistros: document.getElementById('dept-total-registros'),
        deptTotalDepartamentos: document.getElementById('dept-total-departamentos'),
        deptPromedio: document.getElementById('dept-promedio')
    };
    
    const totalDepts = Object.keys(data.departamentos).length;
    const promedio = totalDepts > 0 ? Math.round(data.registrosTotales / totalDepts) : 0;
    
    if (elements.deptTotalRegistros) elements.deptTotalRegistros.textContent = formatNumber(data.registrosTotales);
    if (elements.deptTotalDepartamentos) elements.deptTotalDepartamentos.textContent = totalDepts;
    if (elements.deptPromedio) elements.deptPromedio.textContent = formatNumber(promedio);
    
    const topDepts = Object.entries(data.departamentos)
        .map(([name, data]) => [name, data])
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, currentTopN);
    
    // Crear los 6 gráficos - TODOS RESPETAN currentTopN
    createDeptBarChart(topDepts);
    createDeptPieChart(topDepts.slice(0, Math.min(currentTopN, 8))); // Máximo 8 para pie chart
    createDeptPregradoChart(topDepts);
    createDeptPosgradoChart(topDepts);
    createDeptComparativaChart(topDepts.slice(0, Math.min(currentTopN, 6))); // Máximo 6 para comparativa
    createDeptRadarChart(topDepts.slice(0, Math.min(currentTopN, 6))); // Máximo 6 para radar
}

function createDeptBarChart(topDepts) {
    const ctx = document.getElementById('deptBarChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.deptBarChart) charts.deptBarChart.destroy();
    
    charts.deptBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topDepts.map(([n]) => n.length > 12 ? n.substring(0, 12) + '...' : n),
            datasets: [{
                label: 'Registros',
                data: topDepts.map(([,i]) => i.total),
                backgroundColor: '#dc2626',
                borderRadius: 6,
                hoverBackgroundColor: '#ef4444'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: {
                    display: showDataLabels,
                    anchor: 'end',
                    align: 'top',
                    color: '#374151',
                    font: { weight: 'bold' }
                }
            },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#6b7280' }},
                x: { ticks: { color: '#6b7280' }}
            }
        }
    });
}

function createDeptPieChart(topDepts) {
    const ctx = document.getElementById('deptPieChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.deptPieChart) charts.deptPieChart.destroy();
    
    charts.deptPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: topDepts.map(([n]) => n),
            datasets: [{
                data: topDepts.map(([,i]) => i.total),
                backgroundColor: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2', '#fef2f2', '#fffbfb']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#374151', usePointStyle: true }},
                datalabels: {
                    display: showDataLabels,
                    formatter: (v, ctx) => {
                        const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        return total > 0 ? (v*100 / total).toFixed(1)+"%": "0%";
                    },
                    color: '#fff',
                    font: { weight: 'bold' }
                }
            }
        }
    });
}

function createDeptPregradoChart(topDepts) {
    const ctx = document.getElementById('deptPregradoChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.deptPregradoChart) charts.deptPregradoChart.destroy();
    
    charts.deptPregradoChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topDepts.map(([n]) => n.length > 10 ? n.substring(0, 10) + '...' : n),
            datasets: [{
                label: 'Pregrado',
                data: topDepts.map(([,i]) => (i.niveles && i.niveles.Pregrado) || 0),
                backgroundColor: '#10b981',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: { display: showDataLabels, color: '#374151', font: { weight: 'bold' }}
            },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#6b7280' }},
                x: { ticks: { color: '#6b7280' }}
            }
        }
    });
}

function createDeptPosgradoChart(topDepts) {
    const ctx = document.getElementById('deptPosgradoChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.deptPosgradoChart) charts.deptPosgradoChart.destroy();
    
    charts.deptPosgradoChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topDepts.map(([n]) => n.length > 10 ? n.substring(0, 10) + '...' : n),
            datasets: [{
                label: 'Posgrado',
                data: topDepts.map(([,i]) => (i.niveles && i.niveles.Posgrado) || 0),
                backgroundColor: '#8b5cf6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: { display: showDataLabels, color: '#374151', font: { weight: 'bold' }}
            },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#6b7280' }},
                x: { ticks: { color: '#6b7280' }}
            }
        }
    });
}

function createDeptComparativaChart(topDepts) {
    const ctx = document.getElementById('deptComparativaChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.deptComparativaChart) charts.deptComparativaChart.destroy();
    
    charts.deptComparativaChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topDepts.map(([n]) => n.length > 8 ? n.substring(0, 8) + '...' : n),
            datasets: [
                {
                    label: 'Pregrado',
                    data: topDepts.map(([,i]) => (i.niveles && i.niveles.Pregrado) || 0),
                    backgroundColor: '#10b981'
                },
                {
                    label: 'Posgrado',
                    data: topDepts.map(([,i]) => (i.niveles && i.niveles.Posgrado) || 0),
                    backgroundColor: '#8b5cf6'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: '#374151', usePointStyle: true }},
                datalabels: { display: showDataLabels, color: '#374151', font: { size: 10, weight: 'bold' }}
            },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#6b7280' }},
                x: { ticks: { color: '#6b7280', maxRotation: 45 }}
            }
        }
    });
}

function createDeptRadarChart(topDepts) {
    const ctx = document.getElementById('deptRadarChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.deptRadarChart) charts.deptRadarChart.destroy();
    
    const maxValue = Math.max(...topDepts.map(([,i]) => i.total));
    
    charts.deptRadarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: topDepts.map(([n]) => n.length > 8 ? n.substring(0, 8) + '...' : n),
            datasets: [{
                label: 'Registros',
                data: topDepts.map(([,i]) => i.total),
                backgroundColor: 'rgba(220, 38, 38, 0.2)',
                borderColor: '#dc2626',
                borderWidth: 2,
                pointBackgroundColor: '#dc2626'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: { display: false }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: maxValue * 1.1,
                    ticks: { color: '#6b7280', stepSize: Math.ceil(maxValue / 5) },
                    grid: { color: '#e5e7eb' },
                    pointLabels: { color: '#374151', font: { size: 11 }}
                }
            }
        }
    });
}

// ============= TAB MUNICIPIOS =============
function updateMunicipiosTab() {
    const data = window.currentData;
    
    const elements = {
        munTotalRegistros: document.getElementById('mun-total-registros'),
        munTotalMunicipios: document.getElementById('mun-total-municipios'),
        munPromedio: document.getElementById('mun-promedio')
    };
    
    const totalMuns = Object.keys(data.municipios).length;
    const promedio = totalMuns > 0 ? Math.round(data.registrosTotales / totalMuns) : 0;
    
    if (elements.munTotalRegistros) elements.munTotalRegistros.textContent = formatNumber(data.registrosTotales);
    if (elements.munTotalMunicipios) elements.munTotalMunicipios.textContent = totalMuns;
    if (elements.munPromedio) elements.munPromedio.textContent = formatNumber(promedio);
    
    const topMuns = Object.entries(data.municipios)
        .map(([name, data]) => [name, data])
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, currentTopN);
    
    // Crear los 6 gráficos para municipios - TODOS RESPETAN currentTopN
    createMunBarChart(topMuns);
    createMunPieChart(topMuns.slice(0, Math.min(currentTopN, 8))); // Máximo 8 para pie
    createMunPorDeptChart(data, Math.min(currentTopN, 8)); // Máximo 8 para doughnut
    createMunDensidadChart(topMuns.slice(0, Math.min(currentTopN, 8))); // Máximo 8 para línea
    createMunHorizontalChart(topMuns.slice(0, Math.min(currentTopN, 6))); // Máximo 6 para horizontal
    createMunBubbleChart(topMuns.slice(0, Math.min(currentTopN, 10))); // Máximo 10 para bubble
}

function createMunBarChart(topMuns) {
    const ctx = document.getElementById('munBarChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.munBarChart) charts.munBarChart.destroy();
    
    charts.munBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topMuns.map(([n]) => n.length > 12 ? n.substring(0, 12) + '...' : n),
            datasets: [{
                label: 'Registros',
                data: topMuns.map(([,i]) => i.total),
                backgroundColor: '#10b981',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: { display: showDataLabels, anchor: 'end', align: 'top', color: '#374151', font: { weight: 'bold' }}
            },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#6b7280' }},
                x: { ticks: { color: '#6b7280' }}
            }
        }
    });
}

function createMunPieChart(topMuns) {
    const ctx = document.getElementById('munPieChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.munPieChart) charts.munPieChart.destroy();
    
    charts.munPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: topMuns.map(([n]) => n),
            datasets: [{
                data: topMuns.map(([,i]) => i.total),
                backgroundColor: ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#374151', usePointStyle: true }},
                datalabels: {
                    display: showDataLabels,
                    formatter: (v, ctx) => {
                        const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        return total > 0 ? (v*100 / total).toFixed(1)+"%": "0%";
                    },
                    color: '#fff',
                    font: { weight: 'bold' }
                }
            }
        }
    });
}

function createMunPorDeptChart(data, maxItems) {
    const ctx = document.getElementById('munPorDeptChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.munPorDeptChart) charts.munPorDeptChart.destroy();
    
    const munsPorDept = {};
    Object.entries(data.municipios).forEach(([munName, munData]) => {
        const dept = munData.departamento || 'Sin departamento';
        if (!munsPorDept[dept]) munsPorDept[dept] = 0;
        munsPorDept[dept] += munData.total;
    });
    
    const topDepts = Object.entries(munsPorDept)
        .sort((a, b) => b[1] - a[1])
        .slice(0, maxItems);
    
    charts.munPorDeptChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: topDepts.map(([n]) => n.length > 10 ? n.substring(0, 10) + '...' : n),
            datasets: [{
                data: topDepts.map(([,v]) => v),
                backgroundColor: ['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a', '#312e81', '#3730a3', '#4338ca', '#4f46e5']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { color: '#374151', usePointStyle: true }},
                datalabels: { display: showDataLabels, color: '#fff', font: { weight: 'bold', size: 10 }}
            }
        }
    });
}

function createMunDensidadChart(topMuns) {
    const ctx = document.getElementById('munDensidadChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.munDensidadChart) charts.munDensidadChart.destroy();
    
    charts.munDensidadChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: topMuns.map(([n]) => n.length > 8 ? n.substring(0, 8) + '...' : n),
            datasets: [{
                label: 'Densidad',
                data: topMuns.map(([,i]) => i.total),
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#dc2626'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: { display: showDataLabels, color: '#374151', font: { weight: 'bold' }}
            },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#6b7280' }},
                x: { ticks: { color: '#6b7280' }}
            }
        }
    });
}

function createMunHorizontalChart(topMuns) {
    const ctx = document.getElementById('munHorizontalChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.munHorizontalChart) charts.munHorizontalChart.destroy();
    
    charts.munHorizontalChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topMuns.map(([n]) => n.length > 15 ? n.substring(0, 15) + '...' : n),
            datasets: [{
                label: 'Registros',
                data: topMuns.map(([,i]) => i.total),
                backgroundColor: '#8b5cf6',
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: { display: showDataLabels, anchor: 'end', align: 'right', color: '#374151', font: { weight: 'bold' }}
            },
            scales: {
                x: { beginAtZero: true, ticks: { color: '#6b7280' }},
                y: { ticks: { color: '#6b7280' }}
            }
        }
    });
}

function createMunBubbleChart(topMuns) {
    const ctx = document.getElementById('munBubbleChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.munBubbleChart) charts.munBubbleChart.destroy();
    
    const maxValue = Math.max(...topMuns.map(([,i]) => i.total));
    
    charts.munBubbleChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                label: 'Municipios',
                data: topMuns.map(([name, data], index) => ({
                    x: index + 1,
                    y: data.total,
                    r: Math.max(5, (data.total / maxValue) * 20),
                    municipio: name
                })),
                backgroundColor: 'rgba(245, 158, 11, 0.6)',
                borderColor: '#f59e0b',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.raw.municipio}: ${context.raw.y} registros`;
                        }
                    }
                }
            },
            scales: {
                x: { beginAtZero: true, ticks: { color: '#6b7280' }, title: { display: true, text: 'Ranking', color: '#374151' }},
                y: { beginAtZero: true, ticks: { color: '#6b7280' }, title: { display: true, text: 'Registros', color: '#374151' }}
            }
        }
    });
}

// ============= TAB PAÍSES =============
function updatePaisesTab() {
    const data = window.currentData;
    
    const elements = {
        paisTotalRegistros: document.getElementById('pais-total-registros'),
        paisTotalPaises: document.getElementById('pais-total-paises'),
        paisMasRegistros: document.getElementById('pais-mas-registros')
    };
    
    const totalPaises = Object.keys(data.paises).length;
    const topPais = Object.entries(data.paises)
        .sort((a, b) => b[1].total - a[1].total)[0];
    
    if (elements.paisTotalRegistros) elements.paisTotalRegistros.textContent = formatNumber(data.registrosTotales);
    if (elements.paisTotalPaises) elements.paisTotalPaises.textContent = totalPaises;
    if (elements.paisMasRegistros) elements.paisMasRegistros.textContent = topPais ? topPais[0] : '-';
    
    const topPaises = Object.entries(data.paises)
        .map(([name, data]) => [name, data])
        .sort((a, b) => b[1].total - a[1].total)
        .slice(0, currentTopN);
    
    // Crear los 6 gráficos para países - TODOS RESPETAN currentTopN
    createPaisPieChart(topPaises.slice(0, Math.min(currentTopN, 8))); // Máximo 8 para pie
    createPaisBarChart(topPaises);
    createPaisPregradoChart(topPaises);
    createPaisPosgradoChart(topPaises);
    createPaisNivelesChart(topPaises.slice(0, Math.min(currentTopN, 6))); // Máximo 6 para comparativa
    createPaisHeatmapChart(topPaises.slice(0, Math.min(currentTopN, 8))); // Máximo 8 para heatmap
}

function createPaisPieChart(topPaises) {
    const ctx = document.getElementById('paisPieChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.paisPieChart) charts.paisPieChart.destroy();
    
    charts.paisPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: topPaises.map(([n]) => n),
            datasets: [{
                data: topPaises.map(([,i]) => i.total),
                backgroundColor: ['#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a', '#312e81', '#3730a3', '#4338ca', '#4f46e5']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#374151', usePointStyle: true }},
                datalabels: {
                    display: showDataLabels,
                    formatter: (v, ctx) => {
                        const total = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                        return total > 0 ? (v*100 / total).toFixed(1)+"%": "0%";
                    },
                    color: '#fff',
                    font: { weight: 'bold' }
                }
            }
        }
    });
}

function createPaisBarChart(topPaises) {
    const ctx = document.getElementById('paisBarChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.paisBarChart) charts.paisBarChart.destroy();
    
    charts.paisBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topPaises.map(([n]) => n.length > 12 ? n.substring(0, 12) + '...' : n),
            datasets: [{
                label: 'Registros',
                data: topPaises.map(([,i]) => i.total),
                backgroundColor: '#10b981',
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: { display: showDataLabels, anchor: 'end', align: 'top', color: '#374151', font: { weight: 'bold' }}
            },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#6b7280' }},
                x: { ticks: { color: '#6b7280' }}
            }
        }
    });
}

function createPaisPregradoChart(topPaises) {
    const ctx = document.getElementById('paisPregradoChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.paisPregradoChart) charts.paisPregradoChart.destroy();
    
    charts.paisPregradoChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topPaises.map(([n]) => n.length > 10 ? n.substring(0, 10) + '...' : n),
            datasets: [{
                label: 'Pregrado',
                data: topPaises.map(([,i]) => (i.niveles && i.niveles.Pregrado) || 0),
                backgroundColor: '#14b8a6',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: { display: showDataLabels, color: '#374151', font: { weight: 'bold' }}
            },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#6b7280' }},
                x: { ticks: { color: '#6b7280' }}
            }
        }
    });
}

function createPaisPosgradoChart(topPaises) {
    const ctx = document.getElementById('paisPosgradoChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.paisPosgradoChart) charts.paisPosgradoChart.destroy();
    
    charts.paisPosgradoChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topPaises.map(([n]) => n.length > 10 ? n.substring(0, 10) + '...' : n),
            datasets: [{
                label: 'Posgrado',
                data: topPaises.map(([,i]) => (i.niveles && i.niveles.Posgrado) || 0),
                backgroundColor: '#ef4444',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: { display: showDataLabels, color: '#374151', font: { weight: 'bold' }}
            },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#6b7280' }},
                x: { ticks: { color: '#6b7280' }}
            }
        }
    });
}

function createPaisNivelesChart(topPaises) {
    const ctx = document.getElementById('paisNivelesChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.paisNivelesChart) charts.paisNivelesChart.destroy();
    
    charts.paisNivelesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topPaises.map(([n]) => n.length > 8 ? n.substring(0, 8) + '...' : n),
            datasets: [
                {
                    label: 'Pregrado',
                    data: topPaises.map(([,i]) => (i.niveles && i.niveles.Pregrado) || 0),
                    backgroundColor: '#14b8a6'
                },
                {
                    label: 'Posgrado',
                    data: topPaises.map(([,i]) => (i.niveles && i.niveles.Posgrado) || 0),
                    backgroundColor: '#ef4444'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { color: '#374151', usePointStyle: true }},
                datalabels: { display: showDataLabels, color: '#374151', font: { size: 10, weight: 'bold' }}
            },
            scales: {
                y: { beginAtZero: true, stacked: false, ticks: { color: '#6b7280' }},
                x: { ticks: { color: '#6b7280', maxRotation: 45 }}
            }
        }
    });
}

function createPaisHeatmapChart(topPaises) {
    const ctx = document.getElementById('paisHeatmapChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.paisHeatmapChart) charts.paisHeatmapChart.destroy();
    
    const maxValue = Math.max(...topPaises.map(([,i]) => i.total));
    
    charts.paisHeatmapChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topPaises.map(([n]) => n.length > 12 ? n.substring(0, 12) + '...' : n),
            datasets: [{
                label: 'Intensidad',
                data: topPaises.map(([,i]) => i.total),
                backgroundColor: topPaises.map(([,i]) => {
                    const intensity = i.total / maxValue;
                    const alpha = Math.max(0.3, intensity);
                    return `rgba(99, 102, 241, ${alpha})`;
                }),
                borderColor: '#6366f1',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: { display: showDataLabels, anchor: 'end', align: 'right', color: '#374151', font: { weight: 'bold' }}
            },
            scales: {
                x: { beginAtZero: true, ticks: { color: '#6b7280' }},
                y: { ticks: { color: '#6b7280' }}
            }
        }
    });
}

// ============= ESTADÍSTICAS DETALLADAS =============

// FUNCIÓN CORREGIDA PARA ESTADÍSTICAS
function updateStatsCharts() {
    if (!verificarDatos()) {
        showNotification('❌ Error: No hay datos para mostrar estadísticas', 'error');
        return;
    }
    
    const data = window.currentData;
    const topNControlStats = document.getElementById('topN-control-stats');
    const currentTopNStats = topNControlStats ? getTopNValue('topN-control-stats') : 10;
    
    try {
        // Gráfico de niveles académicos
        createNivelesChart(data);
        
        // Gráfico de pregrado por departamento
        createPregradoChart(data, currentTopNStats);
        
        // Gráfico de posgrado por departamento
        createPosgradoChart(data, currentTopNStats);
        
        // Gráfico comparativo por países
        createNivelesXPaisChart(data, currentTopNStats);
        
        console.log('✅ Gráficos de estadísticas actualizados');
    } catch (error) {
        console.error('❌ Error al actualizar estadísticas:', error);
        showNotification('❌ Error al cargar estadísticas', 'error');
    }
}

function createNivelesChart(data) {
    const ctx = document.getElementById('nivelesChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.nivelesChart) charts.nivelesChart.destroy();
    
    const pregrado = data.nivelesAcademicos.Pregrado || 0;
    const posgrado = data.nivelesAcademicos.Posgrado || 0;
    const total = pregrado + posgrado;
    
    charts.nivelesChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pregrado', 'Posgrado'],
            datasets: [{
                data: [pregrado, posgrado],
                backgroundColor: ['#3b82f6', '#10b981'],
                hoverBackgroundColor: ['#2563eb', '#059669'],
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverBorderWidth: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: { 
                        color: '#374151',
                        usePointStyle: true,
                        padding: 20
                    }
                },
                datalabels: {
                    display: showDataLabels,
                    formatter: (v) => (total > 0 ? (v*100/total).toFixed(1) : 0)+"%",
                    color: '#fff',
                    font: { weight: 'bold', size: 14 }
                }
            }
        }
    });
}

function createPregradoChart(data, topN) {
    const ctx = document.getElementById('pregradoChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.pregradoChart) charts.pregradoChart.destroy();
    
    const pregradoDepts = Object.entries(data.departamentos)
        .filter(([,i]) => i.niveles && i.niveles.Pregrado > 0)
        .sort(([,a], [,b]) => b.niveles.Pregrado - a.niveles.Pregrado)
        .slice(0, topN);
    
    charts.pregradoChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: pregradoDepts.map(([n]) => n.length > 12 ? n.substring(0, 12) + '...' : n),
            datasets: [{
                label: 'Pregrado',
                data: pregradoDepts.map(([,i]) => i.niveles.Pregrado),
                backgroundColor: '#3b82f6',
                borderRadius: 6,
                hoverBackgroundColor: '#2563eb'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: {
                    display: showDataLabels,
                    anchor: 'end',
                    align: 'top',
                    color: '#374151',
                    font: { weight: 'bold' }
                }
            },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#6b7280' }},
                x: { ticks: { color: '#6b7280' }}
            }
        }
    });
}

function createPosgradoChart(data, topN) {
    const ctx = document.getElementById('posgradoChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.posgradoChart) charts.posgradoChart.destroy();
    
    const posgradoDepts = Object.entries(data.departamentos)
        .filter(([,i]) => i.niveles && i.niveles.Posgrado > 0)
        .sort(([,a], [,b]) => b.niveles.Posgrado - a.niveles.Posgrado)
        .slice(0, topN);
    
    charts.posgradoChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: posgradoDepts.map(([n]) => n.length > 12 ? n.substring(0, 12) + '...' : n),
            datasets: [{
                label: 'Posgrado',
                data: posgradoDepts.map(([,i]) => i.niveles.Posgrado),
                backgroundColor: '#8b5cf6',
                borderRadius: 6,
                hoverBackgroundColor: '#7c3aed'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                datalabels: {
                    display: showDataLabels,
                    anchor: 'end',
                    align: 'top',
                    color: '#374151',
                    font: { weight: 'bold' }
                }
            },
            scales: {
                y: { beginAtZero: true, ticks: { color: '#6b7280' }},
                x: { ticks: { color: '#6b7280' }}
            }
        }
    });
}

function createNivelesXPaisChart(data, topN) {
    const ctx = document.getElementById('nivelesXPaisChart')?.getContext('2d');
    if (!ctx) return;
    
    if (charts.nivelesXPaisChart) charts.nivelesXPaisChart.destroy();
    
    const topPaisesStats = data.topPaises.slice(0, Math.min(topN, data.topPaises.length));
    
    charts.nivelesXPaisChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topPaisesStats.map(p => p.nombre),
            datasets: [
                {
                    label: 'Pregrado',
                    data: topPaisesStats.map(p => (data.paises[p.nombre]?.niveles?.Pregrado) || 0),
                    backgroundColor: '#3b82f6',
                    hoverBackgroundColor: '#2563eb'
                },
                {
                    label: 'Posgrado',
                    data: topPaisesStats.map(p => (data.paises[p.nombre]?.niveles?.Posgrado) || 0),
                    backgroundColor: '#10b981',
                    hoverBackgroundColor: '#059669'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: { 
                        color: '#374151',
                        usePointStyle: true,
                        padding: 15
                    }
                },
                datalabels: { 
                    display: showDataLabels,
                    color: '#374151',
                    font: { weight: 'bold' }
                }
            },
            scales: {
                x: { 
                    stacked: true,
                    ticks: { color: '#6b7280' }
                },
                y: { 
                    stacked: true, 
                    beginAtZero: true,
                    ticks: { color: '#6b7280' }
                }
            }
        }
    });
}

// ============= FUNCIONES DE CONTROL =============

// FUNCIÓN PARA ALTERNAR ETIQUETAS DE DATOS
function toggleChartDataLabels() {
    showDataLabels = !showDataLabels;
    
    ['toggle-data-labels-dashboard', 'toggle-data-labels-stats'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            const span = btn.querySelector('span');
            if (span) {
                span.textContent = showDataLabels ? 'Ocultar Datos' : 'Datos Numéricos';
            }
            btn.classList.toggle('active-data', showDataLabels);
        }
    });
    
    // Actualizar todos los gráficos existentes
    Object.values(charts).forEach(chart => {
        if (chart && chart.options && chart.options.plugins && chart.options.plugins.datalabels) {
            chart.options.plugins.datalabels.display = showDataLabels;
            chart.update('none');
        }
    });
    
    showNotification(`${showDataLabels ? '📊 Datos mostrados' : '📊 Datos ocultos'}`, 'info');
}

// FUNCIÓN PARA CAMBIAR PESTAÑAS
function switchTab(tabName) {
    // Remover clase active de todos los botones y contenidos
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Activar el botón y contenido correspondiente
    const activeBtn = document.querySelector(`[data-tab="${tabName}"]`);
    const activeContent = document.getElementById(`tab-${tabName}`);
    
    if (activeBtn) activeBtn.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
    
    // Actualizar gráficos después de cambiar tab
    setTimeout(() => {
        if (verificarDatos()) {
            updateDashboardCharts();
        }
    }, 100);
}

// FUNCIÓN PARA DESTRUIR TODOS LOS GRÁFICOS
function destroyAllCharts() {
    Object.values(charts).forEach(chart => {
        if (chart && typeof chart.destroy === 'function') {
            chart.destroy();
        }
    });
    charts = {};
}

// FUNCIÓN PARA INICIALIZAR CHART.JS
function initChartJS() {
    if (typeof Chart !== 'undefined' && typeof ChartDataLabels !== 'undefined') {
        Chart.register(ChartDataLabels);
        
        Chart.defaults.font.family = 'system-ui, -apple-system, sans-serif';
        Chart.defaults.color = '#374151';
        Chart.defaults.plugins.datalabels.display = false;
        
        // Optimizar rendimiento
        Chart.defaults.animation.duration = 750;
        Chart.defaults.hover.animationDuration = 200;
        Chart.defaults.responsiveAnimationDuration = 400;
        
        console.log('✅ Chart.js inicializado correctamente');
    } else {
        console.error('❌ Chart.js o ChartDataLabels no están disponibles');
    }
}

// FUNCIÓN PARA CONFIGURAR EVENT LISTENERS
function initEventListeners() {
    // Botones flotantes
    const dashboardToggle = document.getElementById('dashboard-toggle');
    const statsToggle = document.getElementById('stats-toggle');
    
    if (dashboardToggle) {
        dashboardToggle.addEventListener('click', toggleDashboard);
    } else {
        console.warn('⚠️ Botón dashboard-toggle no encontrado');
    }
    
    if (statsToggle) {
        statsToggle.addEventListener('click', toggleStats);
    } else {
        console.warn('⚠️ Botón stats-toggle no encontrado');
    }
    
    // Pestañas del dashboard
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    // Botones de datos numéricos
    const dashboardDataBtn = document.getElementById('toggle-data-labels-dashboard');
    const statsDataBtn = document.getElementById('toggle-data-labels-stats');
    
    if (dashboardDataBtn) {
        dashboardDataBtn.addEventListener('click', toggleChartDataLabels);
    }
    
    if (statsDataBtn) {
        statsDataBtn.addEventListener('click', toggleChartDataLabels);
    }
    
    // Controles Top N
    const topNControl = document.getElementById('topN-control');
    const topNControlStats = document.getElementById('topN-control-stats');
    
    if (topNControl) {
        topNControl.addEventListener('change', () => {
            currentTopN = getTopNValue('topN-control');
            if (verificarDatos()) {
                updateDashboardCharts();
            }
        });
    }
    
    if (topNControlStats) {
        topNControlStats.addEventListener('change', () => {
            if (verificarDatos()) {
                updateStatsCharts();
            }
        });
    }
    
    // Botones de cerrar overlays CON DESBLOQUEO DE SCROLL
    const closeDashboard = document.getElementById('close-dashboard');
    const closeStats = document.getElementById('close-stats');
    
    if (closeDashboard) {
        closeDashboard.addEventListener('click', () => {
            const overlay = document.getElementById('overlay-dashboard');
            if (overlay) {
                overlay.classList.remove('show');
                desbloquearScrollBody();
            }
        });
    }
    
    if (closeStats) {
        closeStats.addEventListener('click', () => {
            const overlay = document.getElementById('overlay-stats');
            if (overlay) {
                overlay.classList.remove('show');
                desbloquearScrollBody();
            }
        });
    }
    
    // Cerrar overlays al hacer clic fuera CON DESBLOQUEO DE SCROLL
    const overlayDashboard = document.getElementById('overlay-dashboard');
    const overlayStats = document.getElementById('overlay-stats');
    
    if (overlayDashboard) {
        overlayDashboard.addEventListener('click', (e) => {
            if (e.target === overlayDashboard) {
                overlayDashboard.classList.remove('show');
                desbloquearScrollBody();
            }
        });
    }
    
    if (overlayStats) {
        overlayStats.addEventListener('click', (e) => {
            if (e.target === overlayStats) {
                overlayStats.classList.remove('show');
                desbloquearScrollBody();
            }
        });
    }
    
    // ESCAPE key para cerrar overlays
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const dashboardOpen = document.getElementById('overlay-dashboard')?.classList.contains('show');
            const statsOpen = document.getElementById('overlay-stats')?.classList.contains('show');
            
            if (dashboardOpen) {
                document.getElementById('overlay-dashboard').classList.remove('show');
                desbloquearScrollBody();
            }
            
            if (statsOpen) {
                document.getElementById('overlay-stats').classList.remove('show');
                desbloquearScrollBody();
            }
        }
    });
    
    console.log('✅ Event listeners configurados');
}

// INICIALIZACIÓN CUANDO EL DOM ESTÉ LISTO
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando sistema de gráficos...');
    
    // Verificar dependencias
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js no está cargado');
        showNotification('❌ Error: Chart.js no disponible', 'error');
        return;
    }
    
    if (typeof ChartDataLabels === 'undefined') {
        console.warn('⚠️ ChartDataLabels no está disponible');
    }
    
    // Inicializar componentes
    initChartJS();
    initEventListeners();
    
    console.log('✅ Sistema de gráficos inicializado correctamente');
});

// LISTENER PARA REDIMENSIONAMIENTO CON THROTTLE
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        Object.values(charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }, 250);
});

// EXPORTAR FUNCIONES PARA USO GLOBAL
window.toggleDashboard = toggleDashboard;
window.toggleStats = toggleStats;
window.updateDashboardCharts = updateDashboardCharts;
window.updateStatsCharts = updateStatsCharts;