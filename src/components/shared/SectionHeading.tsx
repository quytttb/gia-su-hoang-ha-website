import React from 'react';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  id?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  centered = true,
  id,
}) => {
  return (
    <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
      <h2 id={id} className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">
        {title}
      </h2>
      {subtitle && <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{subtitle}</p>}
      <div
        className={`h-1 w-20 bg-primary dark:bg-primary-400 mt-4 ${centered ? 'mx-auto' : ''}`}
      ></div>
    </div>
  );
};

export default SectionHeading;
