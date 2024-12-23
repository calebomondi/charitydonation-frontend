import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../Home/home';
import Donate from '../donations/donate';
import MyDonations from '../donations/mydonations';


const AuthenticatedApp: React.FC = () => {

    return (
        <Routes>
            <Route
                path="/"
                element={<Home />}
            />
            <Route
                path="/donate"
                element={<Donate />}
            />
            <Route
                path="/my-donations"
                element={<MyDonations />}
            />
            <Route
                path="/fundraisers"
                element={''}
            />
            <Route
                path="/my-fundraisers"
                element={''}
            />
        </Routes>
    );
  };

// Main Header component
export default function MyRoutes() {
    return (
        <Router>
            <AuthenticatedApp />
        </Router>
    );
}