import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './SignupForm';
import LoginForm from './LoginForm';
import Home from './Home';
import HRJobPost from './hr';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './AuthContext'; // Make sure you have this file set up
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import CandidateDashboard from './candidate';
import ApplyJob from './ApplyJob';
import HRJobs from './HRJobs';
import JobResumes from './JobResumes';
import Logout from './Logout';
import ResumeAnalyzer from './ResumeAnalyzer';
import Chatbot from './Chatbot';
library.add(fas);

function App() {
  return (
    <AuthProvider>
      <Router>
      <Chatbot />
        <div className="min-h-screen bg-gray-100 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/candidate" element={<CandidateDashboard />} />
            <Route path="/apply/:jobId" element={<ApplyJob />} />
            <Route path="/hrjobs" element={<HRJobs />} />
            <Route path="/jobs/:job_id" element={<JobResumes />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/hr" element={<HRJobPost />} />
            <Route path="/analyze-resume" element={<ResumeAnalyzer />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
