import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="w-full max-w-7xl px-6 pt-20 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center">
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 animate-fade-in">
          Automate Your Client Welcome
        </span>
        <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-7xl max-w-4xl transition-all duration-700 ease-out transform">
          Client Onboarding <span className="text-indigo-600 dark:text-indigo-400">Simplified</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-all duration-700 delay-100">
          OnboardFlow gives your service business a professional, automated hub to welcome new clients, collect documents, and track progress — all in one place.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-200">
          <Link
            to="/signup"
            className="rounded-md bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all hover:scale-105 active:scale-95"
          >
            Get Started for Free
          </Link>
          <Link
            to="/login"
            className="rounded-md bg-gray-100 dark:bg-gray-800 px-8 py-4 text-lg font-semibold text-gray-900 dark:text-white shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:scale-105 active:scale-95"
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full bg-gray-50 dark:bg-gray-800/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl">Everything you need to scale</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Ditch the spreadsheets and fragmented tools.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Custom Templates</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Create reusable checklists and email templates tailored to each service you offer.</p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Document Signing</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Seamlessly manage contracts and essential paperwork in one unified onboarding flow.</p>
            </div>
            <div className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Progress Tracking</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Keep clients and your team on the same page with clear, real-time completion tracking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold sm:text-4xl text-center mb-16">How it works</h2>
          <div className="space-y-12">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="text-xl font-bold">Set up your templates</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Define your standard onboarding steps and welcome emails once.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="text-xl font-bold">Add a new client</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Just enter their name and email to get started.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="text-xl font-bold">Launch the flow</h4>
                <p className="mt-2 text-gray-600 dark:text-gray-400">One click to send the welcome email and start the checklist. Done.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full bg-gray-50 dark:bg-gray-800/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold sm:text-4xl text-gray-900 dark:text-white">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Start for free and scale as you grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter */}
            <div className="flex flex-col p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Starter</h3>
              <p className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span className="text-4xl font-extrabold tracking-tight">$29</span>
                <span className="ml-1 text-xl font-semibold text-gray-500">/mo</span>
              </p>
              <p className="mt-6 text-gray-500 dark:text-gray-400">Perfect for freelancers and small agencies.</p>
              <ul className="mt-6 space-y-4 flex-1">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Up to 10 clients/month
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Custom checklists
                </li>
              </ul>
              <Link to="/signup" className="mt-8 block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors">Start Starter</Link>
            </div>
            {/* Growth */}
            <div className="flex flex-col p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-indigo-600 transform scale-105 z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Growth</h3>
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full uppercase">Most Popular</span>
              </div>
              <p className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span className="text-4xl font-extrabold tracking-tight">$59</span>
                <span className="ml-1 text-xl font-semibold text-gray-500">/mo</span>
              </p>
              <p className="mt-6 text-gray-500 dark:text-gray-400">Ideal for growing teams and agencies.</p>
              <ul className="mt-6 space-y-4 flex-1">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Up to 50 clients/month
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Unlimited templates
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Document tracking
                </li>
              </ul>
              <Link to="/signup" className="mt-8 block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors">Go Growth</Link>
            </div>
            {/* Pro */}
            <div className="flex flex-col p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pro</h3>
              <p className="mt-4 flex items-baseline text-gray-900 dark:text-white">
                <span className="text-4xl font-extrabold tracking-tight">$99</span>
                <span className="ml-1 text-xl font-semibold text-gray-500">/mo</span>
              </p>
              <p className="mt-6 text-gray-500 dark:text-gray-400">For established firms with high volume.</p>
              <ul className="mt-6 space-y-4 flex-1">
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Unlimited clients
                </li>
                <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Priority support
                </li>
              </ul>
              <Link to="/signup" className="mt-8 block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors">Get Pro</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full py-24 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl mb-8">Ready to transform your client experience?</h2>
        <Link
          to="/signup"
          className="rounded-md bg-indigo-600 px-10 py-5 text-xl font-bold text-white shadow-lg hover:bg-indigo-500 transition-all hover:scale-105"
        >
          Get Started for Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="w-full bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">OnboardFlow</span>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Client onboarding, simplified.</p>
          </div>
          <div className="flex gap-8">
            <Link to="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600">Log In</Link>
            <Link to="/signup" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600">Sign Up</Link>
            <Link to="/pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600">Pricing</Link>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
            &copy; {new Date().getFullYear()} OnboardFlow. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}
