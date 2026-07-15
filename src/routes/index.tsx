import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { HelixEngine, type BallSkin } from '@/game/HelixEngine'
import { GameUI } from '@/components/GameUI'
import { toast } from 'sonner'
import { Trophy, Coins, Award } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

export const Route = createFileRoute('/')({
  component: GamePage,
})

const MUSIC_URL = 'https://bukkaketokens.com/wp-content/uploads/2025/02/cyberpunk-street.mp3';

function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<HelixEngine | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { user, profile, addJumpPoints, refreshProfile, requestPayout } = useAuth()

  const [score, setScore] = useState(0)
  const scoreRef = useRef(0)
  const [level, setLevel] = useState(1)
  const [gameState, setGameState] = useState<'HOME' | 'PLAYING' | 'REVIVE' | 'WIN'>('HOME')
  const [activeTab, setActiveTab] = useState('play')
  const [localJP, setLocalJP] = useState(0)

  useEffect(() => {
    if (profile) setLocalJP(Number(profile.jump_balance))
  }, [profile])

  useEffect(() => { scoreRef.current = score }, [score])

  useEffect(() => {
    if (!containerRef.current) return
    const engine = new HelixEngine(containerRef.current, {
      score: 0,
      level: level,
      isGameOver: false,
      onWin: async () => {
        setGameState('WIN')
        const bonus = 100 + (level * 10)
        setLocalJP(prev => prev + bonus)
        if (user) {
            await addJumpPoints(scoreRef.current + bonus)
            await refreshProfile()
        }
      },
      onLoss: async () => {
        setGameState('REVIVE')
        if (user && scoreRef.current > 0) {
            await addJumpPoints(scoreRef.current)
            await refreshProfile()
        }
      },
      onScoreUpdate: (pts) => {
          setScore(prev => prev + pts)
          setLocalJP(prev => prev + pts)
      }
    })
    engineRef.current = engine
    return () => engine.dispose()
  }, [user])

  const startGame = () => {
    // 1. Force Audio Start
    if (!audioRef.current) {
        audioRef.current = new Audio(MUSIC_URL);
        audioRef.current.loop = true;
    }
    audioRef.current.play().catch(e => console.error("Audio error", e));

    // 2. Start Engine
    setScore(0);
    scoreRef.current = 0;
    setGameState('PLAYING');
    if (engineRef.current) {
        engineRef.current.setPaused(false);
    }
  }

  const handleRestart = () => {
    setScore(0);
    setGameState('HOME');
    engineRef.current?.resetToStart();
    audioRef.current?.pause();
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      <div ref={containerRef} className="absolute inset-0 z-0" />

      <div className="absolute top-4 inset-x-0 p-6 flex justify-between z-50 pointer-events-none">
          <div className="bg-black/60 p-2 rounded-xl flex items-center gap-2">
            <Coins className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-bold">{(profile?.coin_balance || 0)} VC</span>
          </div>
          <div className="bg-black/60 p-2 rounded-xl flex items-center gap-2">
            <span className="text-sm font-bold">{localJP} JP</span>
            <Award className="h-4 w-4 text-green-400" />
          </div>
      </div>

      {gameState === 'PLAYING' && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-center">
            <div className="text-xs opacity-50 uppercase font-black">Stage {level}</div>
            <div className="text-7xl font-black italic">{score}</div>
        </div>
      )}

      {gameState === 'HOME' && activeTab === 'play' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/20">
            <h1 className="text-6xl font-black italic mb-12 text-center">HELIX<br/>EMPIRE</h1>
            <button onClick={startGame} className="w-64 h-20 bg-primary rounded-full text-3xl font-black italic">PLAY</button>
        </div>
      )}

      {gameState === 'WIN' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[100] bg-black/90">
            <Trophy className="h-20 w-20 text-yellow-400 mb-4" />
            <h2 className="text-4xl font-black mb-8">STAGE CLEAR!</h2>
            <button onClick={() => { setLevel(l => l+1); handleRestart(); }} className="w-64 py-5 bg-white text-black rounded-2xl font-bold">NEXT LEVEL</button>
        </div>
      )}

      {gameState === 'REVIVE' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[100] bg-black/90">
            <h2 className="text-4xl font-black mb-8">GAME OVER</h2>
            <button onClick={handleRestart} className="w-64 py-5 bg-primary rounded-2xl font-bold">RETRY</button>
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
