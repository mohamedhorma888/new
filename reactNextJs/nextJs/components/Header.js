import Link from 'next/link'

export default function Header(){
  return (
    <header className="site-header">
      <div className="container">
        <h1 className="site-title">My Portfolio</h1>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
