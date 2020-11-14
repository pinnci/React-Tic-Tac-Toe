import React, { useState } from 'react';

//React-router
import { BrowserRouter as Router, Route} from 'react-router-dom';

//React-transition-group
import { CSSTransition } from 'react-transition-group';

//Debounce - Lodash
import {debounce} from 'lodash';

//Styles
import './App.scss';

//Views
import Home from './Components/Views/Home';
import Size from './Components/Views/Size';
import Play from './Components/Views/Play';

function App() {
  //Prevents the animation from trigger, when switching components. The animation will only run once at startup.
  const [startUpAnimation,setStartUpAnimation] = useState(true);

  //State for distinguishing signs
  const [sign,setSign] = useState(true);

  //Create state for matrix
  const [values,setValues] = useState([]);

  //Single player or player vs. player
  const [playerVsPlayer,setPlayerVsPlayer] = useState({
    AI:false,
    AImove:false  
  });

  //Create state for rows and columns
  const [dimensions,setDimensions] = useState({
    rows:null,
    columns:null
  });

  //Is there a winner?
  const [winner,setWinner] = useState(false);

  //Winner count
  const [winnerCount,setWinnerCount] = useState({
    player1:0,
    ties:0,
    player2:0
  });

  //Set startAnimation state to false, so animation won't start again.
  function preventStartUpAnimation(){
    setStartUpAnimation(false);
  }

  //Generate matrix and set to state
  function generateMatrix(rows,columns){
    setValues([...Array(rows)].map(e => Array(columns).fill(" "))); 
  }

  //Debounce computer move
  const debounceComputerMove = debounce(()=>{
    computerMove(values);
  },500);

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

  //Pick random empty column
  function getRandomCol(rows) {
    return Math.floor(Math.random() * Math.floor(rows.length));
  }

  //Update matrix
  function updateValues(row,column){
    //Make a copy of matrix
    let newValue = [...values];

    if(playerVsPlayer.AI === false){
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

    }else{    
      //If playervsplayer.AI === true, i.e player vs computer
      if(playerVsPlayer.AImove === false){
        if(values[row][column] === " "){
            newValue[row][column] = <p className="xSign">x</p>
  
            //Switch sign
            setSign(!sign);
  
            //Update matrix with new value
            setValues(newValue);

            //Check if there is a winner
            checkWinner();

            //Switch state to computer move
            setPlayerVsPlayer(prevState => ({
              ...prevState,
              AImove:true
            }));

            //Computer makes a move
            debounceComputerMove(values);
        }else{
          return;
        }
      }
    }
  }

  //Computer moves
  function computerMove(values){
    let newValue = [...values];

    let emptyCols = [];
    let randomCol;

    //Loop thru matrix and find all empty cols
    for(var i=0;i<values.length;i++){
      for(var j=0;j<values[i].length;j++){
        if(values[i][j] === " "){
          emptyCols.push([[i][j] = i,j]);
        }
      }
    }

    //If there are no empty cells, then return
    if(emptyCols.length > 0 && winner === false && tempWinner === false){
      //Get random from emptyCols
      randomCol = getRandomCol(emptyCols);

      let row = emptyCols[randomCol][0];
      let col = emptyCols[randomCol][1];

      newValue[row][col] = <p className="oSign">o</p>

      //Switch sign
      setSign(true);

      //Switch state player move
      setPlayerVsPlayer(prevState => ({
        ...prevState,
        AImove:false
      }));

      //Update matrix with new value;
      setValues(newValue);

      checkWinner();
    }else{
      return;
    } 
  }

  //Play player vs. computer
  function playPlayerVsComputer(){
    setPlayerVsPlayer({
      AI:true,
      AImove:false
    });
  }

  //Play player vs. player
  function playPlayerVsPlayer(){
    setPlayerVsPlayer({
      AI:false,
      AImove:false
    });
  }

  //Display who wins
  function displayWinner(){
    return winner;
  }

  //Check for winner
  //Prevent computer making move after player wins
  let tempWinner=false;
  
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
            setWinnerCount(prevState => ({
              ...prevState,
              player1:prevState.player1 + 1
            }));

            tempWinner = true;
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
            setWinnerCount(prevState => ({
              ...prevState,
              player2:prevState.player2 + 1
            }));

            tempWinner = true;
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
            setWinnerCount(prevState => ({
              ...prevState,
              player1:prevState.player1 + 1
            }));

            tempWinner = true;
            return;
          }
        }else{
          xCount = 0;
        }

        if(typeof values[j][i] === 'object' && values[j][i].props.children === 'o'){
          oCount++;

          if(oCount === 3){
            setWinner('O WINS!');
            displayWinner();
            setWinnerCount(prevState => ({
              ...prevState,
              player2:prevState.player2 + 1
            }));

            tempWinner = true;
            return;
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
          setWinnerCount(prevState => ({
            ...prevState,
            player1:prevState.player1 + 1
          }));

          tempWinner = true;
          return;
        }
      }else{
        xCount = 0;
      }

      if(typeof values[i][i] === 'object' && values[i][i].props.children === 'o'){
        oCount++;

        if(oCount === 3){
          setWinner('O WINS!');
          displayWinner();
          setWinnerCount(prevState => ({
            ...prevState,
            player2:prevState.player2 + 1
          }));

          tempWinner = true;
          return;
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
          setWinnerCount(prevState => ({
            ...prevState,
            player1:prevState.player1 + 1
          }));

          tempWinner = true; 
          return;
        }
      }else{
        xCount = 0;
      }

      if (typeof values[values.length - 1 - i][i] === "object" && values[values.length - 1 - i][i].props.children === "o"){
        oCount++;

        if(oCount === 3) {
          setWinner("O WINS!");
          displayWinner();
          setWinnerCount(prevState => ({
            ...prevState,
            player2:prevState.player2 + 1
          }));

          tempWinner = true;
          return;
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
      setWinnerCount(prevState => ({
        ...prevState,
        ties:prevState.ties + 1
      }));

      tempWinner = true;
      return;
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

    if(playerVsPlayer.AI === false){
      setPlayerVsPlayer({
        AI:false,
        AImove:false
      });
    }else{
      setPlayerVsPlayer({
        AI:true,
        AImove:false
      });
    }
  }

  //Reset whole game
  function resetGame(){
    setSign(true);

    setWinner(false);

    setPlayerVsPlayer({
      AI:false,
      AImove:false
    });

    setWinnerCount({
      player1:0,
      ties:0,
      player2:0
    });
  }

  return (
    <Router>
      <div className="App">
        <div className="container">

            <Route key="/" exact path="/">
              {({match})=>(
                <CSSTransition
                  in={match != null}
                  timeout={300}
                  classNames="slide-backward"
                  unmountOnExit
                  >
                    <div className="page">
                      <Home
                        playPlayerVsComputer={playPlayerVsComputer}
                        playPlayerVsPlayer={playPlayerVsPlayer}
                        startUpAnimation={startUpAnimation}
                        preventStartUpAnimation={preventStartUpAnimation}
                      />
                    </div>

                </CSSTransition>
              )}
            </Route>

            <Route key="/size" exact path="/size">
              {({match})=>(
                <CSSTransition
                  in={match != null}
                  timeout={300}
                  classNames="slide-forward-size"
                  unmountOnExit
                  >
                    <div className="page">
                      <Size 
                        getSize={getSize}
                       />
                    </div>

                </CSSTransition>
              )}
            </Route>

            <Route key="/play" exact path="/play">
              {({match})=>(
                <CSSTransition
                  in={match != null}
                  timeout={300}
                  classNames="slide-forward"
                  unmountOnExit
                  >
                    <div className="page">
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
                        player1={winnerCount.player1}
                        ties={winnerCount.ties}
                        player2={winnerCount.player2}
                      />
                    </div>

                </CSSTransition>
              )}
            </Route>
          
        </div>
      </div>
    </Router>
  );
}

export default App;
