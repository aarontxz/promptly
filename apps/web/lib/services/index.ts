export * from './base'
export * from './decks'
export * from './flashcards'

// Re-export for backward compatibility
import { apiService } from './base'
import { decksService } from './decks'
import { flashcardsService } from './flashcards'

export const api = {
  // Deck methods
  getDecks: () => decksService.getDecks(),
  createDeck: (data: import('../types').DeckCreate) => decksService.createDeck(data),
  getDeck: (id: number) => decksService.getDeck(id),
  updateDeck: (id: number, data: Partial<import('../types').DeckCreate>) => decksService.updateDeck(id, data),
  deleteDeck: (id: number) => decksService.deleteDeck(id),
  
  // Flashcard methods
  getDeckFlashcards: (deckId: number) => flashcardsService.getDeckFlashcards(deckId),
  createFlashcard: (deckId: number, data: import('../types').FlashcardCreate) => flashcardsService.createFlashcard(deckId, data),
  getFlashcard: (id: number) => flashcardsService.getFlashcard(id),
  updateFlashcard: (id: number, data: Partial<import('../types').FlashcardCreate>) => flashcardsService.updateFlashcard(id, data),
  deleteFlashcard: (id: number) => flashcardsService.deleteFlashcard(id),
  
  // Auth methods
  setToken: (token: string) => apiService.setToken(token),
  clearToken: () => apiService.clearToken(),
}
