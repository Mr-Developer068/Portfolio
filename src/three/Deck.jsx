import React, { useState } from 'react'
import Card from './Card'

const TILT_Y = -0.35
const RADIUS = 5
const AUTO_SPEED = 0.6
const WHEEL_SENSITIVITY = 0.0015
const DAMPING = 0.0008

const Deck = ({ projects }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const totalCards = projects.length

    return (
        <group>
            {projects.map((project, idx) => {
                // Divide the full circle equally between cards
                const angle = (idx / totalCards) * Math.PI * 2

                // Position each card on the X-Z plane
                const x = Math.sin(angle) * RADIUS
                const z = Math.cos(angle) * RADIUS

                // Make the card face toward the center
                const rotationY = angle + Math.PI

                return (
                    <Card
                        key={project.id}
                        project={project}
                        index={idx}
                        hoveredIndex={hoveredIndex}
                        setHoveredIndex={setHoveredIndex}
                        position={[x, 0, z]}
                        baseRotationY={rotationY + TILT_Y}
                    />
                )
            })}
        </group>
    )
}

export default Deck