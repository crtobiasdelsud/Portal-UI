'use client'

import { Component } from 'react'

export default class WidgetErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(err) {
    console.error('[Widget error]', err)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80px',
        padding: '16px',
        background: '#fef2f2',
        border: '1.5px dashed #fca5a5',
        borderRadius: '8px',
        textAlign: 'center',
        flexDirection: 'column',
        gap: '4px',
      }}>
        <span style={{ fontSize: '1.2rem' }}>⚠</span>
        <p style={{ margin: 0, fontSize: '0.78rem', color: '#dc2626', fontWeight: 600 }}>
          Error al cargar el contenido
        </p>
      </div>
    )
  }
}
