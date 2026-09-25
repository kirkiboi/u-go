import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebook,
    faInstagram,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
    return (
        <footer
            className="px-6 pt-16 pb-8"
            style={{
                backgroundColor: "var(--color-forest-950)",
                color: "white",
            }}>
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
                    <div className="lg:col-span-2">
                        <a
                            href="/"
                            className="inline-flex flex-col leading-tight">
                            <span
                                className="text-[10px] font-semibold uppercase tracking-[0.25em]"
                                style={{
                                    color: "var(--color-forest-300)",
                                }}>
                                U-Go Mountain Resort
                            </span>

                            <span
                                className="mt-1 text-2xl font-semibold"
                                style={{
                                    fontFamily: "var(--font-display)",
                                }}>
                                Home &amp; Retreat
                            </span>
                        </a>
                        <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">
                            A peaceful mountain escape in Valencia City,
                            Bukidnon. Come for the scenery, stay for the
                            experience.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                            Explore
                        </h3>

                        <nav className="mt-5 flex flex-col gap-3">
                            <a
                                href="#rooms"
                                className="text-sm text-white/60 transition-colors duration-200 hover:text-white">
                                Rooms
                            </a>
                            <a
                                href="#amenities"
                                className="text-sm text-white/60 transition-colors duration-200 hover:text-white">
                                Amenities
                            </a>
                            <a
                                href="#location"
                                className="text-sm text-white/60 transition-colors duration-200 hover:text-white">
                                Location
                            </a>
                            <a
                                href="#booking"
                                className="text-sm text-white/60 transition-colors duration-200 hover:text-white">
                                Book a Cottage
                            </a>
                        </nav>
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                            Visit Us
                        </h3>
                        <div className="mt-5 space-y-4">
                            <div className="flex gap-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.8}
                                    stroke="currentColor"
                                    className="mt-0.5 h-5 w-5 shrink-0"
                                    style={{
                                        color: "var(--color-forest-300)",
                                    }}>
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11Z" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                </svg>

                                <p className="text-sm leading-relaxed text-white/60">
                                    Brgy. Lourdes,
                                    Valencia City, Bukidnon
                                    8709
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <a
                                    href="#"
                                    aria-label="Facebook"
                                    className="flex h-9 w-9 items-center justify-center 
                                    rounded-full border border-white/15 text-white/60 transition-all duration-200 
                                    hover:border-white/30 hover:text-white">
                                    <FontAwesomeIcon icon={faFacebook} />
                                </a>
                                <a
                                    href="#"
                                    aria-label="Instagram"
                                    className="flex h-9 w-9 items-center justify-center 
                                    rounded-full border border-white/15 text-white/60 transition-all duration-200 
                                    hover:border-white/30 hover:text-white">
                                    <FontAwesomeIcon icon={faInstagram} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-14 border-t border-white/10 pt-6">
                    <div className="flex flex-col gap-3 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
                        <p>
                            © {new Date().getFullYear()} U-Go Mountain Resort.
                            All rights reserved.
                        </p>
                        <p>
                            Valencia City, Bukidnon
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}