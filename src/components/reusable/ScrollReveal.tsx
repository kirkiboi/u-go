"use client";
import { useEffect, useRef, useState } from "react";

type ScrollRevealProps = {
    children: React.ReactNode;
    className?: string;
    delay?: number;
};

export default function ScrollReveal({
    children,
    className = "",
    delay = 0,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(element);
                }
            },
            {
                threshold: 0.15,
            }
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
                } ${className}`}
            style={{
                transitionDelay: `${delay}ms`,
            }}>
            {children}
        </div>
    );
}