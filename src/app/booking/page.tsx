"use client";
import { useState } from "react";

export default function BookingPage() {
  const [step, setStep] = useState(1);

  return (
    <main className="min-h-screen pt-24 pb-16 bg-[var(--color-bg)]">
      <section className="px-4 py-12 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-forest-900)" }}>
          Reserve Your Stay
        </h1>
        <p className="text-lg text-stone-600 mb-8">
          Complete the details below to secure your mountain getaway.
        </p>

        <div className="flex items-center justify-center max-w-md mx-auto mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s ? 'bg-[var(--color-forest-800)] text-white' : 'bg-stone-200 text-stone-500'
                }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 mx-2 rounded ${step > s ? 'bg-[var(--color-forest-800)]' : 'bg-stone-200'
                  }`} />
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">

          <div className="lg:w-2/3">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-[var(--color-border)]">

              <div className="mb-12">
                <h3 className="text-xl font-bold mb-6 text-[var(--color-forest-900)] flex items-center">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-forest-100)] text-[var(--color-forest-800)] flex items-center justify-center text-xs mr-3">1</span>
                  Stay Details
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Select Accommodation</label>
                    <select className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none transition-colors">
                      <option>Cabin House - ₱3,500/night</option>
                      <option>Pinetree House - ₱4,200/night</option>
                      <option>Mountain View Cottage - ₱5,500/night</option>
                      <option>Forest Haven House - ₱7,800/night</option>
                      <option>Evergreen Family Villa - ₱12,000/night</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Check-in Date</label>
                      <input type="date" className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Check-out Date</label>
                      <input type="date" className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="col-span-2 md:col-span-2">
                      <label className="block text-sm font-medium text-stone-700 mb-2">Adults</label>
                      <select className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none">
                        {[1, 2, 3, 4, 5, 6].map(n => <option key={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 md:col-span-2">
                      <label className="block text-sm font-medium text-stone-700 mb-2">Children</label>
                      <select className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none">
                        {[0, 1, 2, 3, 4].map(n => <option key={n}>{n}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8 pt-8 border-t border-[var(--color-border)]">
                <h3 className="text-xl font-bold mb-6 text-[var(--color-forest-900)] flex items-center">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-forest-100)] text-[var(--color-forest-800)] flex items-center justify-center text-xs mr-3">2</span>
                  Guest Information
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">First Name</label>
                      <input type="text" placeholder="John" className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Last Name</label>
                      <input type="text" placeholder="Doe" className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Email Address</label>
                      <input type="email" placeholder="john@example.com" className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-2">Phone Number</label>
                      <input type="tel" placeholder="+63 912 345 6789" className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-2">Special Requests (Optional)</label>
                    <textarea
                      rows={4}
                      placeholder="Any dietary requirements or special arrangements?"
                      className="w-full border-stone-300 rounded-lg p-3 border focus:ring-[var(--color-forest-500)] focus:border-[var(--color-forest-500)] outline-none resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[var(--color-border)] sticky top-24">
              <h3 className="text-xl font-bold mb-6 text-[var(--color-forest-900)] border-b border-[var(--color-border)] pb-4">
                Booking Summary
              </h3>

              <div className="mb-6">
                <img
                  src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80"
                  alt="Cabin House"
                  className="w-full h-40 object-cover rounded-xl mb-4" />
                <h4 className="font-bold text-lg text-stone-800">Cabin House</h4>
                <div className="flex items-center text-sm text-stone-500 mt-1">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  2 Adults, 0 Children
                </div>
              </div>

              <div className="space-y-4 text-sm mb-6 border-b border-[var(--color-border)] pb-6">
                <div className="flex justify-between">
                  <span className="text-stone-600">Check-in</span>
                  <span className="font-semibold text-stone-800">Oct 15, 2026 (2:00 PM)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Check-out</span>
                  <span className="font-semibold text-stone-800">Oct 17, 2026 (12:00 NN)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Length of stay</span>
                  <span className="font-semibold text-stone-800">2 Nights</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 border-b border-[var(--color-border)] pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">₱3,500 x 2 nights</span>
                  <span className="font-medium text-stone-800">₱7,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Taxes & Fees</span>
                  <span className="font-medium text-stone-800">₱840</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg text-stone-800">Total Price</span>
                <span className="font-bold text-2xl text-[var(--color-forest-900)]">₱7,840</span>
              </div>

              <button className="w-full bg-[var(--color-forest-800)] text-white py-4 rounded-xl font-bold text-lg hover:bg-[var(--color-forest-700)] transition-colors shadow-lg hover:shadow-xl active:scale-[0.98]">
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}