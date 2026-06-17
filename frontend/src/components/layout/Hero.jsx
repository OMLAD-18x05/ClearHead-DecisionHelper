import { Link } from 'react-router-dom'
import Button from '../ui/Button'

export default function Hero(){
    return(
        <>
           <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
                    <span className="inline-block text-xl font-semibold tracking-widest uppercase text-indigo-500 dark:text-indigo-400 mb-4">
                      Decision scoring tool
                    </span>
                    <h1 className="text-6xl font-extrabold leading-tight tracking-tight text-zinc-900 dark:text-white mb-6">
                      Stop agonizing.<br />
                      <span className="text-indigo-600 dark:text-indigo-400">Start deciding.</span>
                    </h1>
                    <p className="text-xl text-zinc-500 dark:text-zinc-300 max-w-xl mx-auto mb-10">
                      ClearHead turns messy decisions into structured scores. Define your criteria,
                      weight what matters, and let the numbers cut through the noise.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      {/**later add references */}
                      <Link to='/register'>
                      <Button className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors flex" size='lg' > Get started free </Button>
                      </Link>
                    </div>
                  </section>
        </>
    )
}