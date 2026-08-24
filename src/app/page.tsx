export default function HomePage() {
  return (
    <section
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-forest-50)" }}
    >
      <div className="text-center max-w-lg">
        <p
          className="text-base leading-relaxed"
          style={{ color: "var(--color-stone-600)" }}
        >
          A premium mountain experience is on its way.
          <br />
          The full landing page will be built here.
        </p>
      </div>
    </section>
  );
}
