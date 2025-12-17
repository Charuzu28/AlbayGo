import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App(){
  return(
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App