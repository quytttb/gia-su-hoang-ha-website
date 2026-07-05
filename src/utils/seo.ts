// SEO utilities for dynamic meta tags management

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

/**
 * Update document meta tags dynamically
 */
export const updateSEO = (seoData: SEOData) => {
  // Update title
  document.title = seoData.title;

  // Update or create meta tags
  updateMetaTag('description', seoData.description);

  if (seoData.keywords) {
    updateMetaTag('keywords', seoData.keywords);
  }

  // Open Graph tags
  updateMetaProperty('og:title', seoData.ogTitle || seoData.title);
  updateMetaProperty('og:description', seoData.ogDescription || seoData.description);
  updateMetaProperty('og:url', seoData.ogUrl || window.location.href);

  if (seoData.ogImage) {
    updateMetaProperty('og:image', seoData.ogImage);
  }

  // Canonical URL
  if (seoData.canonical) {
    updateCanonicalLink(seoData.canonical);
  }
};

/**
 * Update or create a meta tag
 */
const updateMetaTag = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;

  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }

  meta.content = content;
};

/**
 * Update or create a meta property tag (for Open Graph)
 */
const updateMetaProperty = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;

  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }

  meta.content = content;
};

/**
 * Update canonical link
 */
const updateCanonicalLink = (href: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;

  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }

  link.href = href;
};

/**
 * SEO data for different pages
 */
export const seoData = {
  home: {
    title: 'Trung tâm Gia Sư Hoàng Hà - Dẫn lối tri thức, vững bước tương lai',
    description:
      'Trung tâm Gia Sư Hoàng Hà cung cấp dịch vụ gia sư chất lượng cao tại Thanh Hóa. Đội ngũ giáo viên giỏi, phương pháp giảng dạy hiệu quả, luyện thi THPT Quốc Gia.',
    keywords:
      'gia sư thanh hóa, trung tâm gia sư, luyện thi đại học, học thêm thanh hóa, gia sư toán, gia sư văn, gia sư tiếng anh',
    ogImage: 'https://giasuhoangha.com/og-image.jpg',
    canonical: 'https://giasuhoangha.com/',
  },

  about: {
    title: 'Về chúng tôi - Trung tâm Gia Sư Hoàng Hà',
    description:
      'Tìm hiểu về lịch sử, sứ mệnh và đội ngũ giáo viên của Trung tâm Gia Sư Hoàng Hà. Hơn 10 năm kinh nghiệm trong lĩnh vực giáo dục tại Thanh Hóa.',
    keywords:
      'về gia sư hoàng hà, lịch sử trung tâm, đội ngũ giáo viên, giáo viên gia sư thanh hóa',
    canonical: 'https://giasuhoangha.com/about',
  },

  classes: {
    title: 'Lớp học - Trung tâm Gia Sư Hoàng Hà',
    description:
      'Khám phá các lớp học chất lượng cao tại Trung tâm Gia Sư Hoàng Hà: Luyện thi THPT Quốc Gia, Tiếng Anh giao tiếp, Toán học, Văn học và nhiều lớp học khác.',
    keywords:
      'lớp học gia sư, luyện thi THPT quốc gia thanh hóa, học tiếng anh thanh hóa, học toán thanh hóa, lớp học hè',
    canonical: 'https://giasuhoangha.com/classes',
  },

  courses: {
    title: 'Lớp học - Trung tâm Gia Sư Hoàng Hà',
    description:
      'Khám phá các lớp học chất lượng cao tại Trung tâm Gia Sư Hoàng Hà: Luyện thi THPT Quốc Gia, Tiếng Anh giao tiếp, Toán học, Văn học và nhiều lớp học khác.',
    keywords:
      'lớp học gia sư, luyện thi THPT quốc gia thanh hóa, học tiếng anh thanh hóa, học toán thanh hóa, lớp học hè',
    canonical: 'https://giasuhoangha.com/classes',
  },

  contact: {
    title: 'Liên hệ - Trung tâm Gia Sư Hoàng Hà',
    description:
      'Liên hệ với Trung tâm Gia Sư Hoàng Hà để được tư vấn miễn phí về các lớp học. Địa chỉ: 265 Đường 06, Phường Nam Ngạn, Thanh Hóa. Hotline: 0385.510.892',
    keywords:
      'liên hệ gia sư hoàng hà, địa chỉ trung tâm gia sư thanh hóa, số điện thoại gia sư, tư vấn lớp học',
    canonical: 'https://giasuhoangha.com/contact',
  },

  schedule: {
    title: 'Lịch học - Trung tâm Gia Sư Hoàng Hà',
    description:
      'Xem lịch học của các lớp học tại Trung tâm Gia Sư Hoàng Hà. Tra cứu lịch học theo ngày, lớp học hoặc số điện thoại đăng ký.',
    keywords: 'lịch học gia sư, thời khóa biểu, lịch học thanh hóa, tra cứu lịch học',
    canonical: 'https://giasuhoangha.com/schedule',
  },
};

/**
 * Generate class-specific SEO data
 */
export const generateClassSEO = (
  className: string,
  classDescription: string,
  classId: string
): SEOData => {
  return {
    title: `${className} - Trung tâm Gia Sư Hoàng Hà`,
    description: `${classDescription.substring(0, 150)}... Đăng ký ngay tại Trung tâm Gia Sư Hoàng Hà, Thanh Hóa.`,
    keywords: `${className.toLowerCase()}, lớp học ${className.toLowerCase()}, gia sư ${className.toLowerCase()}, học ${className.toLowerCase()} thanh hóa`,
    canonical: `https://giasuhoangha.com/classes/${classId}`,
  };
};

/**
 * Generate registration page SEO data
 */
export const generateRegistrationSEO = (className: string): SEOData => {
  return {
    title: `Đăng ký ${className} - Trung tâm Gia Sư Hoàng Hà`,
    description: `Đăng ký lớp học ${className} tại Trung tâm Gia Sư Hoàng Hà. Quy trình đăng ký nhanh chóng, đội ngũ giáo viên chất lượng cao.`,
    keywords: `đăng ký ${className.toLowerCase()}, đăng ký lớp học, gia sư thanh hóa`,
    ogTitle: `Đăng ký ${className} - Gia Sư Hoàng Hà`,
  };
};

/**
 * Generate structured data for a class
 */
export const generateClassStructuredData = (classData: any) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: classData.name,
    description: classData.description,
    provider: {
      '@type': 'EducationalOrganization',
      name: 'Trung tâm Gia Sư Hoàng Hà',
      url: 'https://giasuhoangha.com',
    },
    courseCode: classData.id,
    educationalLevel: classData.category,
    audience: {
      '@type': 'EducationalAudience',
      audienceType: classData.targetAudience,
    },
    offers: {
      '@type': 'Offer',
      price: classData.price,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
      validFrom: new Date().toISOString(),
      ...(classData.discount &&
        classData.discountEndDate && {
          priceValidUntil: classData.discountEndDate,
          discount: classData.discount,
        }),
    },
    image: classData.imageUrl,
    url: `https://giasuhoangha.com/classes/${classData.id}`,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'blended',
      location: {
        '@type': 'Place',
        name: 'Trung tâm Gia Sư Hoàng Hà',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '265 - Đường 06 - Mặt Bằng 08',
          addressLocality: 'Phường Nam Ngạn',
          addressRegion: 'Thành phố Thanh Hóa',
          addressCountry: 'VN',
        },
      },
      schedule: 'Thứ 2 đến 4, 19:30 - 21:30',
    },
  };
};

/**
 * Generate SEO data for a blog post
 */
export const generateBlogSEO = (post: {
  title: string;
  excerpt?: string;
  slug?: string;
  imageUrl?: string;
}): SEOData => {
  const slug = post.slug || '';
  return {
    title: `${post.title} - Blog Gia Sư Hoàng Hà`,
    description: post.excerpt || post.title,
    keywords: 'blog gia sư, tin tức giáo dục, gia sư thanh hóa',
    ogTitle: post.title,
    ogDescription: post.excerpt || post.title,
    ogImage: post.imageUrl,
    canonical: `https://giasuhoangha.com/blog/${slug}`,
  };
};

/**
 * Generate structured data (BlogPosting) for a blog post
 */
export const generateBlogStructuredData = (post: {
  title: string;
  excerpt?: string;
  slug?: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: string | { seconds?: number };
  updatedAt?: string | { seconds?: number };
}) => {
  const toISO = (dateValue?: string | { seconds?: number }) => {
    if (!dateValue) return new Date().toISOString();
    if (typeof dateValue === 'string') return new Date(dateValue).toISOString();
    if (dateValue.seconds) return new Date(dateValue.seconds * 1000).toISOString();
    return new Date().toISOString();
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.imageUrl,
    author: {
      '@type': 'Organization',
      name: post.author || 'Trung tâm Gia Sư Hoàng Hà',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Trung tâm Gia Sư Hoàng Hà',
      url: 'https://giasuhoangha.com',
    },
    datePublished: toISO(post.publishedAt),
    dateModified: toISO(post.updatedAt || post.publishedAt),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://giasuhoangha.com/blog/${post.slug || ''}`,
    },
  };
};
