import { useGSAP } from '@gsap/react'
import { useTexture } from '@react-three/drei'
import React, { useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const Card = ({ project, index, hoveredIndex, setHoveredIndex, baseRotationY = 0 }) => {

    const texture = useTexture(project.thumbnail)
    const meshRef = useRef(null)

    const navigate = useNavigate()

    const { safeContext } = useGSAP(() => {

    }, { scope: meshRef })

    const [width, height] = useMemo(() => {

        const img = texture.image
        const aspect = img.width / img.height

        const maxHeight = 2.5
        return [maxHeight * aspect, maxHeight]

    }, [texture])

    const hoverItUp = safeContext((e) => {
        e.stopPropagation();
        setHoveredIndex(hoveredIndex);
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

    const hoverItDown = safeContext(() => {
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

    return (
        <>
            <mesh
                ref={meshRef}
                rotateY={baseRotationY}
                onPointerOver={hoverItUp}
                onPointerLeave={hoverItDown}
                onClick={handleCardClick}
            >
                <planeGeometry />
                <meshBasicMaterial />
            </mesh>
        </>
    )
}

export default Card
