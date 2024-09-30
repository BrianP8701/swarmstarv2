declare module 'react-vis-network-graph' {
  import { Component } from 'react'

  export interface GraphData {
    nodes: Array<{ id: string; label: string }>
    edges: Array<{ from: string; to: string }>
  }

  export interface GraphOptions {
    layout: {
      hierarchical: {
        enabled: boolean
        direction: string
        sortMethod: string
      }
    }
    nodes: {
      shape: string
    }
    physics: {
      enabled: boolean
    }
  }

  export interface GraphProps {
    graph: GraphData
    options: GraphOptions
    style?: React.CSSProperties
  }

  export default class Graph extends Component<GraphProps> {}
}
