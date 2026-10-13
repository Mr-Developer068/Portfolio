import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import Experience from '../three/Experience'

const Home = () => {
    return (
        <div className="h-screen w-full flex items-center justify-center">
            <Canvas>
                <OrbitControls />
                <Experience />
            </Canvas>
        </div>
    )
}

export default Home
