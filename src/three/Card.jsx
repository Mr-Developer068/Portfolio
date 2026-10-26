import { useGSAP } from '@gsap/react'
import { useTexture } from '@react-three/drei'
import React, { useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from "three"



const vertexShader = `
    varying vec2 vUv;

    uniform float uWind;
    uniform float uHover;
    uniform float uTime;

    void main() {
        vUv = uv;

        vec3 transformed = position;

        // Normalized horizontal coordinate: -1 to 1
        float x = uv.x * 2.0 - 1.0;

        // Bell-shaped curve: strongest at the center,
        // fading smoothly toward both edges
        float bell = exp(-x * x * 4.0);

        // Strongest deformation around the middle
        // of the card's height
        float verticalCurve = sin(uv.y * 3.14159265);

        // Hover curl and directional scroll gust
        float bend = uHover * 0.24 + uWind * 0.40;

        // A subtle traveling ripple during a gust
        float ripple = sin(
            uv.y * 6.2831853 - uTime * 3.0
        ) * abs(uWind) * 0.025;

        transformed.z +=
            bend * bell * verticalCurve + ripple * bell;

        // Slight sideways flex for a flexible-paper feel
        transformed.x +=
            x * bell * abs(bend) * 0.035;

        gl_Position = projectionMatrix *
            modelViewMatrix * vec4(transformed, 1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D uTexture;
    varying vec2 vUv;

    void main() {
        vec4 color = texture2D(uTexture, vUv);
        gl_FragColor = color;
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
