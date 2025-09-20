'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import { api } from '../../../lib/services';
import { Navigation } from '../../components/Navigation';

interface Flashcard {
  id: number;
  front: string;
  back: string;
  created_at: string;
}

interface Deck {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  flashcards: Flashcard[];
}

export default function DeckPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '' });
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);

  const resolvedParams = use(params);
  const deckId = parseInt(resolvedParams.id);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchDeck();
    }
  }, [status, router, resolvedParams.id]);

  const fetchDeck = async () => {
    try {
      setLoading(true);
      const deckData = await api.getDeck(deckId);
      const flashcards = await api.getDeckFlashcards(deckId);
      setDeck({ ...deckData, flashcards });
    } catch (error) {
      console.error('Error fetching deck:', error);
      router.push('/decks');
    } finally {
      setLoading(false);
    }
  };

  const createFlashcard = async () => {
    if (!newCard.front.trim() || !newCard.back.trim()) return;

    try {
      const flashcard = await api.createFlashcard(deckId, newCard);
      if (deck) {
        setDeck({ ...deck, flashcards: [...deck.flashcards, flashcard] });
      }
      setNewCard({ front: '', back: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating flashcard:', error);
    }
  };

  const startStudyMode = () => {
    setStudyMode(true);
    setCurrentCardIndex(0);
    setShowBack(false);
  };

  const nextCard = () => {
    if (deck && currentCardIndex < deck.flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowBack(false);
    } else {
      setStudyMode(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowBack(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !deck) {
    return null;
  }

  if (studyMode && deck.flashcards.length > 0) {
    const currentCard = deck.flashcards[currentCardIndex];
    if (!currentCard) return null;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="max-w-2xl w-full mx-4">
          {/* Study Mode Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{deck.name}</h1>
            <p className="text-gray-600">
              Card {currentCardIndex + 1} of {deck.flashcards.length}
            </p>
          </div>

          {/* Flashcard */}
          <div
            className="bg-white rounded-xl shadow-xl p-8 min-h-[300px] flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
            onClick={() => setShowBack(!showBack)}
          >
            <div className="text-center">
              <p className="text-lg text-gray-900 mb-4">
                {showBack ? currentCard.back : currentCard.front}
              </p>
              <p className="text-sm text-gray-500">
                {showBack ? 'Back' : 'Front'} - Click to flip
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={prevCard}
              disabled={currentCardIndex === 0}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={() => setStudyMode(false)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Exit Study
            </button>
            <button
              onClick={nextCard}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {currentCardIndex === deck.flashcards.length - 1 ? 'Finish' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.push('/decks')}
            className="text-blue-600 hover:text-blue-800 mr-4"
          >
            ← Back to Decks
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{deck.name}</h1>
            {deck.description && (
              <p className="text-gray-600">{deck.description}</p>
            )}
          </div>
          <div className="flex space-x-4">
            {deck.flashcards.length > 0 && (
              <button
                onClick={startStudyMode}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                🎯 Study Mode
              </button>
            )}
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Card
            </button>
          </div>
        </div>

        {/* Create Card Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">Add New Flashcard</h2>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Front</label>
                <textarea
                  placeholder="Question or term"
                  value={newCard.front}
                  onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Back</label>
                <textarea
                  placeholder="Answer or definition"
                  value={newCard.back}
                  onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={createFlashcard}
                  disabled={!newCard.front.trim() || !newCard.back.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add Card
                </button>
                <button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewCard({ front: '', back: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Flashcards List */}
        {deck.flashcards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🃏</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No flashcards yet</h3>
            <p className="text-gray-500 mb-6">Add your first flashcard to start studying!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Card
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Flashcards ({deck.flashcards.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deck.flashcards.map((card) => (
                <div
                  key={card.id}
                  className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                >
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">FRONT</label>
                    <p className="text-sm text-gray-900 line-clamp-3">{card.front}</p>
                  </div>
                  <div className="mb-3">
                    <label className="block text-xs font-medium text-gray-500 mb-1">BACK</label>
                    <p className="text-sm text-gray-600 line-clamp-3">{card.back}</p>
                  </div>
                  <p className="text-xs text-gray-400">
                    Created {new Date(card.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
