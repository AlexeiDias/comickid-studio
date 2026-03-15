'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

type AuthMode = 'landing' | 'login' | 'signup' | 'reset';

export default function HomePage() {
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const router = useRouter();

  const [mode, setMode]             = useState<AuthMode>('landing');
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [creatorName, setCreatorName] = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [error, setError]           = useState('');
  const [info, setInfo]             = useState('');
  const [busy, setBusy]             = useState(false);

  useEffect(() => {
    if (!loading && user) router.push('/library');
  }, [user, loading, router]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="font-display text-4xl text-amber-800 animate-pulse">Loading...</div>
    </div>
  );

  function clearForm() { setEmail(''); setPassword(''); setConfirmPw(''); setCreatorName(''); setError(''); setInfo(''); }

  function friendlyError(code: string): string {
    const map: Record<string, string> = {
      'auth/user-not-found':       'No account found with that email.',
      'auth/wrong-password':       'Wrong password. Try again!',
      'auth/email-already-in-use': 'That email is already taken.',
      'auth/weak-password':        'Password must be at least 6 characters.',
      'auth/invalid-email':        'Please enter a valid email address.',
      'auth/invalid-credential':   'Wrong email or password. Try again!',
      'auth/too-many-requests':    'Too many attempts. Try again later.',
      'auth/network-request-failed': 'Network error. Check your connection.',
    };
    return map[code] || 'Something went wrong. Please try again.';
  }

  async function handleGoogle() {
    setBusy(true); setError('');
    try { await signInWithGoogle(); }
    catch (e: any) { setError(friendlyError(e.code)); }
    setBusy(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setBusy(true); setError('');
    try { await signInWithEmail(email, password); }
    catch (e: any) { setError(friendlyError(e.code)); }
    setBusy(false);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!creatorName.trim()) { setError('Please enter your creator name!'); return; }
    if (!email)              { setError('Please enter your email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPw) { setError("Passwords don't match!"); return; }
    setBusy(true); setError('');
    try { await signUpWithEmail(email, password, creatorName.trim()); }
    catch (e: any) { setError(friendlyError(e.code)); }
    setBusy(false);
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError('Enter your email address.'); return; }
    setBusy(true); setError('');
    try {
      await resetPassword(email);
      setInfo('Password reset email sent! Check your inbox.');
    } catch (e: any) { setError(friendlyError(e.code)); }
    setBusy(false);
  }

  // ── Landing ───────────────────────────────────────────────────────
  if (mode === 'landing') return (
    <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div className="mb-2 text-7xl animate-bounce">🎨</div>
      <h1 className="font-display text-6xl text-amber-900 mb-1" style={{ letterSpacing: '2px' }}>ComicKid</h1>
      <p className="font-display text-3xl text-orange-500 mb-6">STUDIO</p>

      <div className="flex gap-2 mb-8">
        {['💥','🦸','🗺️'].map((emoji, i) => (
          <div key={i} className="comic-panel w-20 h-24 bg-white flex items-center justify-center text-3xl wiggle">
            {emoji}
          </div>
        ))}
      </div>

      <p className="text-amber-800 font-bold text-lg mb-8 max-w-xs">
        Create amazing comic books, build cool characters, and share your stories! 🌟
      </p>

      <div className="w-full max-w-xs flex flex-col gap-3">
        {/* Google */}
        <button onClick={handleGoogle} disabled={busy}
          className="btn-ink bg-white text-gray-800 py-4 rounded-xl text-lg font-extrabold flex items-center justify-center gap-3 border-2 border-gray-300 disabled:opacity-50">
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-0.5 bg-amber-200"/>
          <span className="text-amber-700 font-bold text-sm">or</span>
          <div className="flex-1 h-0.5 bg-amber-200"/>
        </div>

        {/* Email options */}
        <button onClick={() => { clearForm(); setMode('login'); }}
          className="btn-ink bg-amber-400 text-amber-900 py-4 rounded-xl text-lg font-extrabold">
          Sign in with Email
        </button>
        <button onClick={() => { clearForm(); setMode('signup'); }}
          className="btn-ink bg-orange-500 text-white py-4 rounded-xl text-lg font-extrabold">
          Create Account
        </button>
      </div>

      <p className="text-amber-600 text-xs font-bold mt-6">Ask a parent to help you sign in!</p>

      <div className="absolute top-8 right-8 font-display text-3xl text-orange-400 rotate-12 opacity-60">POW!</div>
      <div className="absolute top-24 left-6 font-display text-2xl text-yellow-500 -rotate-6 opacity-60">ZAP!</div>
      <div className="absolute bottom-32 right-6 font-display text-2xl text-red-400 rotate-6 opacity-60">BOOM!</div>
    </main>
  );

  // ── Shared back button ─────────────────────────────────────────────
  const BackBtn = () => (
    <button onClick={() => { clearForm(); setMode('landing'); }}
      className="text-amber-700 font-extrabold text-sm mb-6 flex items-center gap-1">
      ← Back
    </button>
  );

  // ── Login ──────────────────────────────────────────────────────────
  if (mode === 'login') return (
    <main className="flex flex-col min-h-screen px-6 pt-16 pb-8 max-w-sm mx-auto">
      <BackBtn/>
      <div className="text-5xl mb-2 text-center">🔑</div>
      <h1 className="font-display text-4xl text-amber-900 text-center mb-1">Welcome back!</h1>
      <p className="text-amber-700 font-bold text-center mb-8">Sign in to your account</p>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="your@email.com"/>
        <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Your password"/>

        {error && <ErrorBox msg={error}/>}

        <button type="submit" disabled={busy}
          className="btn-ink bg-amber-400 text-amber-900 py-4 rounded-xl text-xl font-extrabold disabled:opacity-50 mt-2">
          {busy ? '⏳ Signing in...' : 'Sign In 🚀'}
        </button>
      </form>

      <div className="flex flex-col items-center gap-3 mt-6">
        <button onClick={() => { clearForm(); setMode('reset'); }}
          className="text-amber-600 font-bold text-sm underline">
          Forgot password?
        </button>
        <p className="text-amber-700 font-bold text-sm">
          No account?{' '}
          <button onClick={() => { clearForm(); setMode('signup'); }} className="text-orange-600 underline font-extrabold">
            Create one
          </button>
        </p>
      </div>

      <Divider/>
      <GoogleBtn onClick={handleGoogle} busy={busy}/>
    </main>
  );

  // ── Sign Up ────────────────────────────────────────────────────────
  if (mode === 'signup') return (
    <main className="flex flex-col min-h-screen px-6 pt-16 pb-8 max-w-sm mx-auto">
      <BackBtn/>
      <div className="text-5xl mb-2 text-center">✨</div>
      <h1 className="font-display text-4xl text-amber-900 text-center mb-1">Join ComicKid!</h1>
      <p className="text-amber-700 font-bold text-center mb-8">Create your free account</p>

      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        <Field label="Creator Name 🎨" type="text" value={creatorName} onChange={setCreatorName}
          placeholder="e.g. SuperZen, ArtKid..."/>
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="your@email.com"/>
        <Field label="Password" type="password" value={password} onChange={setPassword}
          placeholder="At least 6 characters"/>
        <Field label="Confirm Password" type="password" value={confirmPw} onChange={setConfirmPw}
          placeholder="Same password again"/>

        {error && <ErrorBox msg={error}/>}

        <button type="submit" disabled={busy}
          className="btn-ink bg-orange-500 text-white py-4 rounded-xl text-xl font-extrabold disabled:opacity-50 mt-2">
          {busy ? '⏳ Creating account...' : "Let's Go! 🚀"}
        </button>
      </form>

      <p className="text-amber-700 font-bold text-sm text-center mt-6">
        Already have an account?{' '}
        <button onClick={() => { clearForm(); setMode('login'); }} className="text-amber-900 underline font-extrabold">
          Sign in
        </button>
      </p>

      <Divider/>
      <GoogleBtn onClick={handleGoogle} busy={busy}/>
    </main>
  );

  // ── Reset password ─────────────────────────────────────────────────
  if (mode === 'reset') return (
    <main className="flex flex-col min-h-screen px-6 pt-16 pb-8 max-w-sm mx-auto">
      <BackBtn/>
      <div className="text-5xl mb-2 text-center">📧</div>
      <h1 className="font-display text-4xl text-amber-900 text-center mb-1">Reset Password</h1>
      <p className="text-amber-700 font-bold text-center mb-8">
        Enter your email and we'll send you a reset link
      </p>

      <form onSubmit={handleReset} className="flex flex-col gap-4">
        <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="your@email.com"/>

        {error && <ErrorBox msg={error}/>}
        {info  && (
          <div className="bg-green-50 border-2 border-green-400 rounded-xl px-4 py-3">
            <p className="text-green-700 font-bold text-sm">{info}</p>
          </div>
        )}

        <button type="submit" disabled={busy || !!info}
          className="btn-ink bg-amber-400 text-amber-900 py-4 rounded-xl text-xl font-extrabold disabled:opacity-50 mt-2">
          {busy ? '⏳ Sending...' : 'Send Reset Email 📬'}
        </button>
      </form>

      <button onClick={() => { clearForm(); setMode('login'); }}
        className="text-amber-600 font-bold text-sm text-center mt-6 underline">
        Back to sign in
      </button>
    </main>
  );

  return null;
}

// ── Shared sub-components ──────────────────────────────────────────────────
function Field({ label, type, value, onChange, placeholder }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block font-extrabold text-amber-800 text-sm mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} autoComplete={type === 'password' ? 'current-password' : undefined}
        className="w-full rounded-xl px-4 py-3 font-bold text-base outline-none bg-white"
        style={{ border: '3px solid #78350f' }}/>
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="bg-red-50 border-2 border-red-400 rounded-xl px-4 py-3">
      <p className="text-red-700 font-bold text-sm">⚠️ {msg}</p>
    </div>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-0.5 bg-amber-200"/>
      <span className="text-amber-700 font-bold text-sm">or</span>
      <div className="flex-1 h-0.5 bg-amber-200"/>
    </div>
  );
}

function GoogleBtn({ onClick, busy }: { onClick: () => void; busy: boolean }) {
  return (
    <button onClick={onClick} disabled={busy}
      className="btn-ink bg-white text-gray-800 py-4 rounded-xl text-base font-extrabold flex items-center justify-center gap-3 border-2 border-gray-300 disabled:opacity-50 w-full">
      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
      Continue with Google
    </button>
  );
}
