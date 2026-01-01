import { useState } from 'react'

function AuthRequest({ request, userName, onComplete, apiUrl }) {
  const [isApproving, setIsApproving] = useState(false)
  const [error, setError] = useState('')

  const handleApprove = async () => {
    setIsApproving(true)
    setError('')

    try {
      // In a real app, this would use WebAuthn to sign the challenge
      // For demo purposes, we'll just call the API directly
      
      const response = await fetch(`${apiUrl}/auth/approve/${request.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const data = await response.json()

      if (data.success) {
        // Success!
        setTimeout(() => {
          onComplete()
        }, 1000)
      } else {
        setError('Approval failed. Please try again.')
        setIsApproving(false)
      }
    } catch (err) {
      console.error('Approval error:', err)
      setError('Failed to approve authentication: ' + err.message)
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    try {
      await fetch(`${apiUrl}/auth/reject/${request.id}`, {
        method: 'POST',
      })
      onComplete()
    } catch (err) {
      console.error('Reject error:', err)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="card">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-pulse">🔔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Authentication Request
          </h1>
          <p className="text-gray-600">
            A service is requesting your approval
          </p>
        </div>

        {/* Request Details */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-4">
            Transaction Details:
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-blue-700">Type:</span>
              <span className="text-sm font-semibold text-blue-900">
                {request.transaction_type || 'Authentication'}
              </span>
            </div>

            {request.amount && (
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Amount:</span>
                <span className="text-lg font-bold text-blue-900">
                  ${request.amount}
                </span>
              </div>
            )}

            {request.description && (
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Description:</span>
                <span className="text-sm font-semibold text-blue-900">
                  {request.description}
                </span>
              </div>
            )}

            <div className="flex justify-between pt-3 border-t border-blue-200">
              <span className="text-sm text-blue-700">Time:</span>
              <span className="text-sm font-semibold text-blue-900">
                {new Date(request.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* User Confirmation */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 text-center">
            Confirm with your biometric to approve this request
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        {!isApproving ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleReject}
              className="py-4 px-6 border-2 border-red-300 text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-all"
            >
              ❌ Reject
            </button>
            <button
              onClick={handleApprove}
              className="py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              ✅ Approve
            </button>
          </div>
        ) : (
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-12 w-12 text-green-600 mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="text-lg font-semibold text-green-800">
                ✅ Approved!
              </p>
              <p className="text-sm text-green-600 mt-1">
                Confirming authentication...
              </p>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Security reminder
              </h3>
              <div className="mt-1 text-sm text-yellow-700">
                Only approve if you initiated this action. Never approve requests you don't recognize.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-white text-sm">
        <p>Hi {userName} 👋</p>
        <p className="mt-1 opacity-75">Powered by Janus</p>
      </div>
    </div>
  )
}

export default AuthRequest
