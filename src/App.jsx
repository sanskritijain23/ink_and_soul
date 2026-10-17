function App() {
  return (
    <main className="min-h-screen bg-paper px-8 py-16 text-ink">
      <p className="font-sans text-xs uppercase tracking-[0.3em] text-ink-muted">
        A space of one's own
      </p>

      <h1 className="mt-5 font-display text-6xl font-medium md:text-8xl">
        Ink & Soul<span className="text-sage-ink">.</span>
      </h1>

      <p className="mt-6 max-w-lg font-reading text-lg leading-8 text-ink-brown">
        Write freely. Read slowly. Feel deeply.
      </p>

      <div className="mt-10 h-px max-w-md bg-paper-border"/>
      <p className="mt-6 font-display text-2xl italic text-sage-ink">
        Every page holds a little of who we are.
      </p>

      <button className="mt-8 rounded-full bg-sage-ink px-6 py-3 font-sans text-sm text-paper transition hover:bg-ink">
        Enter your space
      </button>
    </main>
  )
}

export default App