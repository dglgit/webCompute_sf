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
var start=10000;
var length=10000;
var end=start+length;
var count=0;
console.time()
for(var i=start;i<end;++i){
    //count+=isPrime(i);
    computeCollatz(i);
}
console.timeEnd()
console.log(count)

