import Image from 'next/image'
import Layout from '../components/Layout'
import styles from '../styles/Home.module.css'

export default function Home(){
  return (
    <Layout>
      <section className={styles.hero}>
        <div className={styles.profile}>
          <Image src="/images/profile.svg" alt="Profile" width={160} height={160} />
        </div>
        <h2>Hello — I'm a Frontend Developer</h2>
        <p>I build accessible, performant web applications using React and Next.js.</p>
      </section>

      <section className={styles.skills}>
        <h3>Skills</h3>
        <ul>
          <li>React / Next.js</li>
          <li>TypeScript / JavaScript</li>
          <li>CSS Modules / Styled components</li>
        </ul>
      </section>

      <section className={styles.projectsPreview}>
        <h3>Featured Projects</h3>
        <div className={styles.grid}>
          <div className={styles.card}>
            <Image src="/images/project1.svg" alt="Project 1" width={400} height={220} />
            <h4>Project One</h4>
            <p>Short description of project one.</p>
          </div>
          <div className={styles.card}>
            <Image src="/images/project2.svg" alt="Project 2" width={400} height={220} />
            <h4>Project Two</h4>
            <p>Short description of project two.</p>
          </div>
        </div>
      </section>
    </Layout>
  )
}
