var currentNumber;
//const addr="http://192.168.1.86:5000/"//att
//const addr='http://192.168.86.241:5000/'//ji tzuoh lins
importScripts("https://cdn.jsdelivr.net/npm/gmp-wasm/dist/mini.umd.min.js")
//const addr ="http://10.241.124.235:5000/"
const addr='http://127.0.0.1:5000/';
function makeInt(val,binding){
    const result = binding.mpz_t();
    binding.mpz_init_set_si(result,val);
    return result;
}
function singleMillerRabinGMPLow(numberPtr,s,d,binding){//all inputs are pointers
    //gmp.init().then(({binding})=>{
        //console.log(binding)
        const a = makeInt(2+Math.floor(Math.random()*(binding.mpz_get_si(numberPtr)-3)),binding);
        const start = binding.mpz_t();
        const minus1=binding.mpz_t();
        const one = makeInt(1,binding);
        binding.mpz_sub(minus1,numberPtr,one);
        const actualMinus1=binding.mpz_get_si(minus1)
        binding.mpz_powm(start,a,d,numberPtr);
        let r=binding.mpz_get_si(start);
        if(r==1 || r==actualMinus1){
            return true;
        }
        const two = makeInt(2,binding);
        for(let i=0;i<binding.mpz_get_si(s);++i){
            binding.mpz_powm(start,start,two,numberPtr);
            if(binding.mpz_get_si(start)==actualMinus1){
                return true;
            }
        }
        return false;
    //})
}
function millerRabinGMPLow(numberPtr,iters, binding){//number should also be pointer
    //console.log(binding)
    let s=0;
    const d=binding.mpz_t();
    const one=makeInt(1,binding);
    binding.mpz_sub(d,numberPtr,one);
    const two = makeInt(2,binding);
    while(binding.mpz_tstbit(d,0)){//bitcnt might just be a js number
        binding.mpz_divexact(d,d,two);
        s++;
    }
    const sp=makeInt(s,binding);
    for(let i=0;i<iters;++i){
        if(!singleMillerRabinGMPLow(numberPtr,sp,d,binding)){
            return false;
        }
    }
    return true;
}
async function getJob(){
    var jr,result;

    //randomly breaks sometimes with typerror maybe because all the request have the same ip address for some reason
    return await fetch(addr+"get-job",{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'type':'primes'
        })
    }).then(async (f)=>{result=await f.json();console.log(`fetch worked, ${result.toString()}`);return result['task']}).catch(async (r)=>{console.log("fetch failed "+r.message)})
    /*
    result= await fetch(addr+"get-job",{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'type':'primes'
        })
    });*/

    jr=await result.json();

    console.log(jr)
    console.log(`data: ${jr}, task is ${jr['task']}`);
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
function stringToGmp(s,binding){
    const ptr=binding.mpz_t();
    const sptr=binding.malloc_cstr(s);
    binding.mpz_init_set_str(ptr,sptr,10);
    return ptr;
}
async function compute(num){
    return await gmp.init().then(({binding})=>{
        const numPtr=stringToGmp(num,binding);
        let result=millerRabinGMPLow(numPtr,10,binding);
        binding.reset();
        return result;
    });
    
}
function sleep(ms) {
    console.log(`sleeping for ${ms}`);
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function sleepCompute(num){
    await sleep(1100);
    return false;
}

async function mainloop(){
    console.log("starting");
    var number=-1,result=-1,lastNum=-1;
    var i=30;
    while(i-->0){
        //console.log("asdffsdf");
        number = await getJob();//number might be a string from now on
        if(number==-2){
            console.log('stop signal recieved quitting ')
            postMessage("q");
            return;
        }
        //NOTE: number is a sequential counting number while `input` is the actual prime(s) being tested
        //console.log("task: "+number)
        postMessage(JSON.stringify({"lastNumber":lastNum,"currentNumber":number,"lastResult":result}));
        result=await compute(number);
        await submitJob(number,result);
        lastNum=number;
        
    }
}
mainloop();