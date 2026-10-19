function PageHeader({ title, subtitle }) {
    return (
        <header className="mb-8">
            <p className="mb-2 font-sans text-xs uppercase tracking-[0.2em] text-ink-muted">
                Ink & Soul / Your space
            </p>
            <h1 className="font-display text-4xl font-medium text-ink md:text-5xl">
                {title}
            </h1>

            <p className="mt-3 max-w-xl font-reading text-base leading-7 text-ink-brown">
                {subtitle}
            </p>
        </header>
    )
}

export default PageHeader