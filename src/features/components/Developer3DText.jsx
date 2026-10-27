
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

export default function DeveloperText({ setIntroDone, introDone }) {
    const letterRefs = useRef([])
    const rootRef = useRef(null)

    const wordGroupRef = useRef(null)

    const font = useFont(FONT_URL)

    const { viewport, size } = useThree()
    // Responsive sizing based on the actual rendered canvas.
    const isMobile = size.width < 640
    const isTablet = size.width >= 640 && size.width < 1024


    const LETTER_GAP = isMobile ? 0.02 : 0.035
    const TEXT_SIZE = isMobile ? 0.72 : 0.85
    const TEXT_DEPTH = isMobile ? 0.08 : 0.12

    const responsiveScale = Math.min(
        1,
        viewport.width / (isMobile ? 9 : isTablet ? 11 : 12),
        viewport.height / 5.5
    )

    const targetY = viewport.height * (isMobile ? 0.22 : 0.3)
    const targetX = viewport.width * (isMobile ? 0 : 0.1)
    const wordGap = isMobile ? 0.5 : isTablet ? 1.5 : 2.6

    const developerX = TEXT_SIZE + wordGap

    console.log("this is size->", developerX)


    useLayoutEffect(() => {
        const letters = letterRefs.current.filter(Boolean)
        const section = document.querySelector('.intro-section')

        if (!letters.length || !section || !wordGroupRef.current) {
            console.error('Animation setup failed:', {
                letters: letters.length,
                sectionFound: Boolean(section),
                wordGroupFound: Boolean(wordGroupRef.current),
            })
            return
        }

        const context = gsap.context(() => {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: () => `+=${Math.max(1800, window.innerHeight * 2.5)}`,
                    scrub: 3,
                    invalidateOnRefresh: true,
                    // markers: true,

                    onLeave: () => {
                        console.log('INTRO COMPLETE: switching to Hero')
                        setIntroDone(true)
                    },
                },
            })

            const letterDelay = 3
            const growDuration = 2.5
            const rotateDuration = 3
            const settleDuration = 2

            letters.forEach((letter, index) => {
                const startTime = index * letterDelay

                timeline.to(letter.scale, {
                    x: 2,
                    y: 2,
                    z: 2,
                    duration: growDuration,
                    ease: 'power1.inOut',
                }, startTime)

                timeline.to(letter.rotation, {
                    x: Math.PI * 0.8,
                    y: Math.PI * 0.2,
                    z: Math.PI * 0.4,
                    duration: rotateDuration,
                    ease: 'power1.inOut',
                }, startTime)

                timeline.to(letter.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: settleDuration,
                    ease: 'power1.inOut',
                }, startTime + growDuration)

                timeline.to(letter.rotation, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: settleDuration,
                    ease: 'power1.inOut',
                }, startTime + rotateDuration)
            })

            timeline.to(wordGroupRef.current.scale, {
                x: 0.5,
                y: 0.5,
                z: 0.5,
                duration: 8,
                ease: 'none',
            }, '>')

            timeline.to(wordGroupRef.current.position, {
                y: targetY,
                x: targetX,
                duration: 8,
                ease: 'none',
            }, '<')
        })

        return () => context.revert()
    }, [
        setIntroDone,
        targetY,
        targetX,
        responsiveScale,
        wordGap,
        LETTER_GAP,
        TEXT_SIZE,
        TEXT_DEPTH,
    ])

    console.log("this is developer text-->", introDone)

    return (
        <group ref={rootRef} scale={responsiveScale}>
            <Float
                speed={1}
                rotationIntensity={0.02}
                floatIntensity={0.06}
            >
                <Center>
                    <group ref={wordGroupRef}>
                        <AnimatedWord
                            text="Mr."
                            font={font}
                            size={TEXT_SIZE}
                            depth={TEXT_DEPTH}
                            gap={LETTER_GAP}
                            startIndex={0}
                            refs={letterRefs}
                        />

                        <group
                            position={
                                developerX > 3
                                    ? [developerX, 0, 0]       // Desktop: same line
                                    : [0, -TEXT_SIZE * 1.5, 0] // Small screens: below Mr.
                            }
                        >
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
