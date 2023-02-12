import requests
import threading
import time
from concurrent.features import ThreadPoolExecutor 
url="127.0.0.1:5000/"

def sequentialTest(urls,iters,req={}):
    start=time.time()
    for i in range(iters):
        requests.post(urls[i],data=req)
    elapsed=time.time()-start
    print(f"total time was {elapsed}s, avg of {elapsed/iters}s")


def parallelTest(urls,workers,req):
    start=time.time()
    def postRequest(url):
        return requests.post(url,data=req)
    with ThreadPoolExecutor(max_workers=workers) as pool:
        responses=pool.map(postRequest,urls)
    elapsed=time.time()-start
    print(f"total time was {elapsed}s")