import "./App.css";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
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
        <Col
          Key={data.Search[i].imdbID}
          xs={12}
          sm={6}
          md={4}
          lg={3}
          className="mb-4"
        >
          <div className="movie-card text-center">
            <p>{data.Search[i].Title}</p>
            <p>{data.Search[i].Year}</p>
            <img
              src={data.Search[i].Poster}
              alt={`${data.Search[i].Title} poster`}
              className="img-fluid"
            ></img>
          </div>
        </Col>
      );
    }
  }

  function handleSearch() {
    console.log(searchTerm);
    console.log(`https://www.omdbapi.com/?apikey=76fc6c1e&s=${searchTerm}`);
    setTriggerSearch(!triggerSearch);
  }
  function clearSearch() {
    setData(null);
    setSearchTerm("");
  }
  return (
    <div className="App">
      <div className="search-div">
        <Form.Control
          value={searchTerm}
          placeholder="Search..."
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        ></Form.Control>
        {/* <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        ></input> */}
        <div className="search-buttons">
          <Button onClick={handleSearch}>Search</Button>
          <Button variant="outline-primary" onClick={clearSearch}>Clear Search</Button>
        </div>
      </div>
       {data && data.Search && data.Search.length !== 0 ? `I've found ${data.Search.length} results for "${searchTerm}"`
           :"" }
      <Container className="results-div">
        <Row>
          {data && data.Search && data.Search.length !== 0 ? (
            paragraphs
          ) : (
            <Col>What movie are you looking for?</Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default App;
