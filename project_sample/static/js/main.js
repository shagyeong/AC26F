let gameState = {};
let chartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
    initGame();
    
    document.getElementById("restartBtn").addEventListener("click", initGame);
    document.getElementById("modalRestartBtn").addEventListener("click", () => {
        document.getElementById("resultModal").classList.add("hidden");
        initGame();
    });
});

// 게임 상태 비동기 호출 및 초기화
async function initGame() {
    const response = await fetch("/api/init");
    gameState = await response.json();
    
    updateUI();
    initChart(gameState.history);
}

// 데이터 변경에 따른 UI 컴포넌트 실시간 동기화
function updateUI() {
    document.getElementById("currentYear").innerText = gameState.year > 10 ? "종료" : `${gameState.year}년차`;
    document.getElementById("gdpValue").innerText = gameState.gdp.toFixed(1);
    document.getElementById("inequalityValue").innerText = gameState.inequality.toFixed(3);
    document.getElementById("productivityValue").innerText = gameState.productivity.toFixed(1);
    
    // 불평등 지수 위험 수치 영역별 경고 폰트 컬러 분기
    const ineqText = document.getElementById("inequalityValue");
    if (gameState.inequality >= 0.6) {
        ineqText.className = "stat-value text-red-500 text-3xl";
    } else if (gameState.inequality >= 0.5) {
        ineqText.className = "stat-value text-amber-500 text-3xl";
    } else {
        ineqText.className = "stat-value text-emerald-400 text-3xl";
    }

    // 아젠다 선택 카드 동적 바인딩
    const choicesContainer = document.getElementById("choicesContainer");
    choicesContainer.innerHTML = "";
    
    if (!gameState.is_over) {
        gameState.choices.forEach(policy => {
            const card = document.createElement("div");
            card.className = "policy-card flex flex-col justify-between";
            card.innerHTML = `
                <div>
                    <h3 class="text-lg font-bold text-blue-400 mb-2">${policy.title}</h3>
                    <p class="text-sm text-gray-400 leading-relaxed">${policy.desc}</p>
                </div>
                <div class="mt-4 pt-2 border-t border-gray-800 flex justify-between text-xs font-mono text-gray-500">
                    <span>GDP: ${policy.effect.gdp > 0 ? '+' : ''}${policy.effect.gdp}</span>
                    <span>불평등: ${policy.effect.inequality > 0 ? '+' : ''}${policy.effect.inequality}</span>
                    <span>생산성: ${policy.effect.productivity > 0 ? '+' : ''}${policy.effect.productivity}</span>
                </div>
            `;
            card.addEventListener("click", () => selectPolicy(policy.id));
            choicesContainer.appendChild(card);
        });
    } else {
        showResultModal(gameState.result);
    }
}

// Chart.js 이중 Y축(Dual Axis) 복합 시각화 차트 초기화
function initChart(historyData) {
    const ctx = document.getElementById("analyticsChart").getContext("2d");
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: historyData.years.map(y => `${y}년`),
            datasets: [
                {
                    label: 'GDP',
                    data: historyData.gdp,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    yAxisID: 'yLeft',
                    tension: 0.2,
                    borderWidth: 3
                },
                {
                    label: 'AI 생산성',
                    data: historyData.productivity,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    yAxisID: 'yLeft',
                    tension: 0.2,
                    borderWidth: 3
                },
                {
                    label: '불평등 지수',
                    data: historyData.inequality,
                    borderColor: '#f59e0b',
                    backgroundColor: 'transparent',
                    yAxisID: 'yRight',
                    tension: 0.2,
                    borderWidth: 3,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#94a3b8', font: { size: 12 } } }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' }
                },
                yLeft: {
                    type: 'linear',
                    position: 'left',
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8' },
                    title: { display: true, text: 'GDP / AI 생산성 수치', color: '#94a3b8' }
                },
                yRight: {
                    type: 'linear',
                    position: 'right',
                    min: 0,
                    max: 1,
                    grid: { drawOnChartArea: false },
                    ticks: { color: '#94a3b8' },
                    title: { display: true, text: '불평등 지수 (0~1)', color: '#94a3b8' }
                }
            }
        }
    });
}

// 유저 의사결정 데이터 가공 처리 및 결과 반환 스트림
async function selectPolicy(policyId) {
    const response = await fetch("/api/choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            year: gameState.year,
            gdp: gameState.gdp,
            inequality: gameState.inequality,
            productivity: gameState.productivity,
            history: gameState.history,
            selected_id: policyId
        })
    });
    
    gameState = await response.json();
    updateUI();
    
    // [버그 수정] 각 데이터셋 배열에 올바른 인덱스를 지정하여 실시간 그래프 반영
    chartInstance.data.labels = gameState.history.years.map(y => `${y}년`);
    chartInstance.data.datasets[0].data = gameState.history.gdp;
    chartInstance.data.datasets[1].data = gameState.history.productivity;
    chartInstance.data.datasets[2].data = gameState.history.inequality;
    chartInstance.update();
}

// 최종 판정 연출용 팝업 모달 트리거
function showResultModal(resultType) {
    const modal = document.getElementById("resultModal");
    const title = document.getElementById("modalTitle");
    const desc = document.getElementById("modalDesc");
    
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    
    if (resultType === "victory") {
        title.innerText = "🎉 시뮬레이션 승리!";
        title.className = "text-3xl font-extrabold text-emerald-400 mb-4";
        desc.innerHTML = `안정적인 자본 분배 시스템 구축에 성공했습니다.<br><br><strong>최종 성과:</strong><br>· GDP: <span class="text-blue-400">${gameState.gdp.toFixed(1)}</span> (목표: 130 이상)<br>· 불평등 지수: <span class="text-emerald-400">${gameState.inequality.toFixed(3)}</span> (0.4 미만 안착)`;
    } else if (resultType === "defeat_breakdown") {
        title.innerText = "🚨 사회 시스템 붕괴 (패배)";
        title.className = "text-3xl font-extrabold text-red-500 mb-4";
        desc.innerHTML = `불평등 지수가 위험 임계 한계선(<span class="text-red-400">0.7</span>)을 초과했습니다.<br>폭동과 극심한 경제 양극화로 인해 사회 인프라가 완전히 파괴되었습니다.`;
    } else {
        title.innerText = "📉 목표 달성 실패 (패배)";
        title.className = "text-3xl font-extrabold text-amber-500 mb-4";
        desc.innerHTML = `10년의 시뮬레이션 기간이 완주되었으나 종합 승리 조건을 만족하지 못했습니다.<br><br><strong>최종 결과 스탯:</strong><br>· GDP: ${gameState.gdp.toFixed(1)} (목표: 130 이상)<br>· 불평등 지수: ${gameState.inequality.toFixed(3)} (목표: 0.4 미만)`;
    }
}
