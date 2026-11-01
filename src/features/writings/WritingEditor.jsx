import { useEffect, useState } from "react";
import { ArrowLeft, Feather, Save, Plus, Trash2 } from 'lucide-react'
import {
    addRecord,
    getAllRecords,
    updateRecord,
    deleteRecord,
} from '../../services/db'

function WritingEditor() {
    const [writings, setWritings] = useState([])
    const [activeId, setActiveId] = useState(null)
    const [title, setTitle] = useState('')
    const [writingType, setWritingType] = useState('')
    const [content, setContent] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState('All')
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    useEffect(() => {
        async function loadWritings() {
            try {
                const records = await getAllRecords('writings')
                setWritings(
                    records.sort(
                        (a, b) => 
                            new Date(b.updatedAt) - new Date(a.updatedAt)
                    )
                )
            }
            catch (error) {
                console.error('Could not load writings:', error)
                setMessage('Your writings could not be loaded.')
            }
            finally {
                setLoading(false)
            }
        }
        loadWritings()
    }, [])

    function startNewWriting() {
        setActiveId(null)
        setTitle('')
        setContent('')
        setWritingType('')
        setMessage('')
    }

    function openWriting(writing) {
        setActiveId(writing.id)
        setTitle(writing.title)
        setContent(writing.content)
        setWritingType(writing.type ?? '')
        setMessage('')
    }

    async function handleSave() {
        if (!title.trim() && !content.trim()) {
            setMessage('Write something before saving.')
            return
        }

        const now = new Date().toISOString()

        const record = {
            id: activeId ?? crypto.randomUUID(),
            title: title.trim() || 'Untitled',
            type: writingType.trim(),
            content,
            updatedAt: now,
            ...(!activeId && { createdAt: now }),
        }

        try {
            if (activeId) {
                await updateRecord('writings', record)

            }
            else {
                await addRecord('writings', record)
                setActiveId(record.id)
            }

            const records = await getAllRecords('writings')

            setWritings(
                records.sort(
                    (a,b) =>
                        new Date(b.updatedAt) - new Date(a.updatedAt)
                )
            )

            setMessage('Your words have been saved.')
        }
        catch (error) {
            console.error('Could not save writing:', error)
            setMessage('Could not save. Please try again.')
        }
    }

    async function handleDelete() {
        if (!activeId) {
            setMessage('Select a saved writing to delete.')
            return
        }

        const confirmed = window.confirm(
            'Are you sure you want to delete this writing?'
        )

        if (!confirmed) return 

        try {
            await deleteRecord('writings', activeId)

            setWritings((previousWritings) => 
                previousWritings.filter(
                    (writing) => writing.id !== activeId
                )
            )

            startNewWriting()
            setMessage('Writing deleted successfully.')
        }
        catch (error) {
            console.error('Could not delete writing:', error)
            setMessage('Could not delete. please try again')
        }
    }

    const writingTypes = [
        ...new Set(
            writings.map((writing) => writing.type ?.trim()).filter(Boolean)
        ),
    ].sort((a,b) => a.localeCompare(b))

    const filterWritings = writings.filter((writing) => {
        const matchesSearch = writing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        writing.content.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = typeFilter === 'All' || writing.type === typeFilter
        return matchesSearch && matchesType
    })

    return (
        <div className="min-h-screen bg-paper px-6 py-10 md:px-10">
            <div className="mx-auto max-w-6xl">
                <button 
                   onClick={() => window.history.back()}
                   className="mb-8 flex items-center gap-2 text-sm text-ink-muted transition hover:text-sage-ink">
                      <ArrowLeft size={17} />
                       Back
                   </button>

                   <header className="mb-10">
                       <div className="mb-3 flex items-center gap-2 text-sage-ink">
                           <Feather size={18} />
                           <span className="text-xs uppercase tracking-[0.2em]">
                                Your personal pages
                           </span>
                       </div>

                       <h1 className="font-display text-4xl text-ink md:text-5xl">
                           A page of your own.
                       </h1>

                       <p className="mt-3 font-reading italic text-ink-muted">
                           No rules. No rush. Just your words.
                       </p>
                   </header>

                   <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
                        <section className="rounded-3xl border border-paper-border bg-paper-card p-6 shadow-sm md:p-8">
                            <div className="mb-6">
                                <label 
                                   htmlFor="writing-type"
                                   className="mb-2 block text-xs uppercase tracking-[0.18em] text-ink-muted">
                                      This piece is...
                                   </label>

                                   <input 
                                      id="writing-type"
                                      type="text"
                                      value={writingType}
                                      onChange={(event) => setWritingType(event.target.value)}
                                      placeholder="Poetry, reflection, ghazal..."
                                      className="w-full border-b border-paper-border bg-transparent pb-3 font-reading text-base italic text-ink outline-none placeholder:text-ink-muted/60 focus:border-sage-dark" />

                            </div>
                            <input 
                               value={title}
                               onChange={(event) => setTitle(event.target.value)}
                               placeholder="Give this piece a title..."
                               className="mb-6 w-full border-b border-paper-border bg-transparent pb-4 font-display text-3xl text-ink outline-none placeholder:text-ink-muted/60 focus:border-sage-dark md:text-4xl" />
                               <textarea 
                                  value={content}
                                  onChange={(event) => setContent(event.target.value)}
                                  placeholder="Begin wherever you are..."
                                  rows={14}
                                  className="w-full resize-y bg-transparent font-reading text-base leading-8 text-ink outline-none placeholder:text-ink-muted/60" />
                                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-paper-border pt-5">
                                    <p className="text-sm text-ink-muted">
                                        {content.trim() ?
                                         content.trim().split(/\s+/).length : 0} words

                                    </p>
                                    <button 
                                      onClick={handleSave}
                                      className="flex items-center gap-2 rounded-xl bg-sage-ink px-5 py-3 text-sm font-medium text-white transition hover:bg-[#304536] active:scale-[0.98]" >
                                        <Save size={16} />
                                        Save writing
                                        </button> 

                                    {activeId && (
                                        <button 
                                           onClick={handleDelete}
                                           className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm text-red-700 transition hover:bg-red-50">
                                            <Trash2 size={16} />
                                            Delete writing
                                           </button>
                                    )}
                                  </div>

                                  {message && (
                                    <p role="status" className="mt-4 text-sm text-sage-ink">
                                        {message}
                                    </p>
                                  )}
                        </section>

                        <aside className="h-fit rounded-3xl border border-paper-border bg-paper-card p-5">
                            <div className="mb-5 flex items-center justify-between gap-2">
                                <h2 className="font-display text-2xl text-ink">
                                    Your writings
                                </h2>


                                <button 
                                   onClick={startNewWriting}
                                   aria-label="Create new writing"
                                   title="Create new writing"
                                   className="rounded-lg bg-sage p-2 text-sage-ink transition hover:bg-sage-dark">
                                    <Plus size={18} />

                                   </button>
                            </div>

                            <div className="mb-4 space-y-3">
                                <div className="relative">
                                    <input 
                                        type="text"
                                        value={searchTerm}
                                        onChange={(event) => setSearchTerm(event.target.value)}
                                        placeholder="Search your words..."
                                        aria-label="Search-eritings"
                                        className="w-full rounded-xl border border-paper-border bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-sage-dark"/>

                                </div>
                                <select 
                                    value={typeFilter}
                                    onChange={(event) => setTypeFilter(event.target.value)}
                                    aria-label="Filter writings by type"
                                    className="w-full rounded-xl border border-paper-border bg-paper px-3 py-2.5 text-sm text-ink outline-none focus:border-sage-dark">
                                        <option value="All">All writings</option>
                                        {writingTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                            </div>

                            {loading ? (
                                <p className="text-sm text-ink-muted">
                                    Opening your pages...
                                </p>
                            ) : writings.length === 0 ? (
                                <p className="font-reading text-sm italic leading-6 text-ink-muted">
                                    Your saved words will find a home here.
                                </p>
                            ) : filterWritings.length === 0 ? (
                                <p className="py-5 text-center font-reading text-sm italic text-ink-muted">
                                    No writings found. Try another search. 
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {filterWritings.map((writing) => (
                                        <button 
                                            key={writing.id}
                                            onClick={() => openWriting(writing)}
                                            className={`w-full rounded-xl border p-4 text-left transition ${
                                                activeId === writing.id
                                                ? 'border-sage-dark bg-sage/60'
                                                : 'border-transparent hover:border-paper-border hover:bg-paper'}`}>
                                                    <span className="block truncate font-display text-lg text-ink">
                                                        {writing.title}
                                                    </span>

                                                    <span className="mt-1 block text-xs text-ink-muted">
                                                        {new Date(writing.updatedAt).toLocaleDateString()}

                                                    </span>
                                                    {writing.type?.trim() && (
                                                        <span className="mt-2 inline-block rounded-full bg-sage px-2.5 py-1 text-xs text-sage-ink">
                                                            {writing.type}
                                                        </span>
                                                    )}

                                                    <span className="mt-2 block text-sm leading-6 text-ink-muted">
                                                        {writing.content.length > 85 
                                                            ? `${writing.content.slice(0, 85)}...`
                                                            : writing.content}
                                                    </span>
                                                    
                                                </button>
                                    ))}
                                </div>
                            )
                            }
                        </aside>
                   </div>
            </div>
        </div>
    )
}

export default WritingEditor