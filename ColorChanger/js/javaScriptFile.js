document.addEventListener('domcontentloaded',function(){

return console.log('dom is loaded');

});

document.getElementById('color-box').onclick = function(){

};
document.getElementById('change-color-btn')


function getRandomColor(){
    const letters = '0123456789ABCDEF';
    let color = '#';
    for(let i = 0; i < 6; i++){
        color += letters[Math.floor(Math.random() * 16)];

    
    }return color;
}

document.getElementById('change-color-btn').addEventListener('click', function(){

    const colorbox = document.getElementById('color-box');
    colorbox.style.backgroundColor = getRandomColor();
    colorbox.innerHTML = color-box.style.backgroundColor;

});
