var currentNumber;
//const addr="http://192.168.1.86:5000/"
const addr='http://127.0.0.1:5000/';
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
        result=compute(number);
        await submitJob(number,result);
        lastNum=number;
        
    }
}
mainloop();