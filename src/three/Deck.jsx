import React, { useState } from 'react'
import Card from './Card'

const TILT_Y = -0.35;
const SPACING = 3.2;
const AUTO_SPEED = 0.6;
const WHEEL_SENSITIVITY = 0.0015;

const DAMPING = 0.0008


const Deck = ({ projects }) => {

    const [hoveredIndex, setHoveredIndex] = useState(null)

    return (
        <group>
            {projects.map((project, idx) => {
                return <Card
                    key={project.id}
                    project={project}
                    index={idx}
                    hoveredIndex={hoveredIndex}
                    setHoveredIndex={setHoveredIndex}
                    baseRotationY={TILT_Y}
                />
            })}
        </group>
    )
}

export default Deck
