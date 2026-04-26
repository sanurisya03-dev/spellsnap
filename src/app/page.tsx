"use client";

import Link from "next/link";
import { Sparkles, Play, Award, Settings, BookOpen, Star, LogIn, LogOut, User, Loader2, Rocket, Camera, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGameStore } from "@/lib/game-store";
import { useUser, useAuth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function LobbyPage() {
  const { stats, isLoaded } = useGameStore();
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();

  const handleSignIn = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  if (!isLoaded || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background bg-pattern flex flex-col md:flex-row overflow-hidden">
      {/* Hero Section (Left) */}
      <aside className="w-full md:w-[40%] bg-primary p-8 md:p-16 flex flex-col justify-between items-center text-center md:text-left relative">
        <div className="space-y-4 z-10 w-full">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
            SPELL<br />SNAP!
          </h1>
          <p className="text-white/80 font-bold text-xl md:text-2xl">
            A Digital Spelling Innovation
          </p>
        </div>

        <div className="relative w-full aspect-square max-w-[400px] flex items-center justify-center py-12">
          <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10 grid grid-cols-2 gap-8 w-full h-full items-center justify-items-center">
             <Rocket className="h-20 w-20 text-white animate-float" style={{ animationDelay: '0s' }} />
             <Camera className="h-20 w-20 text-white animate-float" style={{ animationDelay: '0.5s' }} />
             <Lightbulb className="h-20 w-20 text-white animate-float" style={{ animationDelay: '1s' }} />
             <Sparkles className="h-20 w-20 text-white animate-float" style={{ animationDelay: '1.5s' }} />
          </div>
        </div>

        {!user && (
          <div className="w-full max-w-sm bg-white/20 p-8 rounded-[2rem] backdrop-blur-md border border-white/30 z-10">
            <h3 className="text-white font-black text-2xl mb-4">Sign in</h3>
            <Button onClick={handleSignIn} className="w-full h-14 bg-white hover:bg-white/90 text-primary btn-snap text-lg">
              <LogIn className="mr-2 h-5 w-5" /> Start Learning
            </Button>
          </div>
        )}

        {user && (
          <div className="w-full max-w-sm flex items-center gap-4 bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/30 z-10">
             <Avatar className="h-16 w-16 border-4 border-white">
                <AvatarImage src={user.photoURL || ""} />
                <AvatarFallback className="bg-white/20 text-white"><User /></AvatarFallback>
             </Avatar>
             <div className="flex-1 overflow-hidden">
                <p className="text-white font-black truncate">{user.displayName || 'Hello!'}</p>
                <p className="text-white/60 text-sm font-bold truncate">{user.email}</p>
             </div>
             <Button variant="ghost" size="icon" onClick={handleSignOut} className="text-white hover:bg-white/20">
                <LogOut className="h-6 w-6" />
             </Button>
          </div>
        )}
      </aside>

      {/* Categories/Levels Section (Right) */}
      <main className="flex-1 p-8 md:p-16 space-y-12 bg-secondary/30 rounded-t-[3rem] md:rounded-t-none md:rounded-l-[4rem] -mt-12 md:mt-0 z-20">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-accent-foreground">Hello!</h2>
            <p className="text-muted-foreground font-bold text-lg">Find a course you want to learn.</p>
          </div>

          <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-[2rem] shadow-sm">
             <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Star className="h-5 w-5 text-primary fill-primary" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-muted-foreground">My Stars</p>
                   <p className="text-xl font-black">{stats.stars}</p>
                </div>
             </div>
             <div className="h-10 w-px bg-border" />
             <div className="flex items-center gap-3">
                <div className="bg-accent/20 p-2 rounded-full">
                  <Award className="h-5 w-5 text-accent" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase text-muted-foreground">Mastered</p>
                   <p className="text-xl font-black">{stats.wordsMastered}</p>
                </div>
             </div>
          </div>
        </header>

        <section className="space-y-8">
          <div className="flex justify-between items-end">
            <h3 className="text-3xl font-black">Categories</h3>
            <Link href="/stats" className="text-accent font-black hover:underline">See Progress</Link>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Link href="/game?difficulty=beginner">
              <Card className="card-snap overflow-hidden group">
                <CardContent className="p-0 flex items-center h-48 bg-primary/10">
                  <div className="w-1/3 h-full flex items-center justify-center">
                    <div className="bg-white p-6 rounded-3xl shadow-sm group-hover:scale-110 transition-transform">
                      <Rocket className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 p-6 space-y-1">
                    <h4 className="text-3xl font-black text-primary">Beginner</h4>
                    <p className="text-muted-foreground font-bold">Short words with hints</p>
                    <p className="text-sm font-black uppercase tracking-widest text-primary/60 mt-4">120 Sessions</p>
                  </div>
                  <div className="pr-12">
                    <div className="bg-primary h-12 w-12 rounded-full flex items-center justify-center text-white">
                      <Play className="fill-current" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/game?difficulty=intermediate">
              <Card className="card-snap overflow-hidden group">
                <CardContent className="p-0 flex items-center h-48 bg-accent/10">
                  <div className="w-1/3 h-full flex items-center justify-center">
                    <div className="bg-white p-6 rounded-3xl shadow-sm group-hover:scale-110 transition-transform">
                      <Camera className="h-12 w-12 text-accent" />
                    </div>
                  </div>
                  <div className="flex-1 p-6 space-y-1">
                    <h4 className="text-3xl font-black text-accent">Intermediate</h4>
                    <p className="text-muted-foreground font-bold">Medium words (5-7 letters)</p>
                    <p className="text-sm font-black uppercase tracking-widest text-accent/60 mt-4">85 Sessions</p>
                  </div>
                  <div className="pr-12">
                    <div className="bg-accent h-12 w-12 rounded-full flex items-center justify-center text-white">
                      <Play className="fill-current" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/game?difficulty=advanced">
              <Card className="card-snap overflow-hidden group">
                <CardContent className="p-0 flex items-center h-48 bg-foreground/5">
                  <div className="w-1/3 h-full flex items-center justify-center">
                    <div className="bg-white p-6 rounded-3xl shadow-sm group-hover:scale-110 transition-transform">
                      <Lightbulb className="h-12 w-12 text-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 p-6 space-y-1">
                    <h4 className="text-3xl font-black text-foreground">Advanced</h4>
                    <p className="text-muted-foreground font-bold">Complex words (8+ letters)</p>
                    <p className="text-sm font-black uppercase tracking-widest text-foreground/40 mt-4">40 Sessions</p>
                  </div>
                  <div className="pr-12">
                    <div className="bg-foreground h-12 w-12 rounded-full flex items-center justify-center text-white">
                      <Play className="fill-current" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        <footer className="pt-12 grid grid-cols-2 md:grid-cols-3 gap-6">
           <Link href="/admin">
              <Button variant="outline" className="w-full h-20 rounded-[2rem] border-2 border-primary/20 bg-white hover:bg-primary/5 flex flex-col gap-1">
                 <Settings className="h-6 w-6 text-primary" />
                 <span className="text-[10px] font-black uppercase">Settings</span>
              </Button>
           </Link>
           <Link href="/admin/generator">
              <Button variant="outline" className="w-full h-20 rounded-[2rem] border-2 border-accent/20 bg-white hover:bg-accent/5 flex flex-col gap-1">
                 <Sparkles className="h-6 w-6 text-accent" />
                 <span className="text-[10px] font-black uppercase">AI Generator</span>
              </Button>
           </Link>
           <div className="hidden md:flex items-center justify-center p-6 bg-white/50 rounded-[2rem] text-sm italic font-bold text-muted-foreground text-center">
              Specialized for ESL Primary Learners
           </div>
        </footer>
      </main>
    </div>
  );
}