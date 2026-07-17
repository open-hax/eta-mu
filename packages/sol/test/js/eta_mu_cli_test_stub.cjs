class SessionManager {
  static inMemory(workspaceRoot) {
    return new SessionManager(workspaceRoot)
  }

  constructor(workspaceRoot) {
    this.workspaceRoot = workspaceRoot
    this.events = []
  }

  newSession(session) {
    this.session = session
    return session
  }

  appendModelChange(provider, model) {
    this.events.push({ type: "model", provider, model })
  }

  appendThinkingLevelChange(level) {
    this.events.push({ type: "thinking", level })
  }
}

function createAgentSession(options) {
  const session = {
    options,
    isStreaming: false,
    agent: {
      setAfterToolCall(fn) {
        this.afterToolCall = fn
      }
    },
    setThinkingLevel(level) {
      this.thinkingLevel = level
    }
  }

  return Promise.resolve({ session })
}

module.exports = {
  SessionManager,
  createAgentSession
}
