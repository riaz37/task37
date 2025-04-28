import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur-sm fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/medical-logo.svg" alt="MedBook" width={32} height={32} />
            <span className="font-bold text-xl text-foreground">MedBook</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/auth/signin"
              className="text-foreground hover:text-primary px-4 py-2 text-sm font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="bg-primary/10 text-primary px-6 py-2 rounded-full text-sm font-medium hover:bg-primary/20 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Your Health, <br />
              <span className="text-primary">Our Priority</span>
            </h1>
            <p className="text-xl text-muted max-w-lg">
              Experience healthcare reimagined. Book appointments, connect with top doctors, and manage your health journey - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/register"
                className="group bg-primary hover:bg-primary-hover px-8 py-4 rounded-full text-lg font-medium text-white shadow-sm hover:shadow-md transition-all inline-flex items-center justify-center"
              >
                <span className="text-white">Book Your First Visit</span>
                <svg 
                  className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/hospitals"
                className="bg-primary/10 text-primary px-8 py-4 rounded-full text-lg font-medium hover:bg-primary/20 transition-all inline-flex items-center justify-center"
              >
                Find Nearby Hospitals
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-foreground/10">
              <div>
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-muted">Doctors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50k+</div>
                <div className="text-muted">Patients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">100+</div>
                <div className="text-muted">Hospitals</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-foreground/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose MedBook?</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Experience the future of healthcare booking with our innovative platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-background p-8 rounded-2xl shadow-sm hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-primary-hover/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who have transformed their healthcare experience with MedBook
          </p>
          <Link
            href="/auth/register"
            className="bg-white text-primary px-8 py-4 rounded-full text-lg font-medium hover:bg-primary-hover hover:text-white transition-all inline-flex items-center justify-center"
          >
            Schedule Your First Appointment
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-foreground/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Image src="/medical-logo.svg" alt="MedBook" width={32} height={32} />
                <span className="font-bold text-xl text-foreground">MedBook</span>
              </div>
              <p className="text-muted">Making healthcare accessible to everyone, everywhere.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted hover:text-primary">Features</Link></li>
                <li><Link href="#" className="text-muted hover:text-primary">Pricing</Link></li>
                <li><Link href="#" className="text-muted hover:text-primary">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted hover:text-primary">About</Link></li>
                <li><Link href="#" className="text-muted hover:text-primary">Careers</Link></li>
                <li><Link href="#" className="text-muted hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-muted hover:text-primary">Privacy</Link></li>
                <li><Link href="#" className="text-muted hover:text-primary">Terms</Link></li>
                <li><Link href="#" className="text-muted hover:text-primary">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-foreground/10 mt-12 pt-8 text-center text-muted">
            <p>© {new Date().getFullYear()} MedBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Easy Booking",
    description: "Schedule appointments with just a few clicks. No more waiting on phone calls.",
    icon: (
      <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Secure Platform",
    description: "Your medical data is protected with enterprise-grade security protocols.",
    icon: (
      <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "Smart Reminders",
    description: "Never miss an appointment with automated notifications and reminders.",
    icon: (
      <svg className="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
];
