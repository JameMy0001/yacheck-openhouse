import React, { Component, type ReactNode } from 'react'

export interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  public override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Uncaught 3D / UI Error:', error, errorInfo)
  }

  public override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] p-6 text-white">
          <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-red-950/20 p-6 backdrop-blur-xl text-center shadow-[0_0_50px_rgba(239,68,68,0.2)]">
            <h2 className="mb-2 text-xl font-bold tracking-tight text-red-400">Rendering Error Detected</h2>
            <p className="mb-4 text-xs text-gray-400 leading-relaxed">
              The WebGL scene or UI component encountered an unexpected error.
            </p>
            <pre className="max-h-36 overflow-auto rounded bg-black/60 p-3 text-left font-mono text-[11px] text-red-300">
              {this.state.error?.message || String(this.state.error)}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-red-600 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-red-500 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Reload Experience
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
