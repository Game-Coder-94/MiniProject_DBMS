import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Boards.css';
import '../App.css';

const Boards = () => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBoards = async () => {
            const token = localStorage.getItem('astro_token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const apiUrl = import.meta.env.DEV ? '/api/boards' : 'http://localhost:3000/api/boards';
                const response = await axios.get(apiUrl, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBoards(response.data);
            } catch (err) {
                setError('Failed to load boards');
            } finally {
                setLoading(false);
            }
        };
        fetchBoards();
    }, [navigate]);

    const handleCreateBoard = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('astro_token');
        if (!newBoardTitle.trim()) return;

        try {
            const apiUrl = import.meta.env.DEV ? '/api/boards' : 'http://localhost:3000/api/boards';
            const response = await axios.post(apiUrl, { title: newBoardTitle }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBoards([response.data, ...boards]);
            setNewBoardTitle('');
        } catch (err) {
            setError('Failed to create board. You might need to be logged in.');
        }
    };

    if (loading) return <div className="boards-container" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Connecting to Cosmos...</div>;

    return (
        <div className="boards-container">
            <div className="boards-header">
                <h1 className="boards-title">My Boards</h1>
                <p className="boards-subtitle">Your personalized constellation of space imagery and discoveries.</p>
            </div>

            <div className="boards-content">
                {error && <p style={{color: '#f87171', marginBottom: '1rem'}}>{error}</p>}

                <div className="create-board-card">
                    <div className="create-board-stardust"></div>
                    <div className="create-board-glow"></div>
                    
                    <div className="create-board-content">
                        <h2 className="create-board-heading">Initiate New Board</h2>
                        <p className="create-board-text">Curate your own personal cosmos by capturing stellar phenomena.</p>
                        
                        <form onSubmit={handleCreateBoard} className="create-board-form">
                            <div className="create-board-input-wrapper">
                                <span className="create-board-icon">✨</span>
                                <input 
                                    type="text" 
                                    className="create-board-input"
                                    placeholder="Name your collection..." 
                                    value={newBoardTitle} 
                                    onChange={(e) => setNewBoardTitle(e.target.value)} 
                                />
                            </div>
                            <button type="submit" className="create-board-submit">
                                Deploy Board 🚀
                            </button>
                        </form>
                    </div>
                </div>

                <div className="boards-grid">
                    {boards.map(board => (
                        <div key={board.board_id} className="board-card" onClick={() => navigate(`/boards/${board.board_id}`)}>
                            <div className="board-card-glow-tr"></div>
                            <div className="board-card-glow-bl"></div>
                            
                            <div className="board-card-content">
                                <div className="board-card-icon">🗂️</div>
                                <h3 className="board-card-title">{board.title}</h3>
                                <p className="board-card-desc">{board.description || 'Personal space imagery collection.'}</p>
                            </div>
                            <div className="board-card-footer">
                                <span className="board-card-date">
                                    {new Date(board.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                                <span className="board-card-explore">
                                    Explore <span>→</span>
                                </span>
                            </div>
                        </div>
                    ))}
                    {boards.length === 0 && (
                        <div className="boards-empty">
                            <span className="boards-empty-icon">🌌</span>
                            <h3 className="boards-empty-title">The Void is Empty</h3>
                            <p className="boards-empty-text">You haven't established any operational boards yet. Initialize one above to start curating the cosmos.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Boards;
