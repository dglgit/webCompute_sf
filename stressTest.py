import requests
import threading
import time
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor
url="http://127.0.0.1:5000/"

def sequentialTest(iters):
    start=time.time()
    for i in range(iters):
        res=requests.post(url+'get-job',json={'type':'primes'})
        #print(res.json())
        task=res.json()['task']
        requests.post(url+'submit-job',json={'type':'primes',"task":task,'result':False})
    elapsed=time.time()-start
    print(f"total time was {elapsed}s, avg of {elapsed/iters}s")
def postRequest(dest):
    res=requests.post(dest+'get-job',json={'type':'primes'})
    task=res.json()['task']
    return requests.post(dest+'submit-job',json={'type':'primes',"task":task,'result':False})

def parallelTest(workers):
    start=time.time()
    with ProcessPoolExecutor(max_workers=8) as pool:
        responses=list(pool.map(postRequest,[url]*workers))
    elapsed=time.time()-start
    #print(responses)
    print(f"total time was {elapsed}s")

if __name__=='__main__':
    sequentialTest(3000)
    time.sleep(1)
    parallelTest(3000)