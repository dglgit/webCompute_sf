import sqlite3

'''
database should have 3 variables
list of numbers being computed      
states for the list of numbers(same length, 0=failed,1=working)
current number i might need to make a seperate reaction for that 
maybe rowids for dropping and stuff
for every new request, look through indexes for failed computations
if there are none add one to current number and make new entry in both lists, the first being current number+1 and the other being 1(working)
^^i could probably just keep an array of failed computations 
on disconnect set the relevant state to 0 for failure
on successful computation delete the rowid for the states and the number 
'''

connection = sqlite3.connect('database.db')


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
