'use client'

import { useState } from 'react'
import { FlashcardCreate } from '../../../lib/types'

interface CreateFlashcardModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: FlashcardCreate) => void
  isLoading?: boolean
}

export function CreateFlashcardModal({ isOpen, onClose, onSubmit, isLoading = false }: CreateFlashcardModalProps) {
  const [formData, setFormData] = useState<FlashcardCreate>({ front: '', back: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.front.trim() || !formData.back.trim()) return
    onSubmit(formData)
    setFormData({ front: '', back: '' })
  }

  const handleClose = () => {
    setFormData({ front: '', back: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Add New Flashcard</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Front</label>
            <textarea
              placeholder="Question or term"
              value={formData.front}
              onChange={(e) => setFormData({ ...formData, front: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Back</label>
            <textarea
              placeholder="Answer or definition"
              value={formData.back}
              onChange={(e) => setFormData({ ...formData, back: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={!formData.front.trim() || !formData.back.trim() || isLoading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Adding...' : 'Add Card'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
