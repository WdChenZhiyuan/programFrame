from flask import Flask, render_template, request, jsonify, redirect
import pymysql


app = Flask(__name__)

# -------------------------------------------------------------------以下获得数据库
cur = None
conn = None
disconnect = 5
try:
    conn = pymysql.connect(
        user="root",
        password="root123",
        host="127.0.0.1",
        port=3306,
        database="todo"
    )

    cur = conn.cursor()

except pymysql.Error as e:
    print(f"Error connecting to MariaDB Platform: {e}")


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/todoList")
def todoList():
    global cur
    global conn

    todoList=()
    try:
        cur.execute(
            'select * from TODO')
        todoList = cur.fetchall()
    except pymysql.Error as e:
        print(f"Error connecting to sql: {e}")
        return jsonify({"code": 5})

    print(todoList)
    res=[]
    for i in todoList:
        task={}
        task["index"]=i[0]
        task["content"]=i[1]
        task['isDone']=(i[2]==1)
        res.append(task)
    return jsonify(res)

@app.route("/add",methods=['POST','GET'])
def add():
    data=request.get_json()
    print(data)
    content = data["content"]
    print('insert TODO(content) values (\"{}\")'.format(content))
    try:
        cur.execute(
        'insert TODO(content) values (\"{}\")'.format(content))
    except pymysql.Error as e:
        print(f"Error connecting to sql: {e}")
        return jsonify({"code": -1})
    
    return jsonify({"code":0})

@app.route("/delete",methods=['POST','GET'])
def delete():
    data=request.get_json()
    index = data["index"]
    try:
        cur.execute(
            'DELETE FROM TODO where TODO_ID=(\"{}\")'.format(index))
    except pymysql.Error as e:
        print(f"Error connecting to sql: {e}")
        return jsonify({"code": -1})
    return jsonify({"code":0})

@app.route("/complete",methods=['POST','GET'])
def complete():
    data=request.get_json()
    index = data["index"]
    try:
        cur.execute(
            'UPDATE TODO SET ISDONE=1 where TODO_ID=(\"{}\")'.format(index))
    except pymysql.Error as e:
        print(f"Error connecting to sql: {e}")
        return jsonify({"code": -1})
    return jsonify({"code":0})

@app.route("/uncomplete",methods=['POST','GET'])
def uncomplete():
    data=request.get_json()
    index = data["index"]
    try:
        cur.execute(
            'UPDATE TODO SET ISDONE=0 where TODO_ID=(\"{}\")'.format(index))
    except pymysql.Error as e:
        print(f"Error connecting to sql: {e}")
        return jsonify({"code": -1})
    return jsonify({"code":0})

if __name__=='__main__':
    app.run(host="0.0.0.0",port="5000",debug=True)