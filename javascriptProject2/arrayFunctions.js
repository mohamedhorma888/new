//MAXIMUM
 function maximum(arr){
    
   return Math.max(...arr);
}

console.log(maximum([4,2,3,4,5]));
//MINIMUM
function mimimum(arr){

return Math.min(...arr);


}
console.log(mimimum([4,2,3,7,5]));
//SUM
function sume(arr){
    let s =0;
for(let e of arr){
s += e;

}
return s;
}
console.log(sume([4,2,3,7,5]));

//Filter Array:

function filterArray(arr ){

return arr.filter(element => element > 4);

}
console.log(filterArray([4,2,3,7,5]));



