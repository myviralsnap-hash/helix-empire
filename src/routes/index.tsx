import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { HelixEngine, type BallSkin } from '@/game/HelixEngine'
import { GameUI } from '@/components/GameUI'
import { GameOnboarding } from '@/components/GameOnboarding'
import { toast } from 'sonner'
import { AdMob, RewardAdPluginEvents, type AdMobRewardItem } from '@capacitor-community/admob'
import { Trophy, Coins, ArrowRight, Loader2, Award, X, CheckSquare, Square, Diamond } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Link } from '@tanstack/react-router'
import { Capacitor } from '@capacitor/core'

export const Route = createFileRoute('/')({
  component: GamePage,
})

function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<HelixEngine | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { user, profile, signIn, signUp, signOut, addViralCoins, addJumpPoints, requestPayout } = useAuth()

  const [skin, setSkin] = useState<BallSkin>('fire')
  const [score, setScore] = useState(0)
  const scoreRef = useRef(0)
  const [level, setLevel] = useState(1)
  const [gameState, setGameState] = useState<'HOME' | 'PLAYING' | 'REVIVE' | 'WIN' | 'AUTH'>('HOME')
  const [activeTab, setActiveTab] = useState<'play' | 'inventory' | 'store' | 'event'>('play')
  const [isAdLoading, setIsAdLoading] = useState(false)
  const [localJP, setLocalJP] = useState(0)

  const isNative = Capacitor.isNativePlatform()

  useEffect(() => {
    if (profile) setLocalJP(Number(profile.jump_balance))
  }, [profile])

  useEffect(() => {
    scoreRef.current = score
  }, [score])

  useEffect(() => {
    if (!containerRef.current) return
    const engine = new HelixEngine(containerRef.current, {
      score: 0,
      level: level,
      isGameOver: false,
      onWin: async () => {
        setGameState('WIN')
        const winBonus = 100 + (level * 10)
        const totalToSave = scoreRef.current + winBonus
        setLocalJP(prev => prev + winBonus)
        if (user) await addJumpPoints(totalToSave)
        toast.success("STAGE CLEAR!")
      },
      onLoss: async () => {
        setGameState('REVIVE')
        if (user && scoreRef.current > 0) await addJumpPoints(scoreRef.current)
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
    setScore(0)
    scoreRef.current = 0
    setGameState('PLAYING')
    setActiveTab('play')
    // Reset and start immediately
    if (engineRef.current) {
        engineRef.current.resetToStart()
        engineRef.current.setPaused(false)
        engineRef.current.revive()
    }
  }

  const nextLevel = () => {
    setLevel(prev => prev + 1)
    setScore(0)
    scoreRef.current = 0
    setGameState('PLAYING')
    setActiveTab('play')
    if (engineRef.current) {
        engineRef.current.setupLevel(level + 1)
        engineRef.current.resetToStart()
        engineRef.current.setPaused(false)
        engineRef.current.revive()
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black font-sans text-white">
      <div ref={containerRef} className="absolute inset-0 z-0" />

      {/* TOP HUD */}
      <div className="absolute top-4 inset-x-0 p-6 flex justify-between items-start z-[150] pointer-events-none">
          <div className="bg-black/60 backdrop-blur-xl border-2 border-white/10 rounded-2xl px-4 py-2 flex items-center gap-3 pointer-events-auto">
            <Coins className="h-4 w-4 text-yellow-400" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-black text-white/50 leading-none">Wallet</span>
              <span className="text-sm font-black leading-none">{(profile?.coin_balance || 0).toLocaleString()} VC</span>
            </div>
          </div>
          <div className="bg-black/60 backdrop-blur-xl border-2 border-white/10 rounded-2xl px-4 py-2 flex items-center gap-3 text-right pointer-events-auto">
            <div className="flex flex-col text-right">
              <span className="text-[10px] uppercase font-black text-white/50 leading-none">Progress</span>
              <span className="text-sm font-black leading-none text-green-400">{localJP.toLocaleString()} JP</span>
            </div>
            <Award className="h-4 w-4 text-green-400" />
          </div>
      </div>

      {/* SCORE HUD */}
      {gameState === 'PLAYING' && activeTab === 'play' && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10">
            <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">Stage {level}</span>
            <span className="text-white text-7xl font-black italic tracking-tighter leading-none">{score}</span>
        </div>
      )}

      {/* MODALS */}
      <div className="absolute inset-0 z-[500] pointer-events-none">
        {gameState === 'HOME' && activeTab === 'play' && (
            <div className="w-full h-full bg-black/20 flex flex-col items-center justify-between pt-24 pb-48 pointer-events-auto">
                <h1 className="text-[15vw] font-black italic text-white text-center leading-none">
                    HELIX<br /><span className="text-primary italic text-[18vw]">EMPIRE</span>
                </h1>
                <div className="flex flex-col items-center gap-6 w-full max-w-xs px-6">
                    <button onClick={startGame} className="w-full h-28 bg-primary text-white rounded-[40px] font-black uppercase text-4xl italic shadow-glow">PLAY</button>
                    {!user && <button onClick={() => setGameState('AUTH')} className="text-white/40 text-[10px] font-black uppercase py-4">Join the Empire / Sign In</button>}
                </div>
            </div>
        )}

        {gameState === 'WIN' && (
            <div className="w-full h-full bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 pointer-events-auto z-[600] text-center">
                <Trophy className="h-24 w-24 text-yellow-400 mb-6 mx-auto" />
                <h2 className="text-5xl font-black italic uppercase mb-8">STAGE CLEAR!</h2>
                <button onClick={nextLevel} className="w-full max-w-xs bg-white text-black py-6 rounded-3xl font-black uppercase text-xl mx-auto">Next Stage</button>
            </div>
        )}

        {gameState === 'REVIVE' && (
            <div className="w-full h-full bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-12 pointer-events-auto z-[600] text-center">
                <h2 className="text-6xl font-black italic uppercase mb-12">GAME OVER</h2>
                <button onClick={() => { setScore(0); setLevel(1); setGameState('HOME'); }} className="w-full max-w-xs border-2 border-white/20 text-white/40 py-6 rounded-3xl font-black uppercase mx-auto">Restart Game</button>
            </div>
        )}
      </div>

      <GameUI
        viralCoins={profile?.coin_balance || 0}
        jumpPoints={localJP}
        currentSkin={skin}
        onSkinSelect={(s) => {setSkin(s); engineRef.current?.setSkin(s)}}
        isHidden={gameState === 'PLAYING' && activeTab === 'play'}
        onTabChange={(t) => { setActiveTab(t); if(t !== 'play') setGameState('HOME'); }}
        requestPayout={requestPayout}
      />
    </div>
  )
}
