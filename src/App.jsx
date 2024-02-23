import './App.scss'
import { NavLink, Route, Routes } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import logo from './assets/logo.svg'
import GamePage from './pages/GamePage'
import Games from './pages/Games'
import HomePage from './pages/HomePage'
import NotFound from './pages/NotFound'
import PublisherPage from './pages/PublisherPage'
import Publishers from './pages/Publishers'
import SignUser from './components/SignUser'

function App() {

  const { user, logOut } = useUser();
  
  return (
    <div className='app-wrapper'>

      <nav className='main-navbar'>
          <div className='nav-logo'>
            <NavLink className={'navlink logo-link'} to={'/'} element={<HomePage/>}>
              <div className='logo-user-wrapper'>
                <figure className='logo-wrapper'>
                  <img src={logo} alt="IndieGames"/>
                </figure>
                <p className='user'>{user?.email}</p>
              </div>
            </NavLink>
          </div>
          {user &&
            <menu>
              <li>
                <NavLink className={'navlink'} to={'/publishers'} element={<Publishers/>}>Publishers</NavLink>
              </li>
              <li>
                <NavLink className={'navlink'} to={'/games'} element={<Games/>}>Games</NavLink>
              </li>
              <li>
              <NavLink 
                onClick={e => logOut()}
                className={'navlink'} to={'/'} element={<HomePage/>}>Log Out</NavLink>
              </li>
            </menu>
          }
          {!user &&
            <menu>
              <li>
                <NavLink className={'navlink'} to={'/signup'} element={<SignUser type='signup'/>}>Sign Up</NavLink>
              </li>
              <li>
                <NavLink className={'navlink'} to={'/login'} element={<SignUser type='login'/>}>Log In</NavLink>
              </li>
            </menu>
          }
      </nav>

      <Routes>
        <Route path={'/'} element={<HomePage/>}/>
        <Route path={'/signup'} element={<SignUser type='signup'/>}/>
        <Route path={'/login'} element={<SignUser type='login'/>}/>
        <Route path={'/publishers'}>
          <Route index element={<Publishers/>}/>
          <Route path={':slug'} element={<PublisherPage/>}/>
        </Route>
        <Route path={'/games'}>
          <Route index element={<Games/>}/>
          <Route path={':slug'} element={<GamePage/>}/>
        </Route>
        <Route path={'*'} element={<NotFound/>}/>
      </Routes>
      
    </div>
  )
}

export default App
