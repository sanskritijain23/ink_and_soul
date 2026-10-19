
import Sidebar from './Sidebar'


function AppLayout ({ children }){
    return (
        <div className="flex min-h-screen bg-paper text-ink">
            <Sidebar />
            <main className="min-w-0 flex-1">
                {children}
            </main>
        </div>
    )
}

export default AppLayout