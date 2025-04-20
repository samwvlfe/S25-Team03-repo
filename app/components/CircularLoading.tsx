import React, { ReactElement } from 'react';

/* This is way more involved than it needs to be.
Sam was right, I have too much time on my hands. - Will */
export default function CircularLoading() {
    // Max % height that a star can be.
    const MAX_STAR_HEIGHT:number = 8;

    // The initial % height of a planet's orbit and the gap to the next orbit.
    const ORBIT_INITIAL_HEIGHT:number = 20;
    const ORBIT_GAP:number = 15;

    // The constraints on a planet's size.
    const PLANET_MIN_VARIANCE:number = 20;
    const PLANET_MAX_VARIANCE:number = 40;

    // This will normalize the planet's size so they stay consistent.
    const PLANET_NORMALIZE:number = ORBIT_INITIAL_HEIGHT / (ORBIT_GAP + ORBIT_INITIAL_HEIGHT);

    // How much time the quickest orbit should take.
    const ORBIT_TIME = 2;

    // How many planets to create.
    const ORBIT_NUMBER:number = 4;

    // Creating the star of the solar system.
    const Star = () => {
       return (<div className="star" style={{ height: `${MAX_STAR_HEIGHT}%`, }}/>);
    };

    return (
        <div className="solar-system">
            <Star />
            {Array.from({ length: ORBIT_NUMBER }, (_, i) => {
                // Setting the orbit's size.
                const orbitHeight:number = ORBIT_INITIAL_HEIGHT + i * ORBIT_GAP;
                
                // Setting the planet's size.
                const planetVar:number = Math.floor(Math.random() * (PLANET_MAX_VARIANCE - PLANET_MIN_VARIANCE + 1)) + PLANET_MIN_VARIANCE;
                const normPlanetHeight:number = planetVar * (PLANET_NORMALIZE / (++i));
                return (
                    <div key={i} className="orbit-outline" style={{ height: `${orbitHeight}%`, animationDuration: `${(ORBIT_TIME + i)}s` }}>
                        <div className="planet" style={{ height: `${normPlanetHeight}%`, animationDuration: `${ORBIT_TIME + i}s`}}/>
                    </div>
                );
            })}
        </div>
    )
}