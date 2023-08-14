import React from 'react'
import ReactDOM from 'react-dom/client'
import { SIDButton } from '@sid-hq/sid'

const PageComponent: React.FC = () => {
    let [isConnected, setIsConnected] = React.useState(false)

    const callback = () => {
        console.log('callback')
        setIsConnected(false)
        return Promise.resolve()
    }

    return (
        <div>
            <SIDButton onDisconnect={callback} isConnected={isConnected} />
            <button onClick={() => setIsConnected(!isConnected)}>Toggle</button>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <PageComponent />
)
