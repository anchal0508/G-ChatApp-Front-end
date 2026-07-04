import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './site/Login.tsx'
import SignUp from './site/SignUp.tsx'
import Dashboard from './site/Dashboard.tsx'
import ProtectedRoutes from './ProtectedRoutes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />} >
          <Route path='/' element={<Login />}>Login</Route>
          <Route path='/signup' element={<SignUp />}>SignUp</Route>

          <Route element={<ProtectedRoutes />}>
            <Route path='/dashboard' element={<Dashboard />}>Dashboard</Route>
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
