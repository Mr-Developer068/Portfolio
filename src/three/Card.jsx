import { useGSAP } from '@gsap/react'
import { useTexture } from '@react-three/drei'
import React, { useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import * as THREE from "three"


const vertexShader = `
    varying vec2 vUv;
    void main(){
        vUv=uv;
        gl_Position=projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D uTexture;
    varying vec2 vUv;
    void main(){
        vec4 texture=texture2D(uTexture,vUv);
        gl_FragColor=texture;
    }
`;


const Card = ({
    project,
    index,
    hoveredIndex,
    setHoveredIndex,
    position,
    baseRotationY = 0
}) => {

    const texture = useTexture(project.thumbnail)
    const meshRef = useRef(null)

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
            y: 1.08,
            x: 1.08,
            z: 1.08,
            duration: 0.65,
            ease: 'power2.out'
        })
    })

    const hoverItDown = contextSafe(() => {
        setHoveredIndex(null);
        gsap.to(meshRef.current.rotation, {
            y: baseRotationY,
            duration: 0.5,
            ease: 'power2.out'
        })
        gsap.to(meshRef.current.scale, {
            y: 1,
            x: 1,
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
    }))

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
                <planeGeometry args={[width, height]} />
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
