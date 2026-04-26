
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DoorOpen, ArrowLeft, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGameStore } from "@/lib/game-store";
import { useToast } from "@/hooks/use-toast";

export default function JoinClassPage() {
  const router = useRouter();
  const { joinClass } = useGameStore();
  const { toast } = useToast();
  
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleJoin = async () => {
    if (code.length < 4) return;
    setLoading(true);
    
    try {
      const result = await joinClass(code);
      if (result) {
        setSuccess(true);
        setTimeout(() => router.push("/"), 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Code not found",
          description: "Please double check the class code with your teacher."
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="bg-animate" />
      
      <div className="w-full max-w-md space-y-8 z-10">
        <header className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.push("/")} className="rounded-xl border-4 border-white bg-white/50 backdrop-blur-xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-black flex items-center gap-2">
            <DoorOpen className="text-accent" /> Join a Class
          </h1>
        </header>

        <Card className="rounded-[3rem] border-8 border-white shadow-3xl bg-white/80 backdrop-blur-2xl">
          <CardHeader className="text-center pb-2">
            <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-accent/20">
               <Sparkles className="h-10 w-10 text-accent" />
            </div>
            <CardTitle className="text-3xl font-black">Enter Class Code</CardTitle>
            <CardDescription className="text-lg font-medium">Ask your teacher for the 6-character code!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="relative">
              <Input 
                className="text-center text-4xl font-black h-24 rounded-3xl border-4 border-accent uppercase tracking-[0.5em] focus:ring-accent"
                maxLength={6}
                placeholder="XXXXXX"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={loading || success}
              />
            </div>

            {!success ? (
              <Button 
                onClick={handleJoin} 
                disabled={loading || code.length < 4}
                className="w-full btn-bouncy h-20 text-2xl bg-accent text-white shadow-xl"
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : "JOIN NOW!"}
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-3 animate-in zoom-in text-accent">
                 <CheckCircle2 className="h-16 w-16" />
                 <p className="text-2xl font-black">WELCOME TO CLASS!</p>
              </div>
            )}
          </CardContent>
        </Card>

        <footer className="text-center">
           <p className="text-muted-foreground font-bold">You'll see your teacher's word lists as soon as you join.</p>
        </footer>
      </div>
    </div>
  );
}
