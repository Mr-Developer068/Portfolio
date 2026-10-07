import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import Experience from '../three/Experience'

const Home = () => {
    return (
        <div>
            <Canvas>
                <OrbitControls />
                <Experience />
            </Canvas>
        </div>
    )
}

export default Home
