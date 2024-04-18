import { Outlet } from 'react-router-dom';
import Header from './Header';
import 'bootstrap/dist/css/bootstrap.min.css';

const FullLayout = () => {
  return (
    <>
      <header className="App-header">
        <Header />
      </header>
      <main>
        <div className="container-fluid container-xxl">
          <Outlet />
        </div>
      </main>
    </>
  );
};
export default FullLayout;
