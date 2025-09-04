import { Link } from 'react-router-dom';
import Footer from './Footer';

function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle login logic
    console.log('Login submitted');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-light text-gray-800 tracking-wider">IncTra</h1>
            <div className="w-24 h-0.5 bg-blue-500 mx-auto mt-2"></div>
            <p className="text-gray-500 mt-3">Easy to use Incident Tracker</p>
          </div>

          {/* Login Card */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="mb-6">
              <h2 className="text-2xl font-medium text-gray-800 relative">
                <span className="absolute -left-4 top-1 h-6 w-1 bg-blue-500"></span>
                Login
              </h2>
            </div>

            <form action="/api/login" method="POST">
              <div className="mb-4">
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 transition-colors duration-300"
              >
                Login
              </button>
            </form>

            <p className="text-sm text-center text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Login;
