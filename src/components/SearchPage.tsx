'use client';

import { useState, useEffect } from 'react';
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

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (term) {
                setIsLoading(true);
                setHasSearched(false);

                fetch(`/api/search?q=${encodeURIComponent(term)}`)
                    .then(res => res.json())
                    .then(setResults);
                setIsLoading(false);
                setHasSearched(true);
            } else {
                setResults([]);
                setHasSearched(false);
            }
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [term]);

    return (
        <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Search Fixtures</h2>

            <input
                className="w-full p-3 border border-gray-300 rounded-md mb-4"
                placeholder="Enter team name…"
                value={term}
                onChange={e => setTerm(e.target.value)}
            />

            {isLoading && <p className="text-gray-500">Searching...</p>}

            {!isLoading && term && hasSearched && results.length === 0 && (
                <p className="text-gray-500">No matches.</p>
            )}

            {results.map(f => (
                <div
                    key={f._id}
                    onClick={() => onSelect(f)}
                    className="p-3 border border-gray-200 rounded-md hover:bg-blue-50 cursor-pointer mb-2"
                >
                    <div className="font-medium">{f.fixture_datetime}</div>
                    <div className="flex justify-between">
                        <span className="flex-1">{f.home_team}</span>
                        <span className="flex-1 text-right">{f.away_team}</span>
                    </div>
                </div>
            ))}
            <div className="text-center py-8 text-gray-500">
                <button onClick={() => navigateTo('import')} className="text-blue-600 hover:text-blue-800">
                    Import first
                </button>
            </div>
        </section>
    );
}
