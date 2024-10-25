import { BrowserRouter as Router } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MeetingsProvider } from './context/MeetingsContext';
import { TaskAssignmentsProvider } from './context/TaskAssignmentsContext';
import { ProjectProvider } from "./context";
import { PlannProvider } from "./context/PlannContext"; // Asegúrate de importar esto
import { TestCaseProvider } from './context/TestsCasesContext'; // Importa el contexto de TestCase

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <ProjectProvider>
        <MeetingsProvider>
          <TaskAssignmentsProvider>
            <PlannProvider>
              <TestCaseProvider> {/* Añade el contexto de TestCase aquí */}
                <Router>
                  <AnimatePresence mode="wait">
                    <AppRoutes />
                  </AnimatePresence>
                </Router>
              </TestCaseProvider>
            </PlannProvider>
          </TaskAssignmentsProvider>
        </MeetingsProvider>
      </ProjectProvider>
    </>
  );
}

export default App;
