export default function LandingPage() {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-6">
        Welcome to{' '}
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Promptly
        </span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
        The modern platform for managing prompts, ideas, and creative workflows. 
        Get started with your Gmail account and unlock your productivity potential.
      </p>
      <div className="flex justify-center space-x-8 text-sm text-gray-500 mb-12">
        <div className="flex items-center">
          Secure & Private
        </div>
        <div className="flex items-center">
          Fast & Reliable
        </div>
        <div className="flex items-center">
          Easy to Use
        </div>
      </div>
    </div>
  );
}
