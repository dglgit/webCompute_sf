DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS numJobs;
DROP TABLE IF EXISTS currentNum;


CREATE TABLE posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);
/*
id is id for each row
open is the list of jobs that are being computed(0)or that have been disconnected before finishing(1)
 numbers are the corresponding numbers to the list of jobs above
 might refactor so that im only storing disconnected jobs
 */
CREATE TABLE numJobs(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    open INTEGER NOT NULL,
    numbers INTEGER NOT NULL
);
CREATE TABLE computed(
    input INTEGER,
    output INTEGER
);
--just a single integer that is the next value to be computed 
CREATE TABLE currentNum(
    num INTEGER NOT NULL
);
