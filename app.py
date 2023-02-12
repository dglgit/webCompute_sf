import sqlite3
from flask import Flask, render_template, request,jsonify

app = Flask(__name__)
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def printDB(name):
    conn=get_db_connection()
    data=conn.execute("SELECT * from ?",[name]).fetchall()
    pdict={key:[] for key in data[0]}
    for row in data:
        for key in row:
            pdict[key]=row[key]
    print(pdict)
@app.route('/get-job',methods=['GET','POST'])
def getJob():
    conn=get_db_connection()
    nums=conn.execute("SELECT * from numJobs").fetchall()
    num=None
    if len(nums)>0:
        num=nums[0]['numbers']
        conn.execute("DELETE * from numJobs WHERE numbers=?",num)
    else:
        num=conn.execute("SELECT num from currentNum").fetchone()[0]
        conn.execute("UPDATE currentNum SET num=?",[num+1])
        conn.commit()
    conn.close()
    return jsonify({"number":num})

@app.route('/register-disconnect',methods=['GET','POST'])
def regDisconnect():
    #js send request with event listener 'beforeunload'
    computed=request.get('computed')
    conn=get_db_connection()
    conn.execute("INSERT INTO numJobs(numbers,open) VALUES(?,0)",[computed])
    conn.commit()
    conn.close()
    return 


@app.route("/submit-job",methods=['GET','POST'])
def submitJob():
    if request=='POST':
        computed=request.get('computed')
        result=request.get('result')
        conn = get_db_connection()
        conn.execute("INSERT INTO computed(inputs,outputs) VALUES (?,?)",[computed,result]) 
        conn.commit()
        conn.close()
    return jsonify({0:0})

@app.route('/')
def index():
    conn = get_db_connection()
    posts = conn.execute('SELECT * FROM posts').fetchall()
    print(dict(**posts[0]))
    conn.close()
    return render_template('testing.html')

if __name__=="__main__":
    app.run()
