import { useState } from "react";
import HeroComponent from "./components/HeroComponent";
import IntroScreen from "./components/IntroScreen";

export default function Home() {
    const [introDone, setIntroDone] = useState(false);

    return introDone ? (
        <HeroComponent />
    ) : (
        <IntroScreen
            setIntroDone={setIntroDone}
            introDone={introDone}
        />
    );
}