var currentNumber;
const addr="127.0.0.1:5000/"
async function getJob(){
    var number=0;
   var result= await fetch("127.0.0.1:5000/get-job",{
       method:'GET'
   });
    number=result.json()['number']
    console.log(number);
    return number;
}
async function submitJob(computedNum,result){
    var result = await fetch('127.0.0.1:5000/submit-job',{
        method:'POST',
        body:JSON.stringify({
            'computed':computedNum,
            'result':result
        })
    });
    var jr=result.json;
    console.log(jr);
    return;
}
async function failJob(num){
    var result=await fetch("127.0.0.1:5000/register-disconnect",{
        method:"POST",
        body: JSON.stringify({
            "computed":num
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
var number=-1,result=-1,lastNum=-1;

while(true){
    number=await getJob();
    postMessage({"lastNumber":lastNum,"currentNumber":number,"lastResult":result});
    result=compute(number);
    await submitJob(number,result);
    lastNum=number;

}

