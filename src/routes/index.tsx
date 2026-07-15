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

  // Improved Audio Setup
  const initAudio = () => {
    if (!audioRef.current) {
        const audio = new Audio(MUSIC_URL);
        audio.loop = true;
        audio.volume = 0.5;
        audioRef.current = audio;
    }
  }

  useEffect(() => {
    if (!containerRef.current) return
    const engine = new HelixEngine(containerRef.current, {
      score: 0,
      level: level,
      isGameOver: false,
      onWin: async () => {
        setGameState('WIN');
        audioRef.current?.pause();
        const bonus = 100 + (level * 10);
        setLocalJP(prev => prev + bonus);
        if (user) {
            await addJumpPoints(scoreRef.current + bonus);
            await refreshProfile();
        }
      },
      onLoss: async () => {
        setGameState('REVIVE');
        audioRef.current?.pause();
        if (user && scoreRef.current > 0) {
            await addJumpPoints(scoreRef.current);
            await refreshProfile();
        }
      },
      onScoreUpdate: (pts) => {
          setScore(prev => prev + pts);
          setLocalJP(prev => prev + pts);
      }
    })
    engineRef.current = engine
    return () => engine.dispose()
  }, [user, level])

  const startGame = () => {
    initAudio();
    audioRef.current?.play().catch(() => {});

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

      {/* Top HUD */}
      <div className="absolute top-4 inset-x-0 p-6 flex justify-between z-50 pointer-events-none">
          <div className="bg-black/80 p-2 rounded-xl flex items-center gap-2 border border-white/10">
            <Coins className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-bold">{(profile?.coin_balance || 0)} VC</span>
          </div>
          <div className="bg-black/80 p-2 rounded-xl flex items-center gap-2 border border-white/10">
            <span className="text-sm font-bold">{localJP} JP</span>
            <Award className="h-4 w-4 text-green-400" />
          </div>
      </div>

      {gameState === 'PLAYING' && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
            <div className="text-[10px] opacity-50 uppercase font-black tracking-widest">Stage {level}</div>
            <div className="text-7xl font-black italic">{score}</div>
        </div>
      )}

      {gameState === 'HOME' && activeTab === 'play' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/20">
            <h1 className="text-6xl font-black italic mb-12 text-center text-white drop-shadow-lg">HELIX<br/>EMPIRE</h1>
            <button onClick={startGame} className="w-64 h-24 bg-primary rounded-[40px] text-4xl font-black italic shadow-2xl">PLAY</button>
        </div>
      )}

      {gameState === 'WIN' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[100] bg-black/90 backdrop-blur-md">
            <Trophy className="h-20 w-20 text-yellow-400 mb-4 animate-bounce" />
            <h2 className="text-5xl font-black mb-8 italic">SUCCESS!</h2>
            <button onClick={() => { setLevel(l => l+1); handleRestart(); }} className="w-64 py-6 bg-white text-black rounded-3xl font-black text-xl shadow-xl">NEXT STAGE</button>
        </div>
      )}

      {gameState === 'REVIVE' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[100] bg-black/90 backdrop-blur-md">
            <h2 className="text-5xl font-black mb-8 italic text-red-500">FAILED</h2>
            <button onClick={handleRestart} className="w-64 py-6 bg-primary text-white rounded-3xl font-black text-xl shadow-xl">TRY AGAIN</button>
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
