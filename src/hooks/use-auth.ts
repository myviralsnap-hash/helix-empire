import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { type User } from '@supabase/supabase-js';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data) setProfile(data);
    setLoading(false);
  }

  async function signIn(email: string, pass: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
  }

  async function signUp(email: string, pass: string) {
    const { error } = await supabase.auth.signUp({ email, password: pass });
    if (error) throw error;
  }

  async function addViralCoins(amount: number) {
    if (!user || !profile) return;
    const newBalance = (profile.coin_balance || 0) + amount;
    const { error } = await supabase.from('profiles').update({ coin_balance: newBalance }).eq('id', user.id);
    if (!error) setProfile({ ...profile, coin_balance: newBalance });
  }

  async function addJumpPoints(amount: number) {
    if (!user || !profile) return;
    // We use jump_balance as the persistent field
    const newBalance = (profile.jump_balance || 0) + amount;
    const { error } = await supabase.from('profiles').update({ jump_balance: newBalance }).eq('id', user.id);
    if (!error) setProfile({ ...profile, jump_balance: newBalance });
    else console.error("Error updating JP:", error);
  }

  async function requestPayout(rewardName: string, jpCost: number) {
    if (!user || !profile) return;
    if ((profile.jump_balance || 0) < jpCost) return toast.error("Insufficient JP");

    const { error: insertError } = await supabase.from('payout_requests').insert({
        user_id: user.id,
        email: user.email,
        reward_type: rewardName,
        jp_amount: jpCost,
        status: 'pending'
    });

    if (insertError) {
        toast.error("Failed to submit request. Try again later.");
        return;
    }

    const newBalance = profile.jump_balance - jpCost;
    await supabase.from('profiles').update({ jump_balance: newBalance }).eq('id', user.id);
    setProfile({ ...profile, jump_balance: newBalance });

    toast.success("Request Submitted! Check your email soon.", { duration: 5000 });
  }

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
  }

  return { user, profile, loading, signIn, signUp, addViralCoins, addJumpPoints, requestPayout, signOut };
}
