import { Component, type ReactNode } from 'react'
import { Button, Card } from '@/ui'
export default class ErrorBoundary extends Component<{ children: ReactNode }, { err: Error | null }> {
  state = { err: null as Error | null }
  static getDerivedStateFromError(err: Error) { return { err } }
  render() { return this.state.err ? <Card className="space-y-3 text-center"><p className="font-semibold">Something went wrong on this page.</p><p className="text-sm text-slate-500">{this.state.err.message}</p><Button onClick={() => this.setState({ err: null })}>Try again</Button></Card> : this.props.children }
}
