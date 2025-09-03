//Factorial of a number:

function factorial(n){
    if (n< 0){
        return 'not defind';
    }
    if (n===0){
        return 1;
    }
result = 1;
for (let i = 1; i <= n; i++) {
result = result*i;
}
return result;
  };
    
  //Prime Number Check:

  function prime(n){
if (n<=1){return "isnt a prime number";}

if (n===2){ return ' 2 is a prime number';}
   
    for (let i = n; i<= n; i++){

if (n%2===0){return `${n} is not a prime number`}
else return `${n} is a prime number`;
    }
}
console.log(prime(9));

//Fibonacci Sequence:

function fibonacci(n) {
  if (n < 2) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}
console.log(fibonacci(7));

  


