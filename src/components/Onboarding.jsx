import { useState } from 'react'

function Onboarding({ onComplete, apiUrl }) {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleNext = async () => {
    setError('')

    if (step === 1) {
      // Validate input
      if (!name.trim() || !email.trim()) {
        setError('Please fill in all fields')
        return
      }

      if (!email.includes('@')) {
        setError('Please enter a valid email')
        return
      }

      setStep(2)
    } else if (step === 2) {
      // Setup WebAuthn
      await setupBiometric()
    }
  }

  const setupBiometric = async () => {
    setIsLoading(true)
    setError('')

    try {
      // Check if WebAuthn is supported
      if (!window.PublicKeyCredential) {
        setError('Your browser does not support biometric authentication. Please use a modern browser.')
        setIsLoading(false)
        return
      }

      // Create WebAuthn credential
      const challenge = new Uint8Array(32)
      window.crypto.getRandomValues(challenge)

      const publicKeyOptions = {
        challenge: challenge,
        rp: {
          name: "Janus",
          id: window.location.hostname
        },
        user: {
          id: new Uint8Array(16),
          name: email,
          displayName: name,
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },  // ES256
          { alg: -257, type: "public-key" } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "none"
      }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyOptions
      })

      // Register with server
      const credentialId = Array.from(new Uint8Array(credential.rawId))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

      const response = await fetch(`${apiUrl}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          credentialId: credentialId,
          publicKey: 'webauthn-key-' + Date.now()
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Store credential ID for future use
        localStorage.setItem('janus_credentialId', credentialId)
        
        // Complete onboarding
        onComplete(data.userId, name)
      } else {
        setError(data.error || 'Registration failed. Please try again.')
      }
    } catch (err) {
      console.error('WebAuthn error:', err)
      
      if (err.name === 'NotAllowedError') {
        setError('Biometric authentication was cancelled')
      } else if (err.name === 'NotSupportedError') {
        setError('Your device does not support biometric authentication')
      } else {
        setError('Failed to setup biometric authentication: ' + err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="card">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Janus
          </h1>
          <p className="text-gray-600">
            Secure authentication in seconds
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            2
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              onClick={handleNext}
              className="btn-primary w-full"
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 2: Biometric Setup */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-6xl mb-4">👆</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Setup Biometric
              </h2>
              <p className="text-gray-600 mb-6">
                Use your Face ID or fingerprint to secure your account
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
              <strong>What happens next:</strong>
              <ul className="list-disc ml-4 mt-2 space-y-1">
                <li>Your browser will ask for biometric permission</li>
                <li>Use Face ID or fingerprint to confirm</li>
                <li>Done! Your account is secure</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="btn-secondary flex-1"
                disabled={isLoading}
              >
                ← Back
              </button>
              <button
                onClick={handleNext}
                className="btn-primary flex-1"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Setting up...
                  </span>
                ) : (
                  'Setup Biometric 🔒'
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-white text-sm">
        <p>Powered by Janus • Secure by Design</p>
      </div>
    </div>
  )
}

export default Onboarding
