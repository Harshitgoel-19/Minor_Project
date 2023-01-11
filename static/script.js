let buttons=document.querySelectorAll('button');
let paratext=document.getElementById("paratext");
let speed=document.getElementById("speed");
let incorrect=document.getElementById("incorrect");
let accuracy=document.getElementById("accuracy");
let para=paratext.innerText;
let textcount=0;
let wrong=0;
let passed='';
let accuracyp=0
function check(keynum){
    let currenttext=String.fromCharCode(keynum)
    accuracyp=((textcount/(textcount+wrong))*100).toPrecision(3)
    accuracy.innerHTML=accuracyp+"% Accuracy"
    if((currenttext==para[textcount])||(keynum==13 && para.charCodeAt(textcount)==10)){
        passed+=para[textcount]
        ++textcount;
        speed.innerText=(textcount/(minute+1)).toPrecision(3)+" words/min"
        let remain='';
        for(i=textcount;i<para.length;++i){
            remain+=para[i];
        }
        let finalstring = "<span style='color:white; background-color:chartreuse;'>"+passed+"</span>"+remain
        paratext.innerHTML=finalstring
    }
    else if(currenttext!=para[textcount]){
        ++wrong;
        incorrect.innerText=wrong+" Errors";
        let remain='';
        for(i=textcount+1;i<para.length;++i){
            remain+=para[i];
        }
        let finalstring = "<span style='color:white; background-color:chartreuse;'>"+passed+"</span>"+"<span style='color:white; background-color:red;'>"+para[textcount]+"</span>"+remain
        paratext.innerHTML=finalstring
    }
}
document.addEventListener('keypress',keypress);
function keypress(e){
    let keynum;
    if(window.event) 
    {                  
        keynum = e.keyCode;
    } else if(e.which)
    {                  
        keynum = e.which;
    }
    let pressed=String.fromCharCode(keynum).toUpperCase();
    // console.log(pressed);
    buttons.forEach(button=>{
        let text=button.innerText;
        if((text=='SPACE' && keynum==32) || (text=='ENTER' && keynum==13) || text==pressed){
            button.style.backgroundColor='rgba(55, 0, 255, 0.5)'
            button.style.color='white'
        }
        else{
            button.style.backgroundColor=''
            button.style.color=''
        }
    })
    check(keynum)
}