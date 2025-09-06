'use client'

import { useState } from 'react'
import { DeckCreate } from '../../../lib/types'

interface CreateDeckModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: DeckCreate) => void
  isLoading?: boolean
}

export function CreateDeckModal({ isOpen, onClose, onSubmit, isLoading = false }: CreateDeckModalProps) {
  const [formData, setFormData] = useState<DeckCreate>({ name: '', description: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    onSubmit(formData)
    setFormData({ name: '', description: '' })
  }

  const handleClose = () => {
    setFormData({ name: '', description: '' })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Create New Deck</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deck Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter deck name"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
              placeholder="Enter deck description (optional)"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={!formData.name.trim() || isLoading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Deck'}
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
