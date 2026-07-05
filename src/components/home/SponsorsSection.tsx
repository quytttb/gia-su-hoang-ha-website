import React from 'react';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website?: string;
}

interface SponsorsSectionProps {
  sponsors?: Sponsor[];
  loading?: boolean;
}

const defaultSponsors: Sponsor[] = [
  {
    id: '1',
    name: 'Sponsor 1',
    logo: '/images/placeholder-logo.svg',
    website: 'https://example.com',
  },
  {
    id: '2',
    name: 'Sponsor 2',
    logo: '/images/placeholder-logo.svg',
    website: 'https://example.com',
  },
  {
    id: '3',
    name: 'Sponsor 3',
    logo: '/images/placeholder-logo.svg',
    website: 'https://example.com',
  },
  {
    id: '4',
    name: 'Sponsor 4',
    logo: '/images/placeholder-logo.svg',
    website: 'https://example.com',
  },
];

const SponsorsSection: React.FC<SponsorsSectionProps> = ({
  sponsors = defaultSponsors,
  loading = false,
}) => {
  if (loading) {
    return (
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
                <div className="h-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Nhà Tài Trợ</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Chúng tôi tự hào được đồng hành cùng các đối tác tin cậy
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {sponsors.map(sponsor => (
            <div
              key={sponsor.id}
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-gray-600/20 transition-shadow duration-300 group"
            >
              {sponsor.website ? (
                <a
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="w-full h-16 object-contain group-hover:scale-105 transition-transform duration-300 dark:brightness-90"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-logo.svg';
                    }}
                  />
                </a>
              ) : (
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="w-full h-16 object-contain dark:brightness-90"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-logo.svg';
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
