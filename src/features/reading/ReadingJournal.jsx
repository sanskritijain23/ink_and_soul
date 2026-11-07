import { useEffect, useState } from "react"
import { BookOpen, Plus, Trash2, Library, BookCheck, Bookmark } from "lucide-react"
import {
    addRecord,
    deleteRecord,
    getAllRecords,
    updateRecord,
} from '../../services/db'
import { searchBookCover } from '../../services/openLibrary'

function ReadingJournal() {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [totalPages, setTotalPages] = useState('')
    const [status, setStatus] = useState('Want to Read')
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [pagesInputs, setPagesinputs] = useState({})
    const [failedCovers, setFailedCovers] = useState({})

    useEffect(() => {
        async function loadBooks() {
            try {
                const records = await getAllRecords('books')
                setBooks(records)
            }
            catch (error) {
                console.error('Could not load books:', error)
                setMessage('Your library could not be loaded.')
            }
            finally {
                setLoading(false)
            }
        }

        loadBooks()
    }, [])

    async function handleSubmit(event) {
        event.preventDefault()
        if (!title.trim() || !author.trim()) {
            setMessage('Please enter both a title and an author.')
            return
        }
        const parsedTotalPages = Number(totalPages)
        if (
            totalPages.trim() === '' ||
            !Number.isSafeInteger(parsedTotalPages) ||
            parsedTotalPages < 1
        ) {
            setMessage('Total pages must be a whole number greater than 0.')
            return
        }
        const cover = await searchBookCover(
            title.trim(),
            author.trim()
        )
        const newBook = {
            id: crypto.randomUUID(),
            title: title.trim(),
            author: author.trim(),
            status,
            totalPages: parsedTotalPages,
            pagesRead: status === 'Finished' ? parsedTotalPages : 0,
            coverId: cover?.coverId ?? null,
            coverUrl: cover?.coverUrl ?? null,
            createdAt: new Date().toISOString(),
        }
        try {
            await addRecord('books', newBook)
            setBooks((previous) => [...previous, newBook])
            setTitle('')
            setAuthor('')
            setTotalPages('')
            setStatus('Want to Read')
            setMessage('Book added to your library.')
        }
        catch (error) {
            console.error('Could not save book:', error)
            setMessage('Could not save the book. Please try again.')
        }
    }

    async function handleDelete(bookId) {
        try {
            await deleteRecord('books', bookId)

            setBooks((previousBooks) => previousBooks.filter((book) => book.id !== bookId))
            setMessage('Book removed from your library.')
        }
        catch (error) {
            console.error('Could not delete book:', error)
            setMessage('Could not delete the book. Please try again.')
        }


    }

    async function handleStatusChange(book, newStatus) {
        if (
            newStatus === 'Finished' && 
            (!Number.isSafeInteger(book.totalPages) || book.totalPages < 1)
        ){
            setMessage('Please add a valid total page count before finishing this book.')
            return
        }
        const updatedBook = {
            ...book,
            status: newStatus,
            pagesRead:
                newStatus === 'Finished'
                    ? book.totalPages
                    : newStatus === 'Want to Read'
                        ? 0
                        : book.pagesRead,
        }
        try {
            await updateRecord('books', updatedBook)
            setBooks((previousBooks) => previousBooks.map((item) => item.id === book.id ? updatedBook : item) )
            setMessage(
                newStatus === 'Finished'
                   ? `"${book.title}" marked as finished!`
                   : `Status updated for "${book.title}".`
            )
        }
        catch (error) {
            console.error('Could not update book status:', error)
            setMessage('Could not update book status. Please try again.')
        }

    }

    async function handleProgressChange(book, value) {
        const rawValue = String(value).trim()
        if (rawValue === '') {
            setMessage('Pages read cannot be empty.')
            return false
        }
        const numberValue = Number(rawValue)
        if (!Number.isSafeInteger(numberValue) || numberValue < 0){
            setMessage('Please enter a valid whole number.')
            return false
        }
        const totalPages = Number(book.totalPages)
        if (!Number.isSafeInteger(totalPages) || totalPages < 1) {
            setMessage('This book needs a valid total page count.')
            return false
        }
        if (numberValue > totalPages) {
            setMessage('Pages read cannot exceed total pages.')
            return false
        }
        const updatedBook = {
            ...book,
            pagesRead: numberValue,
        }
        try {
            await updateRecord('books', updatedBook)
            setBooks((previousBooks) =>
                previousBooks.map((item) =>
                item.id === book.id ? updatedBook : item
            )
        )
            setMessage(`Progress saved for "${book.title}".`)
            return true
        }
        catch (error) {
            console.error('Could not save reading progress:', error)
            setMessage('Could not save progress. Please try again.')
            return false
        }
    }

    const getProgress = (book) => {
        if (!book.totalPages || book.totalPages <= 0) {
            return 0
        }
        return Math.round((book.pagesRead / book.totalPages) * 100)
    }

    const shelves = [
        {
            title: 'Want to Read',
            subtitle: 'Stories waiting for you',
            status: 'Want to Read',
            icon: Bookmark,
        },
        {
            title: 'Currently Reading',
            subtitle: 'Worlds you are living in',
            status: 'Currently Reading',
            icon: Library,
        },
        {
            title: 'Finished',
            subtitle: 'Stories that stayed with you',
            status: 'Finished',
            icon: BookCheck,
        },

    ]

    const getBooksForShelf = (shelfStatus) => {
        return books.filter((book) => book.status === shelfStatus)
    }

    return (
        <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
            <header className="mb-10">
                <div className="mb-3 flex items-center gap-2 text-sage-ink">
                    <BookOpen size={18} />
                    <p className="text-xs uppercase tracking-[0.2em]">
                        Your personal library
                    </p>
                </div>

                <h1 className="font-display text-4xl text-ink md:text-5xl">
                    A world between pages.
                </h1>

                <p className="mt-3 font-reading italic text-ink-muted">
                    Books you have read and worlds you have yet to discover.
                </p>
            </header>

            <section className="mb-8 rounded-3xl border border-paper-border bg-paper-card p-6 shadow-sm md:p-8">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage text-sage-ink">
                        <Plus size={20} />

                    </div>

                    <div>
                        <h2 className="font-display text-2xl text-ink">
                            Add a book 
                        </h2>

                        <p className="text-sm text-ink-muted">
                            Another world for your little library.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
                    <div>
                        <label htmlFor="book-title" className="mb-2 block text-sm text-ink">
                            Book title
                        </label>
                        <input  
                            id="book-title"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            placeholder="e.g. The Book Theif"
                            className="w-full rounded-xl border border-paper-border bg-paper px-4 py-3 text-ink outline-none transition focus:border-sage-dark"
                                required
                            />
                    </div>

                    <div>
                        < label
                            htmlFor="book-author"
                            className="mb-2 block text-sm text-ink">
                            Author
                        </label>

                        <input 
                            id="book-author"
                            type="text"
                            value={author}
                            onChange={(event) => setAuthor(event.target.value)}
                            placeholder="e.g. Markus Zusak"
                            className="w-full rounded-xl border border-paper-border bg-paper px-4 py-3 text-ink outline-none transition focus:border-sage-dark"
                            required
                            />
                    </div>

                    <div>
                        <label 
                        htmlFor="book-total-pages"
                        className="mb-2 block text-sm text-ink">
                            Total pages
                        
                        </label>

                        <input 
                            id="book-total-pages"
                            type="number"
                            min="1"
                            step="1"
                            required
                            value={totalPages}
                            onChange={(event) => setTotalPages(event.target.value)}
                            placeholder="e.g. 350"
                            className="w-full rounded-xl border border-paper-border bg-paper px-4 py-3 text-ink outline-none transition focus:border-sage-dark"/>

                    </div>

                    <div>
                        <label htmlFor="book-status"
                            className="mb-2 block text-sm text-ink">
                                Reading status
                            </label>
                            <select 
                                id="book-status"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="w-full rounded-xl border border-paper-border bg-paper px-4 py-3 text-ink outline-none focus:border-sage-dark">
                                <option value="Want to Read">Want to Read</option>
                                <option value="Currently Reading">Currently Reading</option>
                                <option value="Finished">Finished</option>   
                            </select>
                    </div>

                    <div className="flex items-end">
                        <button 
                             type="submit"
                             className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage-ink px-5 py-3 font-medium text-white transition hover:bg-[#304536] active:scale-[0.98]">
                                 <Plus size={17} />
                                 Add to my library
                        </button>
                    </div>
                </form>
            </section>

            <section>
                <div className="mb-6 flex items-end justify-between gap-3">
                    <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-sage-ink">
                            Your reading life
                        </p>

                        <h2 className="font-display text-3xl text-ink">
                            Your bookshelf
                        </h2>

                        <p className="mt-1 text-sm text-ink-muted">
                            {books.length} {books.length === 1 ? 'book' : 'books'} in your library
                        </p>
                    </div>
                </div>

                {message && (
                    <p role="status" className="mb-5 test-sm text-sage-ink">
                        {message}
                    </p>
                )}

                {loading ? (
                    <p className="py-8 test-sm text-ink-muted">
                        Opening your library...
                    </p>    
                ) : books.length === 0 ? (
                    <div className="rounded-2xl border border-paper-border bg-paper-card p-10 text-center">
                        <BookOpen size={30} className="mx-auto mb-3 text-sage-ink " />
                        <h3 className="font-display text-2xl text-ink">
                            An empty shelf, for now.
                        </h3>

                        <p className="mt-2 font-reading text-sm italic text-ink-muted">
                            Add a book above to begin your collection.
                        </p>

                    </div>
                ) : (
                    <div className="space-y-10">
                        {shelves.map((shelf, shelfIndex) => {
                            const shelfBook = getBooksForShelf(shelf.status)
                            const ShelfIcon = shelf.icon

                            return (
                                <section key={shelf.status}>
                                    <div className="mb-4 flex items-center justify-between border-b border-paper-border pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-sage-ink">
                                                <ShelfIcon size={19} />
                                            </div>

                                            <div>
                                                <h3 className="font-display text-2xl text-ink">
                                                    {shelf.title}
                                                </h3>

                                                <p className="text-xs text-ink-muted">
                                                    {shelf.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="rounded-full bg-sage/60 px-3 py-1 text-xs text-sage-ink">
                                            {shelfBook.length}
                                        </span>
                                    </div>

                                    {shelfBook.length === 0 ? (
                                        <p className="rounded-xl border border-dashed border-paper-border px-5 py-6 font-reading text-sm italic text-ink-muted">
                                            Nothing on this shelf just yet.
                                        </p>    
                                    ) : (
                                       <div className="grid gap-5 md:grid-cols-2">
                                            {shelfBook.map((book) => (
                                                <article 
                                                   key={book.id}
                                                   className="group overflow-hidden rounded-3xl border border-paper-border bg-paper-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                                                    <div className="flex flex-col sm:flex-row">
                                                        <div className="flex w-full shrink-0 flex-col bg-[#E9E1D7] sm:w-[34%]">
                                                            <div className="relative overflow-hidden px-3 pt-3">
                                                                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-[#DED4C8] shadow-sm">

                                                                    {book.coverUrl && !failedCovers[book.id] ? (
                                                                    <img
                                                                        src={book.coverUrl}
                                                                        alt={`Cover of ${book.title}`}
                                                                        loading="lazy"
                                                                        onError={() => {
                                                                            setFailedCovers((previous) => ({
                                                                            ...previous,
                                                                            [book.id]: true,
                                                                        }))
                                                                        }}
                                                                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                                                                    />
                                                                ) : (
                                                                    <div className="relative flex h-full w-full flex-col items-center justify-between overflow-hidden bg-forest px-4 py-5 text-center">
                                                                        <div className="absolute inset-3 rounded-xl border border-paper/20" />
                                                                        <div className="absolute inset-5 rounded-lg border border-clay/20" />
                                                                        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full border border-clay/20" />
                                                                        <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full border border-paper/10" />
                                                                            <div className="relative z-10">
                                                                                <p className="text-[8px] uppercase tracking-[0.35em] text-paper/55">
                                                                                    A story to remember
                                                                                </p>
                                                                            </div>

                                                                            <div className="relative z-10 px-2">
                                                                                <BookOpen
                                                                                    size={28}
                                                                                    className="mx-auto mb-4 text-clay"
                                                                                    strokeWidth={1.2}
                                                                                />

                                                                                <h3 className="break-words font-display text-xl leading-tight text-paper sm:text-2xl">
                                                                                    {book.title}
                                                                                </h3>

                                                                                <div className="mx-auto my-3 h-px w-10 bg-clay/70" />

                                                                                    <p className="break-words text-[9px] uppercase tracking-[0.18em] text-paper/65">
                                                                                        {book.author}
                                                                                    </p>
                                                                                </div>

                                                                                <p className="relative z-10 text-[8px] tracking-[0.25em] text-paper/40">
                                                                                    INK & SOUL
                                                                                </p>
                                                                            </div>
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <div className="px-3 pb-3 pt-3">
                                                                        <p className="mb-2 px-1 text-[9px] font-medium uppercase tracking-[0.22em] text-ink-muted">
                                                                            Reading shelf
                                                                        </p>

                                                                        <div className="space-y-1.5">
                                                                            {[
                                                                                'Want to Read',
                                                                                'Currently Reading',
                                                                                'Finished',
                                                                            ].map((option) => {
                                                                            const isSelected = book.status === option

                                                                            return (
                                                                            <button
                                                                                key={option}
                                                                                type="button"
                                                                                onClick={() => handleStatusChange(book, option)}
                                                                                className={`group/status flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left text-[11px] transition-all duration-200 ${
                                                                                isSelected
                                                                                ? 'border-sage-dark bg-sage text-sage-ink shadow-sm'
                                                                                : 'border-transparent bg-paper/50 text-ink-muted hover:border-paper-border hover:bg-paper hover:text-ink'
                                                                            }`}
                                                                            >
                                                                                <span
                                                                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                                                                                    isSelected
                                                                                    ? 'border-sage-ink bg-sage-ink'
                                                                                    : 'border-[#CFC7B9] bg-paper-card'
                                                                                    }`}
                                                                                >
                                                                                    {isSelected && (
                                                                                    <span className="h-1.5 w-1.5 rounded-full bg-paper-card" />
                                                                                    )}
                                                                                </span>

                                                                                <span className={isSelected ? 'font-medium' : ''}>
                                                                                    {option}
                                                                                </span>
                                                                            </button>
                                                                            )
                                                                            })}
                                                                        </div>
                                                                </div>
                                                        </div>
                                                        <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-5">
                                                            <div className="flex items-start justify-between gap-4">
                                                                <div className="min-w-0">
                                                                    <span 
                                                                       className={`inline-flex rounded-full px-3 py-1 text-[10px] font-medium tracking-wide ${
                                                                          book.status === 'Finished'
                                                                          ? 'bg-sage text-sage-ink'
                                                                          : book.status === 'Currently Reading'
                                                                             ? 'bg-[#F0E5D8] text-[#8A6045]'
                                                                             : 'bg-[#EAE7DD] text-[#77715F]'
                                                                       }`}>
                                                                        {book.status}
                                                                       </span>
                                                                       <div className="mt-3 rounded-r-xl border-l-[3px] border-[#8D5965] bg-[#F3EAE7] px-3 py-2.5">
                                                                            <h3 className="break-words font-display text-2xl leading-tight text-[#702D3B] sm:text-3xl">
                                                                                {book.title}
                                                                            </h3>
                                                                       </div>
                                                                       <p className="mt-2 text-sm text-ink-muted">
                                                                            Written ny {book.author}
                                                                       </p>
                                                                </div>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const confirmed = window.confirm(
                                                                            `Remove "${book.title}" from your library?`)
                                                                        if (confirmed) {
                                                                            handleDelete(book.id)
                                                                    }
                                                                }}
                                                                aria-label={`Delete ${book.title}`}
                                                                className="shrink-0 rounded-xl p-2.5 text-ink-muted transition hover:bg:bg-red-50 hover:text-red-600">
                                                                    <Trash2 size={18} />

                                                                </button>
                                                            </div>
                                                            <div className="mt-5">
                                                                <div className="mb-3 flex items-end justify-between">
                                                                    <div>
                                                                        <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">
                                                                            Your reading journey
                                                                        </p>
                                                                        <p className="mt-1 font-display text-lg text-ink">
                                                                            Reading progress
                                                                        </p>

                                                                    </div>
                                                                    <span className="font-display text-3xl text-sage-ink">
                                                                        {getProgress(book)}%
                                                                    </span>
                                                                </div>
                                                                <div 
                                                                    className="h-2 overflow-hidden rounded-full bg-sage/40"
                                                                    role="progressbar"
                                                                    aria-label={`Reading progress for ${book.title}`}
                                                                    aria-valuemin={0}
                                                                    aria-valuemax={100}
                                                                    aria-valuenow={getProgress(book)}>
                                                                        <div 
                                                                           className="h-full rounded-full bg-sage-ink transition-all duration-500"
                                                                           style={{
                                                                                width: `${getProgress(book)}%`
                                                                           }}/>
                                                                    </div>
                                                                    <p className="mt-2 text-xs text-ink-muted">
                                                                        {book.pagesRead ?? 0} of {book.totalPages ?? 0} pages completed
                                                                    </p>
                                                            </div>
                                                            <div className="mt-4 grid grid-cols-2 gap-4 rounded-2xl bg-paper p-3.5">
                                                                <div>
                                                                    <label
                                                                        htmlFor={`pages-read-${book.id}`}
                                                                        className="mb-2 block text-xs text-ink-muted">
                                                                            Pages read
                                                                        </label>
                                                                        <input
                                                                            id={`pages-read-${book.id}`}
                                                                            type="number"
                                                                            min="0"
                                                                            max={book.totalPages || undefined}
                                                                            step="1"
                                                                            disabled={book.status === 'Finished'}
                                                                            value={pagesInputs[book.id] ?? (book.pagesRead ?? 0)}
                                                                            onChange={(event) => {
                                                                                setPagesinputs((previous) => ({
                                                                                     ...previous,
                                                                                     [book.id]: event.target.value,
                                                                            }))
                                                                        }}
                                                                        onBlur={async (event) => {
                                                                            const value = event.currentTarget.value
                                                                            await handleProgressChange(book, value)
                                                                            setPagesinputs((previous) => {
                                                                                const next = { ...previous }
                                                                                delete next[book.id]
                                                                                return next
                                                                            })

                                                                        }}
                                                                        className="w-full rounded-lg border border-paper-border bg-paper-card px-3 py-2 text-sm text-ink outline-none transition focus:border-sage-dark disabled: cursor-not-allowed disabled:opacity-50"/>

                                                                </div>
                                                                <div>
                                                                    <span className="mb-2 block text-xs text-ink-muted">
                                                                        Total pages
                                                                    </span>
                                                                    <p className="py-2 font-display text-xl text-ink">
                                                                        {book.totalPages}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            
                                                            
                                                        </div>
                                                    </div>
                                                   </article>
                                            ))}
                                       </div>
                                    )
                                    }
                                </section>
                            )
                        })}
                    </div>
                )
                }
            </section>
        </div>
    )
}


export default ReadingJournal