from flask import Flask, render_template, jsonify, request
import random

app = Flask(__name__)

# 각 턴마다 무작위로 제공될 정책 풀 정의
POLICY_POOL = [
    {
        "id": "p1",
        "title": "전국민 AI 기본소득 도입",
        "desc": "AI 기업에 특별 과세를 부과하여 전 국민에게 기본소득으로 분배합니다.",
        "effect": {"gdp": 5, "inequality": -0.08, "productivity": 2}
    },
    {
        "id": "p2",
        "title": "AI 기업 규제 전면 완화",
        "desc": "기술 혁신을 위해 규제를 풀고 법인세를 인하하여 시장 성장을 유도합니다.",
        "effect": {"gdp": 25, "inequality": 0.09, "productivity": 15}
    },
    {
        "id": "p3",
        "title": "국가 주도 공공 AI 인프라 투자",
        "desc": "정부가 직접 공공 데이터 인프라를 구축하고 중소기업의 AI 도입을 지원합니다.",
        "effect": {"gdp": 12, "inequality": -0.01, "productivity": 8}
    },
    {
        "id": "p4",
        "title": "AI 노동자 전직 지원 프로그램",
        "desc": "AI로 대체된 일자리의 실직자들을 위해 대규모 재교육 및 전직 장려금을 지원합니다.",
        "effect": {"gdp": 3, "inequality": -0.05, "productivity": 4}
    },
    {
        "id": "p5",
        "title": "데이터 주권 특별법 제정",
        "desc": "개인의 데이터 제공에 대한 정당한 보상을 의무화하여 플랫폼의 이익 독점을 막습니다.",
        "effect": {"gdp": -2, "inequality": -0.06, "productivity": 1}
    },
    {
        "id": "p6",
        "title": "글로벌 독과점 AI 테크 기업 육성",
        "desc": "국가 대표 테크 기업에 모든 자원과 보조금을 집중하여 글로벌 경쟁력을 확보합니다.",
        "effect": {"gdp": 28, "inequality": 0.12, "productivity": 18}
    }
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/init', methods=['GET'])
def init_game():
    initial_state = {
        "year": 1,
        "gdp": 100.0,
        "inequality": 0.45,
        "productivity": 10.0,
        "history": {
            "years": [1],
            "gdp": [100.0],
            "inequality": [0.45],
            "productivity": [10.0]
        },
        "choices": random.sample(POLICY_POOL, 3),
        "is_over": False,
        "result": ""
    }
    return jsonify(initial_state)

@app.route('/api/choice', methods=['POST'])
def handle_choice():
    data = request.json
    current_year = data.get("year")
    gdp = data.get("gdp")
    inequality = data.get("inequality")
    productivity = data.get("productivity")
    history = data.get("history")
    selected_id = data.get("selected_id")
    
    # 선택한 정책 반영
    selected_policy = next((p for p in POLICY_POOL if p["id"] == selected_id), None)
    if selected_policy:
        effect = selected_policy["effect"]
        gdp += effect["gdp"]
        inequality = round(inequality + effect["inequality"], 3)
        productivity += effect["productivity"]
        
    next_year = current_year + 1
    
    # 지표 한계점 보정
    if inequality < 0: inequality = 0.0
    if gdp < 0: gdp = 0.0
    if productivity < 0: productivity = 0.0

    # 히스토리 누적
    history["years"].append(next_year)
    history["gdp"].append(gdp)
    history["inequality"].append(inequality)
    history["productivity"].append(productivity)
    
    is_over = False
    result = ""
    
    # 즉시 패배 조건 (불평등 지수 0.7 초과)
    if inequality > 0.7:
        is_over = True
        result = "defeat_breakdown"
    # 10년 시뮬레이션 종료 시 승패 판정
    elif next_year > 10:
        is_over = True
        # 초기 gdp인 100 대비 30% 이상 상승(130 이상) 및 불평등 0.4 미만
        if inequality < 0.4 and gdp >= 130.0:
            result = "victory"
        else:
            result = "defeat_fail"
            
    # 다음 턴 정책 선택지 셔플 제공
    next_choices = random.sample(POLICY_POOL, 3) if not is_over else []
    
    return jsonify({
        "year": next_year,
        "gdp": gdp,
        "inequality": inequality,
        "productivity": productivity,
        "history": history,
        "choices": next_choices,
        "is_over": is_over,
        "result": result
    })

if __name__ == '__main__':
    app.run(debug=True)
