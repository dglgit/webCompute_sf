import sqlite3
import time
def testConnect():
    start=time.time()
    conn=sqlite3.connect('database.db')
    elapsed=time.time()-start
    print(elapsed)
    conn.close()
def testConnectDisconnect():
    start=time.time()
    conn=sqlite3.connect('database.db')
    conn.execute("SELECT * from currentNum").fetchall()[0]['num']
    conn.close()
    elapsed=time.time()-start
    print(elapsed)

testConnectDisconnect()
