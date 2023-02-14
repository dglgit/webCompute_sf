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
bench(isPrime,Math.pow(2,52)-1,100,"primes");
bench(bigIntPrime,BigInt(bigIntPow(2n,100n)-1n),100n,"big int primes");
bench(computeCollatz,100000,1000,"collatz");
bench(bigIntComputeCollatz,BigInt(Math.pow(2,30)),1000n,"big int collatz");
