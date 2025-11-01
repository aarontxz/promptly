'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api } from '../../lib/services';
import { Navigation } from '../components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Deck {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  flashcards: Array<{ id: number; front: string; back: string }>;
}

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
      <div className="px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Decks</h1>
            <p className="text-gray-600">Manage your flashcard collections</p>
          </div>
          <div>
            <Button onClick={() => setShowCreateForm(true)}>
              + Create Deck
            </Button>
          </div>
        </div>

        {/* Create Deck Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-96 max-w-full mx-4">
              <CardHeader>
                <CardTitle>Create New Deck</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Deck name"
                  value={newDeck.name}
                  onChange={(e) => setNewDeck({ ...newDeck, name: e.target.value })}
                />
                <Textarea
                  placeholder="Description (optional)"
                  value={newDeck.description}
                  onChange={(e) => setNewDeck({ ...newDeck, description: e.target.value })}
                  className="h-20 resize-none"
                />
                <div className="flex space-x-3">
                  <Button 
                    onClick={createDeck}
                    disabled={!newDeck.name.trim()}
                    className="flex-1"
                  >
                    Create
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewDeck({ name: '', description: '' });
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
            <Button onClick={() => setShowCreateForm(true)} size="lg">
              Create Your First Deck
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
              <Card
                key={deck.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openDeck(deck.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl line-clamp-2">
                      {deck.name}
                    </CardTitle>
                    <Badge variant="secondary">
                      {deck.flashcards?.length || 0} cards
                    </Badge>
                  </div>
                  {deck.description && (
                    <p className="text-muted-foreground line-clamp-3">
                      {deck.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>
                      Created {new Date(deck.created_at).toLocaleDateString()}
                    </span>
                    <span className="text-primary hover:text-primary/80">
                      Open →
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
