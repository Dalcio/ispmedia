'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Firebase auth login logic here
      console.log('Login:', formData.email, formData.password)
      onClose()
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem')
      return
    }
    setIsLoading(true)
    try {
      // Firebase auth register logic here
      console.log('Register:', formData.name, formData.email, formData.password)
      onClose()
    } catch (error) {
      console.error('Register error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Entrar no ISPmedia" size="md">
      <div className="space-y-6">
        {/* Mode Toggle */}
        <div className="flex bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mode === 'login' ? 'bg-primary text-black' : 'text-white/70 hover:text-white'
            }`}
          >
            Entrar
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              mode === 'register' ? 'bg-primary text-black' : 'text-white/70 hover:text-white'
            }`}
          >
            Cadastrar
          </button>
        </div>

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              type="text"
              placeholder="Nome completo"
              value={formData.name}
              onChange={(e) => updateFormData('name', e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Senha"
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Confirmar senha"
              value={formData.confirmPassword}
              onChange={(e) => updateFormData('confirmPassword', e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>
        )}

        {/* Social Login */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-center text-white/60 text-sm mb-4">Ou continue com</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" disabled={isLoading}>
              Google
            </Button>
            <Button variant="outline" disabled={isLoading}>
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
