import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { HelixEngine } from '@/game/HelixEngine'
import { GameUI } from '@/components/GameUI'
import { useAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/')({
  component: GamePage,
})

function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<HelixEngine | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { user, profile, addJumpPoints, refreshProfile, requestPayout } = useAuth()

  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [gameState, setGameState] = useState<'HOME' | 'PLAYING' | 'REVIVE' | 'WIN'>('HOME')
  const [activeTab, setActiveTab] = useState('play')
  const [localJP, setLocalJP] = useState(0)

  useEffect(() => {
    if (profile) setLocalJP(Number(profile.jump_balance))
  }, [profile])

  // Initialize Engine once
  useEffect(() => {
    if (!containerRef.current) return
    const engine = new HelixEngine(containerRef.current, {
      score: 0,
      level: level,
      isGameOver: false,
      onWin: () => setGameState('WIN'),
      onLoss: () => setGameState('REVIVE'),
      onScoreUpdate: (pts) => {
          setScore(prev => prev + pts)
          setLocalJP(prev => prev + pts)
      }
    })
    engineRef.current = engine
    return () => engine.dispose()
  }, [])

  const startGame = () => {
    // 1. Force Local Music
    if (!audioRef.current) {
        audioRef.current = new Audio(`/music/tier${((level-1) % 15) + 1}.MP3`);
        audioRef.current.loop = true;
    }
    audioRef.current.play().catch(e => console.error("Audio blocked", e));

    // 2. Start Engine
    setScore(0);
    setGameState('PLAYING');
    if (engineRef.current) {
        engineRef.current.setupLevel(level);
        engineRef.current.setPaused(false);
    }
  }

  const handleRestart = () => {
    setGameState('HOME');
    engineRef.current?.resetToStart();
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null; // Reset for next level music
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {gameState === 'PLAYING' && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
            <div className="text-[10px] opacity-50 uppercase font-black">Stage {level}</div>
            <div className="text-7xl font-black italic">{score}</div>
        </div>
      )}

      {gameState === 'HOME' && activeTab === 'play' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/40">
            <h1 className="text-6xl font-black italic mb-12 text-center">HELIX<br/>EMPIRE</h1>
            <button onClick={startGame} className="w-64 h-24 bg-primary rounded-full text-4xl font-black italic shadow-2xl transition-transform active:scale-95">PLAY</button>
        </div>
      )}

      {gameState === 'WIN' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[100] bg-black/90">
            <h2 className="text-5xl font-black mb-8 italic">SUCCESS</h2>
            <button onClick={() => { setLevel(l => l+1); handleRestart(); }} className="w-64 py-6 bg-white text-black rounded-3xl font-black text-xl">NEXT STAGE</button>
        </div>
      )}

      {gameState === 'REVIVE' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[100] bg-black/90">
            <h2 className="text-5xl font-black mb-8 italic text-red-500">FAILED</h2>
            <button onClick={handleRestart} className="w-64 py-6 bg-primary text-white rounded-3xl font-black text-xl">TRY AGAIN</button>
        </div>
      )}

      <GameUI
        viralCoins={profile?.coin_balance || 0}
        jumpPoints={localJP}
        onSkinSelect={(s) => engineRef.current?.setSkin(s)}
        isHidden={gameState === 'PLAYING'}
        onTabChange={(t) => { setActiveTab(t); if(t !== 'play') setGameState('HOME'); }}
        requestPayout={requestPayout}
      />
    </div>
  )
}
