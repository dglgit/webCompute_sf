import sqlite3
from flask import Flask, render_template, request,jsonify
from flask_cors import CORS
import time
jobs=['primes','collatz']
TASK_LENGTH=100
nextBenchTime=time.time()+5000
app = Flask(__name__)
CORS(app)# idea from https://stackoverflow.com/questions/26980713/solve-cross-origin-resource-sharing-with-flask
def get_db_connection():
    conn = sqlite3.connect('database.db',check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn
#conn=get_db_connection()
def printDB(name):
    conn=get_db_connection()
    data=conn.execute(f"SELECT * from {name}").fetchall()
    conn.close()
    #print(data)
@app.route('/sync-bench',methods=['POST','GET'])
def syncBench():
    rjson=request.json
    return nextBenchTime-time.time()
@app.route('/get-job',methods=['POST'])
def getJob():
    #print('got job',request.json)
    rjson=request.json
    #print(rjson,type(rjson))
    jobType=rjson['type']
    
    conn=get_db_connection()
    
    nums=conn.execute(f"SELECT * from {jobType}Failed").fetchall()
    if len(nums)>0:
        num=nums[0]['numbers']
        conn.execute(f"DELETE * from {jobType}Failed WHERE numbers=?",num)
    else:
        #printDB(f'{jobType}CurrentTask')
        num=int(conn.execute(f"SELECT task from {jobType}CurrentTask").fetchall()[0]['task'])
        #print(num)
        conn.execute(f"UPDATE {jobType}CurrentTask SET task=?",[num+1])
        conn.commit()
    conn.close()
    return jsonify({"task":num})

@app.route('/register-disconnect',methods=['POST'])
def regDisconnect():
    print(f'disconnected, response was: {request.json}')
    #js send request with event listener 'beforeunload'
    computed=request.json['task']
    jobType=request.json['type']
    #conn=get_db_connection()
    #need to figure out how to handle different computing tasks 
    #conn.execute(f"INSERT INTO {jobType}Jobs(numbers,open) VALUES(?,0)",[computed])
    #conn.commit()
    #conn.close()
    return '0'


@app.route("/submit-job",methods=['POST'])
def submitJob():
    #print('job submitted')
    args=request.json
    #print(args)
    computed=args['task']#will probably be list
    result=args['result']
    jobType=args['type']
    #print(args)
    conn = get_db_connection()
    #conn.executemany(f"INSERT INTO {jobType}Record(tasks,results) VALUES (?,?)",[list(map(int, result)),result]) 
    conn.execute(f"INSERT INTO {jobType}Record(tasks,results) VALUES (?,?)",[int(result),result])
    conn.commit()
    conn.close()
    return '0'

@app.route('/guis',methods=['GET'])
def renderGui():
    if len(request.args)==0:
        return render_template('landing.html')
    jobType=request.args.get("type")
    return render_template(f"{jobType}_gui.html")
@app.route('/')
def index():
    conn = get_db_connection()
    #posts = conn.execute('SELECT * FROM posts').fetchall()
    #print(dict(**posts[0]))
    conn.close()
    return render_template('testing.html')

if __name__=="__main__":
    app.run(host="0.0.0.0")
