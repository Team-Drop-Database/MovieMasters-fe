'use client'

export default function AddToWatchListButton({params}: {
  params: Promise<{id: number}>
}) {

  // Handler for adding a movie to the users watchlist
  const handleAddMovieToWatchlist = () => {
    console.log('boe!');
  }

  return <button className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-xl
  hover:shadow-xl shadow:blue outline hover:ring-2  outline-1 outline-blue-600
   hover:bg-blue-400 transition-all" onClick={handleAddMovieToWatchlist}>Add to my watchlist</button>;
}