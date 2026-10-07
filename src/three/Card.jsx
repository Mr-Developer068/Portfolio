import { useTexture } from '@react-three/drei'
import React, { useMemo } from 'react'

const Card = ({ project }) => {

    const texture = useTexture(project.thumbnail)

    const [width, height] = useMemo(() => {

        const img = texture.image
        const aspect = img.width / img.height

        const maxHeight = 2.5
        return [maxHeight * aspect, maxHeight]

    }, [texture])

    return (
        <>
            <mesh>
                <planeGeometry />
                <meshBasicMaterial />
            </mesh>
        </>
    )
}

export default Card
