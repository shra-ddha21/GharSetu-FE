import React from 'react';

const Skeleton = ({ className = '', variant = 'rectangle', style = {} }) => {
  const baseClasses = 'skeleton-box';
  const variantClasses = {
    rectangle: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4 w-full',
    title: 'rounded h-8 w-3/4',
    avatar: 'rounded-full h-12 w-12',
    card: 'rounded-[2rem] h-64 w-full'
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.rectangle} ${className}`} 
      style={style}
    />
  );
};

export default Skeleton;
