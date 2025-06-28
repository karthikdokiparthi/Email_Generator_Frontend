import axios from "axios";
import { useState } from "react";

function App() {
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [user, setUser] = useState({
    emailContent: '',
    tone: 'professional'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setGeneratedReply('');
    setCopied(false);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/email/response",
        user
      );
      setGeneratedReply(response.data);
    } catch (error) {
      console.error("API Error:", error);
      setError(error.response?.data || "Failed to generate email");
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = () => {
    if (!generatedReply) return;
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const clearForm = () => {
    setUser({ emailContent: '', tone: 'professional' });
    setGeneratedReply('');
    setError('');
    setCopied(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 py-5 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Auto Email Reply Generator
          </h1>
          <p className="text-lg text-gray-200 max-w-xl mx-auto">
            Create professional email responses in seconds
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Form Section */}
            <div className="p-6 md:p-8 border-r border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Compose Email</h2>
                <button
                  onClick={clearForm}
                  className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-2">
                    Original Email Content
                  </label>
                  <textarea
                    name="emailContent"
                    value={user.emailContent}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Paste the email you received here..."
                    required
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-gray-700 font-medium mb-2">
                    Select Tone
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'formal', label: 'Formal' },
                      { value: 'professional', label: 'Professional' },
                      { value: 'casual', label: 'Casual' },
                      { value: 'friendly', label: 'Friendly' }
                    ].map((tone) => (
                      <label
                        key={tone.value}
                        className={`flex items-center justify-center cursor-pointer p-3 rounded-lg border transition-all ${user.tone === tone.value
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-indigo-300 text-gray-700'
                          }`}
                      >
                        <input
                          type="radio"
                          name="tone"
                          value={tone.value}
                          checked={user.tone === tone.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{tone.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 shadow hover:shadow-lg'
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    'Generate Email Reply'
                  )}
                </button>
              </form>
            </div>

            {/* Result Section */}
            <div className="bg-gray-50 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Generated Email</h2>
                <button
                  onClick={copyToClipboard}
                  disabled={!generatedReply}
                  className={`text-sm py-1 px-3 rounded flex items-center ${generatedReply
                    ? 'bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {error ? (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                  <p className="font-medium">Error</p>
                  <p>{error}</p>
                </div>
              ) : generatedReply ? (
                <div className="bg-white p-5 rounded-lg shadow-inner min-h-[250px]">
                  <div className="whitespace-pre-wrap text-gray-800">
                    {generatedReply}
                  </div>
                </div>
              ) : loading ? (
                <div className="flex items-center justify-center min-h-[250px] bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-indigo-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-gray-600 font-medium">Generating your response...</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[250px] bg-gray-100 rounded-lg p-6 text-center">
                  <div className="bg-indigo-100 p-4 rounded-full mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Your Generated Email</h3>
                  <p className="text-gray-600 max-w-md">
                    Fill out the form to generate a professional email response
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
            Error: {error}
          </div>
        )}

        <div className="mt-12 text-center text-sm text-gray-100">
          <p>Auto Email Generator &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
}

export default App;