# 웹 실습 기록
## 예시 프롬프트를 자유롭게 수정하여 실습하시오.
#### test.html
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>웹 실습 예제</title>
    <link rel="stylesheet" href="test.css">
</head>
<body>

    <div class="container">
        <h1 id="title">안녕하세요!</h1>
        <p>아래 버튼을 누르면 배경색과 텍스트가 변경됩니다.</p>
        <button id="changeBtn">클릭하세요</button>
    </div>

    <!-- 같은 경로의 JS 파일 연결 -->
    <script src="test.js"></script>
</body>
</html>
```
#### test.js
```js
// HTML에서 요소(Element) 가져오기
const title = document.getElementById('title');
const button = document.getElementById('changeBtn');

// 버튼 클릭 이벤트 리스너 추가
button.addEventListener('click', () => {
    // 1. 타이틀 텍스트 변경
    title.innerText = "반갑습니다!";
    
    // 2. body의 배경색을 랜덤한 색상으로 변경
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    document.body.style.backgroundColor = randomColor;
    
    // 3. 버튼 텍스트도 변경
    button.innerText = "색상이 변경되었습니다!";
});
```
#### test.css
```css
/* 기본 리셋 및 정렬 */
body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background-color: #f4f7f6;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    transition: background-color 0.5s ease; /* 배경색 변경 시 부드러운 효과 */
}

/* 컨텐츠 박스 스타일 */
.container {
    text-align: center;
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 버튼 스타일 */
button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #0056b3;
}
```
