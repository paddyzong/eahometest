'use client';
import { useState, useEffect } from 'react';

type Fixture = {
    _id: string;
    season: number;
    competition_name: string;
    fixture_datetime: string;
    fixture_round: number;
    home_team: string;
    away_team: string;
};

export default function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Fixture[]>([]);
    const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query) {
                fetch(`/api/search?q=${encodeURIComponent(query)}`)
                    .then(res => res.json())
                    .then(setResults);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Search Fixtures</h1>
            <input
                type="text"
                placeholder="Enter team name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border p-2 w-full mb-4"
            />

            <ul>
                {results.map((fixture) => (
                    <li
                        key={fixture._id}
                        onClick={() => setSelectedFixture(fixture)}
                        className="p-2 border-b cursor-pointer hover:bg-gray-100"
                    >
                        {fixture.home_team} vs {fixture.away_team} <br />
                        <small>{new Date(fixture.fixture_datetime).toLocaleString()}</small>
                    </li>
                ))}
            </ul>

            {/* Modal */}
            {selectedFixture && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded p-6 w-11/12 md:w-2/3 lg:w-1/2 relative">
                        <button
                            onClick={() => setSelectedFixture(null)}
                            className="absolute top-2 right-3 text-gray-500 text-lg"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-semibold mb-2">Fixture Details</h2>
                        <p><strong>Competition:</strong> {selectedFixture.competition_name}</p>
                        <p><strong>Season:</strong> {selectedFixture.season}</p>
                        <p><strong>Date:</strong> {new Date(selectedFixture.fixture_datetime).toLocaleString()}</p>
                        <p><strong>Round:</strong> {selectedFixture.fixture_round}</p>
                        <p><strong>Home Team:</strong> {selectedFixture.home_team}</p>
                        <p><strong>Away Team:</strong> {selectedFixture.away_team}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
