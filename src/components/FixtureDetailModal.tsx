'use client';
import { Calendar, Clock, Trophy, Users } from 'lucide-react';
import type { Fixture } from '@/types/fixture';

interface Props {
    fixture: Fixture;
    onClose: () => void;
}

export default function FixtureDetailModal({ fixture, onClose }: Props) {
    const backdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    const formatDateTime = (datetime: string) => {
        const date = new Date(datetime);
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={backdrop}
        >
            <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-lg w-full">
                <header className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Fixture Details</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </header>

                <div className="mb-6">
                    <div className="flex items-center mb-3">
                        <Trophy className="text-blue-600 mr-2 w-5 h-5" />
                        <div>
                            <p className="text-sm text-gray-500">Competition</p>
                            <p className="font-medium">{fixture.competition_name}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="text-blue-600 mr-2 w-5 h-5" />
                        <div>
                            <p className="text-sm text-gray-500">Season</p>
                            <p className="font-medium">{fixture.season}</p>
                        </div>
                    </div>
                </div>

                {/* Match Info */}
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex-1 text-center">
                            <p className="font-semibold text-lg">{fixture.home_team}</p>
                            <p className="text-sm text-gray-600">Home</p>
                        </div>
                        <div className="px-4 py-2 bg-blue-600 text-white rounded-full mx-3">
                            <span className="font-bold">VS</span>
                        </div>
                        <div className="flex-1 text-center">
                            <p className="font-semibold text-lg">{fixture.away_team}</p>
                            <p className="text-sm text-gray-600">Away</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center">
                        <Clock className="text-blue-600 mr-2 w-5 h-5" />
                        <div>
                            <p className="text-sm text-gray-500">Date & Time</p>
                            <p className="font-medium">{fixture.fixture_datetime ? formatDateTime(fixture.fixture_datetime) : 'TBD'}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <Users className="text-blue-600 mr-2 w-5 h-5" />
                        <div>
                            <p className="text-sm text-gray-500">Round</p>
                            <p className="font-medium">{fixture.fixture_round || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium"
                >
                    Close
                </button>
            </div>
        </div>
    );
}