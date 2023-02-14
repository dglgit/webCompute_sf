import sqlite3

conn=sqlite3.connect('database.db')
conn.row_factory=sqlite3.Row
print(conn.row_factory)
def printTable(name):
    print(name)
    res=conn.execute(f'SELECT * from {name}').fetchall()
    if len(res)==0:
        print(f'{name} rowcount is 0')

        return 
    first=dict(**res[0])
    baseDict={key:[] for key in first}
    for row in res:
        d=dict(**row)
        for key in d:
            baseDict[key].append(d[key])
    print(baseDict)


printTable('primesRecord')
printTable("primesCurrentTask")
