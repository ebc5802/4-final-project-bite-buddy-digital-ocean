import '../index.css';
import React, { useState, useEffect } from "react";
import axios from '../axiosConfig';
// import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../Challenges.css';

const Challenges = () => {
    const [challengesData, setChallengesData] = useState([]);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const navigate = useNavigate()


    useEffect(() => {
        const fetchChallengesData = async () => {
            try{
                const response = await axios.get(`${process.env.REACT_APP_BACK_PORT}/api/challenges`);
                
                const formattedData = response.data.map((item) => {          
                    return {
                      id: item._id,
                      description: item.description,
                      name: item.name,
                      difficulty_level: item.difficulty_level,
                      ingredients: item.ingredients,
                      steps: item.steps,
                      duration: item.duration,

                    };
                  });
                setChallengesData(formattedData)



                console.log('challenges data', challengesData)
            } catch (error){
                console.log('Error fetching activities')
            }
        };

        fetchChallengesData();
    }, []); 

    const handleStartClick = (challenge) => {
        setSelectedChallenge(challenge);
    };

    const closeFullCard = () => {
        setSelectedChallenge(null);
    };

    const handleStartChallenge = (selectedRecipe) => {
        // Navigate to the record activity page, passing the recipe data
        console.log('going to recipe id:' +selectedRecipe._id)
        navigate('/record', { state: { selectedRecipe } });
      };

    return (
        <><h1>CHALLENGES</h1>
        <div className="challenges-container">
            {challengesData.map((challenge, index) => (
                <div className="challenge-card" onClick={() => handleStartClick(challenge)} key={index}>
                    <h2>CHALLENGE #{index + 1}</h2>
                    <h3>{challenge.name}</h3>
                    <p>{challenge.description}</p>
                    {/*<div className="challenge-image">
                        <img src={challenge.image} alt={`Challenge ${index + 1}`} />
                    </div>*/}
                    <button className="start-button" onClick={() => handleStartChallenge(challenge)}>START CHALLENGE</button>
                </div>
            ))}

            {selectedChallenge && (
                <div className="full-page-card">
                    <button className="close-button" onClick={closeFullCard}>X</button>
                    <h2>{selectedChallenge.name}</h2>
                    <p>{selectedChallenge.description}</p>
                   {/* <div className="challenge-image-popup">
                        <img src={selectedChallenge.image} alt={`Challenge image`} />
                    </div>*/}
                    <button className="start-button different-color" onClick={() => handleStartChallenge(selectedChallenge)}>START CHALLENGE</button>
                </div>
            )}
        </div>
        </>
    );
};

export default Challenges;
