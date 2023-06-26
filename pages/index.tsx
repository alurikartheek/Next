// pages/index.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Character from '../components/Character';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface Character {
  id: number;
  name: string;
  image: string;
}

const Home: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const charactersPerPage = 9;
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://rickandmortyapi.com/api/character?page=${currentPage}`);
        setCharacters(response.data.results);
        setTotalPages(response.data.info.pages);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error('Page not found');
          setCharacters([]);
        } else {
          console.error('An error occurred while fetching data:', error);
        }
      }
    };
  
    fetchData();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page > totalPages) {
      return;
    }
    setCurrentPage(page);
    router.push(`/?page=${page}`);
  };

  const pageNumbersToShow = 3;

  const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => i + start);

  const getVisiblePageNumbers = () => {
    const startPage = Math.max(1, currentPage - Math.floor(pageNumbersToShow / 2));
    const endPage = Math.min(totalPages, currentPage + Math.floor(pageNumbersToShow / 2));

    return range(startPage, endPage);
  };

  const visiblePageNumbers = getVisiblePageNumbers();

  return (
    <div>
      <Head>
      <title>Rick and Morty Characters</title>
      </Head>
      <div className="container"
        style={{
          border: '1px solid black',
          borderRadius: '10px',
          padding: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        >
        <h1 className="text-center my-4 handwritten-heading">
          Rick and Morty Characters
        </h1>
        <div className="row">
          {characters.map((character) => (
            <Character key={character.id} character={character} />
          ))}
        </div>
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-primary me-2" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
            First
          </button>
          {visiblePageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              className={`btn btn-primary me-2 ${pageNumber === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
          <button
            className="btn btn-primary me-2"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
