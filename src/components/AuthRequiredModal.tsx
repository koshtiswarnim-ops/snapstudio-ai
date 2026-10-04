import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles, X, UserPlus, LogIn, ArrowRight } from 'lucide-react';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({
  isOpen,
  onClose,
  title = 'Create an Account First',
  description = 'Please create a free account or sign in to upload product photos and generate professional e-commerce studio images. Claim 5 free generation credits upon signing up!',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ground/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-ground-secondary border border-hairline rounded-scientific-lg p-6 space-y-6 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-ink-muted hover:text-ink hover:bg-ground-tertiary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon Header */}
        <div className="w-16 h-16 rounded-full bg-accent-cyan/10 border border-accent-cyan/30 mx-auto flex items-center justify-center text-accent-cyan relative shadow-[0_0_20px_rgba(79,216,232,0.2)]">
          <Lock className="w-8 h-8" />
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-accent-cyan"></span>
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 font-mono-label text-[10px] text-accent-cyan uppercase">
            <Sparkles className="w-3 h-3 text-accent-cyan" />
            <span>AUTHENTICATION REQUIRED</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-ink tracking-tightest">
            {title}
          </h2>
          <p className="text-xs text-ink-secondary leading-relaxed">
            {description}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-2">
          <Link
            to="/signup"
            onClick={onClose}
            className="w-full py-3.5 rounded-scientific bg-accent-cyan text-ground font-mono-label font-bold text-xs hover:bg-accent-cyan/90 transition-all flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(79,216,232,0.3)]"
          >
            <UserPlus className="w-4 h-4" />
            <span>CREATE FREE ACCOUNT (5 CREDITS)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/login"
            onClick={onClose}
            className="w-full py-3 rounded-scientific bg-ground-tertiary border border-hairline text-ink font-mono-label font-bold text-xs hover:border-accent-cyan/40 transition-colors flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4 text-accent-cyan" />
            <span>SIGN IN TO EXISTING ACCOUNT</span>
          </Link>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-hairline font-mono-label text-[9.5px] text-ink-muted">
          NO CREDIT CARD REQUIRED FOR FREE INITIAL TRIAL
        </div>
      </div>
    </div>
  );
};
