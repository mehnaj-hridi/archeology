import React, { useState } from 'react';
import './CSS/Donation.css';
import heroImage from './assets/hero-archaeology.jpg';
import Navigation from './navbar';
// Button Component
const Button = ({ variant = 'default', size = 'default', className = '', children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    hero: "bg-gradient-hero text-white shadow-glow hover:shadow-archaeological transform hover:scale-105 transition-all duration-300 font-semibold",
    heroSecondary: "bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 font-semibold",
    archaeological: "bg-gradient-archaeological text-white shadow-archaeological hover:shadow-glow transition-all duration-300"
  };
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Badge Component
const Badge = ({ variant = 'default', className = '', children, ...props }) => {
  const baseClasses = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";
  const variants = {
    default: "bg-gray-200 text-gray-800",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-gray-300 text-gray-800",
    blue: "bg-blue-500 text-white"
  };
  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

// Card Components
const Card = ({ className = '', children, ...props }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ className = '', children, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className = '', children, ...props }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent = ({ className = '', children, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props}>
    {children}
  </div>
);


// DonationHero Component
const DonationHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-primary/60"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Preserve Our 
          <span className="block bg-gradient-archaeological bg-clip-text text-transparent">Ancient Heritage</span>
        </h1>

        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Your donation helps fund critical archaeological research, site preservation, and
          educational programs that protect our shared human history for future generations.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" className="text-lg px-8 py-6">Donate Now</Button>
          <Button variant="heroSecondary" size="lg" className="text-lg px-8 py-6">Learn More</Button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">150+</div>
            <div className="text-white/80">Active Sites</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">25K+</div>
            <div className="text-white/80">Artifacts Preserved</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">৳2M+</div>
            <div className="text-white/80">Research Funding</div>
          </div>
        </div>
      </div>
    </section>
  );
};

// DonationForm Component (modified)
const DonationForm = () => {
  const predefinedAmounts = [25, 50, 100, 250, 500];
  const [message, setMessage] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('research');

  const [modalOpen, setModalOpen] = useState(false); 
  const [modalMessage, setModalMessage] = useState('');

  const currentAmount = customAmount ? parseInt(customAmount) : selectedAmount;
  const user = JSON.parse(localStorage.getItem("user")); // logged-in user

  const donationTypes = [
    { value: 'research', label: 'Archaeological Research', desc: 'Fund excavations and scientific analysis' },
    { value: 'preservation', label: 'Site Preservation', desc: 'Protect and maintain historical sites' },
    { value: 'education', label: 'Educational Programs', desc: 'Support learning and training initiatives' },
    { value: 'equipment', label: 'Equipment & Technology', desc: 'Advanced tools for better discoveries' }
  ];

  const handleDonate = async () => {
    try {
      const res = await fetch("http://localhost:5000/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nid: user?.nid,
          amount: currentAmount,
          donation_type: donationType,
          message,
        }),
        credentials: "include",
      });
      const data = await res.json();

      setModalMessage(data.status === 'success' 
        ? 'Donation recorded successfully! 🎉' 
        : `Error: ${data.message}`);
      setModalOpen(true);
    } catch (err) {
      setModalMessage(`Failed to record donation: ${err}`);
      setModalOpen(true);
    }
  };

  const handleModalOk = () => {
    setModalOpen(false);
    if (modalMessage.includes('successfully')) {
      setMessage('');
      setSelectedAmount(50);
      setCustomAmount('');
      setDonationType('research');
    }
  };

  return (
    <section className="py-20 bg-gray-100 px-4 relative">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-black mb-4">Make a Donation</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Support archaeological research and preservation efforts around the world
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="p-8 shadow-lg bg-white">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-black">Choose Your Contribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 text-black">
              {/* Donation Purpose */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Donation Purpose
                </label>
                <div className="space-y-3">
                  {donationTypes.map((option) => (
                    <label key={option.value} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-100 transition-colors text-black">
                      <input
                        type="radio"
                        name="donationType"
                        value={option.value}
                        checked={donationType === option.value}
                        onChange={(e) => setDonationType(e.target.value)}
                        className="mt-1 accent-primary"
                      />
                      <div>
                        <div className="font-medium text-black">{option.label}</div>
                        <div className="text-sm text-muted-foreground">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-4">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount && !customAmount ? 'archaeological' : 'outline'}
                      onClick={() => { setSelectedAmount(amount); setCustomAmount(''); }}
                      className="h-12"
                    >
                      ৳{amount}
                    </Button>
                  ))}
                  <Button
                    variant={customAmount ? 'archaeological' : 'outline'}
                    onClick={() => { setSelectedAmount(0); setCustomAmount(''); }}
                    className="h-12"
                  >
                    Custom
                  </Button>
                </div>
                {!selectedAmount && (
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:border-primary focus:outline-none"
                  />
                )}
              </div>

              {/* Optional Message */}
              <textarea
                placeholder="Optional message"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:border-primary focus:outline-none resize-none"
              ></textarea>

              <Button
                variant="archaeological"
                size="lg"
                className="w-full text-lg font-semibold"
                onClick={handleDonate}
              >
                Donate ৳{currentAmount}
              </Button>
            </CardContent>
          </Card>

          {/* Impact Cards */}
          <div className="space-y-6">
            <Card className="p-6 shadow-card-hover">
              <CardHeader>
                <CardTitle className="text-xl">Your Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">$25</span>
                  <span className="text-sm text-muted-foreground">funds 1 week of site documentation</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">$50</span>
                  <span className="text-sm text-muted-foreground">covers basic excavation tools</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">$100</span>
                  <span className="text-sm text-muted-foreground">supports artifact analysis</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium">$250</span>
                  <span className="text-sm text-muted-foreground">funds 1 month of preservation work</span>
                </div>
              </CardContent>
            </Card>

            <Card className="p-6 shadow-card-hover border-l-4 border-l-primary">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🏺</div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Recent Success Story</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Thanks to donations like yours, we recently uncovered a 3,000-year-old ceremonial site in Peru, 
                      providing new insights into ancient Andean civilizations. Your support makes discoveries like this possible.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Blue Popup Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative bg-modal-success rounded-xl shadow-2xl max-w-sm w-full p-8 z-10 border border-green-600">
            <div className="text-white text-3xl mb-4">✅</div>
            <p className="text-white font-semibold text-lg mb-6">{modalMessage}</p>
            <Button
              variant="heroSecondary"
              className="bg-white text-green-700 hover:bg-green-100 px-6 py-3 font-semibold"
              onClick={handleModalOk}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

const ImpactSection = () => {
  const impactStats = [
    { label: "Sites Preserved", value: "127", description: "Archaeological sites protected worldwide" },
    { label: "Artifacts Analyzed", value: "15,000+", description: "Historical objects studied and catalogued" },
    { label: "Research Papers", value: "340", description: "Published scientific discoveries" },
    { label: "Students Trained", value: "2,500", description: "Future archaeologists educated" }
  ];

  const donationUsage = [
    { category: "Research & Excavation", percentage: "45%", description: "Field work, equipment, and scientific analysis", icon: "🔍" },
    { category: "Site Preservation", percentage: "30%", description: "Conservation and protection of archaeological sites", icon: "🏛️" },
    { category: "Education & Outreach", percentage: "15%", description: "Training programs and public education", icon: "📚" },
    { category: "Technology & Innovation", percentage: "10%", description: "Digital preservation and modern analysis tools", icon: "💻" }
  ];

  return (
    <section className="py-20 bg-muted/30 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Impact Statistics */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">Our Impact</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            See how your contributions help preserve history and advance archaeological knowledge
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <Card key={index} className="text-center p-6 shadow-card-hover hover:shadow-archaeological transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <CardTitle className="text-lg">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How Donations Are Used */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-black mb-4">How We Use Your Donations</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            Every donation directly supports our mission to uncover and preserve human history
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationUsage.map((usage, index) => (
              <Card key={index} className="p-6 shadow-card-hover hover:shadow-archaeological transition-all duration-300 group">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{usage.icon}</div>
                  <Badge variant="secondary" className="mb-3">{usage.percentage}</Badge>
                  <CardTitle className="text-lg">{usage.category}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{usage.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-card p-8 rounded-lg shadow-card-hover">
          <h4 className="text-2xl font-bold text-black mb-4">Join Our Mission</h4>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Every discovery tells a story. Help us uncover the mysteries of the past and preserve them for future generations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2 text-black">Transparent Impact</Badge>
            <Badge variant="outline" className="px-4 py-2 text-black">Scientific Excellence</Badge>
            <Badge variant="outline" className="px-4 py-2 text-black">Global Reach</Badge>
            <Badge variant="outline" className="px-4 py-2 text-black">Educational Focus</Badge>
          </div>
        </div>
      </div>
    </section>
  );
};
const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold mb-4">🏺 ArcheoFund</div>
            <p className="text-primary-foreground/80 leading-relaxed mb-4">
              Dedicated to preserving our archaeological heritage through research funding, site preservation, and educational programs. Every donation makes a lasting impact.
            </p>
            <div className="text-sm text-primary-foreground/60">
              © 2024 ArcheoFund. Supporting archaeological research worldwide.
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">About Us</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Our Projects</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Research Impact</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Contact</a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Donate</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Volunteer</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">Partnership</a>
              <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors">FAQ</a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>Preserving the past, inspiring the future through archaeological discovery.</p>
        </div>
      </div>
    </footer>
  );
};


// Main Donation Component
const Donation = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <DonationHero />
      <DonationForm />
      <ImpactSection />
      <Footer />
    </div>
  );
};

export default Donation;
