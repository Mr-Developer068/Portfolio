
import { useCallback, useEffect, useState } from "react";
import {
    Outlet,
    useLocation,
    useNavigate,
} from "react-router-dom";

import Strips from "../features/components/StripsAnimation/Strips";
import { MyContext } from "../context/ProjectContext";

export default function AppLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const [transition, setTransition] = useState(null);

    const handleProjectClick = useCallback((slug) => {
        setTransition({
            action: "cover",
            targetPath: `/project/${slug}`,
        });
    }, []);

    // Once navigation reaches the destination, reveal it.
    useEffect(() => {
        if (
            transition?.action === "cover" &&
            location.pathname === transition.targetPath
        ) {
            setTransition((current) => ({
                ...current,
                action: "reveal",
            }));
        }
    }, [location.pathname, transition?.action, transition?.targetPath]);

    const handleTransitionComplete = useCallback(() => {
        if (!transition) return;

        if (transition.action === "cover") {
            navigate(transition.targetPath);
        } else if (transition.action === "reveal") {
            setTransition(null);
        }
    }, [transition, navigate]);

    return (
        <MyContext.Provider value={handleProjectClick}>
            <Outlet />

            {transition && (
                <Strips
                    key={transition.action}
                    count={15}
                    action={transition.action}
                    onComplete={handleTransitionComplete}
                />
            )}
        </MyContext.Provider>
    );
}
