/\*\*

- Exemplo de integração do sistema de atividades com o contexto global de áudio
- Este arquivo mostra como adicionar o rastreamento de atividades sem quebrar o código existente
  \*/

// EXEMPLO: Como modificar o global-audio-context.tsx

/\*

1. Primeiro, adicione os imports necessários no topo do arquivo:
   \*/

import { useAtividade } from "@/hooks/use-atividade";
import { useAuth } from "@/contexts/auth-context";

/_ 2. No componente GlobalAudioProvider, adicione os hooks:
_/

export function GlobalAudioProvider({ children }: { children: ReactNode }) {
// ... código existente ...

// ✅ NOVO: Hooks para atividades
const { user } = useAuth();
const {
registrarReproducao,
registrarPausa,
registrarPulo,
} = useAtividade();

// ✅ NOVO: Refs para controlar quando registrar atividades
const hasRegisteredPlay = useRef(false);
const lastTrackId = useRef<string | null>(null);

// ... resto do código existente ...

/_ 3. Modifique a função playTrack para registrar reprodução:
_/

const playTrack = (
track: Track,
playlist?: Track[],
playlistTitle?: string
) => {
// ... código existente ...

// ✅ NOVO: Reset flag quando trocar de música
if (track.id !== lastTrackId.current) {
hasRegisteredPlay.current = false;
lastTrackId.current = track.id;
}

setCurrentTrack(audioTrack);

if (audioRef.current) {
audioRef.current.src = track.audioUrl;
audioRef.current.load();
audioRef.current.play().catch(console.error);
}

// Código existente: Increment play count
incrementPlayCount(track.id);
};

/_ 4. Adicione listeners para registrar atividades automaticamente:
_/

// ✅ NOVO: Effect para registrar atividades baseado no estado do player
useEffect(() => {
if (!currentTrack?.id || !user?.uid) return;

// Registrar reprodução após 3 segundos de play contínuo
if (isPlaying && currentTime > 3 && !hasRegisteredPlay.current) {
registrarReproducao(user.uid, currentTrack.id).then(() => {
hasRegisteredPlay.current = true;
console.log(`✅ Reprodução registrada: ${currentTrack.title}`);
}).catch(console.error);
}

// Registrar pausa quando pausar (apenas se já teve reprodução)
if (!isPlaying && hasRegisteredPlay.current && currentTime > 0) {
registrarPausa(user.uid, currentTrack.id).then(() => {
console.log(`⏸️ Pausa registrada: ${currentTrack.title}`);
}).catch(console.error);
}
}, [isPlaying, currentTime, currentTrack?.id, user?.uid, registrarReproducao, registrarPausa]);

/_ 5. Modifique as funções playNext/playPrevious para registrar pulos:
_/

const playNext = () => {
if (currentTrackIndex < currentPlaylist.length - 1) {
// ✅ NOVO: Registrar pulo se houve reprodução da música atual
if (currentTrack?.id && user?.uid && hasRegisteredPlay.current) {
registrarPulo(user.uid, currentTrack.id).then(() => {
console.log(`⏭️ Pulo registrado: ${currentTrack.title}`);
}).catch(console.error);
}

    const nextTrack = currentPlaylist[currentTrackIndex + 1];
    setCurrentTrackIndex(currentTrackIndex + 1);
    playTrackDirectly(nextTrack);

}
};

const playPrevious = () => {
if (currentTrackIndex > 0) {
// ✅ NOVO: Registrar pulo se houve reprodução da música atual
if (currentTrack?.id && user?.uid && hasRegisteredPlay.current) {
registrarPulo(user.uid, currentTrack.id).then(() => {
console.log(`⏮️ Pulo registrado: ${currentTrack.title}`);
}).catch(console.error);
}

    const prevTrack = currentPlaylist[currentTrackIndex - 1];
    setCurrentTrackIndex(currentTrackIndex - 1);
    playTrackDirectly(prevTrack);

}
};

/_ 6. Para curtidas, você pode adicionar uma função no contexto:
_/

const toggleLike = async (liked: boolean) => {
if (!currentTrack?.id || !user?.uid) return;

try {
if (liked) {
await registrarCurtida(user.uid, currentTrack.id);
console.log(`❤️ Curtida registrada: ${currentTrack.title}`);
} else {
await registrarDescurtida(user.uid, currentTrack.id);
console.log(`💔 Descurtida registrada: ${currentTrack.title}`);
}
} catch (error) {
console.error('Erro ao registrar curtida/descurtida:', error);
}
};

// E adicionar no value do contexto:
const value: GlobalAudioContextType = {
// ... propriedades existentes ...
toggleLike, // ✅ NOVO
};

/_ 7. Atualizar a interface do contexto:
_/

interface GlobalAudioContextType {
// ... propriedades existentes ...

// ✅ NOVO: Função para curtir/descurtir
toggleLike: (liked: boolean) => Promise<void>;
}

/\*
RESUMO DA INTEGRAÇÃO:

✅ VANTAGENS:

- Integração não-invasiva (não quebra código existente)
- Rastreamento automático baseado no estado do player
- Logs informativos para debug
- Respeita o sistema de autenticação existente

✅ ATIVIDADES RASTREADAS AUTOMATICAMENTE:

- Reprodução (após 3 segundos de play)
- Pausa (quando pausar após reprodução)
- Pulo (ao usar next/previous)
- Curtidas (via função toggleLike)

✅ COMO USAR NO PLAYER UI:
No componente GlobalAudioPlayer.tsx:

const { toggleLike } = useGlobalAudio();

// No botão de curtir:
<Button onClick={() => toggleLike(!isLiked)}>
{isLiked ? <Heart className="fill-current" /> : <Heart />}
</Button>

✅ RESULTADO:
Todas as atividades do usuário são registradas automaticamente
e aparecem na seção "Atividades" do dashboard! 🎉
\*/
