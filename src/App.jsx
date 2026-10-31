import { BrowserRouter, Routes, Route } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import Dashboard from "./features/dashboard/Dashboard"
import WritingEditor from "./features/writings/WritingEditor"
import ReadingJournal from "./features/reading/ReadingJournal"

function App() {
  return (
    <BrowserRouter>
       <Routes>
         <Route
          path="/"
          element={
             <AppLayout>
              <Dashboard />
             </AppLayout>
          }
        />

        <Route
          path="/writings"
          element={
            <AppLayout>
              <WritingEditor />
            </AppLayout>
          }

          />

        <Route 
          path="/reading-journal"
          element={
            <AppLayout>
              <ReadingJournal />
            </AppLayout>
          }
        />
       </Routes>
    </BrowserRouter>
  )
}

export default App