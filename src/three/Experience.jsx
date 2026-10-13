import React from 'react'
import Deck from './Deck'
import projects from '../data/projects'

const Experience = () => {
    return (
        <>
            <Deck projects={projects} />
        </>
    )
}

export default Experience
