'use client';
import { useState, useEffect, useRef } from 'react';
import type { Fixture } from '@/types/fixture';

interface Props {
    onSelect: (fixture: Fixture) => void;
    navigateTo: (page: 'import' | 'search') => void;
}

export default function SearchPage({ onSelect, navigateTo }: Props) {
    const [term, setTerm] = useState('');
    const [results, setResults] = useState<Fixture[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setResults([]);
        setPage(1);
        setHasMore(true);
    }, [term]);

    useEffect(() => {
        if (!term) {
            setResults([]);
            setHasSearched(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(term)}&page=${page}`);
                const data = await res.json();

                if (data.length === 0) {
                    setHasMore(false);
                } else {
                    setResults(prev => (page === 1 ? data : [...prev, ...data]));
                    setHasSearched(true);
                }
            } catch (error) {
                console.error("Error fetching fixtures:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const delayDebounce = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [term, page]);

    const scrollTriggered = useRef(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
            const scrollThreshold = document.documentElement.offsetHeight - 300;

            if (scrollPosition >= scrollThreshold && !isLoading && hasMore && !scrollTriggered.current) {
                scrollTriggered.current = true;
                setPage(prevPage => prevPage + 1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, hasMore]);

    // Reset the scrollTriggered flag when loading completes
    useEffect(() => {
        if (!isLoading) {
            scrollTriggered.current = false;
        }
    }, [isLoading]);


    return (
        <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Search Fixtures</h2>

            <input
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
                placeholder="Enter team name…"
                value={term}
                onChange={e => setTerm(e.target.value)}
            />

            {!isLoading && term && hasSearched && results.length === 0 && (
                <p className="text-gray-500">No matches.</p>
            )}

            <div className="space-y-3">
                {results.map((fixture) => (
                    <div
                        key={fixture._id}
                        onClick={() => onSelect(fixture)}
                        className="p-3 border border-gray-200 rounded-md hover:bg-blue-50 cursor-pointer transition-all"
                    >
                        <div className="font-medium">{fixture.fixture_datetime}</div>
                        <div className="flex justify-between">
                            <span className="flex-1">{fixture.home_team}</span>
                            <span className="flex-1 text-right">{fixture.away_team}</span>
                        </div>
                    </div>
                ))}
            </div>

            {isLoading && (
                <div className="text-center py-4">
                    <p className="text-gray-500">Loading more fixtures...</p>
                </div>
            )}

            {!hasMore && results.length > 0 && (
                <p className="text-center text-gray-500 py-4">No more fixtures to load</p>
            )}

            <div className="text-center py-8 text-gray-500">
                <button onClick={() => navigateTo('import')} className="text-blue-600 hover:text-blue-800">
                    Import first
                </button>
            </div>
        </section>
    );
}