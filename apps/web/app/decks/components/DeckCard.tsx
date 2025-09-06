'use client'

import { Deck } from '../../../lib/types'

interface DeckCardProps {
  deck: Deck
  onEdit?: (deck: Deck) => void
  onDelete?: (deck: Deck) => void
  onView?: (deck: Deck) => void
}

export function DeckCard({ deck, onEdit, onDelete, onView }: DeckCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{deck.name}</h3>
          {deck.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{deck.description}</p>
          )}
        </div>
        {(onEdit || onDelete) && (
          <div className="flex space-x-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(deck)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(deck)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          <span className="font-medium">{deck.flashcards?.length || 0}</span> cards
          <span className="mx-2">•</span>
          Created {new Date(deck.created_at).toLocaleDateString()}
        </div>
        {onView && (
          <button
            onClick={() => onView(deck)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Study →
          </button>
        )}
      </div>
    </div>
  )
}
