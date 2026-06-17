//import { useState } from "react"

import Navbar from "../components/layout/Navbar";
import SimpleCard from "../components/ui/SimpleCard";
import Hero from '../components/layout/Hero'
export default function HomePage() {
  //const [dark, setDark] = useState(false)

  return (
    <>
      <div className="h-full dark:bg-slate-950 text-slate-900 dark:text-cyan-50">
        <div className="h-150 rounded-b-[15em] bg-indigo-100 dark:bg-slate-800  transition-colors duration-300 font-serif shadow-indigo-500/50 shadow-xl border-b border-indigo-500">
          <Navbar />
          {/* Hero Section */}
         <Hero />
        </div>

        {/**How it works section */}
          <section id="#how-it-works" className=" py-30 flex justify-center gap-25">
          <SimpleCard title='Score your options' description="Assign criteria and weights to each option. Get a clear numeric score so gut feeling doesn't hijack logic." />
          <SimpleCard title="Define what Matters" description="Build a criteria list that reflects your actual priorities — not a generic checklist."/>
          <SimpleCard title="Your decisions are PRIVATE" description="Every decision lives under your account. No sharing, no tracking, no noise."/>
          </section>
      </div>
    </>
  )
}
