'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, use, useCallback } from 'react';
import { api } from '../../../lib/services';
import { Navigation } from '../../components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
  const { status } = useSession();
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

  const fetchDeck = useCallback(async () => {
    try {
      setLoading(true);
      const deckData = await api.getDeck(deckId);
      setDeck(deckData);
    } catch (error) {
      console.error('Error fetching deck:', error);
      router.push('/decks');
    } finally {
      setLoading(false);
    }
  }, [deckId, router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchDeck();
    }
  }, [status, router, fetchDeck]);

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
          <Card
            className="min-h-[300px] cursor-pointer transition-transform hover:scale-105 shadow-xl"
            onClick={() => setShowBack(!showBack)}
          >
            <CardContent className="flex items-center justify-center h-full p-8">
              <div className="text-center">
                <p className="text-lg mb-4">
                  {showBack ? currentCard.back : currentCard.front}
                </p>
                <p className="text-sm text-muted-foreground">
                  {showBack ? 'Back' : 'Front'} - Click to flip
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex justify-center space-x-4 mt-8">
            <Button
              variant="secondary"
              onClick={prevCard}
              disabled={currentCardIndex === 0}
            >
              ← Previous
            </Button>
            <Button
              variant="destructive"
              onClick={() => setStudyMode(false)}
            >
              Exit Study
            </Button>
            <Button onClick={nextCard}>
              {currentCardIndex === deck.flashcards.length - 1 ? 'Finish' : 'Next →'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <div className="px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/decks')}
            className="mr-4"
          >
            ← Back to Decks
          </Button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{deck.name}</h1>
            {deck.description && (
              <p className="text-muted-foreground">{deck.description}</p>
            )}
          </div>
          <div className="flex space-x-4">
            {deck.flashcards.length > 0 && (
              <Button
                onClick={startStudyMode}
                className="bg-green-600 hover:bg-green-700"
              >
                🎯 Study Mode
              </Button>
            )}
            <Button onClick={() => setShowCreateForm(true)}>
              + Add Card
            </Button>
          </div>
        </div>

        {/* Create Card Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-96 max-w-full mx-4">
              <CardHeader>
                <CardTitle>Add New Flashcard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Front</label>
                  <Textarea
                    placeholder="Question or term"
                    value={newCard.front}
                    onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                    className="h-20 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Back</label>
                  <Textarea
                    placeholder="Answer or definition"
                    value={newCard.back}
                    onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                    className="h-20 resize-none"
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={createFlashcard}
                    disabled={!newCard.front.trim() || !newCard.back.trim()}
                    className="flex-1"
                  >
                    Add Card
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewCard({ front: '', back: '' });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Flashcards List */}
        {deck.flashcards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🃏</div>
            <h3 className="text-xl font-semibold mb-2">No flashcards yet</h3>
            <p className="text-muted-foreground mb-6">Add your first flashcard to start studying!</p>
            <Button onClick={() => setShowCreateForm(true)} size="lg">
              Add Your First Card
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">
                Flashcards ({deck.flashcards.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deck.flashcards.map((card) => (
                <Card key={card.id}>
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">FRONT</label>
                      <p className="text-sm line-clamp-3">{card.front}</p>
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-muted-foreground mb-1">BACK</label>
                      <p className="text-sm text-muted-foreground line-clamp-3">{card.back}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Created {new Date(card.created_at).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
