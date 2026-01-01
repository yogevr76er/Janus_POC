function Dashboard({ userName, userId, onLogout, apiUrl }) {
  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600">
            Your Janus account is ready
          </p>
        </div>

        {/* Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Biometric authentication active
              </h3>
              <div className="mt-1 text-sm text-green-700">
                Your account is protected with Face ID / Fingerprint
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold text-gray-900">Active</p>
              </div>
              <div className="text-3xl">🟢</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Authentication Speed</p>
                <p className="text-lg font-semibold text-gray-900">~2 seconds</p>
              </div>
              <div className="text-3xl">⚡</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Security Level</p>
                <p className="text-lg font-semibold text-gray-900">Maximum</p>
              </div>
              <div className="text-3xl">🔒</div>
            </div>
          </div>
        </div>

        {/* Waiting for Auth */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="animate-pulse h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Waiting for authentication requests
              </h3>
              <div className="mt-1 text-sm text-blue-700">
                When you need to authenticate, you'll be notified here
              </div>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">How it works:</h3>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">1.</span>
              <span>You try to login or make a transaction somewhere</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">2.</span>
              <span>You'll see a request here to approve</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">3.</span>
              <span>Confirm with Face ID or fingerprint</span>
            </li>
            <li className="flex items-start">
              <span className="font-semibold text-blue-600 mr-2">4.</span>
              <span>Done! You're authenticated</span>
            </li>
          </ol>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all"
        >
          Logout
        </button>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-white text-sm">
        <p>User ID: {userId.substring(0, 8)}...</p>
        <p className="mt-1 opacity-75">Powered by Janus</p>
      </div>
    </div>
  )
}

export default Dashboard
