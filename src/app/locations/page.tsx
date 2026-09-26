export default function LocationPage() {
  return (
    <main className="min-h-screen pt-24 pb-16 bg-[var(--color-bg)]">
      <section className="px-4 py-16 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-forest-900)" }}>
          Find Your Escape
        </h1>
        <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Tucked away in the serene mountains of Bukidnon, U-Go Mountain Resort is your perfect sanctuary from the bustling city.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2">
          <div className="relative min-h-[420px] overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=7.8932551,124.9656661&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="UGO Cliff Resort Bukidnon location"
              className="absolute inset-0 h-full w-full" />
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
            <p
              className="text-xs font-semibold uppercase tracking-[0.2em]"
              style={{
                color: "var(--color-forest-600)",
              }}>
              U-Go Mountain Resort
            </p>
            <h3
              className="mt-3 text-3xl font-semibold md:text-4xl"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--color-forest-900)",
              }}>
              Escape to the mountains.
            </h3>
            <p
              className="mt-5 text-sm leading-relaxed"
              style={{
                color: "var(--color-stone-600)",
              }}>
              Our resort is located in Brgy. Lourdes,
              Valencia City, Bukidnon, surrounded by peaceful
              mountain scenery and nature.
            </p>
            <div
              className="mt-8 flex gap-4 border-t pt-6"
              style={{
                borderColor: "var(--color-border)",
              }}>
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{
                  backgroundColor:
                    "var(--color-forest-100)",
                }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="h-5 w-5"
                  style={{
                    color: "var(--color-forest-700)",
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
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{
                    color: "var(--color-stone-500)",
                  }}>
                  Address
                </p>
                <p
                  className="mt-1 text-sm leading-relaxed"
                  style={{
                    color: "var(--color-stone-800)",
                  }}>
                  Brgy. Lourdes, Valencia City,
                  <br />
                  Bukidnon, 8709
                </p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{
                  backgroundColor:
                    "var(--color-forest-100)",
                }}>
                  <svg className="w-6 h-6 text-[var(--color-forest-600)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wide"
                    style={{
                      color: "var(--color-stone-500)",
                    }}>
                    Coordinates
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed"
                    style={{
                      color: "var(--color-stone-800)",
                    }}>
                    7.8932551, 124.9656661
                  </p>
                </div>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=7.8932551,124.9656661"
              target="_blank"
              className="group mt-8 inline-flex w-fit items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110"
              style={{
                backgroundColor:
                  "var(--color-forest-800)",
              }}>
              <span>Get Directions</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6" style={{ fontFamily: "var(--font-display)", color: "var(--color-forest-900)" }}>
              The Surrounding Beauty
            </h3>
            <p className="text-stone-600 mb-6 leading-relaxed">
              Located in the heart of Bukidnon, U-Go Mountain Resort offers a perfect starting point to explore the province's natural wonders.
            </p>
            <p className="text-stone-600 mb-8 leading-relaxed">
              Whether you're taking a scenic drive through the winding mountain roads or visiting nearby agricultural attractions, every moment in Valencia City brings you closer to nature.
            </p>

            <div className="space-y-4">
              <h4 className="font-semibold text-[var(--color-forest-900)]">Nearby Points of Interest:</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[var(--color-forest-500)] mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-stone-700">Lake Apo <span className="text-stone-400 text-sm ml-2">(45 mins drive)</span></span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[var(--color-forest-500)] mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-stone-700">Valencia City Center <span className="text-stone-400 text-sm ml-2">(20 mins drive)</span></span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-[var(--color-forest-500)] mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-stone-700">Local Pine Forest Trails <span className="text-stone-400 text-sm ml-2">(10 mins drive)</span></span>
                </li>
              </ul>
            </div>
          </div>
          <div className="h-[500px] rounded-3xl overflow-hidden shadow-lg relative">
            <img
              src="images/test1.jpg"
              alt="Mountain road landscape"
              className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </section>
    </main>
  );
}