export default function Card({ title, description }) {
    return (
        <>
            <div className="flex-col w-xs  items-center justify-center  p-6 gap-2 rounded-3xl border-4 border-indigo-500 bg-slate-800 hover:bg-slate-900 transition duration-300 shadow-2xl hover:shadow-indigo-500">
                <div className="text-3xl py-6 px-5  text-center  text-amber-700 font-semibold"> {title} </div>
                <div className="text-[0.9em] pb-5 px-5 text-center leading-7"> {description} </div>
            </div>

        </>
    )
}