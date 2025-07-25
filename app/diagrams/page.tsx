"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";

export default function DiagramsPage() {
  const [activeSection, setActiveSection] = useState("use-cases");

  const sections = [
    { id: "use-cases", name: "Casos de Uso", icon: "🎯" },
    { id: "data-structure", name: "Estrutura de Dados", icon: "🗃️" },
    { id: "components", name: "Relação de Componentes", icon: "🧩" },
    { id: "architecture", name: "Arquitetura Geral", icon: "🏗️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar ao Início</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            📊 Diagramas Visuais - ISPmedia
          </h1>
          <p className="text-xl text-gray-300">
            Fluxos e estrutura do projeto de streaming de música
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeSection === section.id
                  ? "bg-purple-600 text-white shadow-lg scale-105"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              {section.icon} {section.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-slate-800 rounded-xl shadow-2xl p-8">
          {activeSection === "use-cases" && <UseCasesDiagram />}
          {activeSection === "data-structure" && <DataStructureDiagram />}
          {activeSection === "components" && <ComponentsDiagram />}
          {activeSection === "architecture" && <ArchitectureDiagram />}
        </div>
      </div>
    </div>
  );
}

function UseCasesDiagram() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">🎯 Casos de Uso</h2>

      <div className="bg-slate-900 rounded-lg p-6 mb-6">
        <div className="mermaid-container">
          <svg viewBox="0 0 1200 800" className="w-full h-auto">
            {/* User */}
            <g>
              <circle
                cx="100"
                cy="400"
                r="40"
                fill="#8B5CF6"
                stroke="#A855F7"
                strokeWidth="2"
              />
              <text
                x="100"
                y="405"
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
              >
                👤 User
              </text>
            </g>

            {/* Use Cases */}
            <g>
              {/* Upload de Música */}
              <ellipse
                cx="350"
                cy="200"
                rx="80"
                ry="40"
                fill="#1E293B"
                stroke="#3B82F6"
                strokeWidth="2"
              />
              <text
                x="350"
                y="205"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                🎵 Upload
              </text>
              <text
                x="350"
                y="220"
                textAnchor="middle"
                fill="white"
                fontSize="12"
              >
                Música
              </text>

              {/* Criar Playlist */}
              <ellipse
                cx="350"
                cy="300"
                rx="80"
                ry="40"
                fill="#1E293B"
                stroke="#10B981"
                strokeWidth="2"
              />
              <text
                x="350"
                y="305"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                📁 Criar
              </text>
              <text
                x="350"
                y="320"
                textAnchor="middle"
                fill="white"
                fontSize="12"
              >
                Playlist
              </text>

              {/* Adicionar à Playlist */}
              <ellipse
                cx="350"
                cy="400"
                rx="80"
                ry="40"
                fill="#1E293B"
                stroke="#F59E0B"
                strokeWidth="2"
              />
              <text
                x="350"
                y="405"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                ➕ Adicionar
              </text>
              <text
                x="350"
                y="420"
                textAnchor="middle"
                fill="white"
                fontSize="12"
              >
                à Playlist
              </text>

              {/* Executar Música */}
              <ellipse
                cx="350"
                cy="500"
                rx="80"
                ry="40"
                fill="#1E293B"
                stroke="#EF4444"
                strokeWidth="2"
              />
              <text
                x="350"
                y="505"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                ▶️ Executar
              </text>
              <text
                x="350"
                y="520"
                textAnchor="middle"
                fill="white"
                fontSize="12"
              >
                Música
              </text>

              {/* Abrir Dashboard */}
              <ellipse
                cx="350"
                cy="600"
                rx="80"
                ry="40"
                fill="#1E293B"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              <text
                x="350"
                y="605"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                📊 Dashboard
              </text>
              <text
                x="350"
                y="620"
                textAnchor="middle"
                fill="white"
                fontSize="12"
              >
                Seções
              </text>
            </g>

            {/* System Components */}
            <g>
              {/* Firebase Storage */}
              <rect
                x="550"
                y="160"
                width="120"
                height="60"
                rx="10"
                fill="#FF9500"
                stroke="#FF9500"
                strokeWidth="2"
              />
              <text
                x="610"
                y="185"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                🔥 Firebase
              </text>
              <text
                x="610"
                y="200"
                textAnchor="middle"
                fill="white"
                fontSize="12"
              >
                Storage
              </text>

              {/* Firestore */}
              <rect
                x="550"
                y="260"
                width="120"
                height="60"
                rx="10"
                fill="#4285F4"
                stroke="#4285F4"
                strokeWidth="2"
              />
              <text
                x="610"
                y="285"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                🗃️ Firestore
              </text>
              <text
                x="610"
                y="300"
                textAnchor="middle"
                fill="white"
                fontSize="12"
              >
                Database
              </text>

              {/* Audio Player */}
              <rect
                x="550"
                y="460"
                width="120"
                height="60"
                rx="10"
                fill="#22C55E"
                stroke="#22C55E"
                strokeWidth="2"
              />
              <text
                x="610"
                y="485"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                🎵 Audio
              </text>
              <text
                x="610"
                y="500"
                textAnchor="middle"
                fill="white"
                fontSize="12"
              >
                Player
              </text>

              {/* Dashboard Drawer */}
              <rect
                x="550"
                y="560"
                width="120"
                height="60"
                rx="10"
                fill="#8B5CF6"
                stroke="#8B5CF6"
                strokeWidth="2"
              />
              <text
                x="610"
                y="585"
                textAnchor="middle"
                fill="white"
                fontSize="12"
                fontWeight="bold"
              >
                📱 Dashboard
              </text>
              <text
                x="610"
                y="600"
                textAnchor="middle"
                fill="white"
                fontSize="12"
              >
                Drawer
              </text>
            </g>

            {/* Arrows */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748B" />
              </marker>
            </defs>

            {/* User to Use Cases */}
            <line
              x1="140"
              y1="380"
              x2="270"
              y2="210"
              stroke="#64748B"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="140"
              y1="390"
              x2="270"
              y2="300"
              stroke="#64748B"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="140"
              y1="400"
              x2="270"
              y2="400"
              stroke="#64748B"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="140"
              y1="410"
              x2="270"
              y2="500"
              stroke="#64748B"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="140"
              y1="420"
              x2="270"
              y2="600"
              stroke="#64748B"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />

            {/* Use Cases to Systems */}
            <line
              x1="430"
              y1="200"
              x2="550"
              y2="190"
              stroke="#64748B"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="430"
              y1="320"
              x2="550"
              y2="290"
              stroke="#64748B"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="430"
              y1="400"
              x2="550"
              y2="290"
              stroke="#64748B"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="430"
              y1="500"
              x2="550"
              y2="490"
              stroke="#64748B"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="430"
              y1="600"
              x2="550"
              y2="590"
              stroke="#64748B"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          </svg>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-xl font-bold text-blue-400 mb-3">
            🎵 Fluxo de Upload
          </h3>
          <ol className="text-gray-300 space-y-2">
            <li>1. Usuário seleciona arquivo de áudio</li>
            <li>2. Validação de formato e tamanho</li>
            <li>3. Upload para Firebase Storage</li>
            <li>4. Metadados salvos no Firestore</li>
            <li>5. Atualização da interface</li>
          </ol>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-xl font-bold text-green-400 mb-3">
            📁 Fluxo de Playlist
          </h3>
          <ol className="text-gray-300 space-y-2">
            <li>1. Criação de nova playlist</li>
            <li>2. Seleção de músicas</li>
            <li>3. Adição à playlist</li>
            <li>4. Sincronização no Firestore</li>
            <li>5. Atualização em tempo real</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function DataStructureDiagram() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">
        🗃️ Estrutura de Dados
      </h2>

      <div className="bg-slate-900 rounded-lg p-6 mb-6">
        <svg viewBox="0 0 1200 600" className="w-full h-auto">
          {/* Users Collection */}
          <g>
            <rect
              x="50"
              y="50"
              width="200"
              height="200"
              rx="10"
              fill="#1E293B"
              stroke="#3B82F6"
              strokeWidth="2"
            />
            <text
              x="150"
              y="80"
              textAnchor="middle"
              fill="#3B82F6"
              fontSize="16"
              fontWeight="bold"
            >
              👥 Users
            </text>
            <text x="70" y="110" fill="white" fontSize="12">
              • uid: string
            </text>
            <text x="70" y="130" fill="white" fontSize="12">
              • email: string
            </text>
            <text x="70" y="150" fill="white" fontSize="12">
              • displayName: string
            </text>
            <text x="70" y="170" fill="white" fontSize="12">
              • createdAt: timestamp
            </text>
            <text x="70" y="190" fill="white" fontSize="12">
              • profileImage?: string
            </text>
            <text x="70" y="210" fill="white" fontSize="12">
              • preferences: object
            </text>
            <text x="70" y="230" fill="white" fontSize="12">
              • isActive: boolean
            </text>
          </g>

          {/* Tracks Collection */}
          <g>
            <rect
              x="300"
              y="50"
              width="200"
              height="260"
              rx="10"
              fill="#1E293B"
              stroke="#10B981"
              strokeWidth="2"
            />
            <text
              x="400"
              y="80"
              textAnchor="middle"
              fill="#10B981"
              fontSize="16"
              fontWeight="bold"
            >
              🎵 Tracks
            </text>
            <text x="320" y="110" fill="white" fontSize="12">
              • id: string
            </text>
            <text x="320" y="130" fill="white" fontSize="12">
              • title: string
            </text>
            <text x="320" y="150" fill="white" fontSize="12">
              • artist: string
            </text>
            <text x="320" y="170" fill="white" fontSize="12">
              • genre: string
            </text>
            <text x="320" y="190" fill="white" fontSize="12">
              • duration: number
            </text>
            <text x="320" y="210" fill="white" fontSize="12">
              • fileUrl: string
            </text>
            <text x="320" y="230" fill="white" fontSize="12">
              • uploadedBy: string
            </text>
            <text x="320" y="250" fill="white" fontSize="12">
              • uploadedAt: timestamp
            </text>
            <text x="320" y="270" fill="white" fontSize="12">
              • playCount: number
            </text>
            <text x="320" y="290" fill="white" fontSize="12">
              • isPublic: boolean
            </text>
          </g>

          {/* Playlists Collection */}
          <g>
            <rect
              x="550"
              y="50"
              width="200"
              height="220"
              rx="10"
              fill="#1E293B"
              stroke="#F59E0B"
              strokeWidth="2"
            />
            <text
              x="650"
              y="80"
              textAnchor="middle"
              fill="#F59E0B"
              fontSize="16"
              fontWeight="bold"
            >
              📁 Playlists
            </text>
            <text x="570" y="110" fill="white" fontSize="12">
              • id: string
            </text>
            <text x="570" y="130" fill="white" fontSize="12">
              • name: string
            </text>
            <text x="570" y="150" fill="white" fontSize="12">
              • description?: string
            </text>
            <text x="570" y="170" fill="white" fontSize="12">
              • createdBy: string
            </text>
            <text x="570" y="190" fill="white" fontSize="12">
              • createdAt: timestamp
            </text>
            <text x="570" y="210" fill="white" fontSize="12">
              • trackIds: string[]
            </text>
            <text x="570" y="230" fill="white" fontSize="12">
              • isPublic: boolean
            </text>
            <text x="570" y="250" fill="white" fontSize="12">
              • coverImage?: string
            </text>
          </g>

          {/* TrackPlays Collection */}
          <g>
            <rect
              x="800"
              y="50"
              width="200"
              height="180"
              rx="10"
              fill="#1E293B"
              stroke="#EF4444"
              strokeWidth="2"
            />
            <text
              x="900"
              y="80"
              textAnchor="middle"
              fill="#EF4444"
              fontSize="16"
              fontWeight="bold"
            >
              📊 TrackPlays
            </text>
            <text x="820" y="110" fill="white" fontSize="12">
              • id: string
            </text>
            <text x="820" y="130" fill="white" fontSize="12">
              • trackId: string
            </text>
            <text x="820" y="150" fill="white" fontSize="12">
              • userId: string
            </text>
            <text x="820" y="170" fill="white" fontSize="12">
              • playedAt: timestamp
            </text>
            <text x="820" y="190" fill="white" fontSize="12">
              • duration: number
            </text>
            <text x="820" y="210" fill="white" fontSize="12">
              • completed: boolean
            </text>
          </g>

          {/* Relationships */}
          <defs>
            <marker
              id="arrow"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748B" />
            </marker>
          </defs>

          {/* Users -> Tracks */}
          <line
            x1="250"
            y1="150"
            x2="300"
            y2="150"
            stroke="#64748B"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text
            x="275"
            y="140"
            textAnchor="middle"
            fill="#64748B"
            fontSize="10"
          >
            uploads
          </text>

          {/* Users -> Playlists */}
          <line
            x1="200"
            y1="100"
            x2="550"
            y2="120"
            stroke="#64748B"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text
            x="375"
            y="105"
            textAnchor="middle"
            fill="#64748B"
            fontSize="10"
          >
            creates
          </text>

          {/* Playlists -> Tracks */}
          <line
            x1="600"
            y1="270"
            x2="450"
            y2="310"
            stroke="#64748B"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text
            x="525"
            y="295"
            textAnchor="middle"
            fill="#64748B"
            fontSize="10"
          >
            contains
          </text>

          {/* Users -> TrackPlays */}
          <line
            x1="250"
            y1="200"
            x2="800"
            y2="160"
            stroke="#64748B"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text
            x="525"
            y="175"
            textAnchor="middle"
            fill="#64748B"
            fontSize="10"
          >
            plays
          </text>

          {/* Tracks -> TrackPlays */}
          <line
            x1="500"
            y1="200"
            x2="800"
            y2="140"
            stroke="#64748B"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text
            x="650"
            y="165"
            textAnchor="middle"
            fill="#64748B"
            fontSize="10"
          >
            generates
          </text>
        </svg>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-xl font-bold text-blue-400 mb-3">
            🔗 Relacionamentos
          </h3>
          <ul className="text-gray-300 space-y-2">
            <li>
              • <strong>Users</strong> podem fazer upload de múltiplas
              <strong>Tracks</strong>
            </li>
            <li>
              • <strong>Users</strong> podem criar múltiplas
              <strong>Playlists</strong>
            </li>
            <li>
              • <strong>Playlists</strong> contêm referências a
              <strong>Tracks</strong>
            </li>
            <li>
              • <strong>TrackPlays</strong> registra reproduções de
              <strong>Tracks</strong> por <strong>Users</strong>
            </li>
          </ul>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-xl font-bold text-purple-400 mb-3">
            📋 Regras de Validação
          </h3>
          <ul className="text-gray-300 space-y-2">
            <li>• Tracks devem ter título e gênero obrigatórios</li>
            <li>• Apenas o criador pode editar playlists privadas</li>
            <li>• TrackPlays são criados automaticamente</li>
            <li>• Usuários podem ter apenas um perfil ativo</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ComponentsDiagram() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">
        🧩 Relação de Componentes
      </h2>

      <div className="bg-slate-900 rounded-lg p-6 mb-6">
        <svg viewBox="0 0 1400 800" className="w-full h-auto">
          {/* Dashboard Drawer */}
          <g>
            <rect
              x="50"
              y="100"
              width="180"
              height="600"
              rx="10"
              fill="#1E293B"
              stroke="#8B5CF6"
              strokeWidth="3"
            />
            <text
              x="140"
              y="130"
              textAnchor="middle"
              fill="#8B5CF6"
              fontSize="14"
              fontWeight="bold"
            >
              📱 Dashboard Drawer
            </text>

            {/* Tabs inside drawer */}
            <rect
              x="70"
              y="160"
              width="140"
              height="40"
              rx="5"
              fill="#374151"
              stroke="#10B981"
              strokeWidth="2"
            />
            <text
              x="140"
              y="185"
              textAnchor="middle"
              fill="white"
              fontSize="12"
            >
              🎵 Tracks Tab
            </text>

            <rect
              x="70"
              y="220"
              width="140"
              height="40"
              rx="5"
              fill="#374151"
              stroke="#F59E0B"
              strokeWidth="2"
            />
            <text
              x="140"
              y="245"
              textAnchor="middle"
              fill="white"
              fontSize="12"
            >
              📁 Playlists Tab
            </text>

            <rect
              x="70"
              y="280"
              width="140"
              height="40"
              rx="5"
              fill="#374151"
              stroke="#3B82F6"
              strokeWidth="2"
            />
            <text
              x="140"
              y="305"
              textAnchor="middle"
              fill="white"
              fontSize="12"
            >
              👤 Profile Tab
            </text>

            <rect
              x="70"
              y="340"
              width="140"
              height="40"
              rx="5"
              fill="#374151"
              stroke="#EF4444"
              strokeWidth="2"
            />
            <text
              x="140"
              y="365"
              textAnchor="middle"
              fill="white"
              fontSize="12"
            >
              🔍 Search Tab
            </text>
          </g>

          {/* Modals */}
          <g>
            {/* Upload Modal */}
            <rect
              x="300"
              y="50"
              width="160"
              height="120"
              rx="10"
              fill="#1E293B"
              stroke="#10B981"
              strokeWidth="2"
            />
            <text
              x="380"
              y="80"
              textAnchor="middle"
              fill="#10B981"
              fontSize="12"
              fontWeight="bold"
            >
              📤 Upload Modal
            </text>
            <text x="320" y="100" fill="white" fontSize="10">
              • File selection
            </text>
            <text x="320" y="115" fill="white" fontSize="10">
              • Metadata form
            </text>
            <text x="320" y="130" fill="white" fontSize="10">
              • Progress bar
            </text>
            <text x="320" y="145" fill="white" fontSize="10">
              • Validation
            </text>

            {/* Playlist Modal */}
            <rect
              x="300"
              y="200"
              width="160"
              height="120"
              rx="10"
              fill="#1E293B"
              stroke="#F59E0B"
              strokeWidth="2"
            />
            <text
              x="380"
              y="230"
              textAnchor="middle"
              fill="#F59E0B"
              fontSize="12"
              fontWeight="bold"
            >
              📁 Playlist Modal
            </text>
            <text x="320" y="250" fill="white" fontSize="10">
              • Create/Edit form
            </text>
            <text x="320" y="265" fill="white" fontSize="10">
              • Track selection
            </text>
            <text x="320" y="280" fill="white" fontSize="10">
              • Cover upload
            </text>
            <text x="320" y="295" fill="white" fontSize="10">
              • Privacy settings
            </text>

            {/* Auth Modal */}
            <rect
              x="300"
              y="350"
              width="160"
              height="120"
              rx="10"
              fill="#1E293B"
              stroke="#3B82F6"
              strokeWidth="2"
            />
            <text
              x="380"
              y="380"
              textAnchor="middle"
              fill="#3B82F6"
              fontSize="12"
              fontWeight="bold"
            >
              🔐 Auth Modal
            </text>
            <text x="320" y="400" fill="white" fontSize="10">
              • Login form
            </text>
            <text x="320" y="415" fill="white" fontSize="10">
              • Register form
            </text>
            <text x="320" y="430" fill="white" fontSize="10">
              • Password reset
            </text>
            <text x="320" y="445" fill="white" fontSize="10">
              • Social login
            </text>

            {/* Search Modal */}
            <rect
              x="300"
              y="500"
              width="160"
              height="120"
              rx="10"
              fill="#1E293B"
              stroke="#EF4444"
              strokeWidth="2"
            />
            <text
              x="380"
              y="530"
              textAnchor="middle"
              fill="#EF4444"
              fontSize="12"
              fontWeight="bold"
            >
              🔍 Search Modal
            </text>
            <text x="320" y="550" fill="white" fontSize="10">
              • Global search
            </text>
            <text x="320" y="565" fill="white" fontSize="10">
              • Filter options
            </text>
            <text x="320" y="580" fill="white" fontSize="10">
              • Results display
            </text>
            <text x="320" y="595" fill="white" fontSize="10">
              • Quick actions
            </text>
          </g>

          {/* Global Audio Player */}
          <g>
            <rect
              x="550"
              y="350"
              width="200"
              height="150"
              rx="10"
              fill="#1E293B"
              stroke="#22C55E"
              strokeWidth="3"
            />
            <text
              x="650"
              y="380"
              textAnchor="middle"
              fill="#22C55E"
              fontSize="14"
              fontWeight="bold"
            >
              🎵 Global Audio Player
            </text>
            <text x="570" y="405" fill="white" fontSize="11">
              • Play/Pause controls
            </text>
            <text x="570" y="420" fill="white" fontSize="11">
              • Progress bar
            </text>
            <text x="570" y="435" fill="white" fontSize="11">
              • Volume control
            </text>
            <text x="570" y="450" fill="white" fontSize="11">
              • Queue management
            </text>
            <text x="570" y="465" fill="white" fontSize="11">
              • Shuffle/Repeat
            </text>
            <text x="570" y="480" fill="white" fontSize="11">
              • Audio visualization
            </text>
          </g>

          {/* Context Providers */}
          <g>
            <rect
              x="850"
              y="100"
              width="180"
              height="500"
              rx="10"
              fill="#1E293B"
              stroke="#A855F7"
              strokeWidth="3"
            />
            <text
              x="940"
              y="130"
              textAnchor="middle"
              fill="#A855F7"
              fontSize="14"
              fontWeight="bold"
            >
              🔄 Context Providers
            </text>

            <rect
              x="870"
              y="160"
              width="140"
              height="60"
              rx="5"
              fill="#374151"
              stroke="#8B5CF6"
              strokeWidth="2"
            />
            <text
              x="940"
              y="185"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🎵 Audio Context
            </text>
            <text
              x="940"
              y="200"
              textAnchor="middle"
              fill="white"
              fontSize="10"
            >
              Player state
            </text>

            <rect
              x="870"
              y="240"
              width="140"
              height="60"
              rx="5"
              fill="#374151"
              stroke="#3B82F6"
              strokeWidth="2"
            />
            <text
              x="940"
              y="265"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🔐 Auth Context
            </text>
            <text
              x="940"
              y="280"
              textAnchor="middle"
              fill="white"
              fontSize="10"
            >
              User session
            </text>

            <rect
              x="870"
              y="320"
              width="140"
              height="60"
              rx="5"
              fill="#374151"
              stroke="#10B981"
              strokeWidth="2"
            />
            <text
              x="940"
              y="345"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🎵 Tracks Context
            </text>
            <text
              x="940"
              y="360"
              textAnchor="middle"
              fill="white"
              fontSize="10"
            >
              Tracks data
            </text>

            <rect
              x="870"
              y="400"
              width="140"
              height="60"
              rx="5"
              fill="#374151"
              stroke="#F59E0B"
              strokeWidth="2"
            />
            <text
              x="940"
              y="425"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🖱️ Cursor Context
            </text>
            <text
              x="940"
              y="440"
              textAnchor="middle"
              fill="white"
              fontSize="10"
            >
              Custom cursor
            </text>

            <rect
              x="870"
              y="480"
              width="140"
              height="60"
              rx="5"
              fill="#374151"
              stroke="#EF4444"
              strokeWidth="2"
            />
            <text
              x="940"
              y="505"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              📱 Dashboard Context
            </text>
            <text
              x="940"
              y="520"
              textAnchor="middle"
              fill="white"
              fontSize="10"
            >
              Drawer state
            </text>
          </g>

          {/* Arrows showing relationships */}
          <defs>
            <marker
              id="componentArrow"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#64748B" />
            </marker>
          </defs>

          {/* Drawer to Modals */}
          <line
            x1="230"
            y1="180"
            x2="300"
            y2="110"
            stroke="#64748B"
            strokeWidth="2"
            markerEnd="url(#componentArrow)"
          />
          <line
            x1="230"
            y1="240"
            x2="300"
            y2="260"
            stroke="#64748B"
            strokeWidth="2"
            markerEnd="url(#componentArrow)"
          />
          <line
            x1="230"
            y1="300"
            x2="300"
            y2="410"
            stroke="#64748B"
            strokeWidth="2"
            markerEnd="url(#componentArrow)"
          />
          <line
            x1="230"
            y1="360"
            x2="300"
            y2="560"
            stroke="#64748B"
            strokeWidth="2"
            markerEnd="url(#componentArrow)"
          />

          {/* Modals to Player */}
          <line
            x1="460"
            y1="200"
            x2="550"
            y2="400"
            stroke="#64748B"
            strokeWidth="2"
            markerEnd="url(#componentArrow)"
          />

          {/* Player to Contexts */}
          <line
            x1="750"
            y1="425"
            x2="850"
            y2="350"
            stroke="#64748B"
            strokeWidth="2"
            markerEnd="url(#componentArrow)"
          />

          {/* Drawer to Contexts */}
          <line
            x1="230"
            y1="400"
            x2="850"
            y2="350"
            stroke="#64748B"
            strokeWidth="2"
            markerEnd="url(#componentArrow)"
            strokeDasharray="5,5"
          />
        </svg>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-xl font-bold text-purple-400 mb-3">
            📱 Dashboard Drawer
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            Container principal que gerencia a navegação entre seções da
            aplicação.
          </p>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Controla estado das tabs</li>
            <li>• Gerencia visibilidade</li>
            <li>• Coordena modais</li>
          </ul>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-xl font-bold text-green-400 mb-3">
            🎵 Audio Player
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            Componente global que persiste em toda a aplicação para reprodução
            contínua.
          </p>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Estado global compartilhado</li>
            <li>• Controles persistentes</li>
            <li>• Integração com contexts</li>
          </ul>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-xl font-bold text-blue-400 mb-3">
            🔄 Context System
          </h3>
          <p className="text-gray-300 text-sm mb-3">
            Sistema de contextos React que gerencia estado global da aplicação.
          </p>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Auth & Session</li>
            <li>• Audio State</li>
            <li>• Data Management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function ArchitectureDiagram() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">
        🏗️ Arquitetura Geral
      </h2>

      <div className="bg-slate-900 rounded-lg p-6 mb-6">
        <svg viewBox="0 0 1400 700" className="w-full h-auto">
          {/* Frontend Layer */}
          <g>
            <rect
              x="50"
              y="50"
              width="1300"
              height="150"
              rx="10"
              fill="#1E293B"
              stroke="#8B5CF6"
              strokeWidth="3"
            />
            <text
              x="700"
              y="80"
              textAnchor="middle"
              fill="#8B5CF6"
              fontSize="16"
              fontWeight="bold"
            >
              🎨 Frontend Layer (Next.js 15)
            </text>

            <rect
              x="80"
              y="110"
              width="150"
              height="60"
              rx="5"
              fill="#374151"
              stroke="#3B82F6"
              strokeWidth="2"
            />
            <text
              x="155"
              y="145"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              📄 Pages
            </text>

            <rect
              x="260"
              y="110"
              width="150"
              height="60"
              rx="5"
              fill="#374151"
              stroke="#10B981"
              strokeWidth="2"
            />
            <text
              x="335"
              y="145"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🧩 Components
            </text>

            <rect
              x="440"
              y="110"
              width="150"
              height="60"
              rx="5"
              fill="#374151"
              stroke="#F59E0B"
              strokeWidth="2"
            />
            <text
              x="515"
              y="145"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🔄 Contexts
            </text>

            <rect
              x="620"
              y="110"
              width="150"
              height="60"
              rx="5"
              fill="#374151"
              stroke="#EF4444"
              strokeWidth="2"
            />
            <text
              x="695"
              y="145"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🪝 Hooks
            </text>

            <rect
              x="800"
              y="110"
              width="150"
              height="60"
              rx="5"
              fill="#374151"
              stroke="#22C55E"
              strokeWidth="2"
            />
            <text
              x="875"
              y="145"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🎨 Styles
            </text>

            <rect
              x="980"
              y="110"
              width="150"
              height="60"
              rx="5"
              fill="#374151"
              stroke="#A855F7"
              strokeWidth="2"
            />
            <text
              x="1055"
              y="145"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🔧 Utils
            </text>
          </g>

          {/* API Layer */}
          <g>
            <rect
              x="50"
              y="250"
              width="1300"
              height="120"
              rx="10"
              fill="#1E293B"
              stroke="#10B981"
              strokeWidth="3"
            />
            <text
              x="700"
              y="280"
              textAnchor="middle"
              fill="#10B981"
              fontSize="16"
              fontWeight="bold"
            >
              🔌 API Layer (Next.js API Routes)
            </text>

            <rect
              x="120"
              y="300"
              width="120"
              height="50"
              rx="5"
              fill="#374151"
              stroke="#3B82F6"
              strokeWidth="2"
            />
            <text
              x="180"
              y="330"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🔐 Auth API
            </text>

            <rect
              x="280"
              y="300"
              width="120"
              height="50"
              rx="5"
              fill="#374151"
              stroke="#F59E0B"
              strokeWidth="2"
            />
            <text
              x="340"
              y="330"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🎵 Music API
            </text>

            <rect
              x="440"
              y="300"
              width="120"
              height="50"
              rx="5"
              fill="#374151"
              stroke="#EF4444"
              strokeWidth="2"
            />
            <text
              x="500"
              y="330"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              👤 Users API
            </text>

            <rect
              x="600"
              y="300"
              width="120"
              height="50"
              rx="5"
              fill="#374151"
              stroke="#22C55E"
              strokeWidth="2"
            />
            <text
              x="660"
              y="330"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              📁 Playlists API
            </text>

            <rect
              x="760"
              y="300"
              width="120"
              height="50"
              rx="5"
              fill="#374151"
              stroke="#A855F7"
              strokeWidth="2"
            />
            <text
              x="820"
              y="330"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🎵 Tracks API
            </text>

            <rect
              x="920"
              y="300"
              width="120"
              height="50"
              rx="5"
              fill="#374151"
              stroke="#8B5CF6"
              strokeWidth="2"
            />
            <text
              x="980"
              y="330"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              💊 Health API
            </text>
          </g>

          {/* Firebase Layer */}
          <g>
            <rect
              x="50"
              y="420"
              width="1300"
              height="120"
              rx="10"
              fill="#1E293B"
              stroke="#FF9500"
              strokeWidth="3"
            />
            <text
              x="700"
              y="450"
              textAnchor="middle"
              fill="#FF9500"
              fontSize="16"
              fontWeight="bold"
            >
              🔥 Firebase Layer
            </text>

            <rect
              x="150"
              y="470"
              width="180"
              height="50"
              rx="5"
              fill="#374151"
              stroke="#4285F4"
              strokeWidth="2"
            />
            <text
              x="240"
              y="500"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🔐 Authentication
            </text>

            <rect
              x="370"
              y="470"
              width="180"
              height="50"
              rx="5"
              fill="#374151"
              stroke="#4285F4"
              strokeWidth="2"
            />
            <text
              x="460"
              y="500"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🗃️ Firestore Database
            </text>

            <rect
              x="590"
              y="470"
              width="180"
              height="50"
              rx="5"
              fill="#374151"
              stroke="#4285F4"
              strokeWidth="2"
            />
            <text
              x="680"
              y="500"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              ☁️ Cloud Storage
            </text>

            <rect
              x="810"
              y="470"
              width="180"
              height="50"
              rx="5"
              fill="#374151"
              stroke="#4285F4"
              strokeWidth="2"
            />
            <text
              x="900"
              y="500"
              textAnchor="middle"
              fill="white"
              fontSize="11"
            >
              🔧 Cloud Functions
            </text>
          </g>

          {/* External Services */}
          <g>
            <rect
              x="50"
              y="580"
              width="1300"
              height="80"
              rx="10"
              fill="#1E293B"
              stroke="#64748B"
              strokeWidth="2"
            />
            <text
              x="700"
              y="610"
              textAnchor="middle"
              fill="#64748B"
              fontSize="16"
              fontWeight="bold"
            >
              🌐 External Services
            </text>

            <rect
              x="200"
              y="630"
              width="150"
              height="30"
              rx="5"
              fill="#374151"
              stroke="#64748B"
              strokeWidth="1"
            />
            <text
              x="275"
              y="650"
              textAnchor="middle"
              fill="white"
              fontSize="10"
            >
              📧 Email Services
            </text>

            <rect
              x="400"
              y="630"
              width="150"
              height="30"
              rx="5"
              fill="#374151"
              stroke="#64748B"
              strokeWidth="1"
            />
            <text
              x="475"
              y="650"
              textAnchor="middle"
              fill="white"
              fontSize="10"
            >
              🎵 Audio Processing
            </text>

            <rect
              x="600"
              y="630"
              width="150"
              height="30"
              rx="5"
              fill="#374151"
              stroke="#64748B"
              strokeWidth="1"
            />
            <text
              x="675"
              y="650"
              textAnchor="middle"
              fill="white"
              fontSize="10"
            >
              📊 Analytics
            </text>

            <rect
              x="800"
              y="630"
              width="150"
              height="30"
              rx="5"
              fill="#374151"
              stroke="#64748B"
              strokeWidth="1"
            />
            <text
              x="875"
              y="650"
              textAnchor="middle"
              fill="white"
              fontSize="10"
            >
              💳 Payment Gateway
            </text>
          </g>

          {/* Arrows showing data flow */}
          <defs>
            <marker
              id="archArrow"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748B" />
            </marker>
          </defs>

          {/* Frontend to API */}
          <line
            x1="700"
            y1="200"
            x2="700"
            y2="250"
            stroke="#64748B"
            strokeWidth="3"
            markerEnd="url(#archArrow)"
          />

          {/* API to Firebase */}
          <line
            x1="700"
            y1="370"
            x2="700"
            y2="420"
            stroke="#64748B"
            strokeWidth="3"
            markerEnd="url(#archArrow)"
          />

          {/* Firebase to External */}
          <line
            x1="700"
            y1="540"
            x2="700"
            y2="580"
            stroke="#64748B"
            strokeWidth="3"
            markerEnd="url(#archArrow)"
          />
        </svg>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-bold text-purple-400 mb-2">
            🎨 Frontend
          </h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Next.js 15 (App Router)</li>
            <li>• TypeScript</li>
            <li>• Tailwind CSS</li>
            <li>• React Hooks</li>
            <li>• Context API</li>
          </ul>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-bold text-green-400 mb-2">
            🔌 API Layer
          </h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Next.js API Routes</li>
            <li>• RESTful endpoints</li>
            <li>• Middleware auth</li>
            <li>• Error handling</li>
            <li>• Rate limiting</li>
          </ul>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-bold text-orange-400 mb-2">
            🔥 Firebase
          </h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Authentication</li>
            <li>• Firestore Database</li>
            <li>• Cloud Storage</li>
            <li>• Cloud Functions</li>
            <li>• Real-time sync</li>
          </ul>
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-lg font-bold text-gray-400 mb-2">🌐 External</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Email services</li>
            <li>• Audio processing</li>
            <li>• Analytics</li>
            <li>• CDN delivery</li>
            <li>• Monitoring</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 bg-slate-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-blue-400 mb-4">
          🔄 Fluxo de Dados
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-2">
              📤 Upload de Música
            </h4>
            <ol className="text-gray-300 text-sm space-y-1">
              <li>1. Frontend: Seleção e validação do arquivo</li>
              <li>2. API: Autenticação e processamento</li>
              <li>3. Firebase Storage: Upload do arquivo</li>
              <li>4. Firestore: Salvamento dos metadados</li>
              <li>5. Frontend: Atualização da interface</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">
              🎵 Reprodução de Música
            </h4>
            <ol className="text-gray-300 text-sm space-y-1">
              <li>1. Frontend: Solicitação de reprodução</li>
              <li>2. API: Verificação de permissões</li>
              <li>3. Firebase: Busca da URL do arquivo</li>
              <li>4. Firestore: Registro da reprodução</li>
              <li>5. Audio Player: Início da reprodução</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
