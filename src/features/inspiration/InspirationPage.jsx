import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    addRecord,
    getAllRecords,
    updateRecord,
    deleteRecord,
} from '../../services/db'
import {
    ArrowDown,
    ArrowRight,
    Bookmark,
    BookmarkCheck,
    Check,
    ChevronDown,
    Clock3,
    Feather,
    Lightbulb,
    LoaderCircle,
    Moon,
    PenLine,
    Plus,
    RefreshCw,
    Search,
    Sparkles,
    Sun,
    Trash2,
    X,
} from 'lucide-react'
import { rule } from "postcss";

const prompts = [
    {
        id: 'p1',
        word: 'Elsewhere',
        mood: 'Nostalgic',
        category: 'Reflection',
        time: '5 min',
        prompt: 'Write about a place you have never visited but somehow miss.',
        challange: 'Describe the place without mentioning its name.'

    },
    {
        id: 'p2',
        word: 'Almost',
        mood: 'melancholic',
        category: 'Poetry',
        time: '7 min',
        prompt: 'Write about something that almost happened, but never did.',
        challange: 'Begin with the words: "It was almost..."'

    },
    {
        id: 'p3',
        word: 'Unsaid',
        mood: 'Quiet',
        category: 'Letters',
        time: '10 min',
        prompt: 'Write a letter containing everything you never found the courage to say.',
        challange: 'Do not use the words love, miss or sorry.',
    },
    {
        id: 'p4',
        word: 'AfterGlow',
        mood: 'Hopeful',
        category: 'Reflection',
        time: '5 min',
        prompt: 'Describe the quiet happiness that remains after a beautiful moment.',
        challange: 'Use only sensory details.',
    },
    {
        id: 'p5',
        word: 'Stranger',
        mood: 'Curious',
        category: 'Story',
        time: '10 min',
        prompt: 'Imagine meeting someone who knows a version of you that you have forgotton.',
        challange: 'Write the conversation entirely through dialogue.'
    },
    {
        id: 'p6',
        word: 'Home',
        mood: 'Nostalgic',
        category: 'reflection',
        time: '7 min',
        prompt: 'Describe what home feels like without describing a building.',
        challange: 'Use three memories and one sound.',
    },
    {
        id: 'p7',
        word: 'Unbecoming',
        mood: 'Restless',
        category: 'Poetry',
        time: '10 min',
        prompt: 'Write about the person you had to stop being to become yourself.',
        challange: 'Write in the second person.',
    },
    {
        id: 'p8',
        word: 'Still',
        mood: 'Quiet',
        category: 'Poetry',
        time: '5 min',
        prompt: 'Write about something that remains unchanged while everything else moves.',
        challange: 'Use no more than 50 words.',
    },
    {
        id: 'p9',
        word: 'Tomorrow',
        mood: 'Hopeful',
        category: 'Reflection',
        time: '5 min',
        prompt: 'Write a conversation between you and the person you might become.',
        challange: 'Let the future version ask the first question.'
    },
    {
        id: 'p10',
        word: 'Distance',
        mood: 'Melancholic',
        category: 'Letters',
        time: '7 min',
        prompt: 'Describe the distance between two people still think of each other.',
        challange: 'Never mention physical distance.',
    },
    {
        id: 'p11',
        word: 'Wonder',
        mood: 'Curious',
        category: 'Story',
        time: '5 min',
        prompt: 'Write about an ordinary object that holds an extraordinary secret.',
        challange: 'Begin witth an unexpected discovery.',
    },
    {
        id: 'p12',
        word: 'Unfold',
        mood: 'Restless',
        category: 'Reflection',
        time: '7 min',
        prompt: 'Describe a moment when life began to make sense in an unexpected way.',
        challange: 'Write it as a sequence of three small realizations.',
    },
]

const moods = [
    { name: 'All', icon: Sparkles},
    { name: 'Nostalgic', icon: Moon},
    { name: 'Melancholic', icon: Moon},
    { name: 'Hopeful', icon: Sun},
    { name: 'Quiet', icon: Feather},
    { name: 'Curious', icon: Lightbulb},
    { name: 'Restless', icon: PenLine},
]

const experiments = [
    {
        number: '01',
        title: 'The Unsent Letter',
        description: 'Write a letter to someone you cannot reach, someone you have outgrown or someone you never met.',
        rule: 'Do not edit yourself. Let the letter remain honest.',
        time: '10 minutes',
    },
    {
        number: '02',
        title: 'A Memory Without a Name',
        description: 'Describe a memory without mentioning the people, place or date associated with it.',
        rule: 'Use only sounds, textures, colours ans sensations.',
        time: '7 minutes',
    },
    {
        number: '03',
        title: 'One Hundred Words',
        description: 'Tell an entire story in exactly one hundred words.',
        rule: 'Every sentence must move the story forward.',
        time: '15 minutes',
    },
    {
        number: '04',
        title: 'The Other Perspective',
        description: 'Choose an ordinary object in your room and write its account of your life.',
        rule: 'The object cannot understand human emotions completely.',
        time: '10 minutes',
    },
]

const fragmentCategories = [
    'An idea',
    'A first line',
    'A memory',
    'A thought',
    'A story seed',
]

function SectionLabel({ children, number }) {
    return (
        <div className="mb-4 flex items-center gap-3">
            {number && (
                <span className="font-sans text-[10px] tracking-[0.18em] text-burgundy">
                    {number}
                </span>
            )}
            <span className="font-sans text-[10px] font-semibols uppercase tracking-[0.2em] text-ink-muted">
                {children}
            </span>
            <div className="h-px flex-1 bg-paper-border"/>
        </div>
    )
}

function Moodbutton({ mood, active, onClick }){
    const Icon = mood.icon
    return (
        <button 
            type="button"
            onClick={onClick}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all ${
                active
                ? 'border-forest bg-forest text-white shadow-sm'
                : 'border-paper-border bg-paper-card text-ink-brown hover:border-burgundy/50 hover:text-burgundy'
            }`}>
                <Icon size={15} />
                {mood.name}
            </button>
    )

} 


function InspirationPage() {
    const navigate = useNavigate()
    const [selectedPrompt, setSelectedPrompt] = useState(prompts[0])
    const [selectedMood, setSelectedMood] = useState('All')
    const [savedItems, setSavedItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [showFragmentForm, setShowFragmentForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [fragmentTitle, setFragmentTitle] = useState('')
    const [fragmentContent, setFragmentContent] = useState('')
    const [fragmentCategory, setFragmentCategory] = useState('An idea')
    const [showAllFragments, setShowAllFragments] = useState(false)

    useEffect(() => {
        async function loadInspirations() {
            try {
                const records = await getAllRecords('inspirations')
                setSavedItems(
                    records.sort(
                        (a,b) => new Date(b.savedAt) - new Date(a.savedAt)
                    )
                )
            }
            catch (error) {
                console.error('Could not load inspirations:', error)
                setMessage('Your saved inspirations could not be loaded.')
            }
            finally {
                setLoading(false)
            }
        }
        loadInspirations()
    },[])

    const filteredPrompts = useMemo(() => {
        return prompts.filter((prompt) => {
            const matchesMood = selectedMood === 'All' || prompt.mood === selectedMood
            const term = searchTerm.trim().toLowerCase()
            const matchesSearch = !term || prompt.word.toLowerCase().includes(term) || prompt.prompt.toLowerCase().includes(term) || prompt.category.toLowerCase().includes(term)
            return matchesMood && matchesSearch
        })
    }, [selectedMood, searchTerm])
    function findNewSpark() {
        const availablePrompts = prompts.filter( 
            (prompt) => prompt.id !== selectedPrompt.id
        )
        const randomIndex = Math.floor(Math.random() * availablePrompts.length)
        setSelectedPrompt(availablePrompts[randomIndex])
        setMessage('')
    }
    function choosePrompt(prompt) {
        setSelectedPrompt(prompt)
        setMessage('')
    }
    function isSaved(id) {
        return savedItems.some((item) => item.sourceId === id)
    }
    async function savePrompt(prompt) {
        if (isSaved(prompt.id)) {
            setMessage('This inspiration is already in your collection.')
            return 
        }
        const record = {
            id: crypto.randomUUID(),
            sourceId: prompt.id,
            type: 'prompt',
            title: prompt.word,
            category: prompt.category,
            mood: prompt.mood,
            content: prompt.prompt,
            challange: prompt.challange,
            savedAt: new Date().toISOString(),
        }
        try {
            await addRecord('inspirations', record)
            setSavedItems((previous) => [record, ...previous])
            setMessage('Saved to your collection.')
        }
        catch (error) {
            console.error('Could not save inspiration:', error)
            setMessage('Could not save this inspiration. Please try again.')
        }
    }
    async function saveExperiment(experiment) {
        const alreadySaved = savedItems.some(
            (item) => item.sourceId === `experiment-${experiment.number}`
        )
        if (alreadySaved) {
            setMessage('This experiment is already saved.')
            return 
        }
        const record = {
            id: crypto.randomUUID(),
            sourceId: `experiment-${experiment.number}`,
            type: 'experiment',
            title: experiment.title,
            category: 'Writing-Experiment',
            content: experiment.description,
            challange: experiment.rule,
            savedAt: new Date().toISOString(),
        }
        try {
            await addRecord('inspirations', record)
            setSavedItems((previous) => [record, ...previous])
            setMessage('Experiment saved to your collection.')
        }
        catch (error) {
            console.error('Could not save experiment:', error)
            setMessage('Could not save this experiment.')
        }
    }
    function startWriting(item) {
        navigate('/writings', {
            state: {
                inspirationPrompt: {
                    title: item.title,
                    content: `${item.content}\n\n${item.challange ? `Writing challange: ${item.challange}\n\n` : ''}`,
                    type: item.category || 'Inspired Writing',
                },
            },
    })
    }

    function openNewFragment() {
        setEditingId(null)
        setFragmentTitle('')
        setFragmentContent('')
        setFragmentCategory('An idea')
        setShowFragmentForm(true)

    }
    function openEditFragment(item) {
        setEditingId(item.id)
        setFragmentTitle(item.title)
        setFragmentContent(item.content)
        setFragmentCategory(item.category || 'An idea')
        setShowFragmentForm(true)
    } 
    async function saveFragment() {
        event.preventDefault()
        if (!fragmentTitle.trim() || !fragmentContent.trim()) {
            setMessage('Please add both a title and your fragment.')
            return
        }

        const existing = editingId
            ? savedItems.find((item) => item.id === editingId)
            : null

        const record = {
            id: editingId || crypto.randomUUID(),
            sourceId: existing?.sourceId || null,
            type: 'fragment',
            title: fragmentTitle.trim(),
            category: fragmentCategory,
            content: fragmentContent.trim(),
            savedAt: existing?.savedAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        try {
            if (editingId) {
                await updateRecord('inspirations', record)
                setSavedItems((previous) =>
                    previous.map((item) => (item.id === editingId ? record : item))
                )
                setMessage('Your fragment has been updated.')
            }
            else {
                await addRecord('inspirations', record)
                setSavedItems((previous) => [record, ...previous])
                setMessage('A new fragment has found its place.')
            }
            setShowFragmentForm(false)
            setEditingId(null)
        }
        catch (error) {
            console.error('Could not save fragment:', error)
            setMessage('Could not save your fragment. Please try again.')
        }

    }

    async function removeSavedItem(id) {
        const confirmed = window.confirm(
            'Remove this inspiration from your collection?'
        )
        if (!confirmed) return
        try {
            await deleteRecord('inspirations', id)
            setSavedItems((previous) => previous.filter((item) => item.id !== id))
            setMessage('Removed from your collection.')
        }
        catch (error) {
            console.error('Could not delete inspiration:', error)
            setMessage('Could not remove this item. ')
        }
    }
    const fragments = savedItems.filter(
        (item) => item.type === 'fragment'
    )
    const visibleFragments = showAllFragments ? fragments : fragments.slice(0, 3)
    const savedPrompts = savedItems.filter((item) => item.type !== 'fragment')

    return (
        <div className="min-h-screen bg-paper px-5 py-8 md:py-10 xl:px-12">
            <div className="mx-auto max-w-7xl">
                <header className="mb-8">
                    <div className="mb-3 flex items-center gap-2 text-burgundy">
                        <Sparkles size={17} strokeWidth={1.6} />
                        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em]">
                            The creative corner
                        </span>

                    </div>
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h1 className="font-display text-4xl leading-tight text-ink md:text-5xl">
                                The Muse Room <span className="text-burgundy">.</span>
                            </h1>
                            <p className="mt-2 max-w-xl font-reading text-sm italic leading-7 text-ink-muted md:text-base">
                                A little space for the thoughts that have nowhere else to go.
                            </p>

                        </div>
                        <span className="font-sans text[10px] uppercase tracking-[0.18em] text-ink-muted ">
                            Collect thoughts . Create freely
                        </span>
                    </div>
                </header>

                <section className="relative isolate overflow-hidden rounded-[2rem] bg-forest px-6 py-10 text-white shadow-xl md:px-12 md:py-14">
                    <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10"/>
                    <div className="pointer-events-none absolute -right-4 -top-12 h-52 w-52 rounded-full border border-white/10"/>
                    <div className="pointer-events-none absolute bottom-0 right-12 font-display text-[15rem] leading-none text-white/[0.035]">
                         &ldquo;
                    </div>
                    <div className="relative max-w-3xl">
                        <p className="mb-5 font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E5B968]">
                            A place to begin again
                        </p>
                        <h2 className="font-display text-4xl font-normal leading-[1.12] tracking-tight text-paper md:text-6xl">
                            Somewhere between
                            <br className="hidden md:block" />
                            a thought and a sentence.
                        </h2>
                        <p className="mt-5 max-w-lg font-reading text-sm leading-7 text-white/75 md:text-base">
                            For the days when you have something to say,
                            but do not quite know where to begin.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <button 
                                type="button"
                                onClick={findNewSpark}
                                className="inline-flex items-center gap-2 rounded-xl bg-[#E5B968] px-5 py-3 text-sm font-semibold text-[#302F28] transition hover:bg-[#F0CA82] active:scale-[0.98]">
                                    <Sparkles size={16} />
                                    Find your spark
                                    <ArrowRight size={16} />
                                </button>
                                <a href="#daily-spark"
                                   className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm text-white transition hover:bg-white/10">
                                    Explore the room
                                    <ArrowDown size={15} />
                                   </a>
                        </div>
                    </div>
                    <div className="relative mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-5 font-sans text-[10px] uppercase tracking-[0.16em] text-white/55">
                        <span>Words without rules</span>
                        <span className="hidden sm:inline">.</span>
                        <span>Ideas without deadlines</span>
                        <span className="hidden sm:inline">.</span>
                        <span>A space of your own</span>
                    </div>
                </section>

                <section id="daily-spark" className="scroll-mt-8 py-12 md:py-16">
                    <SectionLabel number="01">
                        A word to begin with
                    </SectionLabel>
                    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="relative overflow-hidden rounded-3xl border border-paper-border bg-paper-card p-6 shadow-sm md:p-9">
                            <div className="absolute right-7 top-5 font-display text-8xl text-burgundy/10">
                                 &ldquo;
                            </div>
                            <div className="relative">
                                <div className="mb-6 flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-rose px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.13em] text-burgundy">
                                        Today's spark
                                    </span>
                                    <span className="text-xs text-ink-muted">
                                        {selectedPrompt.category}
                                    </span>
                                </div>
                                <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-ink-muted">
                                    The word is 
                                </p>
                                <h3 className="mt-2 font-display text-5xl italic leading-tight text-burgundy md:text-6xl">
                                    {selectedPrompt.word}
                                </h3>
                                <p className="mt-5 max-w-xl font-reading text-base leading-8 text-ink md:text-lg">
                                    {selectedPrompt.prompt}
                                </p>
                                <div className="mt-6 rounded-xl border-l-[3px] border-clay bg-paper px-4 py-3">
                                    <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-ink-muted">
                                        A little challange    
                                    </p> 
                                    <p className="font-reading text-sm italic leading-6 text-ink-brown">
                                        {selectedPrompt.challange}
                                    </p>
                                </div>
                                <div className="mt-7 flex flex-wrap items-center gap-3">
                                    <button
                                       type="button"
                                       onClick={() => startWriting(selectedPrompt)}
                                       className="inline-flex items-center gap-2 rounded-xl bg-burgundy px-5 py-3 text-sm font-medium text-white transition hover:bg-burgundy-dark active:scale-[0.98]">
                                            <PenLine size={16} />
                                            Begin writing
                                       </button>
                                       <button 
                                         type="button"
                                         onClick={() => savePrompt(selectedPrompt)}
                                         disabled={isSaved(selectedPrompt.id)}
                                         className="inline-flex items-center gap-2 rounded-xl border border-paper-border px-4 py-3 text-sm text-ink-brown transition hover:border-burgundy hover:text-burgundy disabled:cursor-not-allowed disabled:opacity-60">
                                            {isSaved(selectedPrompt.id) ? (
                                                  <BookmarkCheck size={16} />
                                            ) : (
                                                   <Bookmark size={16} />
                                            )     
                                            }
                                            {isSaved(selectedPrompt.id) ? 'Saved' : 'Save idea'}
                                         </button>

                                         <button
                                            type="button"
                                            onClick={findNewSpark}
                                            aria-label="Find another prompt"
                                            title="Find another prompt"
                                            className="rounded-xl border border-paper-border p-3 text-ink-muted transition hover:border-forest hover:text-forest">
                                                <RefreshCw size={16}/>

                                            </button>
                                </div>
                                <div className="mt-6 flex items-center gap-2 text-xs text-ink-muted">
                                    <Clock3 size={14} />
                                    {selectedPrompt.time}
                                    writing exercise
                                    <span>.</span>
                                    {selectedPrompt.mood}
                                </div>
                            </div>
                        </div>
                        <aside className="flex flex-col justify-between rounded-3xl bg-[#E9E8D9] p-6 md:p-8">
                            <div>
                                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-forest">
                                    A gentle reminder
                                </span>
                                <div className="my-6 h-px w-12 bg-forest/40"/>
                                <p className="font-display text-3xl italic leading-snug text-forest md:text-4xl">
                                    You do not need to know where a senternce is going to begin writing it.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center justify-between border-t border-forest/15 pt-5">
                                <span className="font-sans text-[10px] uppercase tracking-[0.16] text-forest/70">
                                    Permissing to begin
                                </span>
                                <Feather size={24} className="text-forest" strokeWidth={1.3} />

                            </div>
                        </aside> 
                    </div>
                </section>
                <section className="pb-12 md:pb-16">
                    <SectionLabel number="02">
                        Write by mood
                    </SectionLabel>
                    <div className="mb-6">
                        <h2 className="font-display text-3xl text-ink md:text-4xl">
                            What are you carrying today?
                        </h2>
                        <p className="mt-2 font-reading text-sm italic text-ink-muted">
                            Choose a feeling. Let it find its words.
                        </p>
                    </div>
                    <div className="mb-7 flex flex-wrap gap-2">
                        {moods.map((mood) => (
                            <Moodbutton
                               key={mood.name}
                               mood={mood}
                               active={selectedMood === mood.name}
                               onClick={() => setSelectedMood(mood.name)} />
                        ))}
                    </div>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <p className="rext-sm text-ink-muted">
                            {filteredPrompts.length}
                            inspirations to explore
                        </p>
                        <div className="relative w-full sm:w-64">
                            <Search 
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                                <input 
                                   type="search"
                                   value={searchTerm}
                                   onChange={(event) => setSearchTerm(event.target.value)}
                                   placeholder="Find a word or idea..."
                                   className="w-full rounded-xl border border-paper-border bg-paper-card py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/70 focus:border-burgundy" />

                        </div>
                    </div>
                    {filteredPrompts.length === 0 ? (
                         <div className="rounded-2xl border border-dashed border-paper-border bg-paper-card px-5 py-10 text-center">
                            <p className="font-reading italic text-ink-muted">
                                No sparks found. Try another word or mood.
                            </p>

                         </div>
                    ) : ( 
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {filteredPrompts.map((prompt, index) => (
                                <article
                                   key={prompt.id}
                                   className={`group flex flex-col rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-md ${
                                    index %3 === 1
                                    ? 'border-[#DDDCC9] bg-[#F0EFE3]'
                                    : index%3 === 2
                                     ? 'border-[#E5D5D0] bg-[#F4EAE5]'
                                     : 'border-paper-border bg-paper-card'}`} >
                                        <div className="mb-4 flex items-start justify-between gap-3">
                                            <div>
                                                <span className="font-sans text-[10px] uppercase tracking-[0.17em] text-ink-muted">
                                                    {prompt.category}
                                                </span>
                                                <h3 className="mt-1 font-display text-3xl italic text-burgundy">
                                                    {prompt.word}.
                                                </h3>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => savePrompt(prompt)}
                                                disabled={isSaved(prompt.id)}
                                                aria-label={isSaved(prompt.id) ? 'Already saved' : 'Save prompt'}
                                                className="rounded-full p-2 text-ink-muted transition hover:bg-white/70 hover:text-burgundy disabled:text-forest">
                                                    {isSaved(prompt.id) ? (
                                                        <BookmarkCheck size={18} />
                                                    ) : (
                                                        <Bookmark size={18} />

                                                    )
                                                    }
                                                </button>
                                        </div>
                                        <p className="flex-1 font-reading text-sm leading-7 text-ink-brown">
                                            {prompt.prompt}
                                        </p>
                                        <div className="mt-5 flex items-center justify-between border-t border-in/10 pt-4">
                                            <span className="text-xs text-ink-muted">
                                                {prompt.mood} · {prompt.time}
                                            </span>
                                            <button 
                                                type="button"
                                                onClick={() => choosePrompt(prompt)}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-burgundy transition hover:gap-2">
                                                    Explore 
                                                    <ArrowRight size={14}/>
                                                </button>
                                        </div>
                                     </article>
                            ))}
                        </div>
                    )    
                    }
                </section>
                <section className="pb-12 md:pb-16">
                    <SectionLabel number="03">
                        Little experiments
                    </SectionLabel>
                    <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="font-display text-3xl text-ink md:text-4xl">
                                Break a few writing rules.
                            </h2>
                            <p className="mt-2 font-reading text-sm italic text-ink-muted">
                                Small exercises. unexpected discoveries.
                            </p>
                        </div>
                        
                        <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-ink-muted">
                            {experiments.length} experiments
                        </span>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-paper-border bg-paper-card">
                        {experiments.map((experiment, index) => {
                            const saved = savedItems.some(
                                (item) =>
                                    item.sourceId === `experiment-${experiment.number}`
                            )

                            return (
                                <div
                                    key={experiment.number}
                                    className={`grid gap-4 p-5 md:grid-cols-[60px_minmax(0,1fr)_auto] md:items-center md:gap-6 md:p-7 ${
                                        index !== experiments.length - 1
                                            ? 'border-b border-paper-border'
                                            : ''
                                    }`}
                                >
                                    <span className="font-display text-3xl italic text-clay">
                                        {experiment.number}
                                    </span>

                                    <div>
                                        <h3 className="font-display text-2xl text-ink">
                                            {experiment.title}
                                        </h3>

                                        <p className="mt-2 max-w-2xl font-reading text-sm leading-7 text-ink-muted">
                                            {experiment.description}
                                        </p>

                                        <p className="mt-2 text-xs text-burgundy">
                                            Try this: {experiment.rule}
                                        </p>

                                        <span className="mt-3 inline-flex items-center gap-1 text-xs text-ink-muted">
                                            <Clock3 size={13} />
                                            {experiment.time}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2 md:flex-col">
                                        <button
                                            type="button"
                                            onClick={() => startWriting({
                                                title: experiment.title,
                                                content: experiment.description,
                                                challenge: experiment.rule,
                                                category: 'Writing experiment',
                                            })}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-medium text-white transition hover:bg-forest-dark"
                                        >
                                            <PenLine size={14} />
                                            Try it
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => saveExperiment(experiment)}
                                            disabled={saved}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-paper-border px-4 py-2.5 text-xs text-ink-brown transition hover:border-burgundy hover:text-burgundy disabled:opacity-60"
                                        >
                                            {saved ? (
                                                <Check size={14} />
                                            ) : (
                                                <Bookmark size={14} />
                                            )}

                                            {saved ? 'Saved' : 'Save'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
                <section className="pb-12 md:pb-16">
                    <SectionLabel number="04">
                        Fragments worth keeping
                    </SectionLabel>

                    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="font-display text-3xl text-ink md:text-4xl">
                                Not every thought needs an ending.
                            </h2>

                            <p className="mt-2 font-reading text-sm italic text-ink-muted">
                                Keep the ideas you are not ready to let go of.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={openNewFragment}
                            className="inline-flex items-center gap-2 rounded-xl bg-burgundy px-4 py-3 text-sm font-medium text-white transition hover:bg-burgundy-dark"
                        >
                            <Plus size={16} />
                            Add a fragment
                        </button>
                    </div>

                    {showFragmentForm && (
                        <form
                            onSubmit={saveFragment}
                            className="mb-7 rounded-3xl border border-paper-border bg-paper-card p-5 shadow-sm md:p-7"
                        >
                            <div className="mb-6 flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-burgundy">
                                        Your personal collection
                                    </p>

                                    <h3 className="mt-1 font-display text-2xl text-ink">
                                        {editingId ? 'Edit your fragment' : 'A thought of your own'}
                                    </h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowFragmentForm(false)}
                                    aria-label="Close fragment form"
                                    className="rounded-full p-2 text-ink-muted transition hover:bg-paper hover:text-burgundy"
                                >
                                    <X size={19} />
                                </button>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label
                                        htmlFor="fragment-title"
                                        className="mb-2 block text-xs font-medium text-ink-brown"
                                    >
                                        Give your thought a name
                                    </label>

                                    <input
                                        id="fragment-title"
                                        type="text"
                                        value={fragmentTitle}
                                        onChange={(event) => setFragmentTitle(event.target.value)}
                                        maxLength={100}
                                        placeholder="A thought I don't want to lose..."
                                        className="w-full rounded-xl border border-paper-border bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-burgundy"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="fragment-category"
                                        className="mb-2 block text-xs font-medium text-ink-brown"
                                    >
                                        This is...
                                    </label>

                                    <select
                                        id="fragment-category"
                                        value={fragmentCategory}
                                        onChange={(event) => setFragmentCategory(event.target.value)}
                                        className="w-full rounded-xl border border-paper-border bg-paper px-4 py-3 text-sm text-ink outline-none focus:border-burgundy"
                                    >
                                        {fragmentCategories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4">
                                <label
                                    htmlFor="fragment-content"
                                    className="mb-2 block text-xs font-medium text-ink-brown"
                                >
                                    Keep the thought here
                                </label>

                                <textarea
                                    id="fragment-content"
                                    value={fragmentContent}
                                    onChange={(event) => setFragmentContent(event.target.value)}
                                    rows={5}
                                    maxLength={5000}
                                    placeholder="It began with a thought..."
                                    className="w-full resize-y rounded-xl border border-paper-border bg-paper px-4 py-3 font-reading text-sm leading-7 text-ink outline-none placeholder:text-ink-muted/60 focus:border-burgundy"
                                    required
                                />
                            </div>

                            <div className="mt-5 flex flex-wrap justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowFragmentForm(false)}
                                    className="rounded-xl border border-paper-border px-4 py-3 text-sm text-ink-brown transition hover:bg-paper"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-xl bg-forest px-5 py-3 text-sm font-medium text-white transition hover:bg-forest-dark"
                                >
                                    <Check size={16} />
                                    {editingId ? 'Update fragment' : 'Save fragment'}
                                </button>
                            </div>
                        </form>
                    )}

                    {loading ? (
                        <div className="flex items-center gap-2 py-10 text-sm text-ink-muted">
                            <LoaderCircle size={17} className="animate-spin" />
                            Gathering your fragments...
                        </div>
                    ) : fragments.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-paper-border bg-paper-card px-5 py-12 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose">
                                <Feather size={23} className="text-burgundy" />
                            </div>

                            <h3 className="mt-4 font-display text-2xl text-ink">
                                A blank page, for now.
                            </h3>

                            <p className="mx-auto mt-2 max-w-md font-reading text-sm italic leading-7 text-ink-muted">
                                Save a passing thought, a story seed, or a line
                                that might become something beautiful someday.
                            </p>

                            <button
                                type="button"
                                onClick={openNewFragment}
                                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-burgundy hover:text-burgundy-dark"
                            >
                                <Plus size={16} />
                                Keep your first fragment
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                {visibleFragments.map((fragment, index) => (
                                    <article
                                        key={fragment.id}
                                        className={`relative rounded-2xl border p-5 ${
                                            index % 3 === 1
                                                ? 'border-[#DDDCC9] bg-[#F0EFE3]'
                                                : index % 3 === 2
                                                    ? 'border-[#E5D5D0] bg-[#F4EAE5]'
                                                    : 'border-paper-border bg-paper-card'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="rounded-full bg-white/70 px-3 py-1 text-[10px] uppercase tracking-[0.13em] text-ink-muted">
                                                {fragment.category}
                                            </span>

                                            <div className="flex gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => openEditFragment(fragment)}
                                                    title="Edit fragment"
                                                    aria-label="Edit fragment"
                                                    className="rounded-lg p-2 text-ink-muted transition hover:bg-white/80 hover:text-forest"
                                                >
                                                    <PenLine size={15} />
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => removeSavedItem(fragment.id)}
                                                    title="Delete fragment"
                                                    aria-label="Delete fragment"
                                                    className="rounded-lg p-2 text-ink-muted transition hover:bg-white/80 hover:text-burgundy"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="mt-4 font-display text-2xl text-ink">
                                            {fragment.title}
                                        </h3>

                                        <p className="mt-3 whitespace-pre-wrap font-reading text-sm leading-7 text-ink-brown">
                                            {fragment.content}
                                        </p>

                                        <div className="mt-5 border-t border-ink/10 pt-3 text-xs text-ink-muted">
                                            Saved {new Date(fragment.savedAt).toLocaleDateString()}
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {fragments.length > 3 && (
                                <button
                                    type="button"
                                    onClick={() => setShowAllFragments((previous) => !previous)}
                                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-burgundy transition hover:gap-3"
                                >
                                    {showAllFragments ? 'Show less' : `View all ${fragments.length} fragments`}
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform ${showAllFragments ? 'rotate-180' : ''}`}
                                    />
                                </button>
                            )}
                        </>
                    )}
                </section>
                <section className="pb-12 md:pb-16">
                    <SectionLabel number="05">
                        Your saved inspirations
                    </SectionLabel>

                    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="font-display text-3xl text-ink md:text-4xl">
                                Things worth returning to.
                            </h2>

                            <p className="mt-2 font-reading text-sm italic text-ink-muted">
                                Your collection of sparks and possibilities.
                            </p>
                        </div>

                        <span className="font-sans text-xs text-ink-muted">
                            {savedItems.length} saved
                        </span>
                    </div>
                    {loading ? (
                        <p className="py-5 text-sm text-ink-muted">
                            Opening your collection...
                        </p>
                    ) : savedPrompts.length === 0 ? (
                        <div className="rounded-2xl border border-paper-border bg-paper-card p-6">
                            <p className="font-reading text-sm italic text-ink-muted">
                                The ideas you save will find a home here.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3 md:grid-cols-2">
                            {savedPrompts.map((item) => (
                                <article
                                    key={item.id}
                                    className="flex flex-col rounded-2xl border border-paper-border bg-paper-card p-5 transition hover:shadow-sm"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="font-sans text-[10px] uppercase tracking-[0.16em] text-burgundy">
                                            {item.category}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => removeSavedItem(item.id)}
                                            aria-label="Remove saved inspiration"
                                            className="rounded-lg p-2 text-ink-muted transition hover:bg-rose hover:text-burgundy"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <h3 className="mt-2 font-display text-2xl text-ink">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 flex-1 font-reading text-sm leading-7 text-ink-muted">
                                        {item.content}
                                    </p>

                                    {item.challenge && (
                                        <p className="mt-3 border-l-2 border-clay pl-3 font-reading text-xs italic leading-6 text-ink-brown">
                                            {item.challenge}
                                        </p>
                                    )}

                                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-paper-border pt-4">
                                        <span className="text-xs text-ink-muted">
                                            {item.mood || 'Saved inspiration'}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => startWriting(item)}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-burgundy transition hover:gap-2"
                                        >
                                            Write from this
                                            <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
                <footer className="border-t border-paper-border py-8 text-center">
                    <Feather
                        size={20}
                        className="mx-auto mb-3 text-burgundy"
                        strokeWidth={1.4}
                    />
                    <p className="font-display text-2xl italic text-ink">
                        Let the words find their way.
                    </p>
                    <p className="mt-2 font-sans text-[9px] uppercase tracking-[0.2em] text-ink-muted">
                        A little room for the unfinished · Ink & Soul
                    </p>
                </footer>
                {message && (
                    <div
                        role="status"
                        className="fixed bottom-5 right-5 z-50 max-w-sm rounded-xl border border-paper-border bg-paper-card px-5 py-3 text-sm text-forest shadow-lg"
                    >
                        <div className="flex items-center gap-2">
                            <Check size={16} />
                            {message}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default InspirationPage