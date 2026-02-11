import React from 'react';
import { AGENT_STATES } from '../agents/AgentDefinitions.js';

export default function OfficeWorkspace({ agents, selectedAgent, onSelectAgent }) {
  const waterCoolerAgents = agents.filter((a) => a.atWaterCooler);

  return (
    <div className="game-office">
      {/* Ayima Logo Bar */}
      <div className="ayima-logo-bar">
        <img src="/assets/ayima-logo.svg" alt="Ayima" className="ayima-logo" />
        <span className="ayima-logo-text">AGI HQ</span>
      </div>

      {/* Top decoration shelf */}
      <div className="office-shelf">
        <div className="shelf-item shelf-drinks">
          <span className="shelf-icon">&#9749;</span>
          <span className="shelf-icon">&#127849;</span>
        </div>
        <div className="shelf-item shelf-window">
          <div className="pixel-window">
            <div className="win-pane"></div>
            <div className="win-pane"></div>
            <div className="win-pane"></div>
            <div className="win-pane"></div>
          </div>
        </div>
        <div className="shelf-item shelf-center">
          <span className="shelf-icon">&#128200;</span>
          <span className="shelf-icon">&#128336;</span>
        </div>
        <div className="shelf-item shelf-window">
          <div className="pixel-window">
            <div className="win-pane"></div>
            <div className="win-pane"></div>
            <div className="win-pane"></div>
            <div className="win-pane"></div>
          </div>
        </div>
        <div className="shelf-item shelf-board">
          <span className="shelf-icon">&#128204;</span>
          <span className="shelf-icon">&#128196;</span>
        </div>
      </div>

      {/* Title */}
      <div className="office-title-bar">
        <span className="sparkle-icon">&#10024;</span>
        AGI - Ayima General Intelligence - HQ
        <span className="sparkle-icon">&#10024;</span>
      </div>

      {/* The campus floor */}
      <div className="office-floor">
        <div className="office-zones">
          {/* Row 1: Main office + Meeting Room */}
          <div className="office-zone-row">
            {/* Main open-plan office */}
            <div className="zone-main">
              <div className="zone-label">Open Plan Office</div>
              <div style={{ position: 'relative' }}>
                {/* Floor decorations */}
                <div className="floor-plant" style={{ position: 'absolute', bottom: 8, right: 20, zIndex: 1 }}>&#127793;</div>
                <div className="floor-plant" style={{ position: 'absolute', top: 8, left: 12, zIndex: 1 }}>&#127811;</div>

                {/* Water Cooler Area */}
                <div className="water-cooler-area">
                  <div className="water-cooler">
                    <div className="wc-bottle"></div>
                    <div className="wc-base"></div>
                    <div className="wc-label">&#128167;</div>
                  </div>
                  {waterCoolerAgents.length > 0 && (
                    <div className="wc-agents">
                      {waterCoolerAgents.map((agent) => (
                        <div key={agent.id} className="wc-agent-mini">
                          <div className="wc-mini-char">
                            {agent.speechBubble && (
                              <div className="speech-bubble speech-bubble-wc">
                                {agent.speechBubble}
                              </div>
                            )}
                            <div className={`ch-hair ${agent.longHair ? 'ch-hair-long' : ''}`} style={{ background: agent.hairColor }}></div>
                            <div className="ch-head" style={{ background: agent.skinTone }}>
                              <div className="ch-eye ch-eye-l"></div>
                              <div className="ch-eye ch-eye-r"></div>
                            </div>
                            <div className="ch-body" style={{ background: agent.shirtColor }}></div>
                          </div>
                          <div className="wc-name">{agent.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Agent grid */}
                <div className="agent-grid">
                  {agents.map((agent) => (
                    <AgentStation
                      key={agent.id}
                      agent={agent}
                      isSelected={selectedAgent === agent.id}
                      onClick={() => onSelectAgent(agent.id === selectedAgent ? null : agent.id)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Meeting Rooms */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="zone-meeting">
                <div className="zone-label">Meeting Room A</div>
                <div className="meeting-table">
                  <div className="meeting-screen">
                    <div className="meeting-screen-glow"></div>
                  </div>
                  <div className="meeting-surface"></div>
                  <div className="meeting-chairs">
                    <div className="meeting-chair"></div>
                    <div className="meeting-chair"></div>
                    <div className="meeting-chair"></div>
                    <div className="meeting-chair"></div>
                  </div>
                </div>
              </div>
              <div className="zone-meeting">
                <div className="zone-label">Meeting Room B</div>
                <div className="meeting-table">
                  <div className="meeting-screen">
                    <div className="meeting-screen-glow"></div>
                  </div>
                  <div className="meeting-surface"></div>
                  <div className="meeting-chairs">
                    <div className="meeting-chair"></div>
                    <div className="meeting-chair"></div>
                    <div className="meeting-chair"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Breakout Area + Garden */}
          <div className="office-zone-row">
            <div className="zone-breakout">
              <div className="zone-label">Breakout Area</div>
              <div className="breakout-items">
                <div className="breakout-couch"></div>
                <div className="breakout-table"></div>
                <div className="breakout-couch"></div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span className="breakout-emoji">&#9749;</span>
                  <span style={{ fontFamily: 'var(--pixel-font)', fontSize: 5, color: 'rgba(12,53,71,0.5)' }}>COFFEE</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span className="breakout-emoji">&#127918;</span>
                  <span style={{ fontFamily: 'var(--pixel-font)', fontSize: 5, color: 'rgba(12,53,71,0.5)' }}>GAMES</span>
                </div>
              </div>
            </div>

            <div className="zone-garden">
              <div className="zone-label" style={{ color: '#2E7D32', background: 'rgba(46,125,50,0.12)' }}>Outside Garden</div>
              <div className="garden-path"></div>
              <div className="garden-items">
                <div className="garden-item">
                  <span className="garden-emoji">&#127794;</span>
                </div>
                <div className="garden-item">
                  <span className="garden-emoji-sm">&#127800;</span>
                  <span className="garden-emoji-sm">&#127799;</span>
                </div>
                <div className="garden-item">
                  <div className="garden-bench"></div>
                </div>
                <div className="garden-item">
                  <span className="garden-emoji-sm">&#127807;</span>
                  <span className="garden-emoji">&#127795;</span>
                </div>
                <div className="garden-item">
                  <span className="garden-emoji-sm">&#127804;</span>
                  <span className="garden-emoji-sm">&#127803;</span>
                </div>
                <div className="garden-item">
                  <div className="garden-bench"></div>
                </div>
                <div className="garden-item">
                  <span className="garden-emoji">&#127796;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentStation({ agent, isSelected, onClick }) {
  const isActive = agent.state !== AGENT_STATES.IDLE;
  const isWorking = agent.state === AGENT_STATES.WORKING || agent.state === AGENT_STATES.THINKING;
  const isWalking = agent.state === AGENT_STATES.WALKING;
  const isCelebrating = agent.state === AGENT_STATES.CELEBRATING;
  const isCoffee = agent.state === AGENT_STATES.COFFEE;
  const isCollab = agent.state === AGENT_STATES.COLLABORATING || agent.state === AGENT_STATES.PRESENTING;
  const isAtCooler = agent.atWaterCooler;

  return (
    <div className={`agent-station ${isSelected ? 'station-selected' : ''} ${isAtCooler ? 'station-at-cooler' : ''}`} onClick={onClick}>
      {/* Speech Bubble */}
      {agent.speechBubble && !isAtCooler && (
        <div className="speech-bubble">
          {agent.speechBubble}
          <div className="speech-tail"></div>
        </div>
      )}

      {/* Character */}
      <div className={`pixel-char ${isActive ? 'char-active' : ''} ${isWalking ? 'char-walk' : ''} ${isAtCooler ? 'char-away' : ''}`}>
        {/* Thinking / celebration effects */}
        {agent.state === AGENT_STATES.THINKING && (
          <div className="think-effect">&#128161;</div>
        )}
        {isCelebrating && (
          <div className="celebrate-fx">
            <span className="conf c0">&#10024;</span>
            <span className="conf c1">&#127881;</span>
            <span className="conf c2">&#10024;</span>
          </div>
        )}
        {isCoffee && (
          <div className="coffee-fx">&#9749;</div>
        )}

        {/* Hair */}
        <div className={`ch-hair ${agent.longHair ? 'ch-hair-long' : ''}`} style={{ background: agent.hairColor }}></div>
        {/* Head */}
        <div className="ch-head" style={{ background: agent.skinTone }}>
          <div className="ch-eye ch-eye-l"></div>
          <div className="ch-eye ch-eye-r"></div>
        </div>
        {/* Long hair sides */}
        {agent.longHair && (
          <>
            <div className="ch-hair-side ch-hair-side-l" style={{ background: agent.hairColor }}></div>
            <div className="ch-hair-side ch-hair-side-r" style={{ background: agent.hairColor }}></div>
          </>
        )}
        {/* Body */}
        <div className="ch-body" style={{ background: agent.shirtColor }}></div>
        {/* Legs */}
        <div className="ch-legs">
          <div className={`ch-leg ch-leg-l ${isWalking ? 'walk-l' : ''}`}></div>
          <div className={`ch-leg ch-leg-r ${isWalking ? 'walk-r' : ''}`}></div>
        </div>
      </div>

      {/* Status label */}
      <div className={`state-tag ${isWorking ? 'tag-working' : ''} ${isCelebrating ? 'tag-done' : ''} ${isCollab ? 'tag-collab' : ''} ${isCoffee ? 'tag-coffee' : ''}`}>
        {getLabel(agent.state, isAtCooler)}
      </div>

      {/* Desk */}
      <div className="px-desk">
        <div className="desk-top-surface">
          <DeskItems role={agent.role} state={agent.state} />
        </div>
        <div className="desk-front-face"></div>
      </div>

      {/* Nameplate */}
      <div className="px-nameplate">{agent.name}</div>
      <div className="px-title">{agent.title}</div>

      {/* Task badge */}
      {agent.completedTasks > 0 && (
        <div className="px-badge">{agent.completedTasks}</div>
      )}
    </div>
  );
}

function DeskItems({ role, state }) {
  const isWorking = state === AGENT_STATES.WORKING || state === AGENT_STATES.THINKING;

  if (role === 'data_engineer') {
    return (
      <>
        <div className={`px-monitor ${isWorking ? 'mon-glow' : ''}`}>
          <div className="mon-screen mon-code">
            <div className="code-ln c1"></div>
            <div className="code-ln c2"></div>
            <div className="code-ln c3"></div>
          </div>
        </div>
        <div className={`px-monitor ${isWorking ? 'mon-glow' : ''}`}>
          <div className="mon-screen mon-data">
            <div className="data-br d1"></div>
            <div className="data-br d2"></div>
            <div className="data-br d3"></div>
            <div className="data-br d4"></div>
          </div>
        </div>
        <div className="desk-obj">&#127911;</div>
      </>
    );
  }

  if (role === 'coo' || role === 'account_manager') {
    return (
      <>
        <div className={`px-monitor ${isWorking ? 'mon-glow' : ''}`}>
          <div className="mon-screen mon-chart">
            <div className="chart-line"></div>
          </div>
        </div>
        <div className="desk-obj desk-clipboard">
          <div className="clip-check">&#10003;</div>
          <div className="clip-check">&#10003;</div>
        </div>
      </>
    );
  }

  if (role === 'principal_seo' || role === 'head_of_seo') {
    return (
      <>
        <div className="desk-obj">&#128269;</div>
        <div className={`px-monitor ${isWorking ? 'mon-glow' : ''}`}>
          <div className="mon-screen mon-serp">
            <div className="serp-ln s1"></div>
            <div className="serp-ln s2"></div>
            <div className="serp-ln s3"></div>
          </div>
        </div>
        <div className="desk-obj">&#128202;</div>
      </>
    );
  }

  return (
    <>
      <div className={`px-monitor ${isWorking ? 'mon-glow' : ''}`}>
        <div className="mon-screen mon-kw">
          <div className="kw-block k1"></div>
          <div className="kw-block k2"></div>
        </div>
      </div>
      <div className="desk-obj">&#128214;</div>
    </>
  );
}

function getLabel(state, atCooler) {
  if (atCooler) return 'water cooler';
  switch (state) {
    case AGENT_STATES.WORKING: return 'working...';
    case AGENT_STATES.THINKING: return 'thinking...';
    case AGENT_STATES.WALKING: return 'walking';
    case AGENT_STATES.COLLABORATING: return 'chatting';
    case AGENT_STATES.PRESENTING: return 'presenting';
    case AGENT_STATES.COFFEE: return 'coffee break';
    case AGENT_STATES.CELEBRATING: return 'done!';
    default: return 'idle';
  }
}
