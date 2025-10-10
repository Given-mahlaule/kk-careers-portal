import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const navigate = useNavigate();

  const handleNewApplication = () => {
    navigate('/');
  };

  const handleBackToMain = () => {
    window.location.href = 'https://given-mahlaule.github.io/kk-labour-services/';
  };

  return (
    <Layout>
      <Container variant="narrow">
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your interest in working with KK Labour Services. 
            We have received your application and will review it shortly.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            You should receive a confirmation email within the next few minutes. 
            If you don't see it, please check your spam folder.
          </p>
          <div className="space-y-4">
            <Button
              onClick={handleNewApplication}
              variant="outline"
            >
              Submit Another Application
            </Button>
            <div>
              <Button
                onClick={handleBackToMain}
                className="text-sm"
              >
                ← Return to Main Website
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
}