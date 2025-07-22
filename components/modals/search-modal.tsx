'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { debounce } from '@/lib/utils'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{
    songs: any[]
    artists: any[]
    albums: any[]
  }>({
    songs: [],
    artists: [],
    albums: []
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults({ songs: [], artists: [], albums: [] })
      return
    }

    setIsLoading(true)
    try {
      // API call to search
      console.log('Searching for:', searchQuery)
      // Mock results
      setResults({
        songs: [
          { id: 1, title: 'Song 1', artist: 'Artist 1' },
          { id: 2, title: 'Song 2', artist: 'Artist 2' }
        ],
        artists: [
          { id: 1, name: 'Artist 1', followers: 1000 }
        ],
        albums: [
          { id: 1, title: 'Album 1', artist: 'Artist 1' }
        ]
      })
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }, 300)

  const onQueryChange = (value: string) => {
    setQuery(value)
    handleSearch(value)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Buscar" size="lg">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          <Input
            placeholder="Buscar músicas, artistas, álbuns..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-white/60 mt-2">Buscando...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && query && (
          <div className="space-y-6 max-h-96 overflow-y-auto">
            {/* Songs */}
            {results.songs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Músicas</h3>
                <div className="space-y-2">
                  {results.songs.map((song: any) => (
                    <div
                      key={song.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        🎵
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{song.title}</p>
                        <p className="text-white/60 text-sm">{song.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Artists */}
            {results.artists.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Artistas</h3>
                <div className="space-y-2">
                  {results.artists.map((artist: any) => (
                    <div
                      key={artist.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        👤
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{artist.name}</p>
                        <p className="text-white/60 text-sm">{artist.followers} seguidores</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Albums */}
            {results.albums.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Álbuns</h3>
                <div className="space-y-2">
                  {results.albums.map((album: any) => (
                    <div
                      key={album.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                        💿
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{album.title}</p>
                        <p className="text-white/60 text-sm">{album.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {results.songs.length === 0 && results.artists.length === 0 && results.albums.length === 0 && (
              <div className="text-center py-8">
                <p className="text-white/60">Nenhum resultado encontrado para "{query}"</p>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!query && (
          <div className="text-center py-8">
            <Search className="h-16 w-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">Digite algo para começar a buscar</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
