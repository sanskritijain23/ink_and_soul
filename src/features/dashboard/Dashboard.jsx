import { BookOpen, Feather, Quote, Sparkles } from "lucide-react";
import PageHeader from "../../components/PageHeader";

const stats = [
    { label: 'Pieces written', value: '0', icon: Feather},
    { label: 'Books explored', value: '0', icon: BookOpen},
    { label: 'Quotes collected', value: '0', icon: Quote},
]

function Dashboard() {
    return (
    <div className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-12">
        <PageHeader
           title="Your quiet corner."
           subtitle="A little space for the words you write, the books you read and the thoughts you keep." />

           <section className="mb-10 rounded-2xl border border-paper-border bg-paper-card p-6 md:p-8">
              <div className="flex items-center gap-2 text-sage-ink">
                <Sparkles size={18} />
                <p className="font-sans text-xs uppercase tracking-[0.2em]">
                    A moment for yourself
                </p>
              </div>

              <h2 className="mt-5 max-w-2xl font-display text-3xl leading-snug textink md:text-4xl">
                What is something you wish you could say without having to explain it?
              </h2>

              <p className="mt-4 font-reading text-sm italic text-ink-muted">
                Today's writing prompt
              </p>
           </section>

           <section>
            <h2 className="mb-5 font-display text-2xl text-ink">
                Your little world 
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {stats.map((stat) => {
                    const Icon = stat.icon

                    return (
                        <div 
                          key={stat.label}
                          className="rounded-2xl border border-paper-border bg-paper-card p-5 transition hover:-translate-y-1"
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <p className="font-sans text-sm text-ink-muted">
                                    {stat.label}
                                </p>

                                <Icon sie={19} className="text-sage-ink" strokeWidth={1.6} />

                            </div>

                            <p className="font-display text-4xl text-ink">
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