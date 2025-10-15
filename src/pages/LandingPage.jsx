import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Users, Briefcase, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

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
                  onClick={() => navigate('/login')}
                  className="w-full py-4 text-lg font-semibold bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Users className="w-5 h-5 mr-3" />
                  Yes, I have a profile - Sign In
                  <ArrowRight className="w-5 h-5 ml-3" />
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => navigate('/signup')}
                  className="w-full py-4 text-lg font-semibold border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Briefcase className="w-5 h-5 mr-3" />
                  No, create new profile - Sign Up
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