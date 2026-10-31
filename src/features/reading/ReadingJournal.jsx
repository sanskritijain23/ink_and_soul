import { useEffect, useState } from "react"
import { BookOpen, Plus, Trash2 } from "lucide-react"
import {
    addRecord,
    deleteRecord,
    getAllRecords,
    updateRecord,
} from '../../services/db'

function ReadingJournal() {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [status, setStatus] = useState('Want to Read')
    const [books, setBooks] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

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
            setMessage('Please enter both a title and a authot.')
            return
        }

        const newBook = {
            id: crypto.randomUUID(),
            title: title.trim(),
            author: author.trim(),
            status,
            createdAt: new Date().toISOString(),

        }

        try {
            await addRecord('books', newBook)

            setBooks((previousBooks) => [...previousBooks,newBook])
            setTitle('')
            setAuthor('')
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
        try {
            const updatedBook = {
                ...book,
                status: newStatus,
            }

            await updateRecord('books', updatedBook)

            setBooks((previousBooks) =>
                previousBooks.map((item) => 
                    item.id === book.id ? updatedBook : item  
                )
            )
            setMessage(`Moved "${book.title}" to ${newStatus}.`)
        }
        catch (error) {
            console.error('Could not update book status:', error)
            setMessage('Could not update the book status. Please try again.')
        }
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
                        <label htmlFor="book-status"
                            className="mb-2 block text-sm text-ink">
                                Reading status
                            </label>
                            <select 
                                id="book-status"
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="w-full rounded-xl border border-paper-border bg-paper px-4 py-3 text-ink outline-none focus:border-sage-dark">
                                    <option>Want to Read</option>
                                    <option>Reading</option>
                                    <option>Finished</option>
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
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="font-display text-2xl text-ink">
                            Your bookshelf
                        </h2>

                        <p className="mt-1 text-sm text-ink-muted">
                            {books.length} {books.length === 1 ? 'book' : 'books'} in your library
                        </p>
                    </div>
                </div>

                {message && (
                    <p role="status" className="mb-4 text-sm text-sage-ink">
                        {message}
                    </p>
                )}

                {loading ? (
                    <p className="text-sm text-ink-muted">Opening your library...</p>
                ) : books.length === 0 ? (
                    <div className="rounded-2xl border border-paper-border bg-paper-card p-8 text-center">
                        <BookOpen size={28} className="mx-auto mb-3 text-sage-ink" />
                        <p className="font-display text-xl text-ink">
                            An empty shelf, for now.
                        </p>

                        <p className="mt-2 font-reading text-sm italic text-ink-muted">
                            Add a book above to begin your collection.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {books.map((book) => (
                            <article 
                                key={book.id}
                                className="rounded-2xl border border-paper-border bg-paper-card p-5 transition hover:-translate-y-1 hover:shadow-md">
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sage text-sage-ink">
                                            <BookOpen size={20} />

                                        </div>

                                        <button 
                                           type="button"
                                           onClick={() => {
                                            const confirmed = window.confirm(
                                                `Remove "${book.title}" from your library?`
                                            )
                                            if (confirmed)
                                                 handleDelete(book.id)
                                           }}
                                           aria-label={`Delete ${book.title}`}
                                           className="rounded-lg p-2 text-ink-muted transition hover:bg-red-50 hover:text-red-700">
                                               <Trash2 size={17} />
                                           </button>
                                    </div>

                                    <h3 className="font-display text-xl text-ink">
                                        {book.title}
                                    </h3>

                                    <p className="mt-1 text-sm text-ink-muted">
                                        by {book.author}
                                    </p>

                                    <span className="mt-4 inline-block rounded-full bg-sage/60 px-3 py-1 text-xs text-sage-ink">
                                        {book.status}
                                    </span>
                            </article>
                        ))}
                    </div>
                )    
                }
            </section>
        </div>
    )
}


export default ReadingJournal