const fs = require('fs');
let content = fs.readFileSync('client/src/pages/home.tsx', 'utf8');

// 1. Add more icons to imports
content = content.replace(
  '  Utensils\n} from "lucide-react";',
  '  Utensils,\n  HeartPulse,\n  ShoppingCart,\n  Plane,\n  Activity\n} from "lucide-react";'
).replace(
  '  Utensils\r\n} from "lucide-react";',
  '  Utensils,\r\n  HeartPulse,\r\n  ShoppingCart,\r\n  Plane,\r\n  Activity\r\n} from "lucide-react";'
);

// 2. Add to iconMap
content = content.replace(
  "  'utensils': Utensils,\n};",
  "  'utensils': Utensils,\n  'heart-pulse': HeartPulse,\n  'shopping-cart': ShoppingCart,\n  'plane': Plane,\n  'activity': Activity,\n};"
).replace(
  "  'utensils': Utensils,\r\n};",
  "  'utensils': Utensils,\r\n  'heart-pulse': HeartPulse,\r\n  'shopping-cart': ShoppingCart,\r\n  'plane': Plane,\r\n  'activity': Activity,\r\n};"
);

// 3. Add to categoryIconMapping
content = content.replace(
  "const categoryIconMapping: Record<string, string> = {\n  'business-sales': 'briefcase',",
  "const categoryIconMapping: Record<string, string> = {\n  'healthcare-fitness': 'heart-pulse',\n  'healthcare & fitness': 'heart-pulse',\n  'household-daily-needs': 'shopping-cart',\n  'household & daily needs': 'shopping-cart',\n  'sports-entertainment': 'activity',\n  'sports & entertainment': 'activity',\n  'travel-leisure': 'plane',\n  'travel & leisure': 'plane',\n  'business-sales': 'briefcase',"
).replace(
  "const categoryIconMapping: Record<string, string> = {\r\n  'business-sales': 'briefcase',",
  "const categoryIconMapping: Record<string, string> = {\r\n  'healthcare-fitness': 'heart-pulse',\r\n  'healthcare & fitness': 'heart-pulse',\r\n  'household-daily-needs': 'shopping-cart',\r\n  'household & daily needs': 'shopping-cart',\r\n  'sports-entertainment': 'activity',\r\n  'sports & entertainment': 'activity',\r\n  'travel-leisure': 'plane',\r\n  'travel & leisure': 'plane',\r\n  'business-sales': 'briefcase',"
);

// 4. Add to subcategoryIconMapping
content = content.replace(
  "const subcategoryIconMapping: Record<string, string> = {\n  'tuition-private-classes': 'graduation-cap',",
  "const subcategoryIconMapping: Record<string, string> = {\n  'grocery-daily-essentials': 'shopping-cart',\n  'grocery & daily essentials': 'shopping-cart',\n  'cleaning-pest-control': 'sparkles',\n  'cleaning & pest control': 'sparkles',\n  'tuition-private-classes': 'graduation-cap',"
).replace(
  "const subcategoryIconMapping: Record<string, string> = {\r\n  'tuition-private-classes': 'graduation-cap',",
  "const subcategoryIconMapping: Record<string, string> = {\r\n  'grocery-daily-essentials': 'shopping-cart',\r\n  'grocery & daily essentials': 'shopping-cart',\r\n  'cleaning-pest-control': 'sparkles',\r\n  'cleaning & pest control': 'sparkles',\r\n  'tuition-private-classes': 'graduation-cap',"
);

fs.writeFileSync('client/src/pages/home.tsx', content, 'utf8');
console.log('Icons updated successfully');
