export default function Hero() {
    return (
        <section className="relative min-h-[calc(100vh-4rem)] 
                                flex items-end 
                                justify-center 
                                px-4 
                                pb-30
                                bg-[url('/images/ugo_cabinsandbonfire.jpg')]
                                bg-cover
                                bg-center
                                bg-no-repeat">
            <div className="text-center 
                            max-w-lg">
                <button
                    className="px-6 
                                py-3 
                                text-white 
                                rounded-full"
                    style={{
                        backgroundColor: "var(--color-forest-800)",
                    }}
                >
                    Take a stroll
                </button>
            </div>
            <button
                className="absolute 
                           bottom-8 
                           left-1/2 
                           -translate-x-1/2 
                           animate-bounce 
                           text-white 
                           text-4xl"
                aria-label="Scroll to discover more"
                style={{
                    color: "var(--color-forest-800)",
                }}
            >
                ↓
            </button>
        </section>
    )
}