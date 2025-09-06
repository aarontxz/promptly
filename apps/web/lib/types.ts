export interface User {
  id: number
  email: string
  name: string
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: User
}

export interface Deck {
  id: number
  name: string
  description?: string
  owner_id: number
  is_active: boolean
  created_at: string
  updated_at?: string
  flashcards: Flashcard[]
}

export interface DeckCreate {
  name: string
  description?: string
}

export interface Flashcard {
  id: number
  front: string
  back: string
  deck_id: number
  is_active: boolean
  created_at: string
  updated_at?: string
}

export interface FlashcardCreate {
  front: string
  back: string
}
