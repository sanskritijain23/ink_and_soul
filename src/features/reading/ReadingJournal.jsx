import { useEffect, useState } from "react"
import { BookOpen, Plus, Trash2, ChevronDown, Library, BookCheck, Bookmark } from "lucide-react"
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
                            const shelfIcon = shelf.icon

                            return (
                                <section key={shelf.status}>
                                    <div className="mb-4 flex items-center justify-between border-b border-paper-border pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage text-sage-ink">
                                                <shelfIcon size={19} />
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
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            {shelfBook.map((book) => (
                                                <article 
                                                   key={book.id}
                                                   className="group rounded-2xl border border-paper-border bg-paper-card p-5 transition duration-200 hover:-translate-y-1 hover:shadow-md">
                                                   <div className="mb-4 flex items-start justify-between gap-3">
                                                        <div className="flex h-28 w-20 shrink-0 items-center justify-center rounded-md bg-forest px-2 text-center shadow-sm">
                                                            <div>
                                                                <BookOpen size={20} className="mx-auto mb-2 text-clay"/>
                                                                <p className="line-clamp-3 font-display text-sm text-paper">
                                                                    {book.title}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                const confirmed = window.confirm(
                                                                    `Remove "${book.title}" from your library?`
                                                                )
                                                                if (confirmed) {
                                                                    handleDelete(book.id)
                                                                }
                                                            }}
                                                            aria-label={`Delete ${book.title}`}
                                                            className="roundded-lg p-2 text-ink-muted transition hover:bg-red-50 hover:text-red-700">
                                                                <Trash2 size={17} />

                                                            </button>
                                                   </div>

                                                   <h4 className="font-display text-xl text-ink">
                                                        {book.title}
                                                   </h4>

                                                   <p className="mt-1 text-sm text-ink-muted">
                                                        by {book.author}
                                                   </p>

                                                   <div className="relative mt-4">
                                                        <select 
                                                            aria-label={`Reading status for ${book.title}`}
                                                            value={book.status}
                                                            onChange={(event) => handleStatusChange( book, event.target.value)}
                                                            className="w-full appearance-none rounded-xl border border-paper-border bg-paper px-3 py-2 pr-9 text-xs text-ink outline-none transition focus:border-sage-dark">
                                                                <option value="Want to Read">
                                                                    Want to Read
                                                                </option>

                                                                <option value="Currently Reading">
                                                                    Currently Reading
                                                                </option>

                                                                <option value="Finished">
                                                                    Finished
                                                                </option>
                                                            </select>

                                                            <ChevronDown
                                                                size={15}
                                                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"/>

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