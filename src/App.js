import React, { useEffect, useState } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

//React-spring
import {useSpring, animated} from 'react-spring';

//Styles
import './App.scss';

//Views
import Home from './Components/Views/Home';
import Play from './Components/Views/Play';

function App() {
  //State for distinguishing signs
  const [sign,setSign] = useState(true);

  //Create state for matrix
  const [values,setValues] = useState([]);

  //Create state for rows and columns
  const [dimensions,setDimensions] = useState({
    rows:null,
    columns:null
  });

  //Is there a winner?
  const [winner,setWinner] = useState(false);

  //Start animation - fade in input field
  const [moveHome,setMoveHome] = useState(false);

  const props = useSpring({
    opacity: moveHome ? 1 : 0,
    config:{duration:1000}
  });

  useEffect(()=>{
    setMoveHome(true)
  },[moveHome]);

  //Generate matrix and set to state
  function generateMatrix(rows,columns){
    setValues([...Array(rows)].map(e => Array(columns).fill(" "))); 
  }

  //Get size from input
  function getSize(size){
    let x = size.indexOf('x');
    let columns = Number( size.substr( x + 1 ,size.length) );
    let rows = Number( size.substr( 0 , x ) );
    generateMatrix(rows,columns);
    setDimensions({
      rows:rows,
      columns:columns
    });
  }

  //Update matrix
  function updateValues(row,column){
    //Make a copy of matrix
    let newValue = [...values];

    //If clicked field has value then return / Prevent overwriting signs
    //If clicked field has not value then insert X or O component
    if(values[row][column] === " "){
      if(sign === true){
        newValue[row][column] = <p className="xSign">x</p>
      }else{
        newValue[row][column] = <p className="oSign">o</p>
      }
    }else{
      return;
    }

    //Switch sign
    setSign(!sign);

    //Update matrix with new value
    setValues(newValue);

    //Check if there is a winner
    checkWinner();
  }

  //Display who wins
  function displayWinner(){
    return winner;
  }

  //Check for winner
  function checkWinner(){
    var xCount = 0;
    var oCount = 0;

    //Horizontal check
    for(let i=0;i<values.length;i++){
      xCount = 0;
      oCount = 0;
      
      for(let j=0;j<values[i].length;j++){
        if(typeof values[i][j] === 'object' && values[i][j].props.children === 'x'){
          xCount++;

          if(xCount === 3){
            setWinner('X WINS!');
            displayWinner();
            return;
          }
        }else{
          xCount = 0;
        }

        if(typeof values[i][j] === 'object' && values[i][j].props.children === 'o'){
          oCount++;

          if(oCount === 3){
            setWinner('O WINS!');
            displayWinner();
            return;
          }
        }else{
          oCount = 0;
        }
      }
    }
    
    //Vertical check
    for(let i=0;i<values.length;i++){
      xCount = 0;
      oCount = 0;

      for(let j=0;j<values[i].length;j++){
        if(typeof values[j][i] === 'object' && values[j][i].props.children === 'x'){
          xCount++;

          if(xCount === 3){
            setWinner('X WINS!');
            displayWinner();
          }
        }else{
          xCount = 0;
        }

        if(typeof values[j][i] === 'object' && values[j][i].props.children === 'o'){
          oCount++;

          if(oCount === 3){
            setWinner('O WINS!');
            displayWinner();
          }
        }else{
          oCount = 0;
        }
      }
    }
    
    //Diagonal check
    //Left to right
    for (let i = 0; i < values.length; i++){
      if(typeof values[i][i] === 'object' && values[i][i].props.children === 'x'){
        xCount++;

        if(xCount === 3){
          setWinner('X WINS!');
          displayWinner();
        }
      }else{
        xCount = 0;
      }

      if(typeof values[i][i] === 'object' && values[i][i].props.children === 'o'){
        oCount++;

        if(oCount === 3){
          setWinner('O WINS!');
          displayWinner();
        }
      }else{
        oCount = 0;
      }
    }

    //Right to left
    for (let i = values.length - 1; i >= 0; i--){
      if (typeof values[values.length - 1 - i][i] === "object" && values[values.length - 1 - i][i].props.children === "x"){
        xCount++;

        if(xCount === 3) {
          setWinner("X WINS!");
          displayWinner();
        }
      }else{
        xCount = 0;
      }

      if (typeof values[values.length - 1 - i][i] === "object" && values[values.length - 1 - i][i].props.children === "o"){
        oCount++;

        if(oCount === 3) {
          setWinner("O WINS!");
          displayWinner();
        }
      }else{
        oCount = 0;
      }
    }

    //Draw
    const isFull = values.flat().every((cell) => cell !== " ");
    if(isFull === true && winner === false){
      setWinner("DRAW!");
      displayWinner();
    }
  }

  //Restart current game
  function Restart(){
    let newArr = [...values];
    for(let i=0;i<newArr.length;i++){
      for(let j=0;j<newArr[i].length;j++){
        if(newArr[i][j] !== " "){
          newArr[i][j] = " ";
        }
      }
    }

    setValues(newArr);
    setSign(true);
    setWinner(false);
  }

  //Reset whole game
  function resetGame(){
    setDimensions({
      rows:null,
      columns:null
    });
    setSign(true);
    setValues([]);
    setWinner(false);
    setMoveHome(false);
  }

  return (
    <div className="App">
      <div className="container">
        <Router>
          <Switch>
            <Route exact path="/">

              <animated.div style={props}>
                <Home getSize={getSize}/>
              </animated.div>
              
            </Route>

            <Route path="/play">
              <Play 
                updateValues={updateValues}
                values={values}
                sign={sign}
                rows={dimensions.rows}
                columns={dimensions.columns}
                displayWinner={displayWinner}
                winner={winner}
                restartGame={Restart}
                resetGame={resetGame}
                />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
