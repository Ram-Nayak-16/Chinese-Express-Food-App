import React from 'react';

// A simple button component that can be styled with neon borders and glows
const Button = ({ className = '', neon = true, size = 'default', variant = 'default', children, ...props }) => {
  
  // Decide Tailwind CSS classes based on the variant prop
  let variantClasses = '';
  if (variant === 'solid') {
    variantClasses = 'bg-primary-600 hover:bg-primary-700 text-white border-transparent hover:border-gray-900/50 duration-200';
  } else if (variant === 'ghost') {
    variantClasses = 'border-gray-300 bg-white hover:bg-gray-50 text-gray-900 shadow-sm hover:shadow-md';
  } else {
    // default
    variantClasses = 'bg-primary-500/5 hover:bg-primary-500/10 border-primary-500/20 text-gray-900';
  }

  // Decide Tailwind CSS classes based on the size prop
  let sizeClasses = '';
  if (size === 'sm') {
    sizeClasses = 'px-4 py-1.5 text-sm';
  } else if (size === 'lg') {
    sizeClasses = 'px-10 py-4 text-xl font-extrabold';
  } else {
    // default
    sizeClasses = 'px-8 py-3 text-lg font-bold';
  }

  return (
    <button
      className={`relative group border mx-auto text-center rounded-full cursor-pointer transition-all ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {/* Top neon line overlay on hover */}
      {neon && (
        <span className="absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-primary-600 to-transparent block" />
      )}
      
      {/* Main button text */}
      <span className="relative z-10">{children}</span>
      
      {/* Bottom neon line overlay */}
      {neon && (
        <span className="absolute group-hover:opacity-100 opacity-20 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-primary-600 to-transparent block" />
      )}
      
      {/* Behind-button glow effect on hover */}
      {neon && (
         <div className="absolute inset-0 bg-primary-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full -z-10"></div>
      )}
    </button>
  );
};

export { Button };
