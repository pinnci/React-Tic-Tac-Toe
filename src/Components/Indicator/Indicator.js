import React, { useEffect } from 'react';

//styles
import './Indicator.scss';

function Indicator(props){
    //Switch indicator colors depending on sign
    useEffect(()=>{
        let indicatorDiv = document.getElementsByClassName('indicator')[0];
        
        if(props.sign === true){
            indicatorDiv.style.backgroundColor = '#00db93';
        }else{
            indicatorDiv.style.backgroundColor = '#ff1567';
        }

    },[props.sign])

    return(
        <div className="indicatorWrapper">
            <div className="indicator"></div>
            <p>MOVE</p>
        </div>    
    )
}

export default Indicator;