"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowLeft, Star, RefreshCcw, Info, Loader2, Award, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameStore, type WordItem, type Difficulty } from "@/lib/game-store";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export default function GamePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const difficulty = (searchParams.get("difficulty") || "beginner") as Difficulty;
  const { allWords, addStars, addCorrectLetter, addWordMastered, isLoaded } = useGameStore();

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [gameState, setGameState] = useState<"intro" | "playing" | "success" | "finished">("intro");
  const [wordsToPlay, setWordsToPlay] = useState<WordItem[]>([]);
  const [isWrong, setIsWrong] = useState(false);

  useEffect(() => {
    if (!isLoaded || allWords.length === 0 || wordsToPlay.length > 0) return;
    
    let filtered = allWords;
    if (difficulty === "beginner") filtered = allWords.filter(w => w.word.length <= 4);
    else if (difficulty === "intermediate") filtered = allWords.filter(w => w.word.length >= 5 && w.word.length <= 7);
    else if (difficulty === "advanced") filtered = allWords.filter(w => w.word.length >= 8);

    if (filtered.length === 0 && allWords.length > 0) filtered = [allWords[0]];

    const shuffled = [...filtered].sort(() => Math.random() - 0.5).slice(0, 5);
    setWordsToPlay(shuffled);
    setCurrentWordIndex(0);
  }, [allWords, difficulty, isLoaded, wordsToPlay.length]);

  const currentWord = useMemo(() => wordsToPlay[currentWordIndex], [wordsToPlay, currentWordIndex]);

  const handleStart = () => {
    if (!currentWord) return;
    setUserInput(new Array(currentWord.word.length).fill(""));
    setGameState("playing");
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState !== "playing") return;

    const char = e.key.toUpperCase();
    if (/^[A-Z]$/.test(char)) {
      setUserInput(prev => {
        const nextEmpty = prev.indexOf("");
        if (nextEmpty !== -1) {
          const next = [...prev];
          next[nextEmpty] = char;
          return next;
        }
        return prev;
      });
    } else if (e.key === "Backspace") {
      setUserInput(prev => {
        const lastFilled = prev.indexOf("");
        const indexToDelete = lastFilled === -1 ? prev.length - 1 : lastFilled - 1;
        if (indexToDelete >= 0) {
          const next = [...prev];
          next[indexToDelete] = "";
          return next;
        }
        return prev;
      });
    }
  }, [gameState]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (gameState === "playing" && currentWord && !userInput.includes("")) {
      const typed = userInput.join("");
      if (typed === currentWord.word.toUpperCase()) {
        setGameState("success");
        addStars(1);
        addWordMastered();
        addCorrectLetter();
      } else {
        setIsWrong(true);
        setTimeout(() => {
          setIsWrong(false);
          setUserInput(new Array(currentWord.word.length).fill(""));
        }, 1000);
      }
    }
  }, [userInput, currentWord, gameState, addStars, addWordMastered, addCorrectLetter]);

  const nextWord = () => {
    if (currentWordIndex + 1 < wordsToPlay.length) {
      const nextIdx = currentWordIndex + 1;
      setCurrentWordIndex(nextIdx);
      setUserInput(new Array(wordsToPlay[nextIdx].word.length).fill(""));
      setGameState("intro");
    } else {
      setGameState("finished");
    }
  };

  if (!isLoaded || (wordsToPlay.length === 0 && gameState !== "finished")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto" />
          <p className="font-black text-2xl text-accent-foreground">Preparing Adventure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-pattern flex flex-col p-6 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-12">
        <Button variant="ghost" onClick={() => router.push("/")} className="gap-2 font-black text-accent-foreground btn-snap bg-white/50 hover:bg-white shadow-sm px-6">
          <ArrowLeft className="h-5 w-5" /> Exit
        </Button>
        <div className="flex-1 max-w-[300px] mx-8">
          <div className="flex justify-between text-[10px] font-black uppercase text-muted-foreground mb-3 tracking-widest">
            <span>Progress</span>
            <span>{currentWordIndex + 1} / {wordsToPlay.length}</span>
          </div>
          <Progress value={((currentWordIndex + 1) / wordsToPlay.length) * 100} className="h-4 bg-white border-2 border-primary/20" />
        </div>
        <div className="bg-primary text-primary-foreground font-black px-6 py-3 rounded-full text-lg shadow-[0_4px_0_0_#facc15] border-2 border-white">
          {difficulty.toUpperCase()}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        {gameState === "intro" && currentWord && (
          <div className="text-center space-y-12 animate-in fade-in zoom-in duration-500">
            <div className="relative w-80 h-80 mx-auto">
               <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-3xl animate-pulse" />
               <div className="relative z-10 w-full h-full bg-white rounded-[3rem] shadow-2xl border-8 border-primary flex flex-col items-center justify-center p-8">
                  <span className="text-8xl mb-6 block animate-bounce-subtle">📦</span>
                  <p className="text-4xl font-black text-primary tracking-tight">{currentWord.word}</p>
               </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-5xl font-black text-accent-foreground tracking-tighter">Ready to snap?</h2>
              <p className="text-xl font-bold text-muted-foreground max-w-sm mx-auto">Look at the word carefully. We will hide the letters in a second!</p>
              <Button onClick={handleStart} className="px-16 py-10 text-3xl font-black rounded-[2.5rem] bg-primary hover:bg-primary/90 shadow-[0_8px_0_0_#facc15] btn-snap h-auto">
                Go!
              </Button>
            </div>
          </div>
        )}

        {gameState === "playing" && currentWord && (
          <div className={cn("text-center space-y-12 w-full", isWrong && "animate-wiggle")}>
            <div className="bg-white p-10 md:p-16 rounded-[4rem] shadow-2xl border-4 border-primary/20 max-w-3xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Info size={120} />
              </div>
              
              <div className="flex items-start gap-6 text-left mb-12 relative z-10">
                <div className="bg-accent/20 p-4 rounded-3xl">
                  <Info className="text-accent h-8 w-8" />
                </div>
                <div>
                  <h4 className="font-black text-2xl text-accent-foreground uppercase tracking-tight">Hint</h4>
                  <p className="text-xl font-bold text-muted-foreground italic">"{currentWord.definition}"</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-6 relative z-10">
                {userInput.map((char, i) => (
                  <div key={i} className={cn("scrabble-tile", char === "" && "empty", isWrong && "border-destructive text-destructive shadow-none")}>
                    {char}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary/10 px-8 py-4 rounded-full text-primary font-black uppercase tracking-widest text-sm inline-block">
              Type on your keyboard to snap the letters!
            </div>
          </div>
        )}

        {gameState === "success" && currentWord && (
          <div className="text-center space-y-10 animate-in duration-500">
            <div className="text-[12rem] animate-bounce-subtle">🌟</div>
            <div className="space-y-4">
              <h2 className="text-7xl font-black text-primary tracking-tighter">AMAZING!</h2>
              <p className="text-3xl font-bold text-muted-foreground">You snapped <span className="text-accent underline font-black">{currentWord.word}</span>!</p>
            </div>
            <div className="flex justify-center gap-6">
              <div className="bg-white p-6 rounded-[2rem] shadow-xl border-4 border-primary/20 flex items-center gap-4">
                <Star className="h-10 w-10 text-primary fill-primary" />
                <span className="text-4xl font-black text-primary">+1 Star</span>
              </div>
            </div>
            <Button onClick={nextWord} className="px-16 py-10 text-3xl font-black rounded-[2.5rem] bg-accent hover:bg-accent/90 shadow-[0_8px_0_0_#e11d48] btn-snap h-auto mt-8">
              {currentWordIndex + 1 === wordsToPlay.length ? "Finish!" : "Next Word"}
            </Button>
          </div>
        )}

        {gameState === "finished" && (
          <div className="text-center space-y-12 animate-in fade-in duration-700">
             <div className="text-[10rem] animate-float">🏆</div>
             <div className="space-y-4">
                <h2 className="text-7xl font-black text-accent-foreground tracking-tighter">MASTER!</h2>
                <p className="text-3xl font-bold text-muted-foreground">You conquered the {difficulty} level!</p>
             </div>
             
             <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto w-full px-6">
                <div className="bg-white p-10 rounded-[3rem] border-4 border-primary/20 shadow-xl">
                   <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Snaps</p>
                   <p className="text-6xl font-black text-primary">{wordsToPlay.length}</p>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border-4 border-accent/20 shadow-xl">
                   <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Stars</p>
                   <p className="text-6xl font-black text-accent">{wordsToPlay.length}</p>
                </div>
             </div>

             <div className="flex flex-col gap-6 mt-12">
                <Button onClick={() => router.push("/")} className="px-16 py-10 text-3xl font-black rounded-[2.5rem] bg-primary hover:bg-primary/90 shadow-[0_8px_0_0_#facc15] btn-snap h-auto">
                  Lobby
                </Button>
                <Button variant="ghost" onClick={() => window.location.reload()} className="gap-2 text-muted-foreground font-black hover:bg-white rounded-full">
                  <RefreshCcw className="h-5 w-5" /> Play Again
                </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}