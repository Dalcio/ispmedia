'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface PlaylistModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  playlist?: any
}

export function PlaylistModal({ isOpen, onClose, mode, playlist }: PlaylistModalProps) {
  const [formData, setFormData] = useState({
    name: playlist?.name || '',
    description: playlist?.description || '',
    isPublic: playlist?.isPublic || false
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // API call to create/update playlist
      console.log('Playlist data:', formData)
      onClose()
    } catch (error) {
      console.error('Playlist error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={mode === 'create' ? 'Nova Playlist' : 'Editar Playlist'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Nome da playlist"
          value={formData.name}
          onChange={(e) => updateFormData('name', e.target.value)}
          required
        />
        <Textarea
          placeholder="Descrição (opcional)"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPublic"
            checked={formData.isPublic}
            onChange={(e) => updateFormData('isPublic', e.target.checked)}
            className="w-4 h-4 text-primary bg-white/5 border-white/20 rounded focus:ring-primary"
          />
          <label htmlFor="isPublic" className="text-sm text-white/80">
            Playlist pública
          </label>
        </div>
        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : (mode === 'create' ? 'Criar' : 'Salvar')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
