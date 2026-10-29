import { useEffect, useState } from "react";
import { BookOpen, Feather, Quote, Sparkles } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import { getAllRecords } from "../../services/db";


function Dashboard() {
    const [writingsCount, setWritingsCount] = useState(0)

    useEffect(() => {
        async function loadWritingsCount() {
            try {
                const records = await getAllRecords('writings')
                setWritingsCount(records.length)
            }
            catch (error) {
                console.error('Could not load writing count:', error)
            }
        }
        loadWritingsCount()

    },[])

    const stats = [
        { label: 'Pieces written', value: writingsCount, icon: Feather },
        { label: 'Books explored', value: 0, icon: BookOpen },
        { label: 'Quotes collected', value: 0, icon: Quote },
    ]

    return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
        <PageHeader
           title="Your quiet corner."
           subtitle="A little space for the words you write, the books you read and the thoughts you keep." />

           <section className="group relative mb-10 overflow-hidden rounded-3xl border border-sage-dark/40 bg-gradient-to-br from-sage via-[#EDF0E5] to-[#F3E5D9] p-7 shadow-sm transition-all duration-300 hover:shadow-lg md:p-10">
              
                <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full border border-white/50 transition-transform duration-700 group-hover:scale-110" />
                <div className="pointer-events-none absolute -right-2 top-8 h-28 w-28 rounded-full bg-white/30 blur-2xl" />

              <div className="flex items-center gap-2 text-sage-ink">
                <Sparkles size={18} />
                <p className="font-sans text-xs uppercase tracking-[0.2em]">
                    A moment for yourself
                </p>
              </div>

              <h2 className="relative mt-6 max-w-2xl font-display text-4xl font-medium leading-tight tracking-tight text-ink md:text-5xl md:leading-[1.12]">
                What is something you wish you could say without having to explain it?
              </h2>

              <p className="relative mt-5 font-reading text-sm italic text-sage-ink">
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
                          className={`group rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
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

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/60 bg-white/50 text-sage-ink transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
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
    </div>
    )
}


export default Dashboard