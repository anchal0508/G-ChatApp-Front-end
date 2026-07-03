import { Link, Outlet } from "react-router-dom"
import './App.css';

function App() {

  return (
    <div className="base">
      <nav>
        <Link to='/'>Login</Link>
        <Link to='/signup'>SignUp</Link>
      </nav>

      <Outlet />

      <footer>
        Group Chat Application
      </footer>
    </div>
  )
}

export default App
