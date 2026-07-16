import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { HelixEngine } from '@/game/HelixEngine'
import { GameUI } from '@/components/GameUI'
import { useAuth } from '@/hooks/use-auth'
import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob'
import { Browser } from '@capacitor/browser'

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

  // EFFECT: Handle Engine Lifecycle
  useEffect(() => {
    if (!containerRef.current || activeTab !== 'play') return

    console.log("Initializing Engine for Level", level);

    const engine = new HelixEngine(containerRef.current, {
      score: 0,
      level: level,
      onWin: () => setGameState('WIN'),
      onLoss: () => setGameState('REVIVE'),
      onScoreUpdate: (pts) => {
          setScore(prev => prev + pts)
          setLocalJP(prev => prev + pts)
      }
    })
    engineRef.current = engine

    return () => {
        console.log("Cleaning up Engine...");
        engine.dispose();
        engineRef.current = null;
    }
  }, [level, activeTab])

  const startGame = () => {
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(`music/tier${((level-1) % 15) + 1}.MP3`);
    audio.loop = true;
    audio.play().catch(e => console.log("Audio play blocked", e));
    audioRef.current = audio;

    setScore(0);
    setGameState('PLAYING');
    engineRef.current?.setPaused(false);
  }

  const handleRevive = async () => {
    try {
        await AdMob.prepareRewardVideoAd({ adId: 'ca-app-pub-3940256099942544/5224354917' });
        await AdMob.showRewardVideoAd();
        const listener = AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
            setGameState('PLAYING');
            engineRef.current?.setPaused(false);
            listener.remove();
        });
    } catch (e) {
        setGameState('HOME');
    }
  }

  const openLink = async (url: string) => {
      await Browser.open({ url });
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/* 3D Container - Behind everything */}
      <div
        ref={containerRef}
        className={`absolute inset-0 z-0 transition-opacity duration-500 ${activeTab === 'play' ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Gameplay HUD */}
      {gameState === 'PLAYING' && activeTab === 'play' && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
            <div className="text-[10px] opacity-50 uppercase font-black tracking-widest">Stage {level}</div>
            <div className="text-7xl font-black italic">{score}</div>
        </div>
      )}

      {/* GAME OVERLAYS - Only visible on Play tab */}
      {activeTab === 'play' && gameState !== 'PLAYING' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-[50] bg-black/40 backdrop-blur-[2px] px-6 text-center">

            {gameState === 'HOME' && (
                <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
                    <h1 className="text-6xl font-extrabold italic mb-12 leading-tight tracking-tighter">HELIX<br/>EMPIRE</h1>
                    <button
                        onClick={startGame}
                        className="w-64 h-24 bg-[#FF4500] rounded-full text-4xl font-black italic shadow-[0_0_50px_rgba(255,69,0,0.4)] active:scale-95 transition-all"
                    >
                        PLAY
                    </button>
                    <div className="mt-12 flex gap-8 text-[12px] font-black uppercase tracking-widest opacity-40">
                        <span onClick={() => openLink('https://viralsnap.online/privacy')}>Privacy</span>
                        <span onClick={() => openLink('https://viralsnap.online/terms')}>Terms</span>
                    </div>
                </div>
            )}

            {gameState === 'WIN' && (
                <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center">
                    <h2 className="text-6xl font-black mb-12 italic text-yellow-400 drop-shadow-2xl">SUCCESS</h2>
                    <button
                        onClick={() => { setGameState('HOME'); setLevel(l => l + 1); }}
                        className="w-72 py-8 bg-white text-black rounded-[40px] font-black text-2xl shadow-2xl active:scale-95 transition-all"
                    >
                        NEXT STAGE
                    </button>
                </div>
            )}

            {gameState === 'REVIVE' && (
                <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center w-full">
                    <h2 className="text-6xl font-black mb-8 italic text-red-500">FAILED</h2>
                    <button
                        onClick={handleRevive}
                        className="w-full max-w-xs py-6 bg-green-500 rounded-[30px] font-black text-xl mb-4 shadow-lg active:scale-95 transition-all"
                    >
                        WATCH AD TO REVIVE
                    </button>
                    <button
                        onClick={() => { setGameState('HOME'); setLevel(1); }}
                        className="w-full max-w-xs py-6 border-4 border-white/10 bg-white/5 rounded-[30px] font-black text-xl active:scale-95 transition-all"
                    >
                        START OVER
                    </button>
                </div>
            )}
        </div>
      )}

      {/* Main UI System - Always available unless playing */}
      <GameUI
        viralCoins={profile?.coin_balance || 0}
        jumpPoints={localJP}
        onSkinSelect={(s) => engineRef.current?.setSkin(s)}
        isHidden={gameState === 'PLAYING'}
        onTabChange={(t) => {
            setActiveTab(t);
            if(t !== 'play') setGameState('HOME');
        }}
        requestPayout={requestPayout}
      />
    </div>
  )
}
