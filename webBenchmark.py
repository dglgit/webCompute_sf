import sqlite3
from flask import Flask, render_template, request,jsonify
from flask_cors import CORS
import time
from init_db import defaults#will run the file and reset the database
import threading
from threading import Lock
lock=Lock()
jobs=['primes','collatz']
BENCHMODE= True
benchGracePeriod=10#amount of time in seconds from restarting server and benchmarking
nextBenchTime=time.time()+benchGracePeriod#time.time is seconds
endTime=None
globalVars={'stopFlag':False}
stopFlag=False
#benchAmt=10
endValues={'primes': int(defaults['primes'])+50*2,'collatz': int(defaults['collatz'])+2*100}
app = Flask(__name__)
CORS(app,resources={r'/*':{'origins':'*'}})
def get_db_connection():
    conn = sqlite3.connect('database.db',check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn
conn=get_db_connection()
def printDB(name):
    #conn=get_db_connection()
    with lock:
        data=conn.execute(f"SELECT * from {name}").fetchall()
    #conn.close()
    #print(data)

@app.route('/sync-benchmark',methods=['GET'])
def syncBench():
    print(f'address:{request.remote_addr}')
    return str(nextBenchTime) #in seconds
@app.route('/reset-benchmark',methods=['GET'])
def resetBench():
    global nextBenchTime
    nextBenchTime=time.time()+benchGracePeriod
    return '0'
@app.route('/get-job',methods=['POST'])
def getJob():
    if not BENCHMODE or not globalVars['stopFlag']:
        rjson=request.json
        jobType=rjson['type']
        
        #conn=get_db_connection()
        with lock:
            nums=conn.execute(f"SELECT * from {jobType}Failed").fetchall()
            if len(nums)>0:
                num=nums[0]['numbers']
                conn.execute(f"DELETE * from {jobType}Failed WHERE numbers=?",num)
            else:
                num=int(conn.execute(f"SELECT task from {jobType}CurrentTask").fetchall()[0]['task'])
                conn.execute(f"UPDATE {jobType}CurrentTask SET task=?",[str(num+2)])
            conn.commit()
            #conn.close()
            #print("get job num type is: ",type(num))
            return jsonify({"task":str(num)})
    else:
        print("stop flag true",request.json)
        return jsonify({'task':-2})

@app.route('/register-disconnect',methods=['POST'])
def regDisconnect():
    print(f'disconnected, last request was {request.json}')

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
    args=request.json
    computed=args['task']#will probably be list(later)
    try:
        result=args['result']
        jobType=args['type']
    except KeyError:
        print(args)
    #conn = get_db_connection()
    with lock:
        conn.execute(f"INSERT INTO {jobType}Record(tasks,results) VALUES (?,?)",[computed,result])
        conn.commit()
    #conn.close()
    if BENCHMODE and int(computed)>=endValues[jobType]:#python has nice native arbitrary int support 
        #technically not thread safe but since i will only ever be setting it to be True i think its fine
        globalVars['stopFlag']=True
        print(time.time()-nextBenchTime)
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
