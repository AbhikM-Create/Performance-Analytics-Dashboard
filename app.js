// Dashboard Data with cleaned values (no NaN)
const dashboardData = {
    sales_kpis: {
        total_leads: 200,
        conversion_rate: 13.0,
        pipeline_value: 17817018,
        average_deal_size: 92450,
        qualification_rate: 81.5
    },
    funnel_stages: [
        { stage: "Lead Inflow", count: 200, conversion_rate: 100.0, drop_off_rate: 0.0 },
        { stage: "First Call", count: 163, conversion_rate: 81.5, drop_off_rate: 18.5 },
        { stage: "Design Pitch", count: 109, conversion_rate: 54.5, drop_off_rate: 27.0 },
        { stage: "Quotation Sent", count: 61, conversion_rate: 30.5, drop_off_rate: 24.0 },
        { stage: "Closure", count: 26, conversion_rate: 13.0, drop_off_rate: 17.5 }
    ],
    regional_performance: [
        { region: "India", total_leads: 92, closures: 11, closure_rate: 11.96, avg_value: 89137.76, total_value: 8200674 },
        { region: "Singapore", total_leads: 108, closures: 15, closure_rate: 13.89, avg_value: 89040.22, total_value: 9616344 }
    ],
    lead_sources: [
        { source: "Google Ads", total_leads: 38, closures: 8, closure_rate: 21.05, avg_value: 89755.71, roi_score: 1889.36 },
        { source: "Referral", total_leads: 43, closures: 7, closure_rate: 16.28, avg_value: 84320.19, roi_score: 1372.73 },
        { source: "Walk-in", total_leads: 44, closures: 5, closure_rate: 11.36, avg_value: 83328.61, roi_score: 946.61 },
        { source: "Partnership", total_leads: 41, closures: 4, closure_rate: 9.76, avg_value: 94958.29, roi_score: 926.79 },
        { source: "Facebook Ads", total_leads: 33, closures: 2, closure_rate: 6.06, avg_value: 94496.91, roi_score: 572.65 }
    ],
    customer_segments: [
        { segment: "Condo", total_leads: 61, closures: 12, closure_rate: 19.67, avg_value: 83423.39, total_value: 5088827 },
        { segment: "HDB", total_leads: 67, closures: 11, closure_rate: 16.42, avg_value: 89855.07, total_value: 6020290 },
        { segment: "Landed", total_leads: 72, closures: 3, closure_rate: 4.17, avg_value: 93165.29, total_value: 6707901 }
    ],
    delivery_data: [
        {x: -11.47, y: 72.73, satisfaction: 5}, {x: 17.94, y: 52.27, satisfaction: 4},
        {x: 29.01, y: 44.44, satisfaction: 4}, {x: 8.04, y: 0.00, satisfaction: 4},
        {x: 21.06, y: 8.47, satisfaction: 2}, {x: 10.12, y: 50.00, satisfaction: 1},
        {x: 24.42, y: 8.14, satisfaction: 1}, {x: 6.40, y: 5.71, satisfaction: 3},
        {x: 25.31, y: 24.66, satisfaction: 3}, {x: 14.13, y: 8.57, satisfaction: 2},
        {x: 15.65, y: 16.67, satisfaction: 3}, {x: 41.74, y: 70.97, satisfaction: 5},
        {x: 3.49, y: 43.33, satisfaction: 2}, {x: 11.20, y: 47.27, satisfaction: 4},
        {x: -5.80, y: 12.94, satisfaction: 5}, {x: 3.38, y: 45.71, satisfaction: 3}
    ]
};

// Utility Functions
function formatCurrency(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return 'N/A';
    }
    return new Intl.NumberFormat('en-SG', {
        style: 'currency',
        currency: 'SGD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatNumber(value, decimals = 0) {
    if (value === null || value === undefined || isNaN(value)) {
        return 'N/A';
    }
    return new Intl.NumberFormat('en-SG', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(value);
}

function formatPercentage(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return 'N/A';
    }
    return `${value.toFixed(2)}%`;
}

// Clean data function to remove NaN values
function cleanData(data) {
    if (Array.isArray(data)) {
        return data.map(item => cleanData(item));
    } else if (typeof data === 'object' && data !== null) {
        const cleaned = {};
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'number' && isNaN(value)) {
                cleaned[key] = 0; // Replace NaN with 0
            } else {
                cleaned[key] = cleanData(value);
            }
        }
        return cleaned;
    }
    return data;
}

// Tab Navigation Class
class TabNavigator {
    constructor() {
        this.activeTab = 'sales';
        this.init();
    }

    init() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
    }

    switchTab(tabId) {
        // Remove active class from all tabs and buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Add active class to selected tab and button
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(tabId).classList.add('active');

        this.activeTab = tabId;

        // Add subtle animation
        const activeContent = document.getElementById(tabId);
        activeContent.style.opacity = '0';
        activeContent.style.transform = 'translateY(10px)';

        requestAnimationFrame(() => {
            activeContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            activeContent.style.opacity = '1';
            activeContent.style.transform = 'translateY(0)';
        });
    }
}

// Chart Configuration with Enhanced Tooltips
const chartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        intersect: false,
        mode: 'index'
    },
    plugins: {
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            titleColor: '#1565c0',
            bodyColor: '#424242',
            borderColor: '#1565c0',
            borderWidth: 2,
            cornerRadius: 12,
            displayColors: true,
            padding: 12,
            titleFont: {
                size: 14,
                weight: 'bold'
            },
            bodyFont: {
                size: 13
            },
            callbacks: {
                title: function(tooltipItems) {
                    return tooltipItems[0].label;
                },
                label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed.y || context.parsed;

                    if (context.chart.canvas.id === 'funnelChart') {
                        const stage = dashboardData.funnel_stages[context.dataIndex];
                        return [
                            `${label}: ${formatNumber(value)}`,
                            `Conversion Rate: ${formatPercentage(stage.conversion_rate)}`,
                            `Drop-off Rate: ${formatPercentage(stage.drop_off_rate)}`
                        ];
                    } else if (context.chart.canvas.id === 'leadSourceChart') {
                        return `${label}: ${formatPercentage(value)}`;
                    } else if (context.chart.canvas.id === 'regionalChart') {
                        return `${label}: ${formatNumber(value)}`;
                    } else if (context.chart.canvas.id === 'deliveryChart') {
                        return [
                            `Cost Overrun: ${formatPercentage(context.parsed.x)}`,
                            `Delay: ${formatPercentage(context.parsed.y)}`,
                            `Satisfaction: ${context.raw.satisfaction}/5`
                        ];
                    }

                    return `${label}: ${formatNumber(value)}`;
                }
            }
        },
        legend: {
            position: 'bottom',
            labels: {
                padding: 20,
                usePointStyle: true,
                font: {
                    size: 12,
                    weight: '500'
                }
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(21, 101, 192, 0.1)',
                borderColor: 'rgba(21, 101, 192, 0.2)'
            },
            ticks: {
                color: '#616161',
                font: {
                    size: 11,
                    weight: '500'
                }
            }
        },
        y: {
            grid: {
                color: 'rgba(21, 101, 192, 0.1)',
                borderColor: 'rgba(21, 101, 192, 0.2)'
            },
            ticks: {
                color: '#616161',
                font: {
                    size: 11,
                    weight: '500'
                }
            }
        }
    }
};

// Chart Creation Functions
function createFunnelChart() {
    const ctx = document.getElementById('funnelChart');
    if (!ctx) return;

    const cleanedData = cleanData(dashboardData.funnel_stages);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cleanedData.map(stage => stage.stage),
            datasets: [{
                label: 'Lead Count',
                data: cleanedData.map(stage => stage.count),
                backgroundColor: [
                    '#1565c0', '#1976d2', '#42a5f5', '#64b5f6', '#90caf9'
                ],
                borderRadius: 8,
                borderSkipped: false,
            }]
        },
        options: {
            ...chartConfig,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: 'Sales Funnel Progression',
                    font: { size: 16, weight: 'bold' },
                    color: '#1565c0'
                }
            }
        }
    });
}

function createLeadSourceChart() {
    const ctx = document.getElementById('leadSourceChart');
    if (!ctx) return;

    const cleanedData = cleanData(dashboardData.lead_sources);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: cleanedData.map(source => source.source),
            datasets: [{
                data: cleanedData.map(source => source.closure_rate),
                backgroundColor: [
                    '#1565c0', '#1976d2', '#42a5f5', '#64b5f6', '#90caf9'
                ],
                borderWidth: 3,
                borderColor: '#ffffff'
            }]
        },
        options: {
            ...chartConfig,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: 'Lead Source Conversion Rates',
                    font: { size: 16, weight: 'bold' },
                    color: '#1565c0'
                }
            }
        }
    });
}

function createRegionalChart() {
    const ctx = document.getElementById('regionalChart');
    if (!ctx) return;

    const cleanedData = cleanData(dashboardData.regional_performance);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cleanedData.map(region => region.region),
            datasets: [
                {
                    label: 'Total Leads',
                    data: cleanedData.map(region => region.total_leads),
                    backgroundColor: '#1565c0',
                    borderRadius: 6,
                },
                {
                    label: 'Closures',
                    data: cleanedData.map(region => region.closures),
                    backgroundColor: '#42a5f5',
                    borderRadius: 6,
                }
            ]
        },
        options: {
            ...chartConfig,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: 'Regional Performance Comparison',
                    font: { size: 16, weight: 'bold' },
                    color: '#1565c0'
                }
            }
        }
    });
}

function createSegmentChart() {
    const ctx = document.getElementById('segmentChart');
    if (!ctx) return;

    const cleanedData = cleanData(dashboardData.customer_segments);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: cleanedData.map(segment => segment.segment),
            datasets: [{
                label: 'Conversion Rate (%)',
                data: cleanedData.map(segment => segment.closure_rate),
                backgroundColor: ['#1565c0', '#1976d2', '#42a5f5'],
                borderRadius: 6,
            }]
        },
        options: {
            ...chartConfig,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: 'Customer Segment Performance',
                    font: { size: 16, weight: 'bold' },
                    color: '#1565c0'
                }
            },
            scales: {
                ...chartConfig.scales,
                y: {
                    ...chartConfig.scales.y,
                    beginAtZero: true,
                    max: 25
                }
            }
        }
    });
}

function createDeliveryChart() {
    const ctx = document.getElementById('deliveryChart');
    if (!ctx) return;

    const cleanedData = cleanData(dashboardData.delivery_data);

    new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Projects',
                data: cleanedData,
                backgroundColor: function(context) {
                    const satisfaction = context.raw.satisfaction;
                    const colors = {
                        1: '#f44336', 2: '#ff9800', 3: '#2196f3', 
                        4: '#4caf50', 5: '#1565c0'
                    };
                    return colors[satisfaction] || '#9e9e9e';
                },
                borderColor: function(context) {
                    const satisfaction = context.raw.satisfaction;
                    const colors = {
                        1: '#d32f2f', 2: '#f57c00', 3: '#1976d2', 
                        4: '#388e3c', 5: '#0d47a1'
                    };
                    return colors[satisfaction] || '#757575';
                },
                borderWidth: 2,
                pointRadius: 8,
                pointHoverRadius: 10
            }]
        },
        options: {
            ...chartConfig,
            plugins: {
                ...chartConfig.plugins,
                title: {
                    display: true,
                    text: 'Cost Overrun vs Delay Analysis',
                    font: { size: 16, weight: 'bold' },
                    color: '#1565c0'
                },
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    ...chartConfig.scales.x,
                    title: {
                        display: true,
                        text: 'Cost Overrun (%)',
                        font: { size: 12, weight: 'bold' },
                        color: '#616161'
                    }
                },
                y: {
                    ...chartConfig.scales.y,
                    title: {
                        display: true,
                        text: 'Delay (%)',
                        font: { size: 12, weight: 'bold' },
                        color: '#616161'
                    }
                }
            }
        }
    });
}

// Table Sorting Class
class TableSorter {
    constructor(tableId) {
        this.table = document.getElementById(tableId);
        if (!this.table) return;

        this.tbody = this.table.querySelector('tbody');
        this.headers = this.table.querySelectorAll('th[data-sort]');
        this.currentSort = { column: null, direction: 'asc' };
        this.init();
    }

    init() {
        this.headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-sort');
                this.sort(column);
            });
        });
    }

    sort(column) {
        const rows = Array.from(this.tbody.querySelectorAll('tr'));

        // Determine sort direction
        if (this.currentSort.column === column) {
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort.direction = 'asc';
        }
        this.currentSort.column = column;

        // Update header classes
        this.headers.forEach(h => {
            h.classList.remove('sort-asc', 'sort-desc');
        });
        const activeHeader = this.table.querySelector(`th[data-sort="${column}"]`);
        activeHeader.classList.add(`sort-${this.currentSort.direction}`);

        // Sort rows
        rows.sort((a, b) => {
            const aValue = this.getCellValue(a, column);
            const bValue = this.getCellValue(b, column);
            let comparison = 0;

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                comparison = aValue - bValue;
            } else {
                comparison = aValue.toString().localeCompare(bValue.toString());
            }

            return this.currentSort.direction === 'asc' ? comparison : -comparison;
        });

        // Re-append sorted rows
        rows.forEach(row => this.tbody.appendChild(row));
    }

    getCellValue(row, column) {
        const cellIndex = Array.from(this.headers).findIndex(h => h.getAttribute('data-sort') === column);
        const cellText = row.cells[cellIndex].textContent.trim();

        // Try to parse as number (handle percentages and currency)
        const numberMatch = cellText.match(/[\d,]+\.?\d*/);
        if (numberMatch) {
            return parseFloat(numberMatch[0].replace(/,/g, ''));
        }
        return cellText;
    }
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard initializing...');

    // Initialize tab navigation
    new TabNavigator();

    // Initialize charts with clean data
    createFunnelChart();
    createLeadSourceChart();
    createRegionalChart();
    createSegmentChart();
    createDeliveryChart();

    // Initialize table sorting (if tables exist)
    const tables = document.querySelectorAll('.data-table');
    tables.forEach(table => {
        if (table.id) {
            new TableSorter(table.id);
        }
    });

    console.log('Dashboard initialized successfully');
});

// Add hover animations for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to KPI cards
    const kpiCards = document.querySelectorAll('.kpi-card');
    kpiCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add hover effects to chart containers
    const chartContainers = document.querySelectorAll('.chart-container');
    chartContainers.forEach(container => {
        container.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)';
        });

        container.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)';
        });
    });
});

// Export for use in other scripts if needed
window.DashboardApp = {
    data: dashboardData,
    formatCurrency,
    formatNumber,
    formatPercentage,
    cleanData
};