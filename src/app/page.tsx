'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  Moon,
  Sun,
  RefreshCw,
  Keyboard,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Rss,
  TrendingUp,
  Eye,
  MessageSquare,
  Flame,
  Bookmark,
  Code2,
  Bot,
  Coins,
} from 'lucide-react';

export default function LandingPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('gov-watch-theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('gov-watch-theme', newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    window.dispatchEvent(new Event('themechange'));
  };

  const isDark = theme === 'dark';

  return (
    <div 
      className="min-h-screen transition-colors duration-200"
      style={{ 
        backgroundColor: isDark ? '#09090b' : '#fafafa',
        color: isDark ? '#fafafa' : '#09090b'
      }}
    >
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Subtle gradient mesh */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-violet-600/10' : 'bg-violet-400/20'}`} />
          <div className={`absolute top-20 -left-20 w-60 h-60 rounded-full blur-3xl ${isDark ? 'bg-cyan-600/10' : 'bg-cyan-400/15'}`} />
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-40 rounded-full blur-3xl ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-400/15'}`} />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 pt-6 pb-20">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
                <Rss className="w-4 h-4" />
              </div>
              <span className="font-semibold text-lg tracking-tight">discuss.watch</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-lg transition-colors"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link
                href="/app"
                className="px-4 py-2 bg-white text-black hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
              >
                Open App
              </Link>
            </div>
          </nav>

          {/* Hero content */}
          <div className="max-w-3xl mx-auto text-center">
            {/* Pill */}
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                color: isDark ? '#a1a1aa' : '#52525b'
              }}
            >
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                100+ forums indexed
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
              All your forums.
              <br />
              <span style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>One feed.</span>
            </h1>
            
            <p className="text-lg mb-10 leading-relaxed max-w-xl mx-auto" style={{ color: isDark ? '#a1a1aa' : '#52525b' }}>
              Stop tab-hopping between Discourse forums. Aggregate discussions from 
              crypto, AI, and open source communities into a single stream.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black hover:bg-gray-100 font-medium rounded-lg transition-colors"
              >
                Start Reading
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#verticals"
                className="inline-flex items-center gap-2 px-6 py-3 font-medium rounded-lg transition-colors"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              >
                See Coverage
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm" style={{ color: isDark ? '#71717a' : '#a1a1aa' }}>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Free forever
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                No tracking
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Open source
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Verticals */}
      <section id="verticals" className="py-20 border-t" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Three verticals. One inbox.</h2>
            <p style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>
              The communities shaping technology, all in one place.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <VerticalCard
              icon={<Coins className="w-5 h-5" />}
              title="Crypto"
              count="77 forums"
              examples={['Arbitrum', 'Uniswap', 'Aave', 'ENS', 'Optimism', 'Lido']}
              color="violet"
              isDark={isDark}
            />
            <VerticalCard
              icon={<Bot className="w-5 h-5" />}
              title="AI / ML"
              count="7 forums"
              examples={['OpenAI', 'Hugging Face', 'PyTorch', 'LangChain', 'EA Forum']}
              color="cyan"
              isDark={isDark}
            />
            <VerticalCard
              icon={<Code2 className="w-5 h-5" />}
              title="Open Source"
              count="24 forums"
              examples={['Rust', 'Swift', 'NixOS', 'Godot', 'Blender', 'Home Assistant']}
              color="emerald"
              isDark={isDark}
            />
          </div>
        </div>
      </section>

      {/* App preview */}
      <section className="py-20" style={{ backgroundColor: isDark ? '#0c0c0f' : '#f4f4f5' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">A feed that actually works</h2>
            <p style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>
              Filter by community, search across everything, track what you&apos;ve read.
            </p>
          </div>

          {/* Mock app */}
          <div 
            className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl"
            style={{
              backgroundColor: isDark ? '#18181b' : '#ffffff',
              border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`
            }}
          >
            {/* Mock app header */}
            <div 
              className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: isDark ? '#3f3f46' : '#d4d4d8' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: isDark ? '#3f3f46' : '#d4d4d8' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: isDark ? '#3f3f46' : '#d4d4d8' }} />
              </div>
              <span className="text-xs ml-2" style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>discuss.watch</span>
            </div>
            {/* Mock feed items */}
            <div className="p-4 space-y-3">
              <MockFeedItem 
                protocol="Arbitrum" 
                title="[AIP-X] Treasury Management Framework"
                category="Crypto"
                replies={24}
                views={1847}
                isHot
                isDark={isDark}
              />
              <MockFeedItem 
                protocol="PyTorch" 
                title="RFC: Native support for structured sparsity"
                category="AI"
                replies={18}
                views={2420}
                isNew
                isDark={isDark}
              />
              <MockFeedItem 
                protocol="NixOS" 
                title="RFC 0182: Simplified package versioning policy"
                category="OSS"
                replies={42}
                views={1203}
                isHot
                isDark={isDark}
              />
              <MockFeedItem 
                protocol="Uniswap" 
                title="[RFC] Fee switch governance parameters"
                category="Crypto"
                replies={56}
                views={3102}
                isDark={isDark}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 border-t" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Built for power readers</h2>
            <p style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>
              The features you need to stay on top of fast-moving communities.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard icon={<Search />} title="Unified Search" description="Search across all forums at once" isDark={isDark} />
            <FeatureCard icon={<Bell />} title="Keyword Alerts" description="Get notified when topics you care about appear" isDark={isDark} />
            <FeatureCard icon={<Bookmark />} title="Bookmarks" description="Save discussions to read later" isDark={isDark} />
            <FeatureCard icon={<Eye />} title="Read Tracking" description="Know what you've already seen" isDark={isDark} />
            <FeatureCard icon={<TrendingUp />} title="Hot & Active" description="Spot trending discussions instantly" isDark={isDark} />
            <FeatureCard icon={<Keyboard />} title="Keyboard Nav" description="Navigate your feed without touching the mouse" isDark={isDark} />
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="py-20" style={{ backgroundColor: isDark ? '#0c0c0f' : '#f4f4f5' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <WhyCard
              icon={<Zap className="w-5 h-5" />}
              title="Save hours every week"
              description="One feed replaces dozens of tabs. Filter, search, and skim in seconds instead of minutes."
              isDark={isDark}
            />
            <WhyCard
              icon={<Shield className="w-5 h-5" />}
              title="Privacy by design"
              description="No accounts required. No tracking. Your preferences stay in your browser."
              isDark={isDark}
            />
            <WhyCard
              icon={<RefreshCw className="w-5 h-5" />}
              title="Always current"
              description="Forums update automatically. Never miss a proposal, RFC, or important thread."
              isDark={isDark}
            />
          </div>
        </div>
      </section>

      {/* For Agents */}
      <section className="py-20 border-t" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
                style={{
                  backgroundColor: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  color: '#22c55e'
                }}
              >
                <Bot className="w-3 h-3" />
                Agent Friendly
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Built for humans.<br />
                <span style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>Ready for agents.</span>
              </h2>
              <p className="mb-6" style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>
                AI agents can search, monitor, and subscribe to forum discussions. 
                Full REST API, MCP tools, and RSS feeds available.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="/skill.md"
                  className="inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors text-sm"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  }}
                >
                  <Code2 className="w-4 h-4" />
                  Read skill.md
                </a>
                <a
                  href="/api/v1"
                  className="inline-flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors text-sm"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                  }}
                >
                  API Docs
                </a>
              </div>
            </div>
            <div 
              className="rounded-xl p-6 font-mono text-sm"
              style={{ 
                backgroundColor: isDark ? '#18181b' : '#ffffff',
                border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`
              }}
            >
              <div className="mb-4" style={{ color: isDark ? '#52525b' : '#a1a1aa' }}># Search discussions</div>
              <div style={{ color: isDark ? '#a1a1aa' : '#52525b' }}>
                curl &quot;https://discuss.watch/api/v1/search?q=grants&quot;
              </div>
              <div className="mt-4 mb-4" style={{ color: isDark ? '#52525b' : '#a1a1aa' }}># Get hot topics</div>
              <div style={{ color: isDark ? '#a1a1aa' : '#52525b' }}>
                curl &quot;https://discuss.watch/api/v1/discussions?hot=true&quot;
              </div>
              <div className="mt-4 mb-4" style={{ color: isDark ? '#52525b' : '#a1a1aa' }}># Subscribe to feed</div>
              <div style={{ color: isDark ? '#a1a1aa' : '#52525b' }}>
                https://discuss.watch/feed/crypto.xml
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to simplify your reading?
          </h2>
          <p className="mb-8" style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>
            No signup required. Start aggregating forums in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black hover:bg-gray-100 font-medium rounded-lg transition-colors"
            >
              Open App
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="/skill.md"
              className="inline-flex items-center gap-2 px-8 py-4 font-medium rounded-lg transition-colors"
              style={{ 
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              }}
            >
              <Bot className="w-4 h-4" />
              I&apos;m an Agent
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t" style={{ borderColor: isDark ? '#27272a' : '#e4e4e7' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-black/5'}`}>
                <Rss className="w-3 h-3" />
              </div>
              <span className="text-sm font-medium">discuss.watch</span>
            </div>
            <p className="text-sm" style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>
              Part of the{' '}
              <a 
                href="https://sovereignsignal.substack.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:opacity-80"
              >
                Sovereign Signal
              </a>
              {' '}ecosystem
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function VerticalCard({ icon, title, count, examples, color, isDark }: {
  icon: React.ReactNode;
  title: string;
  count: string;
  examples: string[];
  color: 'violet' | 'cyan' | 'emerald';
  isDark: boolean;
}) {
  const colors = {
    violet: { bg: 'bg-violet-500/10', text: 'text-violet-500', border: isDark ? 'border-violet-500/20' : 'border-violet-200' },
    cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: isDark ? 'border-cyan-500/20' : 'border-cyan-200' },
    emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: isDark ? 'border-emerald-500/20' : 'border-emerald-200' },
  };

  return (
    <div 
      className={`p-6 rounded-xl border ${colors[color].border}`}
      style={{ backgroundColor: isDark ? '#18181b' : '#ffffff' }}
    >
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg mb-4 ${colors[color].bg} ${colors[color].text}`}>
        {icon}
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="text-sm" style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>{count}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {examples.map((name) => (
          <span 
            key={name} 
            className="px-2 py-1 text-xs rounded-md"
            style={{ 
              backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              color: isDark ? '#a1a1aa' : '#52525b'
            }}
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

function MockFeedItem({ protocol, title, category, replies, views, isHot, isNew, isDark }: {
  protocol: string;
  title: string;
  category: string;
  replies: number;
  views: number;
  isHot?: boolean;
  isNew?: boolean;
  isDark: boolean;
}) {
  const categoryColors: Record<string, string> = {
    'Crypto': 'text-violet-500',
    'AI': 'text-cyan-500',
    'OSS': 'text-emerald-500',
  };

  return (
    <div 
      className="p-4 rounded-lg flex items-start gap-3"
      style={{
        backgroundColor: isDark ? 'rgba(39, 39, 42, 0.5)' : 'rgba(244, 244, 245, 1)',
      }}
    >
      <div 
        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
        style={{ 
          backgroundColor: isDark ? '#27272a' : '#e4e4e7',
          color: isDark ? '#a1a1aa' : '#52525b'
        }}
      >
        {protocol.slice(0, 2).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium mb-1.5 leading-snug">{title}</p>
        
        <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs" style={{ color: isDark ? '#71717a' : '#a1a1aa' }}>
          <span className="font-medium" style={{ color: isDark ? '#a1a1aa' : '#52525b' }}>{protocol}</span>
          <span>·</span>
          <span className={categoryColors[category]}>{category}</span>
          
          {isNew && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 text-[10px] font-medium">
              NEW
            </span>
          )}
          {isHot && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-500 font-medium">
              <Flame className="w-2.5 h-2.5" />
              <span className="text-[10px]">Hot</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: isDark ? '#52525b' : '#a1a1aa' }}>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {replies}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {views.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, isDark }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isDark: boolean;
}) {
  return (
    <div 
      className="p-5 rounded-xl"
      style={{
        backgroundColor: isDark ? '#18181b' : '#ffffff',
        border: `1px solid ${isDark ? '#27272a' : '#e4e4e7'}`
      }}
    >
      <div 
        className="inline-flex items-center justify-center w-9 h-9 rounded-lg mb-3"
        style={{ 
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          color: isDark ? '#a1a1aa' : '#52525b'
        }}
      >
        {icon}
      </div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm" style={{ color: isDark ? '#71717a' : '#a1a1aa' }}>{description}</p>
    </div>
  );
}

function WhyCard({ icon, title, description, isDark }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isDark: boolean;
}) {
  return (
    <div className="text-center">
      <div 
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4"
        style={{ 
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          color: isDark ? '#fafafa' : '#09090b'
        }}
      >
        {icon}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm" style={{ color: isDark ? '#a1a1aa' : '#71717a' }}>{description}</p>
    </div>
  );
}
