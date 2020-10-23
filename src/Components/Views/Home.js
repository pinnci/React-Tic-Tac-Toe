import React, { useState, useRef } from 'react';
import { Redirect } from 'react-router-dom';

//Styles
import './Home.scss';

function Home(props){
    //Create state for redirecting
    const [redirect,setRedirect] = useState(false);

    //Create ref for input
    const sizeOfBoard = useRef(null);

    //State for an error checking
    const [isError,setIsError] = useState(false);

    //Handle form submit
    function handleSubmit(e){
        e.preventDefault();
        let size;
        
        //Form validation
        if(sizeOfBoard.current.value !== ""){
            size = sizeOfBoard.current.value;

            let x = size.indexOf('x');
            let rows = Number(size.substr(0,x));
            let cols = Number(size.substr(x+1));

            if(size.indexOf('x') === -1 || rows !== cols){
                setIsError(true);
                sizeOfBoard.current.value = '';
            }else{
                //Send size to getSize function in App.js
                if(size){
                    props.getSize(size);
                }
                
                //Switch redirect to true
                setRedirect(true);
            }
        }else{
            setIsError(true);
        }
    }

    //Adds error stylings to input
    if(isError){
        sizeOfBoard.current.style.border='2px solid red';
        sizeOfBoard.current.placeholder='Please enter correct format. (i.e 4x4)';
        sizeOfBoard.current.className = 'error';
    }

    //Removes error stylings from input
    function removeHighlightInput(){
        if(isError){
            setIsError(false);
            sizeOfBoard.current.className='';
            sizeOfBoard.current.placeholder='';
            sizeOfBoard.current.style.border='none';
        }
    }

    //Redirect to Play component on form submit if redirect is true
    function fireRedirect(){
        if(redirect === true){
            return <Redirect to={'/play'} />
        }
    }

    return(
        <div className="homeScreen">
            <h1>Tic Tac Toe</h1>
            <p>Please insert size of game board</p>
            <span>Please use following format : 4x4</span>

            <form onSubmit={handleSubmit}>
                <input type="text" ref={sizeOfBoard} onChange={removeHighlightInput} autoFocus />
            </form>

            {fireRedirect()}
        </div>
    )
}

export default Home;