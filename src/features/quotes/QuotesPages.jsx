import { useEffect, useMemo, useState } from "react";
import {
    BookOpen,
    Bookmark,
    Heart,
    Pencil,
    Plus,
    Search,
    Trash2,
    X,
    Save,
    Feather,
} from 'lucide-react'
import {
    addRecord,
    deleteRecord,
    getAllRecords,
    updateRecord,
} from '../../services/db'

const emptyForm = {
    text: '',
    author: '',
    source: '',
    page: '',
    note: '',
}

function QuotesPage() {
    const [quotes, setQuotes] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showFavorites, setShowFavorites] = useState(false)
    const [formOpen, setFormOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')

    async function loadQuotes() {
        try {
            setLoading(true)
            const records = await getAllRecords('quotes')
            const sortedRecords = records.sort((a, b) => {
                const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
                const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
                return dateB - dateA
            })
            setQuotes(sortedRecords)
        } catch (err) {
            console.error('Could not load quotes:', err)
            setError('Your saved lines could not be loaded. Please refresh the page.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadQuotes()
    }, [])

    const filteredQuotes = useMemo(() => {
        const query = search.trim().toLowerCase()
        return quotes.filter((quote) => {
            const matchesSearch = [
                quote.text,
                quote.author,
                quote.source,
                quote.note,
                quote.page,
            ].some((value) => String(value || '').toLowerCase().includes(query))
            const matchesFavorite = !showFavorites || quote.isFavorite 
            return matchesSearch && matchesFavorite
        })
    }, [quotes, search, showFavorites])
    
    function openNewForm() {
        setForm(emptyForm)
        setEditingId(null)
        setError('')
        setNotice('')
        setFormOpen(true)
    }

    function openEditForm(quote) {
        setForm({
            text: quote.text || '',
            author: quote.author || '',
            source: quote.source || '',
            page: quote.page || '',
            note: quote.note || '',
        })

        setEditingId(quote.id)
        setError('')
        setNotice('')
        setFormOpen(true)
    }

    function closeForm() {
        setFormOpen(false)
        setEditingId(null)
        setForm(emptyForm)
        setError('')
    }

    function handleFieldChange(event) {
        const { name, value } = event.target
        setForm((current) => ({ ...current, [name]: value}))
    }

    async function handleSave(event) {
        event.preventDefault()
        setError('')
        setNotice('')
        if (!form.text.trim()){
            setError('First, write the line you want to keep.')
            return 
        }
        const now = new Date().toISOString()
        const existingQuote = quotes.find((quote) => quote.id === editingId)
        const record = {
            id: editingId || crypto.randomUUID(),
            text: form.text.trim(),
            author: form.author.trim(),
            source: form.source.trim(),
            page: form.page.trim(),
            note: form.note.trim(),
            isFavorite: existingQuote?.isFavorite || false,
            createdAt: existingQuote?.createdAt || now,
            updatedAt: now,
        }

        try {
            if (editingId) {
                await updateRecord('quotes', record)
                setNotice('Your line has been updated.')
            }
            else {
                await addRecord('quotes', record)
                setNotice('A new line has found its place.')
            }

            await loadQuotes()
            closeForm()
        }
        catch (err) {
            console.error('Could not save quote:',  err)
            setError('This line could not be saved. Please try again.')
        }
    }

    async function handleFavorite(quote) {
        setError('')
        const updatedQuote = {
            ...quote,
            isFavorite: !quote.isFavorite,
            updatedAt: new Date().toISOString(),
        }
        try {
            await updateRecord('quotes', updatedQuote)
            setQuotes((current) => current.map((item) => item.id === quote.id ? updatedQuote : item).sort((a, b) => {
                const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime()
                const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime()
                return dateB - dateA
            }))
        }
        catch (err) {
            console.error('Could not update favourite:', err)
            setError('The favourite status could not be updated.')
        }
    }

    async function handleDelete(quote) {
        const confirmed = window.confirm(
            'Remove this quote from your collection? This cannot be undone.'
        )
        if (!confirmed) return 
        try {
            await deleteRecord('quotes', quote.id)
            setQuotes((current) => current.filter((item) => item.id !== quote.id)
        )
            if (editingId === quote.id){
                closeForm()
            }
            setNotice('The line has been removed from your collection.')
            setError('')
        }
        catch (err) {
            console.error('Could not delete quote:', err)
            setError('this line could not be deleted. Please try again.')
        }
    }
    const favoriteCount = quotes.filter((quote) => quote.isFavorite).length
    return (
        <div className="min-h-screen bg-paper px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
            <div className="mx-auto max-w-5xl">
                <header className="relative border-b border-paper-border pb-8 sm:pb-10">
                    <div className="mb-8 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <BookOpen
                               size={16}
                               strokeWidth={1.5}
                               className="text-sage-ink"
                            />
                            <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-ink-muted sm:text-xs">
                                Your personal anthology
                            </span>
                        </div>

                        <span className="font-sans text-[10om] uppercase tracking-[0.18em] text-ink-muted">
                            No. 04
                        </span>
                    </div>
                    <div className="grid gap-6 sm;grid-cols-[1fr_auto] sm:items_end">
                        <div>
                            <p className="mb-2 font-reading text-sm italic text-sage-ink">
                                Words worth returning to
                            </p>
                            <h1 className="font-display text-5xl font-medium leadium-[0.98] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                                Lines that
                                <br />
                                <span className="italic tex-accent">stayed.</span>
                            </h1>
                            <p className="mt-5 max-w-md font-reading text-sm leading-7 text-ink-muted sm:text-base">
                                A sentence from a book. A thought someone left behind.
                                Little pieces of language that somehow felt like yours.
                            </p>

                        </div>
                        <div className="flex items-center gap-4 sm:mb-1 sm:flex-cols sm:items-end sm:gap-1">
                            <p className="font-display text-4xl text-sage-ink">
                                {String(quotes.length).padStart(2,'0')}

                            </p>
                            <p className="font-sans text-[10px] uppercase tracking-[0.17em] text-ink-muted">
                                Lines collected
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <button 
                                type="button"
                                onClick={() => setShowFavorites(false)}
                                className={`border-b-2 px-1 py-2 font-sans text-xs transition-colors ${
                                    !showFavorites
                                    ? 'border-accent text-ink'
                                    : 'border-transparent text-ink-muted hover:text-ink'

                                }`}
                                >
                                    All lines
                                    <span className="ml-2 text-ink-muted">{quotes.length}</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowFavorites(true)}
                                    className={`flex items-center gap-1.5 border-b-2 px-1 py-2 font-sans text-xs transition-colors ${
                                        showFavorites
                                        ? 'border-accent text-ink'
                                        : 'border-transparent text-ink-muted hover:text-ink'
                                    }`}
                                >
                                    <Heart size={13} />
                                    Favourites
                                    <span className="text-ink-muted">
                                        {favoriteCount}
                                    </span>
                                </button>
                        </div>

                        <button 
                            type="button"
                            onClick={openNewForm}
                            className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2.5 font-sans text-xs font-medium text-paper transition hover:bg-sage-ink">
                                <Plus size={15} />
                                Save a line
                            </button>
                    </div>
                </header>

                <div className="flex items-center gap-3 border-b border-paper-border py-4">
                    <Search size={16} className="shrink-0 text-ink-muted"/>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Look for a word, an author, a book..."
                        aria-label="Search saved quotes"
                        className="w-full bg-transparent font-reading text-sm text-ink outline-none placeholder:italic placeholder:text-ink-muted/70"/>
                        {search && (
                            <button
                               type="button"
                               onClick={() => setSearch('')}
                               aria-label="Clear search"
                               className="text-ink-muted transition hover:text-ink">
                                <X size={15} />
                               </button>
                        )}
                </div>
                {error && (
                    <p role="alert" className="mt-4 font-sans text-sm text-accent">
                        {error}
                    </p>
                )}
                {notice && !formOpen && (
                    <p role="status" className="mt-4 font-reading text-sm italic text-sage-ink">
                        {notice}
                    </p>
                )}
                {formOpen && (
                    <section className="my-8 border-y border-sage-dark/40 py-6 sm:py-8">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.2em] text-sage-ink">
                                    {editingId ? 'Revisit this line' : 'Add to your anthology'}

                                </p>
                                <h2 className="font-display text-3xl text-ink">
                                    {editingId ? 'A little edit.' : 'Keep these words'}
                                </h2>
                            </div>

                            <button 
                                type="button"
                                onClick={closeForm}
                                aria-label="Close quote form"
                                className="rounded-full p-2 text-ink-muted transition hover:bg-sage/40 hover:text-ink">
                                    <X size={18} />
                                </button>
                        </div>
                        <form onSubmit={handleSave}
                              className="space-y-5"
                        >
                            <div>
                                <label 
                                    htmlFor="quote-text"
                                    className="mb-2 block font-sans text-xs text-ink-muted">
                                        The words themselves *
                                    </label>
                                    <textarea 
                                        id="quote-text"
                                        name="text"
                                        value={form.text}
                                        onChange={handleFieldChange}
                                        required
                                        rows={4}
                                        maxLength={5000}
                                        placeholder="Write the line exactly as you want to remember it..."
                                        className="w-full resize-y border-b border-paper-border bg-transparent px-0 py-3 font-display text-2xl leading-relaxed text-ink outline-none placeholder:text-ink-muted/50 focus:border-sage-ink" />

                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="quote-author" className="mb-2 block font-sans text-xs text-ink-muted">
                                        Author
                                    </label>
                                    <input 
                                         id="quote-author"
                                         name="author"
                                         value={form.author}
                                         onChange={handleFieldChange}
                                         maxLength={200}
                                         placeholder="Who wrote it?"
                                         className="w-full border-b border-paper-border bg-transparent py-2 font-reading text-sm outline-none focus:border-sage-ink" />

                                </div>
                                <div>
                                    <label htmlFor="quote-source" className="mb-2 block font-sans text-xs text-ink-muted">
                                        Book / source 
                                    </label>
                                    <input 
                                        id="quote-source"
                                        name="source"
                                        value={form.source}
                                        onChange={handleFieldChange}
                                        maxLength={200}
                                        placeholder="Where did you find it?"
                                        className="w-full border- border-paper-border bg-transparent py-2 font-reading text-sm outline-none focus:border-sage-ink" />

                                </div>

                                <div>
                                    <label htmlFor="quote-page" className="mb-2 block font-sans text-xs text-ink-muted">
                                        Page number
                                    </label>
                                    <input  
                                        id="quote-page"
                                        name="page"
                                        value={form.page}
                                        onChange={handleFieldChange}
                                        maxLength={30}
                                        placeholder="e.g. 124"
                                        className="w-full border-b border-paper-border bg-transparent py-2 font-reading text-sm outline-none focus:border-sage-ink" />

                                </div>

                                <div>
                                    <label htmlFor="quote-note" className="mb-2 block font-sans text-xs text-ink-muted">
                                        A note to yourself
                                    </label>
                                    <input 
                                        id="quote-note"
                                        name="note"
                                        value={form.note}
                                        onChange={handleFieldChange}
                                        maxLength={1000}
                                        placeholder="Why did it stay with you?"
                                        className="w-full border-b border-paper-border bg-transparent py-2 font-reading tex-sm outline-none focus:border-sage-ink"/>

                                </div>
                            </div>
                            {error && (
                                <p role="alert" className="font-sans text-sm text-accent">
                                    {error}
                                </p>
                            )}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-2.5 font-sans text-xs font-medium text-paper transition hover:bg-sage-ink">
                                        <Save size={14} />
                                        {editingId ? 'Save changes' : 'Keep this line'}
                                    </button>

                                    <button 
                                        type="button"
                                        onClick={closeForm}
                                        className="px-3 py-2 font-sans text-xs text-ink-muted transition hover:text-ink">
                                            Cancel
                                        </button>
                            </div>
                        </form>
                    </section>
                )}

                <section className="mt-2" aria-label="your saved quotes">
                    {loading ? (
                         <div className="py-16 text-center">
                            <p className="font-display text-2xl italic text-ink-muted">
                                Turning the pages...
                            </p>
                         </div>    
                    ) : filteredQuotes.length === 0 ? (
                        <div className="py-16 text-center sm:py-24">
                            <span aria-hidden="true"
                                className="font-display text-7xl leading-none text-sage-ink/50">
                                    “
                                </span>

                            <h2 className="mt-2 font-display text-3xl text-ink">
                                {search || showFavorites
                                ? 'No lines found here.'
                                : 'Leave room for a line.'
                            }
                            </h2>

                            <p className="mx-auto mt-3 max-w-sm font-reading text-am leading-7 text-ink-muted">
                                {search || showFavorites
                                    ? 'try another search or return to all your saved words.'
                                    : 'The words you underline copy into margins or carry around in your gead belong here.'
                                }
                            </p>

                            {!search && !showFavorites && (
                                <button 
                                   type="button"
                                   onClick={openNewForm}
                                   className="mt-6 inline-flex items-center gap-2 border-b border-accent pb-1 font-sans text-xs text-accent transition hover:text-ink">
                                    <Feather size={14} />
                                    Save your first line
                                   </button>
                            )}
                        </div>
                    ) : (
                        <div>
                            {filteredQuotes.map((quote, index) => (
                                <article 
                                   key={quote.id}
                                   className={`group relative grid gap-3 border-b border-paper-border py-8 sm:grid-cols-[76px_minmax(0,1fr)] sm:gap-5 sm:py-10 lg:gap-8 ${
                                    index === 0 ? 'border-t' : ''}`}>
                                        <div className="hidden sm:block" aria-hidden="true">
                                            <span className={`font-display text-8xl leading-[0.8] ${
                                                index % 3 === 1 
                                                ? 'text-sage-ink/65'
                                                : index % 3 === 2 
                                                ? 'text-ink-muted/50'
                                                : 'text-accent/80'}`}
                                            >
                                                “
                                            </span>
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3 sm:hidden">
                                                <span aria-hidden="true" className="font-display text-5xl leading-none text-accent/80">
                                                    “
                                                </span>
                                                <p className="flex-1 font-display text-2xl leading-relaxed text-ink">
                                                    {quote.text}
                                                </p>
                                            </div>
                                            <p className="hidden font-display text-2xl leading-relaxed text-ink sm:block sm:text-3xl lg:text-[2.1rem]">
                                                {quote.text}
                                            </p>

                                            <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 font-reading text-sm text-ink-muted">
                                                {quote.author && (
                                                    <span className="italic text-ink-brown">
                                                        {quote.author}
                                                    </span>
                                                )}
                                                {quote.author && quote.source && (
                                                    <span aria-hidden="true">.</span>
                                                )}
                                                {quote.source && (
                                                    <span>
                                                        {quote.source}
                                                    </span>
                                                )}
                                                {quote.page && (
                                                    <>
                                                        <span aria-hidden="true">.</span>
                                                        <span>p.{quote.page}</span>
                                                    </>
                                                )}
                                                {!quote.author && !quote.source && !quote.page && (
                                                    <span className="italic ">Source unknown</span>
                                                )}
                                            </div>
                                            {quote.note && (
                                                <p className="mt-4 max-w-2xl border-sage-dark/40 pl-3 font-reading text-sm italic leading-6 text-ink-muted">
                                                    {quote.note}
                                                </p>
                                            )}
                                            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                                                <span className="font-sans text-[9px] uppercase trackinh-[0.18] text-ink-muted/70">
                                                    {String(index + 1).padStart(2, '0')}
                                                    <span className="mx-2">/</span>
                                                    {String(filteredQuotes.length).padStart(2, '0')}
                                                </span>

                                                <div className="flex items-center gap-1 opacity-100 transition sm:opacity-60 sm:group-hover:opacity-100 sm:focus-within:opacoty-100">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleFavorite(quote)}
                                                        aria-label={quote.isFavorite ? 'Remove from favourites' : 'Add to favourites'}
                                                        title={quote.isFavorite ? 'remove favourite' : 'Add to favorites'}
                                                        className={`rounded-full p-2 transition hover:bg-sage/40 ${
                                                            quote.isFavorite ? 'text-accent' : 'text-ink-muted hover:text-accent'}`}>
                                                                <Heart size={16} strokeWidth={1.5} 
                                                                fill= {quote.isFavorite ? 'currentColor' : 'none'}
                                                                />

                                                            </button>

                                                    <button 
                                                        type="button"
                                                        onClick={() => openEditForm(quote)}
                                                        aria-label="Edit quote"
                                                        title="Edit"
                                                        className="rounded-full p-2 text-ink-muted transition hover:bg-sage/40 hover:text-ink">
                                                            <Pencil size={15} strokeWidth={1.5} />

                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={() => handleDelete(quote)}
                                                            aria-label="Delete quote"
                                                            title="Delete"
                                                            className="rounded-full p-2 text-ink-muted transition hover:bg-accent/10 hover:text-accent">
                                                                <Trash2 size={15} strokeWidth={1.5}/>
                                                            </button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                            ))}
                        </div>
                    )
                    }
                </section>

                {!loading && quotes.length > 0 && (
                    <footer className="flexitems-center justify-between gap-3 py-8">
                        <p className="font-reading text-sm italic text-ink-muted">
                            Keep what speaks to you.
                        </p>
                        <div className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                            <Bookmark size={13} strokeWidth={1.5} />
                            {quotes.length} {quotes.length === 1 ? 'line kept' : 'lines kept'}
                        </div>
                    </footer>
                )}
            </div>
        </div>
    )
}

export default QuotesPage