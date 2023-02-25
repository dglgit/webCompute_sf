
function isPrime(num){
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
function sqrt(value) {
    //from https://stackoverflow.com/questions/53683995/javascript-big-integer-square-root
    if (value < 0n) {
        throw 'square root of negative numbers is not supported'
    }

    if (value < 2n) {
        return value;
    }

    function newtonIteration(n, x0) {
        const x1 = ((n / x0) + x0) >> 1n;
        if (x0 === x1 || x0 === (x1 - 1n)) {
            return x0;
        }
        return newtonIteration(n, x1);
    }

    return newtonIteration(value, 1n);
}
function bigIntPow(base,e){
    var start=1n;
    for(var i=0;i<e;++i){
        start*=base;
    }
    return start
}
function bigIntPrime(num){
    console.log(num);
    if(num%2n==0){
        return false;
    }
    var i=BigInt(3);
    for(;i<sqrt(num)+1n;i+=2n){
        if(num%i==0){
            return false;
        }
    }
    return true;
}
function computeCollatz(n){
    var count=0;
    while(n>1){
        if(n%2==0){
            n/=2;
        }else{
            n=3*n+1;
        }
        ++count;
    }
    return count;
}
function bigIntComputeCollatz(n,iters){
    var count=0n;
    while(n>1){
        if(n%2n==0){
            n/=2n;
        }else{
            n=3n*n+1n;
        }
        ++count;
    }
    return count;
}
function bench(func,start,iters,msg){
    console.log(msg);
    console.time();
    for(var i=start;i<start+iters;++i){
        func(i);
    }
    console.timeEnd();
}

function lucasLehmer(p){
    var num = 2**p-1;
    var val = 4%num;
    for(var i=0;i<p;++i){
        val = (val*val-2)%num;
    }
    return val==0;//is prime
}
function lucasLehmerBigInt(p){
    var num = 2n**p-1n;
    var val = 4n%num;
    for(var i=0;i<p;++i){
        val=(val*val-2n)%num;
    }
    return num==0;
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
   // console.log(`s is ${s}`)
    
    for(var r=0n;r<s;++r){
        //console.log(`r is ${r}`);
        if((a%number)**(2n**r*d)%number==(number-1n)){//instead of doing it from scratch everytime i can just square it everytime
            return true;
        }
    }
    return false;
}
function singleMillerRabin2(number,s,d){
    var n=number-1n;
    var a = BigInt(2+Math.floor(Math.random()*(Number(n)-3)));
    console.log(d)
    var start=(a%number)**d%number;
    //console.log(start)
    if(start==1 || start==n){
        return true;
    }
    console.log("testing powers of 2d")
    
    for(var r=1n;r<s;++r){
        start=(start*start)%number
        if(start==(number-1n)){//instead of doing it from scratch everytime i can just square it everytime
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
        console.log(`copyN is ${copyN}`)
        ++s;
        copyN=copyN>>1n;
    }
    d=n>>s;
    for(var i=0;i<iterations;++i){
        console.log(i);
        if(!singleMillerRabin2(number,s,d)){
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
var start=Date.now()
console.log(2n**18n-1n)
//console.log(millerRabin(2n**19n-1n,20n))//passed(true)
//console.log(millerRabin(2n**20n-1n,20n))//passed(false) only took 1 iteration
console.log(millerRabin(2n**31n-1n,20n))//
//console.log(millerRabin(2n**18n-1n,20n))
//testRange(2n**19n-1n,2n**19n+99n,20n);//pretty good pacing although the first one is a prime which takes the longest
//console.log(lucasLehmerBigInt(1978798800n))
//testRange(2n**23n-1n,2n**23n+99n,10);
var end = Date.now()

console.log(end-start);
/*
bench(isPrime,Math.pow(2,52)-1,1000,"primes");
bench(bigIntPrime,BigInt(2n**100n-1n),100n,"big int primes");//2^100-1 is good
bench(computeCollatz,100000,1000,"collatz");
bench(bigIntComputeCollatz,BigInt(Math.pow(2,30)),1000n,"big int collatz");
*/