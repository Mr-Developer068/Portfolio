import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import Experience from '../three/Experience'

const Home = () => {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-black">
            <section className="pointer-events-none absolute left-1/2 top-[12%] z-10 w-full -translate-x-1/2 px-4 text-center sm:top-[10%]">

                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.5em] text-[#D6A85F] sm:text-xs">
                    Creative Developer · Digital Experiences
                </p>

                <h1 className="select-none text-5xl font-black leading-[0.95] tracking-[-0.07em] text-white sm:text-7xl md:text-8xl lg:text-[110px]">
                    Mr<span className="text-[0.65em] text-[#D6A85F]">.</span>
                    <br className="sm:hidden" />
                    <span className="bg-gradient-to-r from-[#F5C56B] via-[#FFF1D6] to-[#D6A85F] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(245,197,107,0.15)]">
                        Developer
                    </span>
                </h1>

                <div className="mx-auto mt-6 flex items-center justify-center gap-4">
                    <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#D6A85F] sm:w-16" />

                    <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-400 sm:text-xs">
                        Turning ideas into reality
                    </p>

                    <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#D6A85F] sm:w-16" />
                </div>

            </section>
            <Canvas
                camera={{
                    position: [0, 0, 4],
                    fov: 100,
                }}
            >
                {/* <OrbitControls /> */}
                <Experience />
            </Canvas>
        </div>
    )
}

export default Home
