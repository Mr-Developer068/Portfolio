import { useGSAP } from '@gsap/react'
import { useTexture } from '@react-three/drei'
import React, { useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import * as THREE from "three"



const vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;

        gl_Position = projectionMatrix
            * modelViewMatrix
            * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform sampler2D uTexture;
    varying vec2 vUv;

    void main() {
        vec4 texColor = texture2D(uTexture, vUv);

        // Preserve the original texture colors
        vec3 color = texColor.rgb;

        // Richer contrast
        color = (color - 0.5) * 1.10 + 0.5;

        // Slightly enhance color saturation
        float luminance = dot(
            color,
            vec3(0.299, 0.587, 0.114)
        );
        color = mix(vec3(luminance), color, 1.08);

        // Subtle premium warmth
        color *= vec3(1.025, 1.012, 0.99);

        // Soft vignette for cinematic depth
        vec2 uv = vUv * 2.0 - 1.0;
        float vignette = 1.0 - smoothstep(
            0.35,
            1.25,
            length(uv)
        );
        color *= mix(0.76, 1.0, vignette);

        // Gentle edge darkening
        float edge = min(
            min(vUv.x, 1.0 - vUv.x),
            min(vUv.y, 1.0 - vUv.y)
        );
        float edgeShade = smoothstep(0.0, 0.025, edge);
        color *= mix(0.94, 1.0, edgeShade);

        color = clamp(color, 0.0, 1.0);

        gl_FragColor = vec4(color, texColor.a);
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
    }), [texture])


    useFrame((state, delta) => {
        if (!meshRef.current) return
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
