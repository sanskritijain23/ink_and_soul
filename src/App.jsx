import { BrowserRouter, Routes, Route } from "react-router-dom"
import AppLayout from "./components/layout/AppLayout"
import Dashboard from "./features/dashboard/Dashboard"
import WritingEditor from "./features/writings/WritingEditor"
import ReadingJournal from "./features/reading/ReadingJournal"
import QuotesPage from "./features/quotes/QuotesPages"
import InspirationPage from "./features/inspiration/InspirationPage"

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


        <Route 
          path="/quotes"
          element={
            <AppLayout>
              <QuotesPage />

            </AppLayout>
          }
        />
       <Route
          path="/inspiration"
          element={
            <AppLayout>
              <InspirationPage/>
            </AppLayout>
          }
        />
      </Routes>

    </BrowserRouter>
  )
}

export default App