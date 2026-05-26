const fs = require('fs');
let content = fs.readFileSync('client/src/pages/home.tsx', 'utf8');

// 1. Add more icons to imports
const newImports = `  Newspaper,
  Calculator,
  Coins,
  Landmark,
  Coffee,
  ChefHat,
  Palette,
  Code,
  Megaphone,
  Stethoscope,
  Microscope,
  Bed,
  Ticket,
  PawPrint,
  Leaf`;

content = content.replace(
  '  Activity\n} from "lucide-react";',
  '  Activity,\n' + newImports + '\n} from "lucide-react";'
).replace(
  '  Activity\r\n} from "lucide-react";',
  '  Activity,\r\n' + newImports.replace(/\n/g, '\r\n') + '\r\n} from "lucide-react";'
);

// 2. Add to iconMap
const newIconMapEntries = `  'newspaper': Newspaper,
  'calculator': Calculator,
  'coins': Coins,
  'landmark': Landmark,
  'coffee': Coffee,
  'chef-hat': ChefHat,
  'palette': Palette,
  'code': Code,
  'megaphone': Megaphone,
  'stethoscope': Stethoscope,
  'microscope': Microscope,
  'bed': Bed,
  'ticket': Ticket,
  'paw-print': PawPrint,
  'leaf': Leaf,`;

content = content.replace(
  "  'activity': Activity,\n};",
  "  'activity': Activity,\n" + newIconMapEntries + "\n};"
).replace(
  "  'activity': Activity,\r\n};",
  "  'activity': Activity,\r\n" + newIconMapEntries.replace(/\n/g, '\r\n') + "\r\n};"
);

// 3. Add to subcategoryIconMapping
const newSubcategoryMappings = `  'news-media': 'newspaper',
  'news & media': 'newspaper',
  'accounting-audit': 'calculator',
  'accounting & audit': 'calculator',
  'investment-opportunities': 'coins',
  'microfinance-cooperative': 'landmark',
  'microfinance/cooperative listings': 'landmark',
  'restaurants': 'utensils',
  'restaurant': 'utensils',
  'cafe': 'coffee',
  'home-delivery': 'truck',
  'home delivery': 'truck',
  'catering': 'chef-hat',
  'graphic-design': 'palette',
  'graphic design': 'palette',
  'web-development': 'code',
  'web development': 'code',
  'digital-marketing': 'megaphone',
  'digital marketing': 'megaphone',
  'clinics-hospitals': 'stethoscope',
  'clinics & hospitals': 'stethoscope',
  'diagnostic-labs': 'microscope',
  'diagnostic labs': 'microscope',
  'fitness-trainers': 'dumbbell',
  'fitness trainers': 'dumbbell',
  'tours-travels': 'plane',
  'tours & travels': 'plane',
  'hotels-resorts': 'bed',
  'hotels & resorts': 'bed',
  'event-movie-ticket-booking': 'ticket',
  'event/movie ticket booking': 'ticket',
  'pet-care-pet-food': 'paw-print',
  'pet care & pet food': 'paw-print',
  'agriculture-seeds-farming': 'leaf',
  'agriculture, seeds & farming': 'leaf',`;

content = content.replace(
  "const subcategoryIconMapping: Record<string, string> = {\n  'grocery-daily-essentials': 'shopping-cart',",
  "const subcategoryIconMapping: Record<string, string> = {\n" + newSubcategoryMappings + "\n  'grocery-daily-essentials': 'shopping-cart',"
).replace(
  "const subcategoryIconMapping: Record<string, string> = {\r\n  'grocery-daily-essentials': 'shopping-cart',",
  "const subcategoryIconMapping: Record<string, string> = {\r\n" + newSubcategoryMappings.replace(/\n/g, '\r\n') + "\r\n  'grocery-daily-essentials': 'shopping-cart',"
);

fs.writeFileSync('client/src/pages/home.tsx', content, 'utf8');
console.log('Extra icons updated successfully');
