import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { useState } from 'react'
import Experience from '../three/Experience'
import HeroComponent from './components/HeroComponent'
import IntroScreen from './components/IntroScreen'

const Home = () => {
    const [introDone, setIntroDone] = useState(false)
    if (!introDone) {
        return (
            <>
                <IntroScreen />
            </>
        )
    }
    return (
        <>
            <HeroComponent />
        </>
    )
}

export default Home
