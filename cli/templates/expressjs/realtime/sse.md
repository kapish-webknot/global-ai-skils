# Server-Sent Events (SSE)

## Setup

\`\`\`javascript
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send initial event
  sendEvent({ message: 'Connected' });

  // Send periodic updates
  const interval = setInterval(() => {
    sendEvent({ time: new Date().toISOString() });
  }, 5000);

  req.on('close', () => {
    clearInterval(interval);
    res.end();
  });
});
\`\`\`

## Best Practices
- Set proper headers (Content-Type, Cache-Control)
- Clean up on client disconnect
- Use heartbeat to detect dead connections
- Implement reconnection logic on client
- Consider using Redis for multi-server setups

## Client Example

\`\`\`javascript
const eventSource = new EventSource('/events');

eventSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

eventSource.onerror = () => {
  console.error('Connection error');
  eventSource.close();
};
\`\`\`
