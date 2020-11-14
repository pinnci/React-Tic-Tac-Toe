import React, { useState, useRef } from 'react';

import { Redirect, Link } from 'react-router-dom';

//Styles
import './Size.scss';

//Button icons
import GoHome from '../Icons/GoHome';

function Size(props){
    //Create state for redirecting
    const [redirect,setRedirect] = useState(false);

    //Create ref for input
    const sizeOfBoard = useRef(null);

    //State for an error checking
    const [isError,setIsError] = useState({
        error:false,
        errorMessage:''
    });

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

            //Get window screen width for setting maximum available game board size for users device
            let width = window.screen.width;

            if(size.indexOf('x') === -1 || rows !== cols || rows < 3 || cols < 3){
                setIsError({
                    error:true,
                    errorMessage:'Please enter correct format. (i.e 4x4)'
                });
                sizeOfBoard.current.value = '';
            }else if(width < 500 && rows > 5){
                setIsError({
                    error:true,
                    errorMessage:'Maximum game size on this device is 5x5'
                });
                sizeOfBoard.current.value = '';
            }else if(width < 320 && rows > 4){
                setIsError({
                    error:true,
                    errorMessage:'Maximum game size on this device is 4x4'
                });
                sizeOfBoard.current.value = '';
            }else if(width > 1500 && rows > 8){
                setIsError({
                    error:true,
                    errorMessage:'Maximum game size on this device is 8x8'
                });
                sizeOfBoard.current.value = '';
            }else if(rows > 10){
                setIsError({
                    error:true,
                    errorMessage:'Maximum game size is 10x10'
                });
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
            setIsError({
                error:true,
                errorMessage:'Please enter correct format. (i.e 4x4)'
            });
        }
    }

    //Adds error stylings to input
    if(isError.error === true){
        sizeOfBoard.current.style.border='2px solid red';
        sizeOfBoard.current.placeholder=isError.errorMessage;
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
        <div className="sizeScreen">
            <p>Select game board size</p>
            <small>Please use following format : 3x3</small><br/>
            <small>The smallest possible size is 3x3</small>

            <form onSubmit={handleSubmit}>
                <input type="text" ref={sizeOfBoard} onChange={removeHighlightInput} autoFocus />
            </form>

            <div className="iconContainer">
                <Link to="/" className="icon">
                    <GoHome resetGame={props.resetGame} />
                </Link>
            </div>

            {fireRedirect()}
        </div>
    )
}

export default Size;