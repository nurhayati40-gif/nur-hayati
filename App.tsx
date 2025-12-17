
import React, { useState, FormEvent } from 'react';
import { Palette } from './types';
import { generatePalette } from './services/geminiService';
import { PaletteDisplay } from './components/PaletteDisplay';

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-white/30 backdrop-blur-lg rounded-2xl border border-white/40 shadow-xl shadow-black/5">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        <p className="text-indigo-600">Generating your palette & moodboard...</p>
    </div>
);

const App: React.FC = () => {
    const [mood, setMood] = useState<string>('');
    const [palette, setPalette] = useState<Palette | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!mood.trim() || isLoading) return;

        setIsLoading(true);
        setError(null);
        setPalette(null);

        try {
            const result = await generatePalette(mood);
            setPalette(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-gray-800 font-sans flex flex-col items-center p-4 md:p-8 transition-all duration-500">
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out forwards;
                }
            `}</style>

            <header className="text-center my-10 md:my-16 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
                    Smart Color Palette Generator
                </h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                    Instantly generate beautiful color schemes from any mood or keyword.
                </p>
            </header>

            <main className="w-full flex-grow flex flex-col items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-lg mb-12">
                    <div className="relative">
                        <input
                            type="text"
                            value={mood}
                            onChange={(e) => setMood(e.target.value)}
                            placeholder="Ketikkan Mood Desain Anda (e.g., Rustic, Futuristik)"
                            className="w-full px-5 py-4 text-lg text-gray-900 bg-white/30 backdrop-blur-lg border border-white/40 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400/80 transition-all duration-300 shadow-xl shadow-black/5"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !mood.trim()}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-indigo-600/90 text-white font-semibold rounded-full hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300"
                        >
                            {isLoading ? '...' : 'Generate'}
                        </button>
                    </div>
                </form>

                <div className="w-full max-w-4xl">
                    {isLoading && <LoadingSpinner />}
                    {error && <div className="text-red-800 bg-red-500/20 backdrop-blur-lg p-4 rounded-2xl animate-fade-in border border-red-500/30 shadow-xl shadow-black/5">{error}</div>}
                    {palette && <PaletteDisplay palette={palette} />}
                    {!isLoading && !error && !palette && (
                         <div className="text-center text-gray-600 animate-fade-in bg-white/30 backdrop-blur-lg border border-white/40 p-8 rounded-2xl shadow-xl shadow-black/5">
                            <p className="font-semibold">Enter a keyword or mood to begin.</p>
                            <p className="text-sm mt-1">Try "serene forest dawn" or "cyberpunk city night".</p>
                        </div>
                    )}
                </div>
            </main>

             <footer className="text-center text-gray-500 py-6 mt-auto">
                <p>Powered by Google Gemini</p>
            </footer>
        </div>
    );
};

export default App;