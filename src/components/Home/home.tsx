import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  const navigate = useNavigate()

    useEffect(() => {
      if (account.status === 'connected') {
        navigate('/donate')
      }
    }, [account.status]
    );

  return (
    <>
      <div>
        <h2 className='font-mono text-red-600'>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>
    </>
  )
}

export default Home
