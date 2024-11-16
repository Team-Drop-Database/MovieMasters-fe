
export default function MyWatchList() {

    // Temporary, to be moved to a 'models' folder later
    class MovieData {
        private name: string;
        private thumbnail: string;
        private trailer: string;
        private watched: boolean;

        constructor(name: string, thumbnail: string, trailer: string, watched: boolean){
            this.name = name;
            this.thumbnail = thumbnail;
            this.trailer = trailer;
            this.watched = watched;
        }

        public getName(){
            return this.name;
        }

        public getThumbnail(){
            return this.thumbnail;
        }

        public getTrailer(){
            return this.trailer;
        }

        public hasWatched(){
            return this.watched;
        }
    }

    // List of a users' movies, to be pulled from a backend
    const movies: MovieData[] = [
        new MovieData("Star Trek", "https://s2.qwant.com/thumbr/474x266/d/b/a8e1eb36ade7f72b895f4bec16cf3244776395b10e6c1a455afdc19bdbb41e/th.jpg?u=https%3A%2F%2Ftse.mm.bing.net%2Fth%3Fid%3DOIP.mq7s159Oqsy0Vv0TPQRdLgHaEK%26pid%3DApi&q=0&b=1&p=0&a=0", "some vid url", true),
        new MovieData("The Super Mario Bros Movie", "https://s2.qwant.com/thumbr/474x729/5/2/b8d9efeea00a7f0d36d92e8700f0b02813bbc9d0566c03ce4fcfaad0b04c0a/th.jpg?u=https%3A%2F%2Ftse.mm.bing.net%2Fth%3Fid%3DOIP.fxDUMakGNNPNmwP_sysnwwHaLZ%26pid%3DApi&q=0&b=1&p=0&a=0", "some vid url", true),
        new MovieData("The Starving Games", "https://m.media-amazon.com/images/S/pv-target-images/fe59fe64d6bb431fd8d9dcf7466d5924d1d73b0e04f26f6036b7c3bb78a830c7.jpg", "some vid url", true),
        new MovieData("The Room", "https://m.media-amazon.com/images/M/MV5BYmNkMThiODYtZTAzMC00ODJkLTg5MmEtMWIyMGFlZDlkYmNlXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg", "some vid url", false),
        new MovieData("Iron Sky: The Coming Race", "https://m.media-amazon.com/images/M/MV5BMzgzODhkY2QtZGMwMi00NDczLTkyN2ItNzUxYzMwMGVlZjgzXkEyXkFqcGc@._V1_.jpg", "some vid url", false),
        
    ];

    // Divide the list of movies into watched and unwatched
    const watchedMovies: MovieData[] = movies.filter((movie: MovieData) => movie.hasWatched());
    const planToWatchMovies: MovieData[] = movies.filter((movie: MovieData) => !movie.hasWatched());

    // Returns a list of movies in JSX format
    const mapMoviesToList = (movies: MovieData[]) => {
        return movies.map((movie: MovieData, index: number) => 
            <div className="flex flex-col items-center max-w-[190px]" key={index}>
                <div className=" w-full h-full">
                    <img className="object-cover w-[185px] h-[185px]" src={movie.getThumbnail()} 
                    alt={`${movie.getName()}_thumbnail.png`}/>
                </div>
                <h3 className="text-l mt-2 text-center">{movie.getName()}</h3>
            </div>);
    }

    return (
        <div className="flex flex-col items-left gap-10 py-10 px-10">
            <div className=" p-4">
                <h1 className="text-2xl">Watched</h1>
                <div className="flex gap-5 mt-2 py-4">
                    {mapMoviesToList(watchedMovies)}
                </div>
            </div>
            <div className=" p-4">
                <h1 className="text-2xl">Plan to watch</h1>
                <div className="flex gap-5 mt-2 py-4">
                    {mapMoviesToList(planToWatchMovies)}
                </div>
            </div>
        </div>
    );
}