from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# 초기 게임 상태 정의 (턴, 경제 지표)
def get_initial_state():
    return {
        "turn": 1,
        "gdp": 100.0,          
        "inequality": 40.0,    
        "productivity": 100.0, 
        "satisfaction": 50.0,  
        "history": {           
            "turn": [1],
            "gdp": [100.0],
            "inequality": [40.0],
            "productivity": [100.0],
            "satisfaction": [50.0]
        }
    }

game_state = get_initial_state()

@app.route('/')
def index():
    global game_state
    game_state = get_initial_state() 
    return render_template('index.html')

@app.route('/api/action', methods=['POST'])
def action():
    global game_state
    data = request.get_json()
    policy = data.get('policy')
    
    turn = game_state["turn"]
    gdp = game_state["gdp"]
    inequality = game_state["inequality"]
    productivity = game_state["productivity"]
    satisfaction = game_state["satisfaction"]
    
    if policy == "tax_ai":
        gdp += 2.0
        inequality = max(10.0, inequality - 5.0)
        productivity = max(50.0, productivity - 3.0)
        satisfaction = min(100.0, satisfaction + 10.0)
    elif policy == "ubi":
        gdp += 1.0
        inequality = max(10.0, inequality - 8.0)
        productivity += 1.0
        satisfaction = min(100.0, satisfaction + 15.0)
    elif policy == "corporate_support":
        gdp += 8.0
        inequality = min(100.0, inequality + 6.0)
        productivity += 12.0
        satisfaction = max(0.0, satisfaction - 8.0)
    
    turn += 1
    
    game_state["turn"] = turn
    game_state["gdp"] = round(gdp, 1)
    game_state["inequality"] = round(inequality, 1)
    game_state["productivity"] = round(productivity, 1)
    game_state["satisfaction"] = round(satisfaction, 1)
    
    game_state["history"]["turn"].append(turn)
    game_state["history"]["gdp"].append(game_state["gdp"])
    game_state["history"]["inequality"].append(game_state["inequality"])
    game_state["history"]["productivity"].append(game_state["productivity"])
    game_state["history"]["satisfaction"].append(game_state["satisfaction"])
    
    return jsonify(game_state)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
