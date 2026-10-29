import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './features/Home'
import About from './features/About'
import Project_Details from './features/Project_Details'
import AppLayout from './layout/AppLayout'

let router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
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
    ]
  }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
