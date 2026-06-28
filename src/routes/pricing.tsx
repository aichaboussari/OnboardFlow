import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

function PricingPage() {
  const tiers = [
    {
      name: "Starter",
      price: "29",
      description: "Perfect for freelancers and small agencies.",
      features: [
        "Up to 10 clients/month",
        "Custom checklists",
        "Unlimited email templates",
        "Community support",
      ],
      cta: "Start Starter",
      popular: false,
    },
    {
      name: "Growth",
      price: "59",
      description: "Ideal for growing teams and agencies.",
      features: [
        "Up to 50 clients/month",
        "Everything in Starter",
        "Document tracking",
        "Basic reporting",
        "Email support",
      ],
      cta: "Go Growth",
      popular: true,
    },
    {
      name: "Pro",
      price: "99",
      description: "For established firms with high volume.",
      features: [
        "Unlimited clients",
        "Everything in Growth",
        "Priority 24/7 support",
        "Advanced analytics",
        "API access",
      ],
      cta: "Get Pro",
      popular: false,
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white pb-20">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">OnboardFlow</Link>
        <div className="flex gap-6 items-center">
          <Link to="/login" className="text-sm font-medium hover:text-indigo-600">Log In</Link>
          <Link to="/signup" className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-indigo-500 transition-colors">Sign Up</Link>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl font-extrabold sm:text-5xl">Plans for every stage of growth</h1>
        <p className="mt-6 text-xl text-gray-600 dark:text-gray-400">Choose the plan that fits your business needs. Upgrade or downgrade at any time.</p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div 
            key={tier.name}
            className={`flex flex-col p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border ${
              tier.popular 
                ? "border-2 border-indigo-600 shadow-xl scale-105 z-10" 
                : "border-gray-100 dark:border-gray-700"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{tier.name}</h3>
              {tier.popular && (
                <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full uppercase">Most Popular</span>
              )}
            </div>
            <p className="flex items-baseline mb-6">
              <span className="text-4xl font-extrabold tracking-tight">${tier.price}</span>
              <span className="ml-1 text-xl font-semibold text-gray-500">/mo</span>
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-8">{tier.description}</p>
            
            <ul className="space-y-4 mb-10 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center text-sm">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <Link 
              to="/signup" 
              className={`block w-full py-3 px-4 rounded-lg text-center font-bold transition-all ${
                tier.popular 
                  ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </section>

      {/* Feature Comparison */}
      <section className="max-w-4xl mx-auto px-6 mt-24">
        <h2 className="text-3xl font-bold text-center mb-12">Detailed Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-4 font-bold">Feature</th>
                <th className="py-4 font-bold px-4">Starter</th>
                <th className="py-4 font-bold px-4">Growth</th>
                <th className="py-4 font-bold px-4">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
              <tr>
                <td className="py-4">Clients / Month</td>
                <td className="py-4 px-4">10</td>
                <td className="py-4 px-4">50</td>
                <td className="py-4 px-4">Unlimited</td>
              </tr>
              <tr>
                <td className="py-4">Custom Checklists</td>
                <td className="py-4 px-4">Check</td>
                <td className="py-4 px-4">Check</td>
                <td className="py-4 px-4">Check</td>
              </tr>
              <tr>
                <td className="py-4">Email Templates</td>
                <td className="py-4 px-4">Check</td>
                <td className="py-4 px-4">Check</td>
                <td className="py-4 px-4">Check</td>
              </tr>
              <tr>
                <td className="py-4">Document Tracking</td>
                <td className="py-4 px-4">-</td>
                <td className="py-4 px-4">Check</td>
                <td className="py-4 px-4">Check</td>
              </tr>
              <tr>
                <td className="py-4">Support</td>
                <td className="py-4 px-4">Community</td>
                <td className="py-4 px-4">Email</td>
                <td className="py-4 px-4">Priority 24/7</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <footer className="mt-32 pt-12 border-t border-gray-100 dark:border-gray-800 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} OnboardFlow. All rights reserved.
      </footer>
    </main>
  );
}
