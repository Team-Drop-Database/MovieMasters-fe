
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

    // List of user-subscribed movies, to be pulled from a backend
    const movies: MovieData[] = [
        new MovieData("Star Trek", "https://upload.wikimedia.org/wikipedia/en/3/39/R2-D2_Droid.png", "some vid url", true),
        new MovieData("Star Trek", "https://upload.wikimedia.org/wikipedia/en/3/39/R2-D2_Droid.png", "some vid url", true),
        new MovieData("Star Trek", "https://upload.wikimedia.org/wikipedia/en/3/39/R2-D2_Droid.png", "some vid url", true),
        new MovieData("Star Trek", "https://upload.wikimedia.org/wikipedia/en/3/39/R2-D2_Droid.png", "some vid url", false)
    ];

    const watchedMovies: MovieData[] = movies.filter((movie: MovieData) => movie.hasWatched());
    const planToWatchMovies: MovieData[] = movies.filter((movie: MovieData) => !movie.hasWatched());

    const mapMoviesToList = (movies: MovieData[]) => {
        return movies.map((movie: MovieData, index: number) => 
            <div key={index}>
                <img src={movie.getThumbnail()} 
                width={50} 
                height={50} 
                alt={`${movie.getName()}_thumbnail.png`}/>
                <h3>{movie.getName()}</h3>
            </div>);
    }

    return (
        <div>
            <h1>Watched</h1>
            {mapMoviesToList(watchedMovies)}
            <h1>Plan to watch</h1>
            {mapMoviesToList(planToWatchMovies)}
        </div>
    );
}