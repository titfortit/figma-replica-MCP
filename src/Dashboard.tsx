import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'personas' | 'flows' | 'results'>('personas');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white border-b-2 border-black shadow-[0_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-4 py-2 border-2 border-black rounded-lg hover:bg-gray-100 transition font-bold"
                        >
                            ← Back
                        </button>
                        <h1 className="text-3xl font-bold">🎭 User Flow Testing Agent</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 bg-green-100 border-2 border-green-500 rounded-lg">
                            <span className="text-sm font-bold text-green-700">● Ready</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-8 py-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b-2 border-gray-300">
                    {(['personas', 'flows', 'results'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 font-bold transition-all border-b-4 ${activeTab === tab
                                    ? 'border-[#C7FF29] text-black'
                                    : 'border-transparent text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab === 'personas' && '👥 Personas'}
                            {tab === 'flows' && '🔄 Flows'}
                            {tab === 'results' && '📊 Results'}
                        </button>
                    ))}
                </div>

                {/* Personas Tab */}
                {activeTab === 'personas' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">User Personas</h2>
                            <button className="px-6 py-3 bg-[#C7FF29] border-2 border-black rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                                + Add Persona
                            </button>
                        </div>

                        {/* Placeholder Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { name: 'Sarah Chen', age: 28, tech: 'High', emoji: '👩‍💼' },
                                { name: 'Robert Smith', age: 65, tech: 'Low', emoji: '👴' },
                                { name: 'Maya Patel', age: 34, tech: 'Medium', emoji: '👩‍🔬' },
                            ].map((persona, i) => (
                                <div
                                    key={i}
                                    className="bg-white border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all"
                                >
                                    <div className="text-5xl mb-4">{persona.emoji}</div>
                                    <h3 className="text-xl font-bold mb-2">{persona.name}</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Age:</span>
                                            <span className="font-bold">{persona.age}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Tech Level:</span>
                                            <span className={`font-bold ${persona.tech === 'High' ? 'text-green-600' :
                                                    persona.tech === 'Low' ? 'text-red-600' : 'text-yellow-600'
                                                }`}>{persona.tech}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span className="text-xs text-gray-500 italic">Click to edit persona details</span>
                                    </div>
                                </div>
                            ))}

                            {/* Empty State */}
                            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                                <div className="text-4xl mb-3">➕</div>
                                <p className="text-gray-500 font-medium">Add more personas</p>
                                <p className="text-xs text-gray-400 mt-2">Up to 40 personas supported</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Flows Tab */}
                {activeTab === 'flows' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Figma Prototype Flows</h2>
                            <button className="px-6 py-3 bg-[#C7FF29] border-2 border-black rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                                + Import Figma Flow
                            </button>
                        </div>

                        {/* Upload Area */}
                        <div className="bg-white border-2 border-dashed border-gray-400 rounded-2xl p-12 text-center">
                            <div className="text-6xl mb-4">🎨</div>
                            <h3 className="text-xl font-bold mb-2">Import Figma Prototype</h3>
                            <p className="text-gray-600 mb-6">Paste your Figma prototype URL or upload flow definition</p>
                            <div className="flex gap-4 justify-center">
                                <input
                                    type="text"
                                    placeholder="https://figma.com/proto/..."
                                    className="px-4 py-3 border-2 border-gray-300 rounded-lg w-96 focus:outline-none focus:border-[#C7FF29]"
                                />
                                <button className="px-6 py-3 bg-black text-white border-2 border-black rounded-lg font-bold hover:bg-gray-800 transition">
                                    Import
                                </button>
                            </div>
                        </div>

                        {/* Flow Preview */}
                        <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-lg font-bold mb-4">Flow Preview</h3>
                            <div className="flex items-center gap-4 overflow-x-auto pb-4">
                                {['Homepage', 'Features', 'Pricing', 'Signup', 'Success'].map((screen, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4 min-w-[120px] text-center">
                                            <div className="text-2xl mb-2">📱</div>
                                            <div className="text-sm font-bold">{screen}</div>
                                        </div>
                                        {i < 4 && <div className="text-2xl">→</div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Tab */}
                {activeTab === 'results' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">Test Results</h2>
                            <button className="px-6 py-3 bg-[#C7FF29] border-2 border-black rounded-full font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all">
                                ▶ Run Test
                            </button>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Completion Rate', value: '73%', color: 'green' },
                                { label: 'Avg. Time', value: '2m 34s', color: 'blue' },
                                { label: 'Drop-offs', value: '8', color: 'red' },
                                { label: 'Personas Tested', value: '30', color: 'purple' },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="bg-white border-2 border-black rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                >
                                    <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                                    <div className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</div>
                                </div>
                            ))}
                        </div>

                        {/* Insights */}
                        <div className="bg-white border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <h3 className="text-lg font-bold mb-4">🎯 Key Insights</h3>
                            <div className="space-y-4">
                                {[
                                    { type: 'warning', text: 'Screen 3 (Payment): 8 personas abandoned - unclear pricing' },
                                    { type: 'error', text: 'Seniors (60+) struggled with small text on mobile' },
                                    { type: 'success', text: 'CTA placement excellent - 90% click rate across all personas' },
                                ].map((insight, i) => (
                                    <div
                                        key={i}
                                        className={`p-4 rounded-lg border-2 ${insight.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                                                insight.type === 'error' ? 'bg-red-50 border-red-400' :
                                                    'bg-green-50 border-green-400'
                                            }`}
                                    >
                                        <p className="font-medium">{insight.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
