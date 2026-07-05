interface PageHeroProps {
  title: string;
  subtitle?: string;
  id?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoClassName?: string;
  children?: React.ReactNode;
}

const PageHero = ({
  title,
  subtitle,
  id,
  logoSrc = '/images/logo.png',
  logoAlt = 'Logo Gia Sư Hoàng Hà',
  logoClassName = 'w-[260px] h-[260px] md:w-[320px] md:h-[320px]',
  children,
}: PageHeroProps) => (
  <section
    className="relative flex items-center justify-center min-h-[220px] md:min-h-[260px] bg-[#e3f0ff] dark:bg-gradient-to-b dark:from-[#182848] dark:to-[#35577d] py-8 md:py-10 overflow-hidden shadow-md border-b border-blue-200 dark:border-blue-900"
    aria-labelledby={id}
  >
    {logoSrc && (
      <img
        src={logoSrc}
        alt={logoAlt}
        className={`absolute inset-0 m-auto opacity-20 dark:opacity-25 pointer-events-none select-none z-0 brightness-[1.15] ${logoClassName}`}
      />
    )}
    <div className="absolute inset-0 bg-white/70 dark:bg-white/10 z-10" />
    <div className="container-custom relative z-20 flex flex-col items-center justify-center text-center">
      <h1
        id={id}
        className="text-4xl md:text-5xl font-bold mb-4 text-primary-700 dark:text-primary-500 drop-shadow-md whitespace-nowrap"
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl md:text-2xl font-semibold text-accent-600 dark:text-accent-500 max-w-4xl mx-auto mb-0 whitespace-nowrap">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  </section>
);

export default PageHero;
