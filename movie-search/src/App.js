import "./App.css";
import { useEffect, useState } from "react";
const apiKey = process.env.REACT_APP_OMDB_API_KEY;

function App() {
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [triggerSearch, setTriggerSearch] = useState(false);

  useEffect(() => {
    // fetch(`https://www.omdbapi.com/?apikey=76fc6c1e&s=batman`)
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`)
      .then((response) => {
        if (!response.ok) {
          throw new console.Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [triggerSearch]);

  console.log(data);

  let paragraphs = [];
  if (data && data.Search && data.Search.length !== 0) {
    for (let i = 0; i < data.Search.length; i++) {
      paragraphs.push(
        <div key={data.Search[i].imdbID}>
          <p>{data.Search[i].Title}</p>
          <p>{data.Search[i].Year}</p>

          <img src={data.Search[i].Poster}></img>
        </div>
      );
    }
  }

  function handleSearch() {
    console.log(searchTerm);
    console.log(`https://www.omdbapi.com/?apikey=76fc6c1e&s=${searchTerm}`);
    setTriggerSearch(!triggerSearch);
  }

  return (
    <div className="App">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      ></input>
      <button onClick={handleSearch}>Search</button>

      <div>
        {data && data.Search && data.Search.length !== 0
          ? paragraphs
          : "What movie are you looking for?"}
      </div>
    </div>
  );
}

export default App;
