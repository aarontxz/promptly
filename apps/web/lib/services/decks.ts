import { apiService } from './base'
import { Deck, DeckCreate } from '../types'

export class DecksService {
  async getDecks(): Promise<Deck[]> {
    return apiService.request<Deck[]>('/decks')
  }

  async createDeck(data: DeckCreate): Promise<Deck> {
    return apiService.request<Deck>('/decks', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getDeck(id: number): Promise<Deck> {
    return apiService.request<Deck>(`/decks/${id}`)
  }

  async updateDeck(id: number, data: Partial<DeckCreate>): Promise<Deck> {
    return apiService.request<Deck>(`/decks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteDeck(id: number): Promise<{ message: string }> {
    return apiService.request<{ message: string }>(`/decks/${id}`, {
      method: 'DELETE',
    })
  }
}

export const decksService = new DecksService()
