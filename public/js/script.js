let buttons=document.querySelectorAll('button');
let paratext=document.getElementById("paratext");
let speed=document.getElementById("speed");
let incorrect=document.getElementById("incorrect");
let accuracy=document.getElementById("accuracy");
let para=paratext.innerText;
let textcount=0;
let wrong=0;
let passed='';
let accuracyp=0;


async function check(keynum){
    let currenttext=String.fromCharCode(keynum)
    accuracyp=((textcount/(textcount+wrong))*100).toPrecision(3)
    accuracy.innerHTML=accuracyp+"% Accuracy"
    if(textcount==para.length-1){
        pause()
        let model=document.getElementById("modelO");
        model.style.display="flex";
        let time1=document.getElementById("time1");
        let speed1=document.getElementById("speed1");
        let error1=document.getElementById("error1");
        let minute=document.getElementById("minute");
        let speed=document.getElementById("speed");
        let second=document.getElementById("second");
        let scored=document.getElementById("score");
        time1.innerText+=" "+minute.innerText+" minutes "+second.innerText+ " second"
        speed1.innerText+=" "+speed.innerText
        error1.innerText+=" "+wrong
        accuracy1.innerText+=" "+accuracyp
        // console.log(Number.parseFloat(speed.innerText))
        let level=document.getElementById("levelname").dataset.level
        let score=(Number.parseFloat(speed.innerText)*accuracyp)/100;
        scored.innerText+=" "+score
        const result=await fetch('level/api/levelupdate',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                score,
                level
            })
        }).then((res)=>res.json())
        if(result.status!=='ok'){
            alert(result.error);
        }
    }
    
        // speed.innerText=(textcount/(minute+1)).toPrecision(3)+" words/min"
    // console.log(second);
        
    
    if((currenttext==para[textcount])||(keynum==13 && para.charCodeAt(textcount)==10)){
        passed+=para[textcount]
        if(keynum==13 && para.charCodeAt(textcount)==10){
            paratext.scrollBy({
                top: 35,
                left: 0,
                behavior: 'smooth'
            });
        }
        ++textcount;
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
    start()
    if(window.event) 
    {                  
        keynum = e.keyCode;
        // console.log(keynum)
    } else if(e.which)
    {                  
        keynum = e.which;
    }
    let pressed=String.fromCharCode(keynum);
    // console.log(pressed);
    buttons.forEach(button=>{
        let text=button.innerText;
        if((text=='SPACE' && keynum==32) || (text=='ENTER' && keynum==13)|| text==pressed){
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