﻿# webCompute_sf

The purpose of this project is to create a framework and a web client that can allow anyone to visit this site and help compute the next collatz conjecture number or help find the next prime number or any other task that can be distributed among multiple machines

## Technologies:
- flask server backend
- sqlite for storing data
- plain HTML, CSS, and Javascript frontend
- WebAssembly for faster computations 

## Usage

`app.py` contains the central webserver. Edit the file to edit the operations you are testing and start the webserver by running `python app.py`
For benchmarking, the code for the central webserver is contained in  `webBenchmark.py`. Run that instead. 

In both cases, the webserver is run on port `5000`. You can edit this in the file. 

To start computing, simply navigate to the url (or use `ngrok` for a public proxy) and follow the buttons on the webpage. They will notify the central webserver that your machine is ready for computation and the webserver will start sending tasks. 

Clear the database of operation results by running `init_db.py` and run `viewDB.py` to take a peek at the contents of the database. 

