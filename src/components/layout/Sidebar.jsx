import { BookOpen, Feather, House, Library, Quote, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
    {label: 'Home', icon: House },
    {label: 'My Writings', icon: Feather},
    {label: 'Reading Journal', icon: Library},
    {label: 'Saved Quotes', icon: Quote},
    {label: 'inspiration', icon: Sparkles },
]

function Sidebar () {
    return (
        <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-paper-border bg-paper-card px-5 py-8">
            <div className='mb-12 px-3'>
                <div className='mb-3 flex items-center gap-2 text-sage-ink'>
                    <BookOpen size={19} strokeWidth={1.5} />
                    <span className='font-sans text-[10px] uppercase tracking-[0.22em]'>
                        A space of one's own
                    </span>
                </div>
                <h2 className='font-display text-4xl font-medium tracking-tight text-ink transition-colors duration-300 hover:text-sage-ink'>
                    Ink & Soul<span className='text-accent'>.</span>
                </h2>
                <p className='mt-2 font-reading text-sm italic text-ink-muted'>
                    Write freely. Read slowly.
                </p>
            </div>
            <nav className='flex-1'>
                <p className='mb-4 px-3 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted'>
                    Your space
                </p>

                <div className='space-y-1.5'>
                    {navItems.map((item, index) => {
                        const Icon = item.icon
                        const isActive = index === 0

                        return (
                            <NavLink
                              key={item.label}
                              to={index === 0
                                ? '/'
                                : index === 1
                                ? '/writings'
                                : '#'
                              }
                            className={({ isActive }) => `group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left font-sans text-sm transition-all suration-300 ${
                                isActive
                                ? 'border-sage-dark/40 bg-sage text-sage-ink font-medium shadow-sm'
                                : 'border-transparent text-ink-brown hover:border-paper-border hover:bg-paper hover:pl-4 hover:text-sage-ink'}`}>
                                    {({ isActive }) => {
                                        const Icon = item.icon
                                        return (
                                            <>
                                               <Icon
                                                  size={18}
                                                  strokeWidth={1.6}
                                                  className={`shrink-0 transition-transform duration-300 ${
                                                    isActive ? 'text-sage-ink' : 'group-hover:scale-110'}`}
                                                    />

                                                    <span>{item.label}</span>
                                                    {isActive && (
                                                        <span className='ml-auto h-1.5 w-1.5 rounded-full bg-sage-ink' />
                                                        
                                                    )}
                                            </>
                                        )
                                    }}
                                </NavLink>
                        )
                    })}
                </div>
            </nav>

            <div className='mt-10 border-t border-paper-border px-3 pt-6'>
                <p className='font-display text-xl italic leading-relaxed text-ink-brown'>
                    "Some things are best understood when written down."
                </p>
                <p className='mt-3 font-sans text-[10px] uppercase tracking-[0.18em] text-ink-muted'>
                    A gentle reminder
                </p>
            </div>
        </aside>
    )
}

export default Sidebar