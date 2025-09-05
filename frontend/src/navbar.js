import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

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

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Detect current route

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) navigate("/");
      else console.error("Logout failed");
    } catch (err) {
      console.error(err);
    }
  };

  // Determine the dynamic button text and target
  const isDonationPage = location.pathname === "/donate";
  const dynamicButton = isDonationPage 
    ? { text: "Sites", target: "/sites" } 
    : { text: "Donate Now", target: "/donate" };

    

  const handleDynamicButton = () => {
    navigate(dynamicButton.target);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-primary">🏺 ProtnoPoth</div>
            <div className="hidden md:flex space-x-6">
              <a href="#" className="text-foreground hover:text-primary transition-colors">Projects</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors">About</a>
              <a
  href="#"
  className="text-foreground hover:text-primary transition-colors"
  onClick={() => navigate("/ticket-purchase")}
>
  Ticket Purchase
</a>

              <a href="#" className="text-foreground hover:text-primary transition-colors">Research</a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleLogout}>Log Out</Button>
            <Button variant="archaeological" onClick={handleDynamicButton}>
              {dynamicButton.text}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
