import React, { useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import DeveloperText from './Developer3DText'



const IntroScreen = ({ setIntroDone, introDone }) => {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d', { alpha: false })

        if (!ctx) return

        // Keep rendering costs under control on high-DPI displays.
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

        let width = 0
        let height = 0
        let animationId = 0
        let stars = []
        let twinklingStars = []
        let mouseX = 0
        let mouseY = 0
        let currentX = 0
        let currentY = 0

        const PARALLAX_STRENGTH = 14
        const SMOOTHNESS = 0.045

        const reducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        )

        // A separate canvas stores stars that never move.
        // The main canvas only redraws these with one drawImage call.
        const starLayer = document.createElement('canvas')
        const starCtx = starLayer.getContext('2d')

        if (!starCtx) return

        const random = (min, max) =>
            Math.random() * (max - min) + min

        const createStars = () => {
            width = window.innerWidth
            height = window.innerHeight

            canvas.width = Math.round(width * dpr)
            canvas.height = Math.round(height * dpr)

            canvas.style.width = `${width}px`
            canvas.style.height = `${height}px`

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            ctx.fillStyle = '#030305'
            ctx.fillRect(0, 0, width, height)

            starLayer.width = canvas.width
            starLayer.height = canvas.height
            starCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

            // Scale the star count with screen size, with a hard cap.
            const count = Math.min(
                7000,
                Math.max(5000, Math.floor((width * height) / 1800))
            )

            stars = Array.from({ length: count }, () => ({
                x: random(0, width),
                y: random(0, height),
                radius: Math.random() < 0.92
                    ? random(0.35, 0.85)
                    : random(0.9, 1.3),
                alpha: random(0.25, 0.85),
                tint: Math.random() < 0.12
                    ? '#b9c9ff'
                    : '#ffffff',
            }))

            // Draw the static stars once.
            starCtx.fillStyle = '#030305'
            starCtx.fillRect(0, 0, width, height)

            for (const star of stars) {
                starCtx.globalAlpha = star.alpha
                starCtx.fillStyle = star.tint
                starCtx.beginPath()
                starCtx.arc(
                    star.x,
                    star.y,
                    star.radius,
                    0,
                    Math.PI * 2
                )
                starCtx.fill()
            }

            starCtx.globalAlpha = 1

            // Animate only a small fraction of the stars.
            twinklingStars = stars
                .filter(() => Math.random() < 0.045)
                .map((star) => ({
                    ...star,
                    phase: random(0, Math.PI * 2),
                    speed: random(0.5, 1.4),
                    amplitude: random(0.15, 0.45),
                }))
        }

        const handleMouseMove = (e) => {
            mouseX = (e.clientX / window.innerWidth - 0.5) * 2
            mouseY = (e.clientY / window.innerHeight - 0.5) * 2
        }

        const handleMouseLeave = () => {
            mouseX = 0
            mouseY = 0
        }

        const render = (time = 0) => {
            if (
                !canvas.width ||
                !canvas.height ||
                !starLayer.width ||
                !starLayer.height
            ) {
                return
            }

            // Smoothly interpolate toward the mouse position
            currentX += (mouseX - currentX) * SMOOTHNESS
            currentY += (mouseY - currentY) * SMOOTHNESS

            // Clear the viewport
            ctx.fillStyle = '#030305'
            ctx.fillRect(0, 0, width, height)

            // Move the starfield subtly in the opposite direction
            const offsetX = -currentX * PARALLAX_STRENGTH
            const offsetY = -currentY * PARALLAX_STRENGTH

            ctx.drawImage(
                starLayer,
                0, 0, starLayer.width, starLayer.height,
                offsetX, offsetY, width, height
            )

            if (!reducedMotion.matches) {
                const seconds = time * 0.001

                for (const star of twinklingStars) {
                    const twinkle =
                        0.65 +
                        Math.sin(seconds * star.speed + star.phase) *
                        star.amplitude

                    ctx.globalAlpha = Math.max(0.1, Math.min(1, twinkle))
                    ctx.fillStyle = star.tint

                    ctx.beginPath()
                    ctx.arc(
                        star.x + offsetX,
                        star.y + offsetY,
                        star.radius,
                        0,
                        Math.PI * 2
                    )
                    ctx.fill()
                }
            }

            ctx.globalAlpha = 1
            animationId = requestAnimationFrame(render)
        }

        const start = () => {
            cancelAnimationFrame(animationId)

            if (
                canvas.width === 0 ||
                canvas.height === 0 ||
                starLayer.width === 0 ||
                starLayer.height === 0
            ) {
                return
            }

            animationId = requestAnimationFrame(render)
        }

        const handleResize = () => {
            createStars()
            start()
        }

        createStars()
        start()

        window.addEventListener('resize', handleResize)
        reducedMotion.addEventListener('change', start)

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('mouseleave', handleMouseLeave)

        return () => {
            cancelAnimationFrame(animationId)
            window.removeEventListener('resize', handleResize)
            reducedMotion.removeEventListener('change', start)

            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('mouseleave', handleMouseLeave)

            starLayer.width = 0
            starLayer.height = 0
        }
    }, [])


    return (
        <section className="intro-section relative h-[400vh] bg-[#030305]">
            <div className="sticky top-0 h-dvh w-full overflow-hidden">
                {/* Starfield background */}
                <canvas
                    ref={canvasRef}
                    aria-hidden="true"
                    className="absolute inset-0 z-0 block h-full w-full"
                />

                {/* 3D typography */}
                <div className="absolute inset-0 z-10 w-full">
                    <Canvas
                        camera={{ position: [0, 0, 7], fov: 45 }}
                        dpr={[1, 1.5]}
                        gl={{ alpha: true, antialias: true }}
                    >
                        <ambientLight intensity={1.2} />

                        <directionalLight
                            position={[-4, 4, 2]}
                            intensity={2.5}
                        />

                        <pointLight
                            position={[-3, 1, 3]}
                            intensity={20}
                            color="#F5C56B"
                        />

                        <DeveloperText setIntroDone={setIntroDone} introDone={introDone} />
                    </Canvas>
                </div>
            </div>
        </section>
    )

}

export default IntroScreen
