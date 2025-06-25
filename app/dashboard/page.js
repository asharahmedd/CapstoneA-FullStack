'use client';
const { useState, useEffect } = require('react');
const { useAuth } = require('../../lib/authContext');
const { useRouter } = require('next/navigation');
const { db } = require('../../lib/firebase');
const { doc, setDoc, getDoc } = require('firebase/firestore');
const { signOut } = require('firebase/auth');
const { auth } = require('../../lib/firebase');

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [superheroes, setSuperheroes] = useState([]);
  const [selectedSuperhero, setSelectedSuperhero] = useState(null);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch selected superhero from Firestore
  useEffect(() => {
    if (user) {
      const fetchSelectedSuperhero = async () => {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setSelectedSuperhero(userDoc.data().selectedSuperhero || null);
          }
        } catch (err) {
          setError('Error fetching selected superhero');
        }
      };
      fetchSelectedSuperhero();
    }
  }, [user]);

  // Search superheroes
  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`/api/superhero?query=${encodeURIComponent(search)}`);
      const data = await response.json();
      if (data.response === 'success') {
        setSuperheroes(data.results || []);
      } else {
        setError('No superheroes found');
      }
    } catch (err) {
      setError('Error searching superheroes');
    }
  };

  // Select superhero
  const selectSuperhero = async (superhero) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), { selectedSuperhero: superhero }, { merge: true });
      setSelectedSuperhero(superhero);
    } catch (err) {
      setError('Error selecting superhero');
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (err) {
      setError('Error logging out');
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <main className="container dashboard">
      <div className="header">
        <h1>Superhero Selector</h1>
        <button onClick={handleLogout} className="btn btn-logout">
          Logout
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a superhero"
          className="form-input search-input"
        />
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
      <div className="superhero-grid">
        {superheroes.map((hero) => (
          <div key={hero.id} className="superhero-card">
            <img src={hero.image.url} alt={hero.name} className="superhero-image" />
            <h2>{hero.name}</h2>
            <p>Intelligence: {hero.powerstats.intelligence}</p>
            <p>Strength: {hero.powerstats.strength}</p>
            <p>Speed: {hero.powerstats.speed}</p>
            <button
              onClick={() => selectSuperhero(hero)}
              className={`btn ${
                selectedSuperhero?.id === hero.id ? 'btn-disabled' : 'btn-primary'
              }`}
              disabled={selectedSuperhero?.id === hero.id}
            >
              {selectedSuperhero?.id === hero.id ? 'Selected' : 'Select Superhero'}
            </button>
          </div>
        ))}
      </div>
      <h2>Your Selected Superhero</h2>
      <div className="superhero-grid">
        {selectedSuperhero ? (
          <div className="superhero-card">
            <img
              src={selectedSuperhero.image.url}
              alt={selectedSuperhero.name}
              className="superhero-image"
            />
            <h2>{selectedSuperhero.name}</h2>
            <p>Intelligence: {selectedSuperhero.powerstats.intelligence}</p>
            <p>Strength: {selectedSuperhero.powerstats.strength}</p>
            <p>Speed: {selectedSuperhero.powerstats.speed}</p>
          </div>
        ) : (
          <p>No superhero selected yet. Search and select one!</p>
        )}
      </div>
    </main>
  );
}