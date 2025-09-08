

const buttons = document.getElementsByClassName('fas fa-plus-circle'); 

let count1 = 0;
let count2 = 0;
let count3 = 0;
// Iterate over the HTMLCollection and add an event listener to each button

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function() {
        // Access the clicked button using 'this'
        if (i === 0) {
            
            count1 = count1 + 1;
    
        document.getElementById('quantity1').textContent = `quantity: ${count1}`; 
        } else if (i === 1) {
           count2 = count2 +1;
            
        document.getElementById('quantity2').textContent = `quantity: ${count2}`;
        }
    if (i === 2) {
        count3 = count3 +1;
        document.getElementById('quantity3').textContent = `quantity: ${count3}`;
          }
    });
}
    


const buttonsMinus = document.getElementsByClassName('fas fa-minus-circle'); 


// Iterate over the HTMLCollection and add an event listener to each button

for (let i = 0; i < buttonsMinus.length; i++) {
    buttonsMinus[i].addEventListener('click', function() {
        
        if (i === 0) {
            
         if (count1 > 0)  {count1 = count1 - 1; } 
    
        document.getElementById('quantity1').textContent = `quantity: ${count1}`; // Increment count for Button 1
        } else if (i === 1) {
          if  (count2 > 0) {  count2 =  count2 - 1 ; }
            
        document.getElementById('quantity2').textContent = `quantity: ${count2}`;
        }
    if (i === 2) {
       if(count3 > 0) {count3 = count3 -1; }
        document.getElementById('quantity3').textContent = `quantity: ${count3}`;
          }
    });
}
    
const buttonsDelete = document.getElementsByClassName('fas fa-trash-alt'); 
const myElement1 = document.getElementById('card1');
const myElement2 = document.getElementById('card2');
const myElement3 = document.getElementById('card3');
for (let i = 0; i < buttonsDelete.length; i++) {
    buttonsDelete[i].addEventListener('click', function() {
        
        if (i === 0) {
            if (myElement1) { 
        myElement1.remove();
    }  }

 if (i === 1) {
            if (myElement2) { 
        myElement2.remove();
    }  }
             if (i === 2) {
          if (myElement3) { 
        myElement3.remove();
    }  }
    }); }

    const heart = document.getElementsByClassName('fas fa-heart'); 

for (let i = 0; i < heart.length; i++) {
    heart[i].addEventListener('click', function() {
        
        if (i === 0) {
             heart[i].style.color = "red";
        }

 if (i === 1) {
             heart[i].style.color = "blue"; }
             if (i === 2) {
           heart[i].style.color = "green"; }
    }); }


let to = 0;
if(count1 === 0 ) {to = (count2)*20 + (count3)*50 ;}
if(count2  === 0 ) {to = (count1)*100 + (count3)*50 ;}
if(count3 === 0 ) {to = (count1)*100 + (count2)*20 ;}

else
to = 100 *(count1)+ 20*(count2) + 50*(count3);
 document.getElementById('total').textContent = `total: ${to}`;

/*to.addEventListener('mouseover', function() {


document.getElementById('totale').textContent = `: ${to}`;   }
);
*/