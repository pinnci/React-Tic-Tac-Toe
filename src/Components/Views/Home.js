import React, { useState } from 'react';

import {Link} from 'react-router-dom';

//react spring
import {useTransition, animated} from 'react-spring';

//Styles
import './Home.scss';

function Home(props){
    //State for animation
    const [showGameOptions] = useState(true);

    //Starting animation
    const gameOptionsTransitions = useTransition(showGameOptions, null, {
        from: { opacity: 0, transform:'translateY(200px)' },
        enter: { opacity: 1, transform:'translateY(0)'},
        leave: { opacity: 0, transform:'translateY(200px)'}
    });

    //Fire animations sent as a props
    function playPlayerVsComputer(){
        props.playPlayerVsComputer();

        //Prevents the animation from trigger, when switching components. The animation will only run once at startup.
        props.preventStartUpAnimation();
    }

    function playPlayerVsPlayer(){
        props.playPlayerVsPlayer();

        //Prevents the animation from trigger, when switching components. The animation will only run once at startup.
        props.preventStartUpAnimation();
    }

    return(
        <div className="homeScreen">
            <h1>Tic Tac Toe</h1>
            <p>Select game mode</p>

            {props.startUpAnimation ? gameOptionsTransitions.map(({ item, key, props }) =>
                item && 
                    <animated.div key={key} style={props}>
                        <Link to="/size" className="setGameMode-btn" onClick={playPlayerVsComputer}>
                            Player vs. Computer
                        </Link>
                
                        <Link to="/size" className="setGameMode-btn" onClick={playPlayerVsPlayer}>
                            Player vs. Player
                        </Link>
                    </animated.div>
                ) : <div>
                        <Link to="/size" className="setGameMode-btn" onClick={playPlayerVsComputer}>
                            Player vs. Computer
                        </Link>  

                        <Link to="/size" className="setGameMode-btn" onClick={playPlayerVsPlayer}>
                            Player vs. Player
                        </Link>
                    </div>
             }
        </div>
    )
}

export default Home;