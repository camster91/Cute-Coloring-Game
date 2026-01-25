import React, { Component, Suspense, lazy } from 'react'

// Lazy load the main component to catch any import errors
const ColoringGame = lazy(() => import('./components/ColoringGame'))

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="text-6xl mb-4 animate-bounce">🎨</div>
      <div className="text-xl text-gray-600 font-medium">Loading Calm Drawing...</div>
      <div className="mt-4 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" style={{ width: '60%' }} />
      </div>
    </div>
  )
}

// Error boundary to catch and display any runtime errors
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    console.error('App Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-8">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            We're sorry, but the drawing app encountered an error. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors mb-6"
          >
            Refresh Page
          </button>
          <details className="bg-white/80 backdrop-blur rounded-xl p-4 max-w-lg w-full shadow-lg">
            <summary className="cursor-pointer text-gray-700 font-medium">Technical Details</summary>
            <pre className="mt-2 text-xs text-red-600 overflow-auto max-h-40 bg-gray-100 p-2 rounded">
              {this.state.error?.toString()}
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <ColoringGame />
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
