import logoJpg from '../../assets/logo.jpg';
import { ArrowLeft } from 'lucide-react';
import { handleBackToMainSite } from '../../utils/navigation';

export default function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="w-full px-8 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={logoJpg} 
              alt="KK Labour Services" 
              className="h-10 w-auto rounded-lg"
            />
            <div className="ml-3">
              <p className="text-base text-blue-400 font-medium">Careers Portal</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center">
            <button 
              onClick={handleBackToMainSite}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors text-sm font-medium bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Main Site</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}