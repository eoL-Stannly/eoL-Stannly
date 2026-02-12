import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

// Section data for the homepage
const SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'protocol', label: 'Protocol' },
  { id: 'staking', label: 'Staking' },
  { id: 'tokenomics', label: 'Tokens' },
  { id: 'roadmap', label: 'Roadmap' },
];

// Circuit/wireframe SVG component
function CircuitGraphic({ className }: { className?: string }) {
  return (
    <svg className={`circuit-graphic ${className || ''}`} viewBox="0 0 400 400" fill="none">
      {/* Main circuit board pattern */}
      <g stroke="var(--green-primary)" strokeWidth="0.5" opacity="0.3">
        {/* Horizontal lines */}
        <line x1="0" y1="100" x2="400" y2="100" />
        <line x1="0" y1="200" x2="400" y2="200" />
        <line x1="0" y1="300" x2="400" y2="300" />
        {/* Vertical lines */}
        <line x1="100" y1="0" x2="100" y2="400" />
        <line x1="200" y1="0" x2="200" y2="400" />
        <line x1="300" y1="0" x2="300" y2="400" />
      </g>

      {/* Connection nodes */}
      <g fill="var(--green-primary)">
        <circle cx="100" cy="100" r="4" opacity="0.8" />
        <circle cx="200" cy="100" r="4" opacity="0.8" />
        <circle cx="300" cy="100" r="4" opacity="0.8" />
        <circle cx="100" cy="200" r="6" opacity="1" className="pulse-node" />
        <circle cx="200" cy="200" r="8" opacity="1" className="pulse-node" />
        <circle cx="300" cy="200" r="6" opacity="1" className="pulse-node" />
        <circle cx="100" cy="300" r="4" opacity="0.8" />
        <circle cx="200" cy="300" r="4" opacity="0.8" />
        <circle cx="300" cy="300" r="4" opacity="0.8" />
      </g>

      {/* Diagonal connections */}
      <g stroke="var(--green-primary)" strokeWidth="1" opacity="0.5">
        <line x1="100" y1="100" x2="200" y2="200" className="animate-line" />
        <line x1="300" y1="100" x2="200" y2="200" className="animate-line" />
        <line x1="100" y1="300" x2="200" y2="200" className="animate-line" />
        <line x1="300" y1="300" x2="200" y2="200" className="animate-line" />
      </g>

      {/* Outer hexagon */}
      <polygon
        points="200,20 350,110 350,290 200,380 50,290 50,110"
        stroke="var(--green-primary)"
        strokeWidth="1"
        fill="none"
        opacity="0.3"
      />

      {/* Inner hexagon */}
      <polygon
        points="200,80 300,130 300,270 200,320 100,270 100,130"
        stroke="var(--green-primary)"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
        className="rotate-slow"
      />

      {/* Center core */}
      <circle cx="200" cy="200" r="30" stroke="var(--green-primary)" strokeWidth="2" fill="none" opacity="0.8" />
      <circle cx="200" cy="200" r="15" fill="var(--green-primary)" opacity="0.3" className="pulse-core" />
    </svg>
  );
}

// Blueprint schematic SVG
function BlueprintSchematic({ className }: { className?: string }) {
  return (
    <svg className={`blueprint-schematic ${className || ''}`} viewBox="0 0 600 400" fill="none">
      {/* Blueprint grid */}
      <defs>
        <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="var(--green-primary)" strokeWidth="0.3" opacity="0.2" />
        </pattern>
        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <rect width="100" height="100" fill="url(#smallGrid)" />
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="var(--green-primary)" strokeWidth="0.5" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="600" height="400" fill="url(#grid)" />

      {/* Supercomputer chassis outline */}
      <g stroke="var(--green-primary)" strokeWidth="1" fill="none">
        {/* Main frame */}
        <rect x="150" y="50" width="300" height="300" opacity="0.5" />
        <rect x="160" y="60" width="280" height="280" opacity="0.3" strokeDasharray="5,5" />

        {/* Processing units */}
        <rect x="180" y="80" width="80" height="60" opacity="0.8" />
        <rect x="280" y="80" width="80" height="60" opacity="0.8" />
        <rect x="380" y="80" width="60" height="60" opacity="0.6" />

        {/* Memory banks */}
        <g opacity="0.6">
          <rect x="180" y="160" width="180" height="20" />
          <rect x="180" y="190" width="180" height="20" />
          <rect x="180" y="220" width="180" height="20" />
          <rect x="180" y="250" width="180" height="20" />
        </g>

        {/* Data lines */}
        <line x1="220" y1="140" x2="220" y2="160" opacity="0.8" />
        <line x1="260" y1="140" x2="260" y2="160" opacity="0.8" />
        <line x1="320" y1="140" x2="320" y2="160" opacity="0.8" />

        {/* Status indicators */}
        <circle cx="400" cy="170" r="5" fill="var(--green-primary)" opacity="0.8" className="pulse-node" />
        <circle cx="400" cy="195" r="5" fill="var(--green-primary)" opacity="0.6" />
        <circle cx="400" cy="220" r="5" fill="var(--green-primary)" opacity="0.4" />

        {/* Bottom connectors */}
        <line x1="200" y1="280" x2="200" y2="320" opacity="0.5" />
        <line x1="250" y1="280" x2="250" y2="320" opacity="0.5" />
        <line x1="300" y1="280" x2="300" y2="330" opacity="0.5" />
        <line x1="350" y1="280" x2="350" y2="320" opacity="0.5" />
      </g>

      {/* Dimension annotations */}
      <g fill="var(--green-primary)" fontSize="10" fontFamily="JetBrains Mono, monospace" opacity="0.5">
        <text x="155" y="45">FSOC_MAINFRAME_v2.0</text>
        <text x="470" y="110">CPU_01</text>
        <text x="470" y="200">MEM_BANK</text>
        <text x="155" y="370">SCALE: 1:100</text>
      </g>
    </svg>
  );
}

export function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
    }

    const particles: Particle[] = [];
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 0, ${particle.alpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const alpha = (1 - distance / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 255, 0, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    animate();

    return () => {
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Handle scroll to update active section
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isScrolling) return;

    const container = containerRef.current;
    const scrollPosition = container.scrollTop;
    const sectionHeight = window.innerHeight;
    const newActiveSection = Math.round(scrollPosition / sectionHeight);

    if (newActiveSection !== activeSection && newActiveSection >= 0 && newActiveSection < SECTIONS.length) {
      setActiveSection(newActiveSection);
    }
  }, [activeSection, isScrolling]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Navigate to section
  const scrollToSection = (index: number) => {
    if (!containerRef.current) return;

    setIsScrolling(true);
    const sectionHeight = window.innerHeight;
    containerRef.current.scrollTo({
      top: index * sectionHeight,
      behavior: 'smooth',
    });

    setTimeout(() => {
      setActiveSection(index);
      setIsScrolling(false);
    }, 800);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && activeSection < SECTIONS.length - 1) {
        scrollToSection(activeSection + 1);
      } else if (e.key === 'ArrowUp' && activeSection > 0) {
        scrollToSection(activeSection - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);

  return (
    <div className="fullpage-home">
      {/* Background canvas */}
      <canvas ref={canvasRef} className="particle-canvas-fixed" />

      {/* Navigation dots */}
      <nav className="section-nav">
        {SECTIONS.map((section, index) => (
          <button
            key={section.id}
            className={`nav-dot ${activeSection === index ? 'active' : ''}`}
            onClick={() => scrollToSection(index)}
            aria-label={section.label}
          >
            <span className="dot-inner" />
            <span className="dot-label">{section.label}</span>
          </button>
        ))}
      </nav>

      {/* Sections container */}
      <div ref={containerRef} className="sections-container">
        {/* Hero Section */}
        <section id="hero" className="fullpage-section hero-full">
          <div className="section-content">
            <CircuitGraphic className="hero-circuit left" />
            <CircuitGraphic className="hero-circuit right" />

            <div className="hero-center">
              <span className="system-status">SYSTEM_ONLINE</span>
              <h1 className="hero-title-large">
                <span className="highlight-letter">F</span>-SOCIETY
              </h1>
              <p className="hero-tagline">DECENTRALIZED FINANCIAL PROTOCOL</p>
              <p className="hero-description">
                Next-generation DeFi infrastructure built on Solana.
                Stake, bond, and earn with institutional-grade security.
              </p>

              <div className="hero-actions">
                <Link to="/staking" className="btn-futuristic primary">
                  <span>Launch App</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <a href="#protocol" className="btn-futuristic secondary" onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(1);
                }}>
                  <span>Learn More</span>
                </a>
              </div>
            </div>

            <div className="scroll-prompt" onClick={() => scrollToSection(1)}>
              <span className="scroll-text">SCROLL</span>
              <div className="scroll-line" />
            </div>
          </div>
        </section>

        {/* Protocol Section */}
        <section id="protocol" className="fullpage-section protocol-section">
          <div className="section-content">
            <BlueprintSchematic className="section-blueprint" />

            <div className="protocol-info">
              <span className="section-tag">BUILDING_INFRASTRUCTURE 40%</span>
              <h2 className="section-title">PROTOCOL</h2>
              <p className="section-description">
                F-Society is a decentralized reserve currency protocol providing
                sustainable yields through algorithmic market operations.
                Our smart contracts are audited and optimized for the Solana blockchain.
              </p>

              <div className="feature-grid">
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <h3>Staking</h3>
                  <p>Stake $sFSOC to earn $FSOC rewards every epoch</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <h3>Bonding</h3>
                  <p>Bond assets to acquire $FSOC at a discount</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3>Treasury</h3>
                  <p>Protocol-owned liquidity backs every token</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Staking Section */}
        <section id="staking" className="fullpage-section staking-section">
          <div className="section-content">
            <div className="staking-visual">
              <div className="apr-display-large">
                <span className="apr-label-small">BASE APR</span>
                <span className="apr-number">50<span className="apr-percent-small">%</span></span>
              </div>
              <div className="lock-bonuses-display">
                <div className="bonus-tier">
                  <span className="tier-label">1 DAY</span>
                  <span className="tier-value">+10%</span>
                </div>
                <div className="bonus-tier highlight">
                  <span className="tier-label">3 DAYS</span>
                  <span className="tier-value">+35%</span>
                </div>
                <div className="bonus-tier">
                  <span className="tier-label">5 DAYS</span>
                  <span className="tier-value">+60%</span>
                </div>
              </div>
            </div>

            <div className="staking-info">
              <span className="section-tag">EARNING_REWARDS 60%</span>
              <h2 className="section-title">STAKING</h2>
              <p className="section-description">
                Stake your $sFSOC tokens to earn $FSOC rewards.
                Choose your lock period for bonus multipliers.
                Rewards are distributed every 4-hour epoch.
              </p>

              <div className="epoch-stats">
                <div className="stat-box">
                  <span className="stat-label">EPOCH DURATION</span>
                  <span className="stat-value">4 HOURS</span>
                </div>
                <div className="stat-box">
                  <span className="stat-label">EPOCHS/YEAR</span>
                  <span className="stat-value">2,190</span>
                </div>
              </div>

              <Link to="/staking" className="btn-futuristic primary large">
                <span>Start Staking</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Tokenomics Section */}
        <section id="tokenomics" className="fullpage-section tokenomics-section">
          <div className="section-content">
            <div className="token-visual">
              <div className="token-card fsoc">
                <div className="token-symbol">$FSOC</div>
                <div className="token-name">F-Society Token</div>
                <div className="token-role">Reward Token</div>
                <div className="token-description">
                  The native reward token distributed to stakers and bonders
                </div>
              </div>
              <div className="token-connector">
                <svg viewBox="0 0 100 50" fill="none">
                  <path d="M10 25 H40 M60 25 H90" stroke="var(--green-primary)" strokeWidth="2" strokeDasharray="5,5" />
                  <circle cx="50" cy="25" r="8" fill="var(--green-primary)" opacity="0.5" />
                </svg>
              </div>
              <div className="token-card sfsoc">
                <div className="token-symbol">$sFSOC</div>
                <div className="token-name">Staked F-Society</div>
                <div className="token-role">Share Token</div>
                <div className="token-description">
                  LP/Share token staked to earn $FSOC rewards
                </div>
              </div>
            </div>

            <div className="tokenomics-info">
              <span className="section-tag">TOKEN_ECONOMICS 80%</span>
              <h2 className="section-title">TOKENS</h2>
              <p className="section-description">
                A dual-token system designed for sustainable value accrual.
                $FSOC serves as the reward and governance token, while
                $sFSOC represents staked positions earning protocol rewards.
              </p>

              <Link to="/prices" className="btn-futuristic secondary">
                <span>View Markets</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Roadmap Section */}
        <section id="roadmap" className="fullpage-section roadmap-section">
          <div className="section-content">
            <div className="roadmap-timeline">
              <div className="timeline-item completed">
                <div className="timeline-marker" />
                <div className="timeline-content">
                  <span className="phase">PHASE 1</span>
                  <h3>Foundation</h3>
                  <p>Smart contract development, security audits, frontend launch</p>
                </div>
              </div>
              <div className="timeline-item active">
                <div className="timeline-marker" />
                <div className="timeline-content">
                  <span className="phase">PHASE 2</span>
                  <h3>Token Launch</h3>
                  <p>$FSOC and $sFSOC deployment on Solana devnet/mainnet</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker" />
                <div className="timeline-content">
                  <span className="phase">PHASE 3</span>
                  <h3>Protocol Growth</h3>
                  <p>Bonding mechanisms, treasury diversification, partnerships</p>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-marker" />
                <div className="timeline-content">
                  <span className="phase">PHASE 4</span>
                  <h3>Governance</h3>
                  <p>DAO launch, community voting, protocol upgrades</p>
                </div>
              </div>
            </div>

            <div className="roadmap-info">
              <span className="section-tag">DEVELOPMENT_PROGRESS 100%</span>
              <h2 className="section-title">ROADMAP</h2>
              <p className="section-description">
                Building the future of decentralized finance, one phase at a time.
                Join us on this journey to financial sovereignty.
              </p>

              <div className="social-links">
                <a href="#" className="social-btn">Discord</a>
                <a href="#" className="social-btn">Twitter</a>
                <a href="#" className="social-btn">Docs</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
