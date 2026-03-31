import React, { useRef, useEffect } from 'react';

export default function ActivityFeed({ activities }) {
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [activities.length]);

  return (
    <div className="activity-feed">
      <h3 className="panel-title">
        <span className="panel-icon">📡</span>
        Activity Feed
      </h3>
      <div className="feed-list" ref={feedRef}>
        {activities.length === 0 ? (
          <div className="feed-empty">No activity yet. Submit a task or start Ralph!</div>
        ) : (
          activities.map((activity, i) => (
            <ActivityItem key={`${activity.timestamp}-${i}`} activity={activity} />
          ))
        )}
      </div>
    </div>
  );
}

function ActivityItem({ activity }) {
  const time = new Date(activity.timestamp);
  const timeStr = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <div className={`feed-item type-${activity.type}`}>
      <div className="feed-item-header">
        <span className="feed-agent-name">{activity.agentName}</span>
        <span className="feed-time">{timeStr}</span>
      </div>
      <div className="feed-message">{activity.message}</div>
      <div className="feed-type-indicator">
        {getTypeIcon(activity.type)}
      </div>
    </div>
  );
}

function getTypeIcon(type) {
  switch (type) {
    case 'task_submitted': return '📥';
    case 'task_completed': return '✅';
    case 'agent_assigned': return '👉';
    case 'agent_working': return '⚙️';
    case 'agent_idle': return '💤';
    case 'knowledge_accessed': return '📚';
    default: return '💬';
  }
}
