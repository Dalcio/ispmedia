"use client";

import { useState, useEffect, useRef } from "react";
import { Command, Search, ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { getShortcuts, type ShortcutAction } from "@/lib/shortcuts";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUploadModal: () => void;
  onOpenPlaylistModal: () => void;
  onOpenDashboard: () => void;
  onOpenSearch: () => void;
  onCloseAllModals: () => void;
  onOpenProfile: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenUploadModal,
  onOpenPlaylistModal,
  onOpenDashboard,
  onOpenSearch,
  onCloseAllModals,
  onOpenProfile,
}: CommandPaletteProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const shortcuts = getShortcuts({
    openUploadModal: onOpenUploadModal,
    openPlaylistModal: onOpenPlaylistModal,
    openDashboard: onOpenDashboard,
    openSearch: onOpenSearch,
    closeAllModals: onCloseAllModals,
    openProfile: onOpenProfile,
  });

  // Filtrar shortcuts baseado no termo de busca
  const filteredShortcuts = shortcuts.filter(
    (shortcut) =>
      shortcut.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shortcut.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Reset do índice selecionado quando o termo de busca muda
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  // Focar no input quando o modal abre
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Navegação por teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredShortcuts.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredShortcuts.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (filteredShortcuts[selectedIndex]) {
            executeShortcut(filteredShortcuts[selectedIndex]);
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredShortcuts, onClose]);

  const executeShortcut = (shortcut: ShortcutAction) => {
    onClose();
    setTimeout(() => {
      shortcut.action();
    }, 150);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedIndex(0);
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case "actions":
        return "Ações";
      case "navigation":
        return "Navegação";
      case "shortcuts":
        return "Atalhos";
      default:
        return category;
    }
  };

  // Agrupar shortcuts por categoria
  const groupedShortcuts = filteredShortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, ShortcutAction[]>);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 min-h-[400px] -m-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Command className="w-5 h-5 text-purple-300" />
          </div>
          <h2 className="text-xl font-semibold text-white">
            Painel de Comandos
          </h2>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
          <Input
            ref={searchInputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Digite para buscar comandos..."
            className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-purple-400/50 focus:ring-purple-400/20"
          />
        </div>

        {/* Commands List */}
        <div className="space-y-6 max-h-80 overflow-y-auto">
          {Object.entries(groupedShortcuts).map(
            ([category, categoryShortcuts]) => (
              <div key={category}>
                <h3 className="text-sm font-medium text-white/70 mb-3 uppercase tracking-wider">
                  {getCategoryTitle(category)}
                </h3>
                <div className="space-y-1">
                  {categoryShortcuts.map((shortcut, index) => {
                    const globalIndex = filteredShortcuts.indexOf(shortcut);
                    const isSelected = globalIndex === selectedIndex;
                    const IconComponent = shortcut.icon;

                    return (
                      <div
                        key={`${shortcut.key}-${shortcut.label}`}
                        className={`
                        group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200
                        ${
                          isSelected
                            ? "bg-purple-500/30 border border-purple-400/50"
                            : "bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/20"
                        }
                      `}
                        onClick={() => executeShortcut(shortcut)}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`
                            p-2 rounded-md transition-colors
                            ${
                              isSelected
                                ? "bg-purple-500/50"
                                : "bg-white/10 group-hover:bg-white/20"
                            }
                          `}
                          >
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {shortcut.label}
                            </div>
                            <div className="text-white/60 text-sm">
                              {shortcut.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {shortcut.key !== "Perfil" &&
                            shortcut.key !== "Esc" && (
                              <div className="px-2 py-1 bg-white/10 rounded text-xs text-white/70 font-mono">
                                {shortcut.key}
                              </div>
                            )}
                          <ChevronRight
                            className={`
                            w-4 h-4 text-white/40 transition-transform
                            ${isSelected ? "translate-x-1" : ""}
                          `}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        {filteredShortcuts.length === 0 && (
          <div className="text-center py-8 text-white/50">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Nenhum comando encontrado</p>
            <p className="text-sm">Tente um termo diferente</p>
          </div>
        )}

        {filteredShortcuts.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 text-xs text-white/50">
            <div className="flex items-center gap-4">
              <span>↑↓ para navegar</span>
              <span>↵ para executar</span>
            </div>
            <span>Esc para fechar</span>
          </div>
        )}
      </div>
    </Modal>
  );
}
