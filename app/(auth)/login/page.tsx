'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { XChainWalletSelector } from '@shelby-protocol/ui/components/x-chain-wallet-selector'

export default function LoginPage() {
  const { connected, account } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (connected && account) {
      // Authenticate with backend when wallet connects
      const authenticate = async () => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ walletAddress: account.address.toString() }),
          })

          if (response.ok) {
            router.push('/')
          }
        } catch (error) {
          console.error('Authentication error:', error)
        }
      }
      authenticate()
    }
  }, [connected, account, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Welcome</h1>
        <p className="text-gray-600 text-center mb-8">
          Connect your wallet to continue
        </p>
        <div className="flex justify-center">
          <XChainWalletSelector
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500 hover:border-blue-400"
          />
        </div>
      </div>
    </div>
  )
}
