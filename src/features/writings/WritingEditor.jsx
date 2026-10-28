import { useEffect, useState } from "react";
import { ArrowLeft, Feather, Save, Plus } from 'lucide-react'
import {
    addRecord,
    getAllRecords,
    updateRecord,
} from '../../services/db'

function WritingEditor() {
    const [writings, setWritings] = useState([])
    const [activeId, setActiveId] = useState(null)
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
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
        setMessage('')
    }

    function openWriting(writing) {
        setActiveId(writing.id)
        setTitle(writing.title)
        setContent(writing.content)
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

                            {loading ? (
                                <p className="text-sm text-ink-muted">Opening your pages...</p>
                            ) : writings.length === 0 ? (
                                <p className="font-reading text-sm italic leading-6 text-ink-muted">
                                    Your saved words will find a home here.
                                </p> 
                            ) : (
                                <div className="space-y-2">
                                    {writings.map((writing) => (
                                        <button 
                                           key={writing.id}
                                           onClick={() => openWriting(writing)}
                                           className={`w-full rounded-xl border p-3 text-left transition ${
                                             activeId === writing.id
                                              ? 'border-sage-dark bg-sage/60'
                                              : 'border-transparent hover:border-paper-border hover:bg-paper'}`}>
                                                <span className="block truncate font-medium text-ink">
                                                    {writing.title}

                                                </span>
                                                <span className="mt-1 block text-xs text-ink-muted">
                                                    {new
                                                    Date(writing.updatedAt).toLocaleDateString()}
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