'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useWallet } from '@aptos-labs/wallet-adapter-react'
import { XChainWalletSelector } from '@shelby-protocol/ui/components/x-chain-wallet-selector'
import { Button } from '@shelby-protocol/ui/components/button'

export default function Navbar() {
  const { connected, account } = useWallet()
  const [userId, setUserId] = useState<string | null>(null)

  const checkAuth = useCallback(async () => {
    if (!account) return
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: account.address.toString() }),
      })
      if (response.ok) {
        const data = await response.json()
        if (data.authenticated && data.user) {
          setUserId(data.user.id)
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error)
    }
  }, [account])

  useEffect(() => {
    if (connected && account) {
      checkAuth()
    } else {
      setUserId(null)
    }
  }, [connected, account, checkAuth])

  const onMintShelbyUsd = () => {
    if (!account) {
      return
    }
    window.open(
      `https://docs.shelby.xyz/apis/faucet/shelbyusd?address=${account.address}`,
      '_blank',
    )
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-500">
            Instagram
          </Link>

          {/* Navigation Links */}
          {connected && account && (
            <div className="flex items-center gap-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
              <Link
                href="/create"
                className="text-gray-700 hover:text-blue-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
              {userId && (
                <Link
                  href={`/profile/${userId}`}
                  className="text-gray-700 hover:text-blue-500 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </Link>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            {connected && account && (
              <Button
                disabled={!connected}
                onClick={onMintShelbyUsd}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Mint shelbyUSD
              </Button>
            )}
            <XChainWalletSelector
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500 hover:border-blue-400"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}
