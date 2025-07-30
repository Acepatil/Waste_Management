
import Header from './Header';
import Footer from './Footer';
import InMap from '../components/Map';
import '../styles/HomePage.css';
import { Outlet } from 'react-router';

function HomePage() {
    return (
        <div className="page-container">
            <Header />
            <div className="main-content">
                <Outlet/>
                <InMap />
            </div>
            <Footer />
        </div>
    );
}

export default HomePage;
