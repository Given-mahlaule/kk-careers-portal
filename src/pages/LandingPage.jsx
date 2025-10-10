import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Users, Briefcase, ArrowRight, Mail, Lock } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      // Here you would typically validate credentials with your backend
      console.log('Login attempt:', loginData);
      // For now, just navigate to the application form
      navigate('/application');
    }
  };

  const handleInputChange = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateProfile = () => {
    navigate('/application');
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-600">
                  Sign in to your existing profile
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                  <Mail className="absolute left-3 top-8 text-gray-400 w-5 h-5 z-10" />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className="pl-10"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-8 text-gray-400 w-5 h-5 z-10" />
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={loginData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-4 pt-2">
                  <Button type="submit" className="w-full py-3 text-lg font-semibold">
                    Sign In
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full py-3"
                    onClick={() => setShowLogin(false)}
                  >
                    Back to Options
                  </Button>
                </div>
              </form>

              <div className="mt-8 text-center pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={handleCreateProfile}
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    Create a profile
                  </button>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl">
                <Briefcase className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-6">
              Join Our Team
            </h1>
            <p className="text-xl text-blue-100 mb-4 max-w-2xl mx-auto leading-relaxed">
              Start your career journey with KK Labour Services
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto">
              We're looking for talented professionals to join our growing team. 
              Whether you're experienced or just starting out, we have opportunities for you.
            </p>
          </div>

          {/* Main CTA Card */}
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm max-w-2xl mx-auto">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Ready to Get Started?
                </h2>
                <p className="text-gray-600 font-medium">
                  Do you already have a profile with us?
                </p>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => setShowLogin(true)}
                  className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Yes, I have a profile
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={handleCreateProfile}
                  className="w-full py-4 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Briefcase className="w-5 h-5 mr-3" />
                  No, create new profile
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
              </div>

              <div className="mt-8 text-center pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 leading-relaxed">
                  By proceeding, you agree to our{' '}
                  <span className="text-blue-600 font-medium">terms of service</span> and{' '}
                  <span className="text-blue-600 font-medium">privacy policy</span>.
                </p>
              </div>
            </div>
          </Card>

          {/* Bottom Text */}
          <div className="text-center mt-12">
            <p className="text-blue-200 text-sm">
              Questions? Contact us at{' '}
              <span className="text-white font-medium">careers@kklabourservices.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}