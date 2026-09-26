"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (email === "admin@gmail.com" && password === "password") {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg relative py-20 px-4 sm:px-6 lg:px-8 z-[100]">
      <div className="fixed inset-0 bg-bg z-[100]"></div>
      <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-2xl shadow-xl border border-border relative z-[101]">
        <div>
          <div className="flex flex-col items-center justify-center text-center">
            <span
              className="text-[10px] font-semibold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-forest-500)" }}>
              U-GO Cliff Resort
            </span>
            <h2
              className="mt-2 text-3xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display)", color: "var(--color-forest-900)" }}>
              Admin Portal
            </h2>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-border rounded-lg text-sm focus:ring-forest-400 focus:border-forest-400 transition-colors"
                style={{
                  outlineColor: "var(--color-forest-400)",
                }}
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-border px-4 py-2 pr-16 text-sm focus:border-forest-400 focus:ring-forest-400"
                  style={{
                    outlineColor: "var(--color-forest-400)",
                  }}
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium cursor-pointer"
                  style={{
                    color: "var(--color-forest-600)",
                  }}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border text-forest-600 focus:ring-forest-500"
                style={{
                  accentColor: "var(--color-forest-500)",
                }}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-muted">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                href="#"
                className="font-medium text-forest-600 hover:text-forest-500 transition-colors"
                style={{ color: "var(--color-forest-600)" }}
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, var(--color-forest-600), var(--color-forest-800))",
              }}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
