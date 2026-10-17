let economyChart;

document.addEventListener("DOMContentLoaded", function() {
    const ctx = document.getElementById('economyChart').getContext('2d');
    
    economyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [1],
            datasets: [
                { label: '국가 GDP (조)', data: [100.0], borderColor: '#38bdf8', tension: 0.2, yAxisID: 'y' },
                { label: '불평등 지수 (%)', data: [40.0], borderColor: '#f87171', tension: 0.2, yAxisID: 'y1' },
                { label: 'AI 생산성', data: [100.0], borderColor: '#a78bfa', tension: 0.2, yAxisID: 'y' },
                { label: '시민 만족도 (%)', data: [50.0], borderColor: '#34d399', tension: 0.2, yAxisID: 'y1' }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                y: { type: 'linear', display: true, position: 'left', grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
                y1: { type: 'linear', display: true, position: 'right', grid: { drawOnChartArea: false }, ticks: { color: '#94a3b8' } }
            },
            plugins: {
                legend: { labels: { color: '#f8fafc' } }
            }
        }
    });
});

function submitPolicy(policyName) {
    fetch('/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy: policyName })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('current-turn').innerText = data.turn;
        document.getElementById('stat-gdp').innerText = data.gdp;
        document.getElementById('stat-inequality').innerText = data.inequality;
        document.getElementById('stat-productivity').innerText = data.productivity;
        document.getElementById('stat-satisfaction').innerText = data.satisfaction;

        // 그래프 갱신
        economyChart.data.labels = data.history.turn;
        economyChart.data.datasets[0].data = data.history.gdp;
        economyChart.data.datasets[1].data = data.history.inequality;
        economyChart.data.datasets[2].data = data.history.productivity;
        economyChart.data.datasets[3].data = data.history.satisfaction;

        economyChart.update();
    })
    .catch(error => console.error('Error executing turn:', error));
}
