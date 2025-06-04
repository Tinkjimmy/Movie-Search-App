import "./App.css";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Navbar from "./components/Navbar";
const apiKey = process.env.REACT_APP_OMDB_API_KEY;

function App() {
  const [data, setData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // querying the API for movies with typed Title
  useEffect(() => {
    if (!searchTerm) {
      setLoading(true);
    }

    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`)
      .then((response) => {
        if (!response.ok) {
          throw new console.Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [triggerSearch]);

  // get selected movies detail to show in the modal

  const handleMovieClick = async (imdbID) => {
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`
      );
      const movie = await res.json();
      setSelectedMovie(movie);
      setShowModal(true);
    } catch (err) {
      console.err("Failed to fetch movie details", err);
    }
  };

  // create the moviecards array

  let paragraphs = [];
  if (data && data.Search && data.Search.length !== 0) {
    for (let i = 0; i < data.Search.length; i++) {
      paragraphs.push(
        <Col
          key={data.Search[i].imdbID}
          xs={12}
          sm={6}
          md={4}
          lg={3}
          className="mb-4"
        >
          <div
            className="movie-card text-center"
            onClick={() => handleMovieClick(data.Search[i].imdbID)}
            style={{ cursor: "pointer" }}
          >
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
    console.log(`https://www.omdbapi.com/?apikey=76fc6c1e&s=${searchTerm}`);
    setTriggerSearch(!triggerSearch);
  }
  function clearSearch() {
    setData(null);
    setSearchTerm("");
  }

  return (
    <div className="App">
      <Navbar/>
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

        <div className="search-buttons">
          <Button onClick={handleSearch}>Search</Button>
          <Button variant="outline-primary" onClick={clearSearch}>
            Clear Search
          </Button>
        </div>
        {loading && <p>Loading results...</p>}
      </div>
      {data && data.Search && data.Search.length !== 0
        ? `I've found ${data.Search.length} results for "${searchTerm}"`
        : ""}
      <Container className="results-div">
        <Row>
          {data && data.Search && data.Search.length !== 0 ? (
            paragraphs
          ) : (
            <Col>What movie are you looking for?</Col>
          )}
        </Row>
      </Container>

      {/* 
modal to show selected movie detail */}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMovie?.Title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMovie ? (
            <>
              <img
                src={
                  selectedMovie.Poster !== "N/A"
                    ? selectedMovie.Poster
                    : "https://via.placeholder.com/150"
                }
                alt={`${selectedMovie.Title} poster`}
                className="img-fluid mb-3"
              />
              <p>
                <strong>Year:</strong> {selectedMovie.Year}
              </p>
              <p>
                <strong>Genre:</strong> {selectedMovie.Genre}
              </p>
              <p>
                <strong>Director:</strong> {selectedMovie.Director}
              </p>
              <p>
                <strong>Plot:</strong> {selectedMovie.Plot}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default App;
