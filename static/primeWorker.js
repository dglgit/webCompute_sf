var currentNumber;
//const addr="http://192.168.1.86:5000/"
const addr ="http://10.241.124.235:5000/"
//const addr='http://127.0.0.1:5000/';
async function getJob(){
    var jr;
    var result= await fetch(addr+"get-job",{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'type':'primes'
        })
    });
    jr=await result.json();
    //console.log(`data: ${jr}, task is ${jr['task']}`);
    return jr['task'];
}
async function submitJob(computedNum,result){
    var dataBody=JSON.stringify({
        'type':'primes',
        'task': computedNum,
        'result': result
    });
    var result = await fetch(addr+'submit-job',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: dataBody
    });
    var jr=await result.json();
    //console.log(jr);
    return;
}
async function failJob(num){
    var result=await fetch(addr+"register-disconnect",{
        method:"POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "type":"primes",
            "task": num
        })
    });
    return result;
}
//https://www.geeksforgeeks.org/aks-primality-test/

//super naive brute force prime checker
function compute(num){
    if(num%2==0){
        return false;
    }
    for(var i=3;i<Math.sqrt(num)+1;i+=2){
        if(num%i==0){
            return false;
        }
    }
    return true;
}
function sleep(ms) {
    console.log(`sleeping for ${ms}`);
    return new Promise(resolve => setTimeout(resolve, ms));
  }
async function sleepCompute(num){
    await sleep(1100);
    return false;
}

function modPow(base, ex, m){
    var res=1n;
    while(ex>0){
      if(ex&1n){
        res*=base;
      }
      res=res*res;
      res%=m;
      ex>>1n;
    }
    return res%m;
}
function singleMillerRabin(number,s,d){
    //credit to wikipedia and geeks for geeks
    var n=number-1n;
    var a = BigInt(2+Math.floor(Math.random()*(Number(n)-3)));
    if((a%number)**d%number==1){
        return true;
    }
    for(var r=0n;r<s;++r){
        if((a%number)**(2**r*d)%number==(number-1n)){
            return true;
        }
    }
    return false;
}

function millerRabin(number,iterations){
    var n = number-1n;
    var copyN=n;
    var d;
    var s=0n;

    while(!(copyN&1n)){
        ++s;
        copyN=copyN>>1n;
    }
    d=n>>s;
    for(var i=0;i<iterations;++i){
        console.log(performance.now());
        if(!singleMillerRabin(number,s,d)){
            return false;
        }
    }
    return true;
}
function testRange(start,end,riters){
    var count=0;
    for(var i=start;i<end;i+=2n){
        if(millerRabin(i,riters)){
            count++;
        }
    }
    console.log(count);
    return count;
}


async function mainloop(){
    console.log("starting");
    var number=-1,result=-1,lastNum=-1;
    var i=300;
    while(i-->0){
        //console.log("asdffsdf");
        number= await getJob();
        if(number==-2){
            console.log('stop signal recieved quitting ')
            postMessage("q");
            return;
        }
        //NOTE: number is a sequential counting number while `input` is the actual prime(s) being tested
        //console.log("task: "+number)
        postMessage(JSON.stringify({"lastNumber":lastNum,"currentNumber":number,"lastResult":result}));
        result=await sleepCompute(number);
        await submitJob(number,result);
        lastNum=number;
        
    }
}
mainloop();