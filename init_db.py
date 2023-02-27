import sqlite3

jobs=["primes", "collatz"]
#defaults={"primes":2**20-1,'collatz':1000}
defaults={'primes':str(2**3217-1),'collatz':1000}
print(type(defaults['primes']))
connection = sqlite3.connect('database.db')
def clearTables(conn):
    cur=conn.cursor()
    tables=conn.execute("SELECT name FROM sqlite_schema WHERE type='table';").fetchall()
    for table, in tables:
        if table!='sqlite_sequence':
            print(table)
            cur.execute(f"DROP TABLE {table}")
    cur.close()
    print('='*10)
clearTables(connection)
for job in jobs:
    connection.executescript(f'''
        CREATE TABLE {job}Record(
            tasks TEXT,
            results TEXT
        );
        CREATE TABLE {job}Failed(
            tasks TEXT
        );
        CREATE TABLE {job}CurrentTask(
            task TEXT
        );
        INSERT into {job}CurrentTask (task) VALUES("{defaults[job]}");
    ''')
cur=connection.cursor()    
tables=connection.execute("SELECT name FROM sqlite_master WHERE type='table';").fetchall()
for table, in tables:
    print(table)
    print(list(cur.execute(f"SELECT * FROM {table}")))

connection.close()
'''
with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO posts (title, content) VALUES (?, ?)",
            ('First Post', 'Content for the first post')
            )

cur.execute("INSERT INTO posts (title, content) VALUES (?, ?)",
            ('Second Post', 'Content for the second post')
            )
cur.execute("INSERT INTO currentNum (num) VALUES (?)",(0,))

connection.commit()
connection.close()
'''
