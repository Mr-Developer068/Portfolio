import { useGSAP } from '@gsap/react'
import { useTexture } from '@react-three/drei'
import React, { useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from "three"



const vertexShader = `
    void main(){
        gl_Position=projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D uTexture;
    void main(){
        gl_FragColor=vec4(0.0,0.0,1.0,1.0);
    }
`;


const Card = ({
    project,
    index,
    hoveredIndex,
    setHoveredIndex,
    position,
    baseRotationY = 0,
    windStrength,
}) => {

    const texture = useTexture(project.thumbnail)
    const meshRef = useRef(null)
    const windRotationRef = useRef(0)
    const windOffsetRef = useRef(0)

    const navigate = useNavigate()

    const { contextSafe } = useGSAP(() => { }, { scope: meshRef })

    const [width, height] = useMemo(() => {

        const img = texture.image
        const aspect = img.width / img.height

        const maxHeight = 2.5
        return [maxHeight * aspect, maxHeight]

    }, [texture])

    const hoverItUp = contextSafe((e) => {
        e.stopPropagation();
        setHoveredIndex(index);
        document.body.style.cursor = 'pointer';
        gsap.to(meshRef.current.rotation, {
            y: baseRotationY + 0.25,
            duration: 0.65,
            ease: 'power2.out'
        })
        gsap.to(meshRef.current.scale, {
            x: 1.04,
            y: 1.04,
            z: 1.04,
            duration: 0.55,
            ease: 'power2.out'
        })
    })

    const hoverItDown = contextSafe(() => {
        setHoveredIndex(null)
        document.body.style.cursor = 'default'

        gsap.to(meshRef.current.rotation, {
            y: baseRotationY,
            duration: 0.5,
            ease: 'power2.out'
        })

        gsap.to(meshRef.current.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            ease: 'power2.out'
        })
    })

    const handleCardClick = (e) => {
        e.stopPropagation();
        navigate(`/project/${project.slug}`)
    }

    const uniform = useMemo(() => ({
        uTexture: { value: texture },
        uWind: { value: 0 },
        uHover: { value: 0 },
        uTime: { value: 0 },
    }), [texture])


    useFrame((state, delta) => {
        if (!meshRef.current) return

        const isHovered = hoveredIndex === index

        // Read shared scroll wind from Deck
        const targetWind = windStrength?.current ?? 0

        // Smooth shader response
        uniform.uWind.value +=
            (targetWind - uniform.uWind.value) *
            Math.min(1, delta * 7)

        // Hover creates a stronger paper curl
        const targetHover = isHovered ? 1 : 0

        uniform.uHover.value +=
            (targetHover - uniform.uHover.value) *
            Math.min(1, delta * 6)

        uniform.uTime.value = state.clock.elapsedTime
    })
    return (
        <>
            <mesh
                ref={meshRef}
                position={position}
                rotation-y={baseRotationY}
                onPointerOver={hoverItUp}
                onPointerLeave={hoverItDown}
                onClick={handleCardClick}
            >
                <planeGeometry args={[width, height, 32, 32]} />
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniform}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </>
    )
}

export default Card
