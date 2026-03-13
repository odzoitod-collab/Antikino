import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SiteConfigProvider } from './context/SiteConfigContext';
import Layout from './components/Layout';
import LogPageView from './components/LogPageView';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Booking from './pages/Booking';
import Addons from './pages/Addons';
import Contacts from './pages/Contacts';
import Chat from './pages/Chat';

export default function App() {
  return (
    <BrowserRouter>
      <SiteConfigProvider>
        <LogPageView />
        <ScrollToTop />
        <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="room/:id" element={<RoomDetails />} />
          <Route path="booking" element={<Booking />} />
          <Route path="addons" element={<Addons />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="chat" element={<Chat />} />
        </Route>
        </Routes>
      </SiteConfigProvider>
    </BrowserRouter>
  );
}
