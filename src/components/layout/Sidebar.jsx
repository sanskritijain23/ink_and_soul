import { BookOpen, Feather, House, Library, Quote, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
    {label: 'Home', icon: House, path:'/'},
    {label: 'My Writings', icon: Feather, path: '/writings'},
    {label: 'Reading Journal', icon: Library, path: '/reading-journal'},
    {label: 'Saved Quotes', icon: Quote, path: '/quotes'},
    {label: 'Inspiration', icon: Sparkles, path: '/inspiration' },
]

function Sidebar () {
    return (
        <aside className="flex min-h-screen w-20 shrink-0 flex-col border-r border-paper-border bg-paper-card px-2 py-6 md:w-64 md:px-5 md:py-8">
            <div className='mb-10 px-1 md:mb-12 md:px-3'>
                <div className='mb-3 hidden items-center gap-2 text-sage-ink md:flex'>
                    <BookOpen size={19} strokeWidth={1.5} />
                    <span className='font-sans text-[10px] uppercase tracking-[0.22em]'>
                        A space of one's own
                    </span>
                </div>
                <h2 className='hidden font-display text-4xl font-medium tracking-tight text-ink transition-colors duration-300 hover:text-sage-ink md:block'>
                    Ink & Soul<span className='text-accent'>.</span>
                </h2>
                <p className='mt-2 hidden font-reading text-sm italic text-ink-muted md:block'>
                    Write freely. Read slowly.
                </p>
            </div>
            <nav className='flex-1'>
                <p className='mb-4 hidden px-3 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted md:block'>
                    Your space
                </p>

                <div className='space-y-1.5'>
                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <NavLink
                                 key={item.label}
                                 to={item.path}
                                 end={item.path === '/'}
                                 className={({ isActive }) => `group flex w-full items-center justify-center gap-3 rounded-xl border px-2 py-3 text-left font-sans text-sm transition-all duration-300 md:justify-start md:px-3 ${
                                    isActive && item.path !== '#'
                                    ? 'border-sage-dark/40 bg-sage font-medium text-sage-ink shadow-sm'
                                    : 'border-transparent text-ink-brown hover:bg-paper hover:pl-4 hover:text-sage-ink'
                                    }`}
                                 >
                                        {({ isActive }) => (
                                            <>
                                               <Icon 
                                                   size={18}
                                                   strokeWidth={1.6}
                                                   className={`shrink-0 transition-transform duration-300 ${
                                                    isActive ? 'text-sage-ink' : 'group-hover:scale-110'}`} />
                                                    <span className='hidden md:inline'>{item.label}</span>
                                                    {isActive && (
                                                        <span className='ml-auto h-1.5 w-1.5 rounded-full bg-sage-ink' />
                                                        
                                                    )}
                                            </>
                                        )}
                                    </NavLink>
                        )
                    })}
                </div>
            </nav>

            <div className='mt-10 hidden border-t border-paper-border px-3 pt-6 md:block'>
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