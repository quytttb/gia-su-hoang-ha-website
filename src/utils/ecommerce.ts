// Enhanced Ecommerce Events for GA4

// Enhanced Ecommerce Events for GA4
export interface ClassItem {
  item_id: string;
  item_name: string;
  item_category: string;
  item_variant?: string;
  price: number;
  quantity: number;
}

export interface PurchaseData {
  transaction_id: string;
  value: number;
  currency: string;
  items: ClassItem[];
  coupon?: string;
}

// Track class view (Enhanced Ecommerce)
export const trackClassViewEcommerce = (classData: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  if (!window.gtag) return;

  window.gtag('event', 'view_item', {
    currency: 'VND',
    value: classData.price,
    items: [
      {
        item_id: classData.id,
        item_name: classData.name,
        item_category: classData.category || 'Lớp học',
        price: classData.price,
        quantity: 1,
      },
    ],
  });
};

// Track add to cart (when user clicks register)
export const trackAddToCart = (classData: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  if (!window.gtag) return;

  window.gtag('event', 'add_to_cart', {
    currency: 'VND',
    value: classData.price,
    items: [
      {
        item_id: classData.id,
        item_name: classData.name,
        item_category: classData.category || 'Lớp học',
        price: classData.price,
        quantity: 1,
      },
    ],
  });
};

// Track class registration start
export const trackBeginCheckout = (classData: {
  id: string;
  name: string;
  price: number;
  category?: string;
}) => {
  if (!window.gtag) return;

  window.gtag('event', 'begin_checkout', {
    currency: 'VND',
    value: classData.price,
    items: [
      {
        item_id: classData.id,
        item_name: classData.name,
        item_category: classData.category || 'Lớp học',
        price: classData.price,
        quantity: 1,
      },
    ],
  });
};

// Track successful class registration
export const trackPurchase = (purchaseData: PurchaseData) => {
  if (!window.gtag) return;

  window.gtag('event', 'purchase', {
    transaction_id: purchaseData.transaction_id,
    value: purchaseData.value,
    currency: purchaseData.currency,
    items: purchaseData.items,
    coupon: purchaseData.coupon,
  });
};

// Track class search
export const trackSearch = (searchTerm: string, results?: number) => {
  if (!window.gtag) return;

  window.gtag('event', 'search', {
    search_term: searchTerm,
    results: results,
  });
};

// Track class list view
export const trackViewItemList = (listName: string, classes: ClassItem[]) => {
  if (!window.gtag) return;

  window.gtag('event', 'view_item_list', {
    item_list_name: listName,
    items: classes,
  });
};

// Track class promotion view
export const trackViewPromotion = (promotionId: string, promotionName: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'view_promotion', {
    promotion_id: promotionId,
    promotion_name: promotionName,
  });
};

// Track class share
export const trackShare = (classId: string, method: string) => {
  if (!window.gtag) return;

  window.gtag('event', 'share', {
    method: method,
    content_type: 'class',
    content_id: classId,
  });
};
