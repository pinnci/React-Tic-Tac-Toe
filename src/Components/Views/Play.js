import React from 'react';
import { Link } from 'react-router-dom';

//Styles
import './Play.scss';

//Components
import Indicator from '../Indicator/Indicator';

//Button icons
import ReloadGame from '../Icons/Replay';
import GoHome from '../Icons/GoHome';

function Play(props){
    //Generate table from matrix
    function generateTable(){
        let rows = [];
        let i,j;

        for (i = 0; i < props.rows; i++) {
            let columns = [];
            for (j = 0; j < props.columns; j++) {
                columns.push(<td key={i+"-"+j} onClick={props.updateValues.bind(null, i, j)}>{props.values[i][j]}</td>);
            }
            rows.push(<tr key={i+"-"+j}>{columns}</tr>);
        }
        return rows;
    }

    //Display winner
    function displayWinner(){
        if(props.winner !== false){
            return props.displayWinner();
        }
    }

    //Color changing depending on who wins
    function colorChange(){
        if(props.winner === 'X WINS!'){
            return 'xWins'
        }else if(props.winner === 'O WINS!'){
            return 'oWins';
        }else{
            return 'draw';
        }
    }

    //Block clicking after someone wins
    function disableClass(){
        if(props.winner !== false){
            return  'disable'
        }else{
            return '';
        }
    }
    
    return(
        <div>
            <Indicator sign={props.sign} />

            <p className={colorChange()}>&nbsp;{displayWinner()}</p>

            <table className={disableClass()}>
                <tbody>
                    {generateTable()}
                </tbody>
            </table>
            
            <div className="iconContainer">
                <Link to="/">
                    <GoHome resetGame={props.resetGame} />
                </Link>

                <ReloadGame restartGame={props.restartGame} />
            </div>

        </div>
    )
}

export default Play;