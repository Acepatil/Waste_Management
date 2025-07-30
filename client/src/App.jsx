import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext";
import HomePage from "./ui/HomePage";
import PageNotFound from "./utils/PageNotFound";
import ActiveSideBar from "./components/ActiveSidebar";
import AddSideBar from "./components/AddSideBar";
import CompletedSideBar from "./components/CompletedSideBar";
import PendingSideBar from "./components/PendingSideBar";
import RequestSideBar from "./components/RequestSideBar";
import Login from "./pages/Login";
import { UserProvider } from "./context/UserContext";
import Register from "./pages/Register";
import ProtectedRoute from "./pages/Protected";

function App() {
  return (
    <Router>
      <TaskProvider>
        <UserProvider>
          <Routes>
            <Route path="/"  element={<HomePage />}>
              <Route path="/home" element={<ActiveSideBar />} />
              <Route
                path="/add"
                element={
                  <ProtectedRoute>
                    <AddSideBar />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/completed" element={<CompletedSideBar />} />
              <Route path="/pending" element={<PendingSideBar />} />
              <Route
                path="/pending/admin"
                element={
                  <ProtectedRoute>
                    <RequestSideBar/>
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </UserProvider>
      </TaskProvider>
    </Router>
  );
}

export default App;
