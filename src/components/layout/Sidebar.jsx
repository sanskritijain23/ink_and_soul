import { BookOpen, Feather, House, Library, Quote, Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navItems = [
    {label: 'Home', icon: House, path:'/'},
    {label: 'My Writings', icon: Feather, path: '/writings'},
    {label: 'Reading Journal', icon: Library, path: '/reading-journal'},
    {label: 'Saved Quotes', icon: Quote, path: '/quotes'},
    {label: 'inspiration', icon: Sparkles, path: '#' },
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
                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <NavLink
                                 key={item.label}
                                 to={item.path}
                                 end={item.path === '/'}
                                 className={({ isActive }) => `group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left font-sans text-sm transition-all duration-300 ${ 
                                    isActive && item.path !== '#' 
                                    ? 'border-sage-dark/40 bg-sage font-medium text-sage-ink shadow-sm'
                                    : 'border-transparent text-ink-ink-brown hover:bg-paper hover:pl-4 hover:text-sage-ink'}`}>
                                        {({ isActive }) => (
                                            <>
                                               <Icon 
                                                   size={18}
                                                   strokeWidth={1.6}
                                                   className={`shrink-0 transition-transform duration-300 ${
                                                    isActive ? 'text-sage-ink' : 'group-hover:scale-110'}`} />
                                                    <span>{item.label}</span>
                                                    {isActive && item.path !== '#' && (
                                                        <span className='ml-auto h-1.5 w-1.5 rounded-full ng-sage-ink' />
                                                        
                                                    )}
                                            </>
                                        )}
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