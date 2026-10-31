import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookOpen, Feather, Quote, Sparkles } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { getAllRecords } from "../../services/db";


function Dashboard() {
    const [writingsCount, setWritingsCount] = useState(0)
    const [recentWritings, setRecentWritings] = useState([])
    const [booksCount, setBooksCount] = useState(0)
    const [quotesCount, setQuotesCount] = useState(0)

    useEffect(() => {
        async function loadWritingsCount() {
            try {
                const [records, books, quotes] = await Promise.all([
                    getAllRecords('writings'),
                    getAllRecords('books'),
                    getAllRecords('quotes')
                ])

                setWritingsCount(records.length)
                setBooksCount(books.length)
                setQuotesCount(quotes.length)

                const latestWritings = [...records].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0,3)

                setRecentWritings(latestWritings)
            }
            catch (error) {
                console.error('Could not load writing count:', error)
            }
        }
        loadWritingsCount()

    },[])

    const stats = [
        { label: 'Pieces written', value: writingsCount, icon: Feather },
        { label: 'Books explored', value: booksCount, icon: BookOpen },
        { label: 'Quotes collected', value: quotesCount, icon: Quote },
    ]

    return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
        <PageHeader
           title="Your quiet corner."
           subtitle="A little space for the words you write, the books you read and the thoughts you keep." />

           <section className="group relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-forest p-7 shadow-lg shadow-forest/10 transition-all duration-300 md:p-10">
              
                <div className="pointer-events-none absolute -right-10 -top-12 h-56 w-56 rounded-full border border-white/15 transition-transform duration-700 group-hover:scale-110" />
                <div className="pointer-events-none absolute -right-2 top-8 h-32 w-32 rounded-full bg-clay/20 blur-2xl" />

              <div className="flex items-center gap-2 text-clay">
                <Sparkles size={18} />
                <p className="font-sans text-xs uppercase tracking-[0.2em]">
                    A moment for yourself
                </p>
              </div>

              <h2 className="relative mt-6 max-w-2xl font-display text-4xl font-medium leading-tight tracking-tight text-paper md:text-5xl md:leading-[1.12]">
                What is something you wish you could say without having to explain it?
              </h2>

              <p className="relative mt-5 font-reading text-sm italic text-paper/75">
                Today's writing prompt
              </p>
           </section>

           <section>
            <h2 className="mb-5 font-display text-2xl text-ink">
                Your little world 
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((stat, index) => {
                    const Icon = stat.icon

                    return (
                        <div 
                          key={stat.label}
                          className={`group rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                            index === 0
                                ? 'border-sage-dark/40 bg-sage/70 hover:bg-sage'
                                : index === 1
                                    ? 'border-paper-border bg-paper-card hover:border-sage-dark/50'
                                    : 'border-[#E8D4CB] bg-[#F3E5D9]/70 hover:bg-[#F3E5D9]'
                                }`}
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <p className="font-sans text-sm text-ink-muted">
                                    {stat.label}
                                </p>

                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-forest/10 bg-paper-card text-ink-muted transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
                                    <Icon size={19} strokeWidth={1.6} />
                                </div>
                            </div>

                            <p className="font-display text-5xl font-medium leading-none tracking-tight text-ink">
                                {stat.value}
                            </p>
                        </div>
                    )
                })}
            </div>
           </section>

           <section className="mt-12">
              <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="font-display text-2xl text-ink">
                        Recently written
                    </h2>

                    <p className="mt-1 font-sans text-sm text-ink-muted">
                        Little pieces of your thoughts.
                    </p>
                </div>

                <span className="font-sans text-xs tracking-wide text-ink-muted">
                    LAST 3
                </span>
              </div>

              {recentWritings.length === 0 ? (
                   <div className="rounded-2xl border border-dashed border-paper-border bg-paper-card/60 px-6 py-10 text-center">
                      <Feather size={25} className="mx-auto mb-3 text-forest/60" />
                      <h3 className="font-display text-xl text-ink">
                         Your pages are waiting.
                      </h3>

                      <p className="mt-2 font-sans text-sm text-ink-muted">
                        Your recent writings will find a place here.
                      </p>

                   </div>   
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {recentWritings.map((writing, index) => (
                        <article 
                            key={writing.id}
                            className="group relative overflow-hidden rounded-2xl border border-[#D9CDBB] bg-[#EDE5D8] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-forest/40 hover:bg-[#E8DECE] hover:shadow-xl hover:shadow-forest/10">
                                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border border-forest/10 transition-transform duration-700 group-hover:scale-125" />
                                <div className="relative">
                                    <div className="mb-8 flex items-center justify-between">
                                        <span className="font-sans text-xs tracking-[0.2em] text-forest/70">
                                           FRAGMENT No. 0{index + 1}
                                        </span>

                                        <Feather 
                                           size={17}
                                           strokeWidth={1.4}
                                           className="text-burgundy/70 transition-transform duration-300 group-hover:-rotate-12" />

                                    </div>

                                    <h3 className="min-h-[3.5rem] font-display text-2xl font-medium leading-tight text-ink">
                                        {writing.title || "Untitled"}
                                    </h3>

                                    <div className="my-4 h-px w-10 bg-clay transition-all duration-300 group-hover:w-16" />
                                    <p className="min-h-[4.5rem] line-clamp-3 font-reading text-sm leading-7 text-ink-muted">
                                        {writing.content || 'A thought waiting to be completed...'}
                                    </p>

                                    <div className="mt-7 flex items-center justify-between border-t border-[#E5DDD1] pt-4">
                                        <span className="font-sans text-xs text-ink-muted">
                                            {new
                                                Date(writing.updatedAt).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                            }
                                        </span>

                                        <span className="font-display text-sm italic text-burgundy">
                                            A piece of you 
                                        </span>
                                    </div>
                                </div>
                            </article>
                        ))}
                </div>
              )  
              }
           </section>

           <section className="mt-12">
               <div className="mb-5">
                   <h2 className="font-display text-2xl text-ink">
                       Find your way around
                   </h2>

                   <p className="mt-1 font-sans text-sm text-ink-muted">
                       Every little corner has a story.
                   </p>
               </div>

               <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                   <Link 
                      to="/writings"
                      className="group flex items-center justify-between rounded-2xl border border-[#D9CDBB] bg-[#EDE5D8] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-[#E8DECE] hover:shadow-lg">
                      <div className="flex items-center gap-4">
                         <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest text-paper">
                            <Feather size={21} />

                         </div>

                         <div>
                            <h3 className="font-display text-xl text-ink">
                                My Writings
                            </h3>
                            <p className="mt-1 font-sans text-xs text-ink-muted">
                                Return to your words.
                            </p>
                         </div>
                      </div>

                      <span className="text-xl text-forest transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </Link>

                    <Link 
                        to="/reading-journal"
                        className="group flex items-center justify-between rounded-2xl border border-[#D9CDBB] bg-[#EDE5D8] p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-[#E8DECE] hover:shadow-lg">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-burgundy text-paper">
                                    <BookOpen size={21} />
                                </div>

                                <div>
                                    <h3 className="font-display text-xl text-ink">
                                        Reading Journal
                                    </h3>
                                    <p className="mt-1 font-sans text-xs text-ink-muted">
                                        Visit your little bookshelf.
                                    </p>
                                </div>
                            </div>

                            <span className="text-xl text-burgundy transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                     </Link>
               </div>
           </section>
    </div>
    )
}


export default Dashboard