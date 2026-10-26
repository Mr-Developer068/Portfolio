
import React, { useEffect, useRef, useState } from 'react'
import Card from './Card'
import { useFrame } from '@react-three/fiber'

const TILT_Y = -0.35
const RADIUS = 5

const AUTO_SPEED = 0.25
const WHEEL_SENSITIVITY = 0.0015
const DAMPING = 3.0

const Deck = ({ projects }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    const groupRef = useRef(null)
    const velocityRef = useRef(0)
    const hoveredRef = useRef(null)

    // Wind physics
    const windRef = useRef(0)
    const windTargetRef = useRef(0)

    useEffect(() => {
        hoveredRef.current = hoveredIndex
    }, [hoveredIndex])

    useEffect(() => {
        const onWheel = (e) => {
            e.preventDefault()

            if (hoveredRef.current !== null) return

            const scrollForce = e.deltaY * WHEEL_SENSITIVITY

            velocityRef.current += scrollForce

            // Scroll creates a gust of wind
            windTargetRef.current = Math.max(
                -1,
                Math.min(1, scrollForce * 3)
            )
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

        // Recover gracefully when hovering
        if (hoveredRef.current !== null) {
            velocityRef.current = 0
            windTargetRef.current = 0
        }

        // Wind quickly settles back to calm
        windTargetRef.current *= Math.exp(-2.5 * delta)

        windRef.current +=
            (windTargetRef.current - windRef.current) *
            Math.min(1, delta * 5)

        velocityRef.current *= Math.exp(-DAMPING * delta)

        const rotationSpeed =
            AUTO_SPEED + velocityRef.current

        groupRef.current.rotation.y += rotationSpeed * delta

        // Wind subtly rocks the whole deck
        groupRef.current.rotation.x +=
            (
                windRef.current * 0.10 -
                groupRef.current.rotation.x
            ) * Math.min(1, delta * 3)

        groupRef.current.rotation.z +=
            (
                -windRef.current * 0.06 -
                groupRef.current.rotation.z
            ) * Math.min(1, delta * 3)

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
                        windStrength={windRef}
                    />
                )
            })}
        </group>
    )
}

export default Deck
