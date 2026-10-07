import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './features/Home'
import About from './features/About'
import Project_Details from './features/Project_Details'

let router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  }, {
    path: "/about",
    element: <About />
  }, {
    path: "/project/:slug",
    element: <Project_Details />
  }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
