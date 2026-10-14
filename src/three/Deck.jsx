import React, { useEffect, useRef, useState } from 'react'
import Card from './Card'
import { useFrame } from '@react-three/fiber'

const TILT_Y = -0.35
const RADIUS = 5

const AUTO_SPEED = 0.25          // radians per second
const WHEEL_SENSITIVITY = 0.0015
const DAMPING = 3.0

const Deck = ({ projects }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const groupRef = useRef(null)
    const velocityRef = useRef(0)
    const hoveredRef = useRef(null)

    useEffect(() => {
        hoveredRef.current = hoveredIndex
    }, [hoveredIndex])

    useEffect(() => {
        const onWheel = (e) => {
            e.preventDefault()

            if (hoveredRef.current !== null) return

            // Add scroll momentum to the current velocity
            velocityRef.current +=
                e.deltaY * WHEEL_SENSITIVITY
        }

        window.addEventListener('wheel', onWheel, {
            passive: false,
        })

        return () => {
            window.removeEventListener('wheel', onWheel)
        }
    }, [])

    useFrame((state, delta) => {
        if (!groupRef.current) return

        // Freeze everything while hovering a card
        if (hoveredRef.current !== null) {
            velocityRef.current = 0
            return
        }

        // Smoothly decay wheel momentum
        velocityRef.current *= Math.exp(-DAMPING * delta)

        // Combine automatic rotation with wheel momentum
        const rotationSpeed =
            AUTO_SPEED + velocityRef.current

        groupRef.current.rotation.y +=
            rotationSpeed * delta

        // Remove negligible wheel momentum
        if (Math.abs(velocityRef.current) < 0.001) {
            velocityRef.current = 0
        }
    })

    const totalCards = projects.length

    return (
        <group ref={groupRef}>
            {projects.map((project, idx) => {
                const angle =
                    (idx / totalCards) * Math.PI * 2

                const x = Math.sin(angle) * RADIUS
                const z = Math.cos(angle) * RADIUS

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
