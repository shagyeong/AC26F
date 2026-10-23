# 파이썬 실습 기록
## 학생 답안
#### (기본 출력)Hello, World를 출력하시오.
```python
```
```
```
#### (문자열)이름이 "user"인 변수에 아무 문자열이나 저장 후, "Hello, user" 형태로 출력하시오.
```python
```
```
```
#### (숫자)이름이 각각 "a", "b"인 변수에 아무 숫자나 저장한 후, 사칙연산 결과를 출력하시오.
```python
```
```
```
#### (딕셔너리)주어진 딕셔너리의 "name" 키에 대응하는 값을 출력하시오.
```python
Kim={
    "name":"Kim",
    "age":"25",
}

# write your code
```
```
```
#### (리스트, 제어문)주어진 리스트를 순회하며 엘리먼트가 짝수인 경우만 출력하시오.
```python
l=[16,4,6,5,11,19,7,12,13,9,14,10,1,20,2,3,8,17,18,15]

# write your code
```
```
```
#### (함수, 조건문)예제를 참고하여 피연산자와 연산자(기호, "+", "-", "*', "/" 형태)를 매개변수로 받아 사칙연산을 수행하는 함수를 작성하고 테스트하시오.
```python
def sum(a,b):
    return a+b

def calc(a,b,mode):
    pass # write your code

print("a + b =",sum(a,b))
print("a + b =",calc(a,b,"+"))
print("a - b =",calc(a,b,"-"))
print("a * b =",calc(a,b,"*"))
print("a / b =",calc(a,b,"/"))
```
```
```
#### (클래스) 예제를 참고하여 클래스 Person에 자신의 나이를 출력하는 메서드 myage()와 작별 인사("See you soon")을 출력하는 메서드 farewell()을 작성하고 테스트하시오.
```python
class Person:
    def __init__(self,name,age):
        self.name=name
        self.age=age
    def greeting(self):
        print("Hello, my name is",self.name)
    def myage(self):
        pass # write your code
    def farewell(self):
        pass # write your code

Kim=Person("Kim",25)

Kim.greeting()
Kim.myage()
Kim.farewell()
```
```
```
## 정답 예시
#### (기본 출력)Hello, World를 출력하시오.
```python
print("Hello, World")
```
```
$ python3 test.py
Hello, World
```
#### (문자열)이름이 "user"인 변수에 아무 문자열이나 저장 후, "Hello, username" 형태로 출력하시오.
```python
user="Kim"
print("Hello,",user)
```
```
$ python3 test.py
Hello, Kim
```
#### (숫자)이름이 각각 "a", "b"인 변수에 아무 숫자나 저장한 후, 사칙연산 결과를 출력하시오.
```python
a=4
b=3

print("a + b =",a+b)
print("a - b =",a-b)
print("a * b =",a*b)
print("a / b =",a/b)
```
```
$ python3 test.py
a + b = 7
a - b = 1
a * b = 12
a / b = 1.3333333333333333
```
#### (딕셔너리)주어진 딕셔너리의 "name" 키에 대응하는 값을 출력하시오.
```python
Kim={
    "name":"Kim",
    "age":"25",
}
print(Kim["name"])
```
```
$ python3 test.py
Kim
```
#### (리스트, 제어문)주어진 리스트를 순회하며 엘리먼트가 짝수인 경우만 출력하시오.
```python
l=[16,4,6,5,11,19,7,12,13,9,14,10,1,20,2,3,8,17,18,15]

for i in l:
    if((i%2)==0):
        print(i,end=" ")
```
```
$ python3 test.py
16 4 6 12 14 10 20 2 8 18
```
#### (함수, 조건문)예제를 참고하여 피연산자와 연산자(기호, "+", "-", "*', "/" 형태)를 매개변수로 받아 사칙연산을 수행하는 함수를 작성하고 테스트하시오.
```python
def calc(a,b,mode):
    if   mode=="+": return a+b
    elif mode=="-": return a-b
    elif mode=="*": return a*b
    elif mode=="/": return a/b
    else:
        print("error")
    return

a=4
b=3
print("a + b =",calc(a,b,"+"))
print("a - b =",calc(a,b,"-"))
print("a * b =",calc(a,b,"*"))
print("a / b =",calc(a,b,"/"))
```
```
$ python3 test.py
a + b = 7
a - b = 1
a * b = 12
a / b = 1.3333333333333333
```
#### (클래스) 예제를 참고하여 클래스 Person에 자신의 나이를 출력하는 메서드 myage()와 작별 인사("See you soon")을 출력하는 메서드 farewell()을 작성하고 테스트하시오.
```python
class Person:
    def __init__(self,name,age):
        self.name=name
        self.age=age
    def greeting(self):
        print("Hello, my name is",self.name)
    def myage(self):
        print("I am",self.age,"years old")
    def farewell(self):
        print("See you soon")

Kim=Person("Kim",25)
Lee=Person("Lee",22)

Kim.greeting()
Kim.myage()
Kim.farewell()

Lee.greeting()
Lee.myage()
Lee.farewell()
```
```
$ python3 test.py
Hello, my name is Kim
I am 25 years old
See you soon
Hello, my name is Lee
I am 22 years old
See you soon
```
