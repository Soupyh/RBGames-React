import Router from './router'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App(){
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="container py-4 flex-fill">
        <Router />
      </main>
      <Footer />
    </div>
  )
}