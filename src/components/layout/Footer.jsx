export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="w-full px-8 lg:px-16 py-4">
        <div className="text-center">
          <p className="text-gray-300 text-sm">
            © 2025 KK Labour Services. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Need help? Contact us at{" "}
            <a href="mailto:careers@kklabourservices.co.za" className="text-blue-400 hover:text-blue-300 transition-colors">
              careers@kklabourservices.co.za
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}