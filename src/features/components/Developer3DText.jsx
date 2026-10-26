
import { useLayoutEffect, useMemo, useRef } from 'react'
import { Center, Float, Text3D, useFont } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FONT_URL = '/fonts/helvetiker_bold.typeface.json'

const WORDS = [
    { text: 'Mr.', key: 'mr' },
    { text: 'Developer', key: 'developer' },
]

const LETTER_GAP = 0.035
const TEXT_SIZE = 0.85
const TEXT_DEPTH = 0.12

function AnimatedWord({ text, font, size, depth, gap, startIndex, refs }) {
    const letters = useMemo(() => {
        const result = []
        let cursor = 0

        for (let i = 0; i < text.length; i++) {
            const character = text[i]

            // Preserve spaces without rendering a visible mesh.
            if (character === ' ') {
                cursor += size * 0.35
                continue
            }

            const shapes = font.generateShapes(character, size)
            const geometry = new THREE.ShapeGeometry(shapes)
            geometry.computeBoundingBox()

            const bounds = geometry.boundingBox
            const width = bounds ? bounds.max.x - bounds.min.x : size * 0.5

            result.push({
                character,
                x: cursor - (bounds?.min.x ?? 0),
                index: startIndex + i,
            })

            cursor += width + gap
            geometry.dispose()
        }

        return {
            letters: result,
            width: Math.max(0, cursor - gap),
        }
    }, [text, font, size, gap, startIndex])

    return (
        <group position={[-letters.width / 2, 0, 0]}>
            {letters.letters.map(({ character, x, index }) => (
                <group
                    key={`${index}-${character}`}
                    position={[x, 0, 0]}
                    ref={(node) => {
                        refs.current[index] = node
                    }}
                    scale={[0, 0, 0]}
                >
                    <Text3D
                        font={FONT_URL}
                        size={size}
                        height={depth}
                        curveSegments={8}
                        bevelEnabled
                        bevelThickness={0.008}
                        bevelSize={0.005}
                        bevelSegments={2}
                    >
                        {character}
                        <meshStandardMaterial
                            color="#D6A85F"
                            metalness={0.45}
                            roughness={0.4}
                        />
                    </Text3D>
                </group>
            ))}
        </group>
    )
}

export default function DeveloperText() {
    const letterRefs = useRef([])
    const rootRef = useRef(null)
    const font = useFont(FONT_URL)
    const { viewport } = useThree()

    const scale = Math.min(1, viewport.width / 12)


    useLayoutEffect(() => {
        const letters = letterRefs.current.filter(Boolean)
        const section = document.querySelector('.intro-section')

        if (!letters.length || !section) return

        const timeDuration = 5

        const context = gsap.context(() => {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 13,
                },
            })

            const letterDelay = 3
            const growDuration = 2.5
            const rotateDuration = 3
            const settleDuration = 2

            letters.forEach((letter, index) => {
                const startTime = index * letterDelay

                // 1. Grow smoothly
                timeline.to(
                    letter.scale,
                    {
                        x: 2,
                        y: 2,
                        z: 2,
                        duration: growDuration,
                        ease: 'power1.inOut',
                    },
                    startTime
                )

                // 2. Rotate while growing
                timeline.to(
                    letter.rotation,
                    {
                        x: Math.PI * 0.8,
                        y: Math.PI * 0.2,
                        z: Math.PI * 0.4,
                        duration: rotateDuration,
                        ease: 'power1.inOut',
                    },
                    startTime
                )

                // 3. Return to normal size after growing
                timeline.to(
                    letter.scale,
                    {
                        x: 1,
                        y: 1,
                        z: 1,
                        duration: settleDuration,
                        ease: 'power1.inOut',
                    },
                    startTime + growDuration
                )

                // 4. Settle rotation after the initial rotation
                timeline.to(
                    letter.rotation,
                    {
                        x: 0,
                        y: 0,
                        z: 0,
                        duration: settleDuration,
                        ease: 'power1.inOut',
                    },
                    startTime + rotateDuration
                )
            })
        })

        return () => context.revert()
    }, [])

    return (
        <group ref={rootRef} scale={scale}>
            <Float
                speed={1}
                rotationIntensity={0.02}
                floatIntensity={0.06}
            >
                <Center>
                    <group>
                        <AnimatedWord
                            text="Mr."
                            font={font}
                            size={TEXT_SIZE}
                            depth={TEXT_DEPTH}
                            gap={LETTER_GAP}
                            startIndex={0}
                            refs={letterRefs}
                        />

                        <group position={[TEXT_SIZE + 2.6, 0, 0]}>
                            <AnimatedWord
                                text="Developer"
                                font={font}
                                size={TEXT_SIZE}
                                depth={TEXT_DEPTH}
                                gap={LETTER_GAP}
                                startIndex={3}
                                refs={letterRefs}
                            />
                        </group>
                    </group>
                </Center>
            </Float>
        </group>
    )
}
