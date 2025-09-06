import { apiService } from './base'
import { Flashcard, FlashcardCreate } from '../types'

export class FlashcardsService {
  async getDeckFlashcards(deckId: number): Promise<Flashcard[]> {
    return apiService.request<Flashcard[]>(`/flashcards/deck/${deckId}`)
  }

  async createFlashcard(deckId: number, data: FlashcardCreate): Promise<Flashcard> {
    return apiService.request<Flashcard>(`/flashcards/deck/${deckId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getFlashcard(id: number): Promise<Flashcard> {
    return apiService.request<Flashcard>(`/flashcards/${id}`)
  }

  async updateFlashcard(id: number, data: Partial<FlashcardCreate>): Promise<Flashcard> {
    return apiService.request<Flashcard>(`/flashcards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteFlashcard(id: number): Promise<{ message: string }> {
    return apiService.request<{ message: string }>(`/flashcards/${id}`, {
      method: 'DELETE',
    })
  }
}

export const flashcardsService = new FlashcardsService()
