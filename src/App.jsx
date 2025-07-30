
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import NavBar from './main-pages/NavBar'
import {Button} from './components/ui/button'
import AddDogPage from './main-pages/AddDog'
import ShowDog from './main-pages/ShowDog'
import DogDetails from './main-pages/DogDetails'
import Dashboard from './main-pages/Dashboard'
function App() {
  

  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/add-dog' element={<AddDogPage/>}/>
      <Route path='/' element={<ShowDog/>}/>
      <Route path='/dog/:id' element={<DogDetails/>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
