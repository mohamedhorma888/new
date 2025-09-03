
//Reverse a String:
function reversWords(word){

    return word.split('').reverse().join('');
}

//Count Characters:


function countCharacter(word){

return word.split('').length;
}

console.log(countCharacter('horma'));


//Capitalize Words:

function capitalizeWords(word){
arr = [...word] ;
arr[0] = arr[0].toUpperCase();
return arr.join('');

}
console.log(capitalizeWords('hier is very good'));


