import Link from "next/link";
import { Globe, Mail, MessageSquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 bg-[#02050a] border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tighter text-white flex items-center gap-2 mb-4 inline-flex"
            >
              AUTOMATE
              <span className="w-2 h-2 rounded-full bg-brand-500" />
            </Link>
            <p className="text-muted-foreground max-w-sm">
              AI-powered business automation built around the way your company actually works.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="#how-it-works" className="text-muted-foreground hover:text-white transition-colors text-sm">How It Works</Link></li>
              <li><Link href="#solutions" className="text-muted-foreground hover:text-white transition-colors text-sm">Solutions</Link></li>
              <li><Link href="#industries" className="text-muted-foreground hover:text-white transition-colors text-sm">Industries</Link></li>
              <li><Link href="#why-us" className="text-muted-foreground hover:text-white transition-colors text-sm">Why Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link href="#about" className="text-muted-foreground hover:text-white transition-colors text-sm">About</Link></li>
              <li><Link href="#contact" className="text-muted-foreground hover:text-white transition-colors text-sm">Contact</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-white transition-colors text-sm">Terms of Service</Link></li>
            </ul>
          </div>
          
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-muted-foreground gap-4">
          <p>© {new Date().getFullYear()} Automate Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors" aria-label="Website">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Contact">
              <Mail className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-white transition-colors" aria-label="Community">
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
