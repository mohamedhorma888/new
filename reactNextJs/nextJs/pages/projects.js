import Image from 'next/image'
import Layout from '../components/Layout'

const projects = [
  { id:1, title:'Project One', img:'/images/project1.svg', desc:'A demo app built with Next.js' },
  { id:2, title:'Project Two', img:'/images/project2.svg', desc:'Another app showcasing features' }
]

export default function Projects(){
  return (
    <Layout>
      <section style={{padding:'2rem'}}>
        <h2>Projects</h2>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
          {projects.map(p=> (
            <article key={p.id} style={{border:'1px solid #ddd',padding:12}}>
              <Image src={p.img} alt={p.title} width={640} height={360} />
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </Layout>
  )
}
