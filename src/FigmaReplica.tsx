import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logCTAClick, signupUser, signinUser } from './firebase';

export default function FigmaReplica() {
    const navigate = useNavigate();
    const [compassKey, setCompassKey] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    // Auth modal state
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
    const [authName, setAuthName] = useState('');
    const [authEmail, setAuthEmail] = useState('');
    const [authError, setAuthError] = useState('');
    const [authSuccess, setAuthSuccess] = useState('');
    const [shakeField, setShakeField] = useState<'name' | 'email' | null>(null);
    // Logged in user state
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

    // Load logged-in state from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('loggedInUser');
        if (savedUser) {
            setLoggedInUser(savedUser);
        }
    }, []);

    // Sign up handler
    const handleSignup = async () => {
        setAuthError('');
        setAuthSuccess('');
        setShakeField(null);

        // Check for empty name field
        if (!authName) {
            setShakeField('name');
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        // Check for empty email field
        if (!authEmail) {
            setShakeField('email');
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        // Validate email format
        if (!authEmail.includes('@')) {
            setAuthError('Please enter a valid email address');
            setShakeField('email');
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        const result = await signupUser(authName, authEmail);
        if (result.success) {
            // Save to localStorage and update state
            localStorage.setItem('loggedInUser', authName);
            setLoggedInUser(authName);
            setAuthName('');
            setAuthEmail('');
            setAuthSuccess(result.message);
            setTimeout(() => setShowAuthModal(false), 1500);
        } else {
            setAuthError(result.message);
        }
    };

    // Sign in handler
    const handleSignin = async () => {
        setAuthError('');
        setAuthSuccess('');
        setShakeField(null);

        // Check for empty email field
        if (!authEmail) {
            setShakeField('email');
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        // Validate email format
        if (!authEmail.includes('@')) {
            setAuthError('Please enter a valid email address');
            setShakeField('email');
            setTimeout(() => setShakeField(null), 500);
            return;
        }

        const result = await signinUser(authEmail);
        if (result.success && result.name) {
            // Save to localStorage and update state
            localStorage.setItem('loggedInUser', result.name);
            setLoggedInUser(result.name);
            setAuthEmail('');
            setAuthSuccess(result.message);
            setTimeout(() => setShowAuthModal(false), 1500);
        } else {
            setAuthError(result.message);
        }
    };

    // Logout handler
    const handleLogout = () => {
        localStorage.removeItem('loggedInUser');
        setLoggedInUser(null);
    };

    return (
        <div className="bg-[#f9f9f9] relative size-full min-h-screen flex items-center justify-center">



            {/* AUTH MODAL (Sign In / Sign Up) */}
            {showAuthModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 animate-[fade-in_0.2s_ease-out]"
                    style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }}
                    onClick={() => setShowAuthModal(false)}
                >
                    <div
                        className="bg-white rounded-[24px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-[popup-bounce_0.4s_ease-out] relative"
                        style={{ padding: isMobile ? '40px 28px' : '56px 72px', maxWidth: isMobile ? '360px' : '560px', fontFamily: 'Inter, sans-serif' }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close */}
                        <button
                            onClick={() => setShowAuthModal(false)}
                            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
                            aria-label="Close"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15 5L5 15M5 5L15 15" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>

                        {/* Tabs */}
                        <div className="flex gap-4 mb-8 border-b-2 border-gray-200">
                            <button
                                className={`flex-1 pb-3 font-bold transition-all ${authMode === 'signup' ? 'border-b-4 border-[#C7FF29] text-black' : 'text-gray-400'}`}
                                onClick={() => {
                                    setAuthMode('signup');
                                    setAuthError('');
                                    setAuthSuccess('');
                                }}
                            >
                                Sign Up
                            </button>
                            <button
                                className={`flex-1 pb-3 font-bold transition-all ${authMode === 'signin' ? 'border-b-4 border-[#C7FF29] text-black' : 'text-gray-400'}`}
                                onClick={() => {
                                    setAuthMode('signin');
                                    setAuthError('');
                                    setAuthSuccess('');
                                }}
                            >
                                Sign In
                            </button>
                        </div>

                        <h2 className="font-bold mb-6 text-center" style={{ fontSize: isMobile ? '20px' : '24px', color: '#1A1D1C' }}>
                            {authMode === 'signup' ? 'Create Account' : 'Welcome Back'}
                        </h2>

                        {/* Error/Success Messages */}
                        {authError && (
                            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                                {authError}
                            </div>
                        )}
                        {authSuccess && (
                            <div className="bg-green-50 border-2 border-green-300 text-green-700 px-4 py-2 rounded mb-4 text-sm">
                                {authSuccess}
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            {authMode === 'signup' && (
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={authName}
                                    onChange={e => setAuthName(e.target.value)}
                                    className={`border-2 rounded-lg px-4 py-3 focus:outline-none transition ${shakeField === 'name'
                                        ? 'border-red-500 animate-[shake_0.5s_ease-in-out]'
                                        : 'border-gray-300 focus:border-[#C7FF29]'
                                        }`}
                                />
                            )}
                            <input
                                type="email"
                                placeholder="Your Email"
                                value={authEmail}
                                onChange={e => setAuthEmail(e.target.value)}
                                className={`border-2 rounded-lg px-4 py-3 focus:outline-none transition ${shakeField === 'email'
                                    ? 'border-red-500 animate-[shake_0.5s_ease-in-out]'
                                    : 'border-gray-300 focus:border-[#C7FF29]'
                                    }`}
                            />
                            <button
                                onClick={authMode === 'signup' ? handleSignup : handleSignin}
                                className="border-2 border-black rounded-full font-bold text-black py-3 transition-all"
                                style={{
                                    backgroundColor: '#C7FF29',
                                    boxShadow: '5px 5px 0px 0px rgba(0, 0, 0, 1)',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#E2FF91';
                                    e.currentTarget.style.boxShadow = '8px 8px 0px 0px rgba(0, 0, 0, 1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#C7FF29';
                                    e.currentTarget.style.boxShadow = '5px 5px 0px 0px rgba(0, 0, 0, 1)';
                                }}
                            >
                                {authMode === 'signup' ? 'Sign Up' : 'Sign In'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Browser Window Container */}
            <div
                className={`bg-white overflow-hidden rounded-[12px] shadow-[0_24px_48px_rgba(0,0,0,0.15)] transition-all duration-300 animate-[bounce-in_0.8s_ease-out_forwards] ${isMobile ? 'w-[375px] h-[667px]' : 'w-[1280px] h-[784px]'
                    }`}
            >
                {/* Safari Browser Chrome */}
                <div className="bg-[#f6f6f6] border-b border-gray-300">
                    {/* Window Controls & Toolbar */}
                    <div className="flex items-center px-3 py-2.5">
                        {/* Traffic Lights (macOS style) */}
                        <div className="flex gap-2 mr-4">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                            <div className="w-3 h-3 rounded-full bg-[#28CA42]" />
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex gap-2 mr-3">
                            <button className="w-7 h-7 flex items-center justify-center hover:bg-black/5 rounded transition">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M7 2L3 6L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="w-7 h-7 flex items-center justify-center hover:bg-black/5 rounded transition">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M5 2L9 6L5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Search/URL Bar */}
                        <div className="flex-1 bg-white rounded-md px-3 py-1.5 flex items-center gap-2 shadow-sm">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-400">
                                <path d="M6 1C6 1 6 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1Z" stroke="currentColor" strokeWidth="1.2" />
                                <rect x="4.5" y="5.5" width="3" height="1" rx="0.5" fill="currentColor" />
                            </svg>
                            <span className="text-[13px] text-gray-700 flex-1">Figma X Cursor</span>
                            <button
                                onClick={() => setIsMobile(!isMobile)}
                                className="w-5 h-5 flex items-center justify-center hover:bg-black/5 rounded transition"
                                title={isMobile ? "Desktop View" : "Mobile View"}
                            >
                                {isMobile ? (
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <rect x="1" y="3" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
                                        <line x1="4" y1="13" x2="10" y2="13" stroke="currentColor" strokeWidth="1.2" />
                                    </svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <rect x="4" y="1" width="6" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
                                        <circle cx="7" cy="11" r="0.6" fill="currentColor" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        {/* Toolbar Icons */}
                        <div className="flex gap-2 ml-3">
                            <button className="w-7 h-7 flex items-center justify-center hover:bg-black/5 rounded transition">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <rect x="3" y="5" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
                                    <path d="M5 5V4C5 2.89543 5.89543 2 7 2H9C10.1046 2 11 2.89543 11 4V5" stroke="currentColor" strokeWidth="1.2" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div
                    className={`flex flex-col items-center justify-center transition-all relative ${isMobile ? 'gap-8 p-6' : 'gap-16 px-48 py-16'
                        }`}
                    style={{
                        height: isMobile ? 'calc(100% - 52px)' : 'calc(100% - 52px)',
                        backgroundColor: '#f3f7ff',
                        backgroundImage: `
              linear-gradient(rgba(200, 220, 255, 0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200, 220, 255, 0.15) 1px, transparent 1px)
            `,
                        backgroundSize: '40px 40px',
                        backgroundPosition: 'center center'
                    }}
                >
                    {/* Sign Up CTA / User Profile - Top Right of Frame */}
                    <button
                        className={`absolute border-2 border-black rounded-full font-bold text-black text-center transition-all ${isMobile ? 'top-2 right-2 px-3 py-1.5 text-xs' : 'top-4 right-4 px-6 py-3 text-base'}`}
                        style={{
                            fontFamily: 'Inter, sans-serif',
                            backgroundColor: '#C7FF29',
                            borderWidth: '2px',
                            boxShadow: '5px 5px 0px 0px rgba(0, 0, 0, 1)',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#E2FF91';
                            e.currentTarget.style.boxShadow = '8px 8px 0px 0px rgba(0, 0, 0, 1)';
                            e.currentTarget.style.transform = 'translate(-3px, -3px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#C7FF29';
                            e.currentTarget.style.boxShadow = '5px 5px 0px 0px rgba(0, 0, 0, 1)';
                            e.currentTarget.style.transform = 'translate(0, 0)';
                        }}
                        onClick={() => loggedInUser ? handleLogout() : setShowAuthModal(true)}
                        title={loggedInUser ? 'Click to logout' : 'Sign up'}
                    >
                        {loggedInUser ? (
                            <span>👋 {loggedInUser} • Logout</span>
                        ) : (
                            <span>Sign Up</span>
                        )}
                    </button>

                    {/* Components Row */}
                    <div className={`flex items-center ${isMobile ? 'flex-col gap-8' : 'gap-20'}`}>
                        {/* Compass Component - Exact Figma Design */}
                        <div
                            className="relative cursor-pointer flex-shrink-0"
                            style={{
                                width: isMobile ? '120px' : '142px',
                                height: isMobile ? '120px' : '142px',
                                filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.08))'
                            }}
                            onClick={() => setCompassKey(k => k + 1)}
                        >
                            {/* Using exact Figma SVG design */}
                            <svg
                                className="w-full h-full"
                                viewBox="0 0 600 600"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Background Circle */}
                                <circle cx="300" cy="300" r="300" fill="#FCFAFE" />

                                {/* Direction Labels */}
                                {/* W - West */}
                                <path d="M62.4348 303.835L68.005 284.252H70.7034L69.1422 291.866L63.1479 312.316H60.4688L62.4348 303.835ZM56.6718 284.252L61.1048 303.45L62.4348 312.316H59.7749L52.9711 284.252H56.6718ZM77.912 303.43L82.2487 284.252H85.9686L79.1841 312.316H76.5242L77.912 303.43ZM71.1082 284.252L76.5242 303.835L78.4902 312.316H75.8111L70.0288 291.866L68.4483 284.252H71.1082Z" fill="#AEABB1" />

                                {/* E - East */}
                                <path d="M542.921 309.29V312.316H528.061V309.29H542.921ZM528.812 284.252V312.316H525.092V284.252H528.812ZM540.955 296.318V299.344H528.061V296.318H540.955ZM542.728 284.252V287.298H528.061V284.252H542.728Z" fill="#AEABB1" />

                                {/* S - South */}
                                <path d="M302.706 546.012C302.706 545.357 302.603 544.779 302.397 544.278C302.205 543.764 301.858 543.301 301.357 542.89C300.868 542.479 300.187 542.087 299.314 541.714C298.453 541.342 297.36 540.963 296.037 540.577C294.649 540.166 293.396 539.71 292.279 539.209C291.161 538.695 290.203 538.11 289.407 537.455C288.61 536.799 288 536.048 287.576 535.199C287.152 534.351 286.94 533.381 286.94 532.289C286.94 531.197 287.164 530.188 287.614 529.263C288.064 528.338 288.706 527.535 289.542 526.854C290.39 526.16 291.398 525.62 292.568 525.235C293.737 524.849 295.041 524.656 296.48 524.656C298.588 524.656 300.374 525.061 301.839 525.871C303.316 526.667 304.441 527.715 305.212 529.012C305.982 530.297 306.368 531.672 306.368 533.137H302.667C302.667 532.083 302.442 531.152 301.993 530.342C301.543 529.52 300.862 528.878 299.95 528.415C299.037 527.94 297.881 527.702 296.48 527.702C295.157 527.702 294.065 527.901 293.204 528.299C292.343 528.698 291.7 529.237 291.276 529.918C290.865 530.599 290.659 531.377 290.659 532.251C290.659 532.842 290.782 533.381 291.026 533.87C291.283 534.345 291.675 534.788 292.201 535.199C292.741 535.611 293.422 535.99 294.244 536.337C295.08 536.684 296.076 537.018 297.232 537.339C298.825 537.789 300.2 538.29 301.357 538.842C302.513 539.395 303.464 540.018 304.209 540.712C304.967 541.393 305.526 542.17 305.886 543.044C306.259 543.905 306.445 544.882 306.445 545.974C306.445 547.117 306.214 548.152 305.751 549.077C305.289 550.002 304.627 550.792 303.766 551.448C302.905 552.103 301.871 552.611 300.663 552.97C299.468 553.317 298.131 553.491 296.654 553.491C295.356 553.491 294.077 553.311 292.818 552.951C291.572 552.591 290.435 552.052 289.407 551.332C288.392 550.612 287.576 549.726 286.959 548.672C286.355 547.606 286.053 546.372 286.053 544.972H289.754C289.754 545.935 289.94 546.764 290.313 547.458C290.685 548.139 291.193 548.704 291.835 549.154C292.491 549.604 293.229 549.938 294.052 550.156C294.887 550.362 295.754 550.465 296.654 550.465C297.952 550.465 299.05 550.285 299.95 549.925C300.849 549.565 301.53 549.051 301.993 548.383C302.468 547.715 302.706 546.925 302.706 546.012Z" fill="#AEABB1" />

                                {/* N - North */}
                                <path d="M306.018 43.463V71.5263H302.279L288.151 49.8813V71.5263H284.431V43.463H288.151L302.337 65.1658V43.463H306.018Z" fill="#1A1D1C" />

                                {/* Compass Needle - Green circles forming vertical line */}
                                <g key={compassKey} className="animate-[compass-spin_4s_ease-in-out_forwards]" style={{ transformOrigin: '300px 300px' }}>
                                    <circle cx="298.026" cy="219.079" r="13.8158" fill="#C7FF29" />
                                    <circle cx="298.026" cy="246.711" r="13.8158" fill="#C7FF29" />
                                    <circle cx="298.026" cy="274.342" r="13.8158" fill="#C7FF29" />
                                    <circle cx="298.026" cy="301.974" r="13.8158" fill="#C7FF29" />
                                    <circle cx="298.026" cy="329.605" r="13.8158" fill="#C7FF29" />
                                    <circle cx="298.026" cy="357.237" r="13.8158" fill="#C7FF29" />
                                    <circle cx="298.026" cy="384.868" r="13.8158" fill="#C7FF29" />
                                    <circle cx="270.395" cy="246.711" r="13.8158" fill="#C7FF29" />
                                    <circle cx="242.763" cy="274.342" r="13.8158" fill="#C7FF29" />
                                    <circle cx="353.289" cy="274.342" r="13.8158" fill="#C7FF29" />
                                    <circle cx="325.658" cy="246.711" r="13.8158" fill="#C7FF29" />
                                </g>
                            </svg>
                        </div>

                        {/* Record/SB Component */}
                        <div className="relative flex-shrink-0" style={{ width: isMobile ? '120px' : '142px', height: isMobile ? '120px' : '142px', filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.08))' }}>
                            <div
                                className="absolute inset-0 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
                                style={{
                                    background: 'linear-gradient(180deg, rgb(213, 220, 228) 0%, rgb(255, 255, 255) 100%)',
                                    border: '12px solid #FFFFFF'
                                }}
                            >
                                {/* SB Text - Using exact Figma specs */}
                                <div className="flex items-center justify-center" style={{
                                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                                    fontSize: isMobile ? '32px' : '38px',
                                    fontWeight: 700,
                                    color: '#1F2937',
                                    letterSpacing: '-0.02em'
                                }}>
                                    SB
                                </div>
                            </div>
                        </div>

                        {/* Weather Component - Cloud with Rain */}
                        <div className="relative rounded-full flex-shrink-0 flex items-center justify-center" style={{
                            width: isMobile ? '120px' : '142px',
                            height: isMobile ? '120px' : '142px',
                            backgroundColor: '#FCFAFE',
                            filter: 'drop-shadow(0 8px 24px rgba(0, 0, 0, 0.08))'
                        }}>
                            <div className="relative" style={{ width: '60%', height: '60%' }}>
                                <svg width="100%" height="100%" viewBox="0 0 109 109" fill="none">
                                    {/* Cloud pixels */}
                                    {[
                                        [34, 26], [34, 36], [54, 36], [54, 26], [54, 46], [54, 56], [54, 66],
                                        [74, 36], [74, 26], [74, 16], [74, 46], [74, 56], [74, 66],
                                        [94, 36], [104, 36], [94, 26], [94, 46], [104, 46], [94, 56], [104, 56], [94, 66],
                                        [34, 46], [14, 46], [14, 36], [14, 56], [14, 66], [34, 56], [34, 66],
                                        [24, 26], [24, 36], [44, 36], [44, 46], [44, 56], [44, 66],
                                        [64, 36], [64, 26], [64, 16], [64, 46], [64, 56], [64, 66],
                                        [84, 36], [84, 26], [84, 16], [84, 46], [84, 56], [84, 66],
                                        [24, 46], [4, 46], [4, 56], [24, 56], [24, 66]
                                    ].map(([x, y], i) => (
                                        <circle key={i} cx={x} cy={y} r="4.3" fill="#C7FF29" />
                                    ))}

                                    {/* Animated raindrops */}
                                    {[
                                        [31, 95, 0], [55, 95, 0.3], [80, 95, 0.6],
                                        [31, 84, 0], [55, 84, 0.3], [80, 84, 0.6]
                                    ].map(([x, y, delay], i) => (
                                        <circle
                                            key={`rain-${i}`}
                                            cx={x}
                                            cy={y}
                                            r="4.3"
                                            fill="#C7FF29"
                                            className="animate-[rain-drop_2s_ease-in-out_infinite]"
                                            style={{ animationDelay: `${delay}s` }}
                                        />
                                    ))}
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Big CTA Button - Exact Figma Design */}
                    <button
                        className={`border-2 border-black rounded-full font-bold text-black text-center transition-all ${isMobile ? 'px-12 py-3 text-base' : 'text-[28px]'
                            }`}
                        style={{
                            fontFamily: 'Inter, sans-serif',
                            backgroundColor: isHovered ? '#E2FF91' : '#C7FF29',
                            padding: isMobile ? '12px 48px' : '28px 80px',
                            borderRadius: '50.27px',
                            borderWidth: '2px',
                            boxShadow: isHovered ? '8px 8px 0px 0px rgba(0, 0, 0, 1)' : '5px 5px 0px 0px rgba(0, 0, 0, 1)',
                            transform: isHovered ? 'translate(-3px, -3px)' : 'translate(0, 0)',
                        }}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onClick={() => {
                            logCTAClick();
                            navigate('/dashboard');
                        }}
                    >
                        Start User Testing
                    </button>
                </div>
            </div>

            {/* Popup Modal */}
            {showPopup && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 animate-[fade-in_0.2s_ease-out]"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(8px)' }}
                    onClick={() => setShowPopup(false)}
                >
                    <div
                        className="bg-white rounded-[24px] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-[popup-bounce_0.4s_ease-out] relative"
                        style={{
                            padding: isMobile ? '32px 24px' : '48px 64px',
                            maxWidth: isMobile ? '320px' : '480px',
                            fontFamily: 'Inter, sans-serif'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowPopup(false)}
                            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Close"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M15 5L5 15M5 5L15 15" stroke="#000" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>

                        {/* Content */}
                        <div className="text-center">
                            <h2
                                className="font-bold mb-3"
                                style={{
                                    fontSize: isMobile ? '28px' : '36px',
                                    color: '#1A1D1C',
                                    lineHeight: '1.2'
                                }}
                            >
                                This CTA does nothing
                            </h2>
                            <p
                                className="text-gray-600"
                                style={{
                                    fontSize: isMobile ? '16px' : '20px',
                                    lineHeight: '1.5'
                                }}
                            >
                                Nothing at all.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: translateY(30px);
            filter: blur(8px);
          }
          50% {
            opacity: 1;
            transform: translateY(-10px);
            filter: blur(4px);
          }
          70% {
            transform: translateY(5px);
            filter: blur(2px);
          }
          85% {
            transform: translateY(-3px);
            filter: blur(1px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        @keyframes compass-spin {
          0% { transform: rotate(0deg); }
          20% { transform: rotate(180deg); }
          40% { transform: rotate(360deg); }
          60% { transform: rotate(180deg); }
          80% { transform: rotate(90deg); }
          100% { transform: rotate(0deg); }
        }
        
        @keyframes rain-drop {
          0%, 100% { opacity: 1; transform: translateY(0); }
          50% { opacity: 0.3; transform: translateY(8px); }
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes popup-bounce {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          50% {
            opacity: 1;
            transform: scale(1.02) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
        </div>
    );
}
