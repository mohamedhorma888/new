const { useState, useEffect } = React;
const apiBase = '/api';
const tokenKey = 'masterproject_token';

function apiFetch(path, options = {}) {
    const headers = options.headers || {};
    if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
        headers['Content-Type'] = 'application/json';
    }
    const token = localStorage.getItem(tokenKey);
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    return fetch(`${apiBase}${path}`, {
        credentials: 'same-origin',
        ...options,
        headers,
    });
}

function formatDate(value) {
    return new Date(value).toLocaleDateString();
}

function Section({ title, children, actions }) {
    return (
        <section>
            <div className="section-header">
                <h2>{title}</h2>
                {actions}
            </div>
            {children}
        </section>
    );
}

function BadgeList({ genres }) {
    return (
        <div className="badge-list">
            {genres.map((genre) => (
                <span key={genre._id} className="badge">
                    {genre.name}
                </span>
            ))}
        </div>
    );
}

function MovieCard({ movie, genreName, onRent, canRent }) {
    return (
        <article className="card">
            <h3>{movie.title}</h3>
            <p>{movie.description}</p>
            <p>
                <strong>Genre:</strong> {genreName}
            </p>
            <p>
                <strong>Release:</strong> {formatDate(movie.releaseDate)}
            </p>
            <p>
                <strong>Price:</strong> ${movie.price.toFixed(2)}
            </p>
            {canRent && (
                <button onClick={() => onRent(movie._id)}>Rent movie</button>
            )}
        </article>
    );
}

function RentalCard({ rental }) {
    const movie = rental.movie || {};
    return (
        <article className="card">
            <h3>{movie.title || 'Unknown movie'}</h3>
            <p>
                <strong>Rented on:</strong> {formatDate(rental.rentalDate)}
            </p>
            <p>
                <strong>Due date:</strong> {formatDate(rental.dueDate)}
            </p>
            <p>
                <strong>Price:</strong> ${((rental.rentalPrice ?? movie.price ?? 0).toFixed(2))}
            </p>
            <p>
                <strong>Status:</strong> {rental.status}
            </p>
        </article>
    );
}

function AuthForm({ onLogin, onRegister, message }) {
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    return (
        <section>
            <div className="form-panel">
                <h2>Login</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onLogin(loginEmail, loginPassword);
                    }}
                >
                    <label>Email</label>
                    <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                    <label>Password</label>
                    <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required minLength="6" />
                    <button type="submit">Login</button>
                </form>
            </div>
            <div className="form-panel">
                <h2>Register</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onRegister(registerName, registerEmail, registerPassword);
                    }}
                >
                    <label>Name</label>
                    <input type="text" value={registerName} onChange={(e) => setRegisterName(e.target.value)} required />
                    <label>Email</label>
                    <input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} required />
                    <label>Password</label>
                    <input type="password" value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} required minLength="6" />
                    <button type="submit">Register</button>
                </form>
            </div>
            {message && <div className={`message ${message.type}`}>{message.text}</div>}
        </section>
    );
}

function AdminPanel({ genres, onCreateGenre, onCreateMovie }) {
    const [genreName, setGenreName] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [price, setPrice] = useState('');
    const [genreId, setGenreId] = useState('');

    return (
        <section className="admin-panel">
            <h3>Admin / Manager</h3>
            <div className="form-panel">
                <h4>Add Genre</h4>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onCreateGenre(genreName);
                        setGenreName('');
                    }}
                >
                    <label>Name</label>
                    <input value={genreName} onChange={(e) => setGenreName(e.target.value)} required />
                    <button type="submit">Create Genre</button>
                </form>
            </div>
            <div className="form-panel">
                <h4>Add Movie</h4>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onCreateMovie({ title, description, releaseDate, price, genre: genreId });
                        setTitle('');
                        setDescription('');
                        setReleaseDate('');
                        setPrice('');
                        setGenreId('');
                    }}
                >
                    <label>Title</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} required />
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="3" required />
                    <label>Release Date</label>
                    <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required />
                    <label>Price</label>
                    <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
                    <label>Genre</label>
                    <select value={genreId} onChange={(e) => setGenreId(e.target.value)} required>
                        <option value="">Select genre</option>
                        {genres.map((genre) => (
                            <option key={genre._id} value={genre._id}>
                                {genre.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Create Movie</button>
                </form>
            </div>
        </section>
    );
}

function App() {
    const [section, setSection] = useState('home');
    const [genres, setGenres] = useState([]);
    const [movies, setMovies] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [token, setToken] = useState(localStorage.getItem(tokenKey));
    const [message, setMessage] = useState(null);

    useEffect(() => {
        loadData();
    }, [token]);

    const loadData = async () => {
        try {
            const [genreRes, movieRes] = await Promise.all([apiFetch('/genres'), apiFetch('/movies')]);
            if (!genreRes.ok) throw new Error('Failed to load genres');
            if (!movieRes.ok) throw new Error('Failed to load movies');
            const [genreJson, movieJson] = await Promise.all([genreRes.json(), movieRes.json()]);
            setGenres(genreJson);
            setMovies(movieJson);
            if (token) {
                await loadRentals();
            }
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        }
    };

    const loadRentals = async () => {
        try {
            const response = await apiFetch('/rentals/me');
            if (!response.ok) {
                const body = await response.json();
                throw new Error(body.error || body.message || 'Failed to load rentals');
            }
            const result = await response.json();
            setRentals(result);
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
            setRentals([]);
        }
    };

    const clearMessage = () => setMessage(null);

    const handleLogin = async (email, password) => {
        try {
            const response = await fetch(`${apiBase}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Login failed');
            localStorage.setItem(tokenKey, result.token);
            setToken(result.token);
            setMessage({ text: 'Signed in successfully', type: 'success' });
            setSection('movies');
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        }
    };

    const handleRegister = async (name, email, password) => {
        try {
            const response = await fetch(`${apiBase}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Registration failed');
            setMessage({ text: result.message || 'Registration successful. Please log in.', type: 'success' });
            setSection('auth');
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        }
    };

    const handleRent = async (movieId) => {
        try {
            const response = await apiFetch(`/rentals/${movieId}`, { method: 'POST' });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || result.message || 'Unable to rent movie');
            setMessage({ text: result.message || 'Movie rented successfully', type: 'success' });
            await loadRentals();
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        }
    };

    const handleCreateGenre = async (name) => {
        try {
            const response = await apiFetch('/genres', {
                method: 'POST',
                body: JSON.stringify({ name }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Unable to create genre');
            setMessage({ text: 'Genre created successfully', type: 'success' });
            await loadData();
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        }
    };

    const handleCreateMovie = async (movieData) => {
        try {
            const response = await apiFetch('/movies', {
                method: 'POST',
                body: JSON.stringify(movieData),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Unable to create movie');
            setMessage({ text: 'Movie created successfully', type: 'success' });
            await loadData();
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem(tokenKey);
        setToken(null);
        setRentals([]);
        setMessage({ text: 'Logged out successfully', type: 'success' });
        setSection('home');
    };

    const genreMap = genres.reduce((map, genre) => {
        map[genre._id] = genre.name;
        return map;
    }, {});

    return (
        <div className="app-shell">
            <header className="topbar">
                <div className="brand">MASTERPROJECT</div>
                <nav className="navbar">
                    <button onClick={() => setSection('home')}>Home</button>
                    <button onClick={() => setSection('movies')}>Movies</button>
                    <button onClick={() => setSection('rentals')}>My Rentals</button>
                    <button onClick={() => setSection('auth')}>Login/Register</button>
                </nav>
                <div className="user-actions">
                    <span>{token ? 'Signed in' : 'Not signed in'}</span>
                    {token && (
                        <button onClick={handleLogout}>Logout</button>
                    )}
                </div>
            </header>
            <main className="main-content">
                {message && (
                    <div className={`message ${message.type}`} onClick={clearMessage}>
                        {message.text}
                    </div>
                )}
                {section === 'home' && (
                    <section>
                        <h1>Welcome to MASTERPROJECT</h1>
                        <p>Browse movies, rent titles, and manage your collection from one page.</p>
                        <div className="home-grid">
                            <div className="home-card">
                                <h2>Browse Movies</h2>
                                <p>View the latest movies and rent them instantly.</p>
                            </div>
                            <div className="home-card">
                                <h2>Manage Your Account</h2>
                                <p>Register or login to access rentals and admin features.</p>
                            </div>
                        </div>
                    </section>
                )}
                {section === 'auth' && (
                    <AuthForm onLogin={handleLogin} onRegister={handleRegister} message={message} />
                )}
                {section === 'movies' && (
                    <Section
                        title="Movies"
                        actions={
                            <button onClick={loadData}>Refresh</button>
                        }
                    >
                        <BadgeList genres={genres} />
                        <div className="cards-grid">
                            {movies.length ? (
                                movies.map((movie) => (
                                    <MovieCard
                                        key={movie._id}
                                        movie={movie}
                                        genreName={genreMap[movie.genre] || 'Unknown'}
                                        onRent={handleRent}
                                        canRent={Boolean(token)}
                                    />
                                ))
                            ) : (
                                <p>No movies available yet.</p>
                            )}
                        </div>
                        {token && <AdminPanel genres={genres} onCreateGenre={handleCreateGenre} onCreateMovie={handleCreateMovie} />}
                    </Section>
                )}
                {section === 'rentals' && (
                    <Section
                        title="My Rentals"
                        actions={
                            <button onClick={loadRentals}>Reload</button>
                        }
                    >
                        <div className="cards-grid">
                            {rentals.length ? (
                                rentals.map((rental) => <RentalCard key={rental._id} rental={rental} />)
                            ) : (
                                <p>No rentals available yet.</p>
                            )}
                        </div>
                    </Section>
                )}
            </main>
        </div>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
