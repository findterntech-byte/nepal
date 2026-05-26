const fs = require('fs');
let content = fs.readFileSync('client/src/pages/home.tsx', 'utf8');

// 1. Add Utensils to imports
content = content.replace(
  '  Badge as BadgeIcon\n} from "lucide-react";',
  '  Badge as BadgeIcon,\n  Utensils\n} from "lucide-react";'
).replace(
  '  Badge as BadgeIcon\r\n} from "lucide-react";',
  '  Badge as BadgeIcon,\r\n  Utensils\r\n} from "lucide-react";'
);

// 2. Add to iconMap
content = content.replace(
  "  'badge': BadgeIcon,\n};",
  "  'badge': BadgeIcon,\n  'trending-up': TrendingUp,\n  'utensils': Utensils,\n};"
).replace(
  "  'badge': BadgeIcon,\r\n};",
  "  'badge': BadgeIcon,\r\n  'trending-up': TrendingUp,\r\n  'utensils': Utensils,\r\n};"
);

// 3. Add to categoryIconMapping
content = content.replace(
  "const categoryIconMapping: Record<string, string> = {\n  'education': 'graduation-cap',",
  "const categoryIconMapping: Record<string, string> = {\n  'business-sales': 'briefcase',\n  'business & sales': 'briefcase',\n  'finance-investments': 'trending-up',\n  'finance & investments': 'trending-up',\n  'food-beverages': 'utensils',\n  'food & beverages': 'utensils',\n  'freelance-online-services': 'laptop',\n  'freelance & online services': 'laptop',\n  'education': 'graduation-cap',"
).replace(
  "const categoryIconMapping: Record<string, string> = {\r\n  'education': 'graduation-cap',",
  "const categoryIconMapping: Record<string, string> = {\r\n  'business-sales': 'briefcase',\r\n  'business & sales': 'briefcase',\r\n  'finance-investments': 'trending-up',\r\n  'finance & investments': 'trending-up',\r\n  'food-beverages': 'utensils',\r\n  'food & beverages': 'utensils',\r\n  'freelance-online-services': 'laptop',\r\n  'freelance & online services': 'laptop',\r\n  'education': 'graduation-cap',"
);

fs.writeFileSync('client/src/pages/home.tsx', content, 'utf8');
console.log('Icons updated successfully');
