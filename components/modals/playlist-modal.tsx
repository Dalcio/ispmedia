'use client'

import { useState, useEffect } from 'react'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
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
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: 'private' as 'public' | 'private'
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (playlist && mode === 'edit') {
      setFormData({
        title: playlist.title || '',
        description: playlist.description || '',
        visibility: playlist.visibility || 'private'
      })
    } else {
      setFormData({
        title: '',
        description: '',
        visibility: 'private'
      })
    }
  }, [playlist, mode, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      showError('Você precisa estar logado para criar playlists')
      return
    }
    
    if (!formData.title.trim()) {
      showError('Nome da playlist é obrigatório')
      return
    }
    
    setIsLoading(true)
    
    try {
      if (mode === 'create') {
        await addDoc(collection(db, 'playlists'), {
          title: formData.title.trim(),
          description: formData.description.trim(),
          visibility: formData.visibility,
          tracks: [],
          createdBy: user.uid,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        success('Playlist criada com sucesso!')
      } else if (mode === 'edit' && playlist) {
        const playlistRef = doc(db, 'playlists', playlist.id)
        await updateDoc(playlistRef, {
          title: formData.title.trim(),
          description: formData.description.trim(),
          visibility: formData.visibility,
          updatedAt: new Date()
        })
        success('Playlist atualizada com sucesso!')
      }
      
      onClose()
    } catch (error) {
      console.error('Playlist error:', error)
      showError(mode === 'create' ? 'Erro ao criar playlist' : 'Erro ao atualizar playlist')
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={mode === 'create' ? 'Nova Playlist' : 'Editar Playlist'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Nome da Playlist
          </label>
          <Input
            placeholder="Digite o nome da playlist"
            value={formData.title}
            onChange={(e) => updateFormData('title', e.target.value)}
            required
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Descrição (opcional)
          </label>
          <Textarea
            placeholder="Descreva sua playlist..."
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            className="w-full h-20"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Visibilidade
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={formData.visibility === 'private'}
                onChange={(e) => updateFormData('visibility', e.target.value)}
                className="w-4 h-4 text-primary-500"
              />
              <span className="text-sm text-text-primary">
                Privada - Apenas você pode ver
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={formData.visibility === 'public'}
                onChange={(e) => updateFormData('visibility', e.target.value)}
                className="w-4 h-4 text-primary-500"
              />
              <span className="text-sm text-text-primary">
                Pública - Qualquer pessoa pode ver
              </span>
            </label>
          </div>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onClose}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Salvando...' : (mode === 'create' ? 'Criar Playlist' : 'Salvar Alterações')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
