
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import NavBar from './NavBar'
import {Button} from './components/ui/button'
import AddDogPage from './AddDog'
import ShowDog from './ShowDog'
function App() {
  

  return (
    <BrowserRouter>
      <NavBar/>
      <Routes>

      <Route path='/add-dog' element={<AddDogPage/>}/>
      <Route path='/' element={<ShowDog/>}/>

      </Routes>
    </BrowserRouter>
  )
}

export default App
