import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        toast.success("Reset link sent!");
      } else {
        toast.error(data.message || "Failed to send reset link");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-b from-background to-[#0d121f]">
        <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-xl text-center p-6">
          <CardContent className="pt-8 space-y-6">
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-full bg-gold/20 flex items-center justify-center animate-pulse">
                <CheckCircle2 className="h-10 w-10 text-gold" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white font-display">Check your email</h2>
              <p className="text-white/60">
                We've sent a password reset link to <span className="text-white font-semibold">{email}</span>.
                The link will expire in 30 minutes.
              </p>
            </div>
            <div className="pt-4">
              <Button 
                variant="outline" 
                className="w-full border-white/10 text-white hover:bg-white/5"
                onClick={() => setIsSuccess(false)}
              >
                Didn't receive the email? Try again
              </Button>
            </div>
            <Link to="/login" className="inline-flex items-center gap-2 text-gold hover:underline text-sm font-semibold">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gradient-to-b from-background to-[#0d121f]">
      <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
        
        <CardHeader className="space-y-3 pt-10">
          <CardTitle className="text-3xl font-display font-bold text-white text-center">Forgot Password?</CardTitle>
          <CardDescription className="text-white/50 text-center">
            No worries! Enter your email and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70 ml-1 text-xs uppercase tracking-wider font-semibold">Email Address</Label>
              <div className="relative group">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="bg-white/5 border-white/10 text-white pl-10 focus:border-gold/50 transition-all h-12 ring-offset-background placeholder:text-white/20"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-gold transition-colors" />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="pb-10 pt-2 flex flex-col gap-6">
            <Button 
              type="submit" 
              className="w-full bg-gold hover:bg-gold/90 text-black font-bold h-12 relative overflow-hidden group shadow-[0_0_20px_rgba(234,179,8,0.2)]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Sending...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4" /> Send Reset Link
                </div>
              )}
            </Button>
            
            <Link to="/login" className="text-white/40 hover:text-white transition-colors flex items-center gap-2 text-sm justify-center group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
