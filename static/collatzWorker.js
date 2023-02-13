var currentNumber;
const addr="http://192.168.1.86:5000/"
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
    console.log(`data: ${jr}, task is ${jr['task']}`);
    return jr['task'];
}
async function submitJob(computedNum,result){
    var dataBody=JSON.stringify({
        'type':'primes',
        'task': computedNum,
        'result': result
    });
    console.log("body to submit: ")
    console.log(dataBody)
    console.log(computedNum)
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
        body: JSON.stringify({
            'type':'primes',
            "task":num
        })
    });
    return result;
}
function compute(num){
    var count=0;
    while(num>1){
        if(num%2==0){
            n/=2;
        }else{
            n=3*n+1;
        }
        ++count;
    }
    return count;
}
async function mainloop(){
    var number=-1,result=-1,lastNum=-1;
    var i=7;
    while(i-->0){
        number= await getJob();
        console.log("task: "+number)
        postMessage(JSON.stringify({"lastNumber":lastNum,"currentNumber":number,"lastResult":result}));
        result=compute(number);
        await submitJob(number,result);
        lastNum=number;
        
    }
}
mainloop();