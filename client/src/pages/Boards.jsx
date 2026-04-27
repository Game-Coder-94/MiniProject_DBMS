import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

    if (loading) return <div className="text-white p-8 text-center bg-space-deeper min-h-screen">Connecting to Cosmos...</div>;

    return (
        <div className="min-h-screen bg-space-deeper p-4 md:p-8 pb-[200px]">
            <div className="max-w-5xl mx-auto pt-10 pb-16 text-center">
                <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-nebula-purple via-blue-400 to-cyan-300 tracking-tight leading-tight mb-4 drop-shadow-lg drop-shadow-purple-500/20">
                    My Boards
                </h1>
                <p className="text-slate-300 text-lg max-w-2xl mx-auto font-medium">
                    Your personalized constellation of space imagery and discoveries.
                </p>
            </div>

            <div className="max-w-6xl mx-auto">
                {error && <p className="text-red-400 mb-4">{error}</p>}

                <div className="mb-16 relative overflow-hidden backdrop-blur-xl bg-gradient-to-r from-space-dark/80 to-slate-900/80 border border-white/20 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(139,92,246,0.15)] group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full group-hover:bg-nebula-purple/30 transition-colors duration-700"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-3xl text-white font-black mb-2 tracking-tight">Initiate New Board</h2>
                        <p className="text-slate-400 mb-8 font-medium text-lg">Curate your own personal cosmos by capturing stellar phenomena.</p>
                        
                        <form onSubmit={handleCreateBoard} className="flex flex-col md:flex-row gap-4 relative">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                    <span className="text-slate-400 text-xl">✨</span>
                                </div>
                                <input 
                                    type="text" 
                                    className="w-full bg-black/40 border border-white/20 rounded-2xl pl-14 pr-4 py-4 text-white text-lg placeholder-slate-500 focus:outline-none focus:border-space-accent focus:ring-2 focus:ring-space-accent/50 transition-all shadow-inner"
                                    placeholder="Name your collection..." 
                                    value={newBoardTitle} 
                                    onChange={(e) => setNewBoardTitle(e.target.value)} 
                                />
                            </div>
                            <button type="submit" className="bg-gradient-to-r from-nebula-purple to-cyan-500 hover:from-[rgba(168,85,247,0.9)] hover:to-[rgba(6,182,212,0.9)] text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-[0_0_20px_rgba(139,92,246,0.5)] border border-white/20 whitespace-nowrap">
                                Deploy Board 🚀
                            </button>
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {boards.map(board => (
                        <div key={board.board_id} className="relative overflow-hidden backdrop-blur-md bg-space-dark/60 border border-white/10 rounded-3xl p-8 transition-all duration-500 cursor-pointer shadow-xl hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:-translate-y-2 group" onClick={() => navigate(`/boards/${board.board_id}`)}>
                            <div className="absolute top-0 right-0 w-40 h-40 bg-nebula-purple/20 blur-3xl rounded-full group-hover:bg-cyan-500/20 transition-all duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full group-hover:bg-nebula-purple/20 transition-all duration-500"></div>
                            
                            <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
                                <div>
                                    <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                        🗂️
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-nebula-purple group-hover:to-cyan-300 transition-all duration-300">{board.title}</h3>
                                    <p className="text-slate-400 text-sm font-medium line-clamp-2">{board.description || 'Personal space imagery collection.'}</p>
                                </div>
                                <div className="mt-8 pt-5 border-t border-white/10 flex items-center justify-between">
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                        {new Date(board.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                    <span className="text-cyan-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 group-hover:translate-x-0 -translate-x-2">
                                        Explore <span>→</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {boards.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 text-center">
                            <span className="text-6xl mb-4 opacity-50">🌌</span>
                            <h3 className="text-2xl font-bold text-white mb-2">The Void is Empty</h3>
                            <p className="text-slate-400 max-w-md">You haven't established any operational boards yet. Initialize one above to start curating the cosmos.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Boards;
