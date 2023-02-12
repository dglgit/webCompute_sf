var currentNumber;
const addr="127.0.0.1:5000/"
async function getJob(){
    var number=0;
   var result= await fetch("127.0.0.1:5000/get-job",{
       method:'POST',
       body: ''
   });
    number=json.json()['number']
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
window.addEventListener("beforeunload",function(e){
    failJob(currentNumber);
    return "are you sture you want to stop?";
});
