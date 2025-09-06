'use client'

import { Flashcard } from '../../../lib/types'

interface FlashcardComponentProps {
  flashcard: Flashcard
  onEdit?: (flashcard: Flashcard) => void
  onDelete?: (flashcard: Flashcard) => void
}

export function FlashcardComponent({ flashcard, onEdit, onDelete }: FlashcardComponentProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-500 mb-1">FRONT</label>
        <p className="text-sm text-gray-900 line-clamp-3">{flashcard.front}</p>
      </div>
      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-500 mb-1">BACK</label>
        <p className="text-sm text-gray-600 line-clamp-3">{flashcard.back}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-400">
          Created {new Date(flashcard.created_at).toLocaleDateString()}
        </p>
        {(onEdit || onDelete) && (
          <div className="flex space-x-2">
            {onEdit && (
              <button
                onClick={() => onEdit(flashcard)}
                className="text-blue-600 hover:text-blue-800 text-xs"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(flashcard)}
                className="text-red-600 hover:text-red-800 text-xs"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
