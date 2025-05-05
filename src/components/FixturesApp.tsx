'use client';

import { useState } from 'react';
import type { Fixture } from '@/types/fixture';
import ImportPage from './ImportPage';
import SearchPage from './SearchPage';
import FixtureDetailModal from './FixtureDetailModal';

export default function FixturesApp() {
    const [currentPage, setCurrentPage] = useState<'import' | 'search'>('import');
    const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);

    const navigateTo = (page: 'import' | 'search') => setCurrentPage(page);

    return (
        <>
            <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
                Fixtures Manager
            </h1>

            {/* Tabs */}
            <div className="flex mb-6 border-b border-gray-200">
                {(['import', 'search'] as const).map(tab => (
                    <button
                        key={tab}
                        onClick={() => navigateTo(tab)}
                        className={`py-2 px-6 font-medium ${currentPage === tab
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-blue-700'
                            }`}
                    >
                        {tab === 'import' ? 'Import Data' : 'Search Fixtures'}
                    </button>
                ))}
            </div>

            {currentPage === 'import' && (
                <ImportPage />
            )}

            {currentPage === 'search' && (
                <SearchPage
                    onSelect={fixture => setSelectedFixture(fixture)}
                    navigateTo={navigateTo}
                />
            )}

            {selectedFixture && (
                <FixtureDetailModal
                    fixture={selectedFixture}
                    onClose={() => setSelectedFixture(null)}
                />
            )}
        </>
    );
}
