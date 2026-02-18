import Layout from '../components/Layout'

export default function Contact(){
  return (
    <Layout>
      <section style={{padding:'2rem',maxWidth:700}}>
        <h2>Contact</h2>
        <p>If you'd like to get in touch, email me at <a href="mailto:you@example.com">you@example.com</a>.</p>
        <form style={{display:'grid',gap:8}} onSubmit={(e)=>{e.preventDefault();alert('Replace with real handler')}}>
          <input placeholder="Your name" />
          <input placeholder="Your email" />
          <textarea placeholder="Message" rows={6} />
          <button type="submit">Send</button>
        </form>
      </section>
    </Layout>
  )
}
