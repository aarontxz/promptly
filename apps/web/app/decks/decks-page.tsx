'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '../../lib/services';
import { Navigation } from '../components/Navigation';
import { Deck } from '../../lib/types';

export default function DecksPage() {
  const { status } = useSession();
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDeck, setNewDeck] = useState({ name: '', description: '' });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchDecks();
    }
  }, [status, router]);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const userDecks = await api.getDecks();
      setDecks(userDecks);
    } catch (error) {
      console.error('Error fetching decks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDeck = async () => {
    if (!newDeck.name.trim()) return;

    try {
      const deck = await api.createDeck(newDeck);
      setDecks([...decks, deck]);
      setNewDeck({ name: '', description: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating deck:', error);
    }
  };

  const openDeck = (deckId: number) => {
    router.push(`/deck/${deckId}`);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Decks</h1>
            <p className="text-gray-600">Manage your flashcard collections</p>
          </div>
          <div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Create Deck
            </button>
          </div>
        </div>

        {/* Create Deck Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">Create New Deck</h2>
              <input
                type="text"
                placeholder="Deck name"
                value={newDeck.name}
                onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Description (optional)"
                value={newDeck.description}
                onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-3">
                <button
                  onClick={createDeck}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewDeck({ name: '', description: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Decks Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">Loading your decks...</div>
          </div>
        ) : decks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No decks yet</h3>
            <p className="text-gray-500 mb-6">Create your first deck to get started with flashcards!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Deck
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
              <div
                key={deck.id}
                onClick={() => openDeck(deck.id)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {deck.name}
                  </h3>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {deck.flashcards?.length || 0} cards
                  </span>
                </div>
                {deck.description && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {deck.description}
                  </p>
                )}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    Created {new Date(deck.created_at).toLocaleDateString()}
                  </span>
                  <span className="text-blue-600 hover:text-blue-800">
                    Open →
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
