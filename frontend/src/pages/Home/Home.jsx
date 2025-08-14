import React from 'react'
import MovieSection from '../../components/MovieSection/MovieSection'
import CinemaSection from '../../components/CinemaSection/CinemaSection'
import './Home.css'

const Home = () => {
  return (
    <div className="home-page">
      <MovieSection />
      <CinemaSection />
    </div>
  )
}

export default Home
