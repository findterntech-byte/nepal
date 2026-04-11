import type { Express } from "express";
import { createServer } from "http";
import { db } from "./db";
import {
  properties,
  agencies,
  locations,
  faqs,
  adminCategories,
  adminSubcategories,
  users,
  userCategoryPreferences,
  userDocuments,
  proProfileTypes,
  proProfileFields,
  proProfiles,
  proProfileValues,
  rentalListings,
  hostelPgListings,
  constructionMaterials,
  propertyDeals,
  commercialProperties,
  industrialLand,
  officeSpaces,
  carsBikes,
  heavyEquipment,
  showrooms,
  secondHandCarsBikes,
  insertAdminCategorySchema,
  insertAdminSubcategorySchema,
  carBikeRentals,
  transportationMovingServices,
  vehicleLicenseClasses,
  electronicsGadgets,
  phonesTabletsAccessories,
  secondHandPhonesTabletsAccessories,
  computerMobileLaptopRepairServices,
  furnitureInteriorDecor,
  householdServices,
  eventDecorationServices,
  fashionBeautyProducts,
  sareeClothingShopping,
  ebooksOnlineCourses,
  cricketSportsTraining,
  pharmacyMedicalStores, // Import pharmacyMedicalStores
  tuitionPrivateClasses, // Added
  danceKarateGymYoga, // Added
  languageClasses, // Added
  academiesMusicArtsSports, // Added
  skillTrainingCertification, // Added
  schoolsCollegesCoaching,
  educationalConsultancyStudyAbroad, // Added, uncommented
  jewelryAccessories, // Added
  healthWellnessServices, // Added
  telecommunicationServices,
  serviceCentreWarranty,
  contactMessages,
  insertContactMessageSchema,
  sliders,
  sliderCard,
  articles,
  insertArticleSchema,
  articleCategories,
  insertArticleCategorySchema,
  blogPosts,
  videos,
  cyberCafeInternetServices, // Added
} from "../shared/schema";
import { uploadMedia, handleMediaUpload } from './upload';
import { eq, sql, desc, or, and, asc, isNotNull } from "drizzle-orm";
import nodemailer from "nodemailer";

const parseBoolean = (value: any, defaultValue = false) => {
  if (value === undefined || value === null) return defaultValue;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (v === "true" || v === "1" || v === "yes" || v === "on") return true;
    if (v === "false" || v === "0" || v === "no" || v === "off") return false;
  }
  return Boolean(value);
};

const asStringArray = (value: any) => {
  if (!Array.isArray(value)) return [];
  return value.filter((x) => typeof x === "string");
};

export function registerRoutes(app: Express) {
  // Middleware: sanitize incoming JSON payloads for DB writes
  // - remove client-supplied system timestamp fields
  // - convert ISO-like date strings to `Date` objects so DB drivers can call `.toISOString()` safely
  app.use((req, _res, next) => {
    try {
      if (!req.body || typeof req.body !== 'object') return next();
      const sanitized: Record<string, any> = {};
      const isoLike = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      for (const [k, v] of Object.entries(req.body)) {
        if (k === 'createdAt' || k === 'updatedAt') continue;
        if (v == null) {
          sanitized[k] = null;
          continue;
        }
        if (typeof v === 'string') {
          // convert ISO-like strings to Date objects
          if (isoLike.test(v)) {
            const d = new Date(v);
            sanitized[k] = isNaN(d.getTime()) ? v : d;
          } else {
            sanitized[k] = v;
          }
          continue;
        }
        // preserve arrays
        if (Array.isArray(v)) {
          sanitized[k] = v;
          continue;
        }
        // preserve Date objects
        if (v instanceof Date) {
          sanitized[k] = v;
          continue;
        }
        // For plain objects, keep as-is (many columns are JSON/JSONB) but avoid prototype issues
        if (typeof v === 'object') {
          sanitized[k] = v;
          continue;
        }
        sanitized[k] = v;
      }
      req.body = sanitized;
    } catch (e) {
      // swallow sanitizer errors and leave body untouched
      console.error('Request sanitizer error:', e);
    }
    next();
  });

  app.use((req, res, next) => {
    try {
      const method = String(req.method || '').toUpperCase();
      if (method !== 'POST' && method !== 'PUT' && method !== 'PATCH') return next();
      if (!req.originalUrl || !req.originalUrl.includes('/api/')) return next();
      if (!req.body || typeof req.body !== 'object') return next();

      const isDataMediaUrl = (s: string) => /^data:(image|video)\//i.test(s.trim());

      const scan = (v: any, depth: number): boolean => {
        if (depth > 8) return false;
        if (v == null) return false;
        if (typeof v === 'string') return isDataMediaUrl(v);
        if (Array.isArray(v)) return v.some((x) => scan(x, depth + 1));
        if (typeof v === 'object') {
          for (const val of Object.values(v)) {
            if (scan(val, depth + 1)) return true;
          }
        }
        return false;
      };

      if (scan(req.body, 0)) {
        return res.status(400).json({
          message:
            'Base64 (data:) media is not allowed in request body. Upload the file to /api/upload (or /api/upload-multiple) and store only the returned /uploads/... URL in the database.',
        });
      }
    } catch (e) {
      console.error('Data URL guard error:', e);
    }
    next();
  });

  // Pro-Profile: list types
  app.get('/api/pro-profile/types', async (_req, res) => {
    try {
      const list = await db.query.proProfileTypes.findMany({ orderBy: [asc(proProfileTypes.sortOrder), asc(proProfileTypes.name)] });
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Pro-Profile: get fields for a type
  app.get('/api/pro-profile/types/:typeId/fields', async (req, res) => {
    try {
      const typeId = req.params.typeId;
      const type = await db.query.proProfileTypes.findFirst({ where: eq(proProfileTypes.id, typeId) });
      if (!type) return res.status(404).json({ message: 'Profile type not found' });

      const fields = await db.query.proProfileFields.findMany({
        where: eq(proProfileFields.profileTypeId, typeId),
        orderBy: [asc(proProfileFields.sortOrder), asc(proProfileFields.label)],
      });
      res.json({ type, fields });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Pro-Profile: upsert values for the logged-in user (by session)
  app.post('/api/pro-profile', async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      const userId = sessionUser?.id || req.body?.userId;
      if (!userId || typeof userId !== 'string') {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const { profileTypeId, values } = req.body || {};
      if (!profileTypeId || typeof profileTypeId !== 'string') {
        return res.status(400).json({ message: 'profileTypeId is required' });
      }
      const payload = (values && typeof values === 'object') ? values : {};

      // ensure profile exists (one per user)
      let profile = await db.query.proProfiles.findFirst({ where: eq(proProfiles.userId, userId) });
      if (!profile) {
        const [created] = await db.insert(proProfiles).values({ userId, profileTypeId }).returning();
        profile = created;
      } else if (profile.profileTypeId !== profileTypeId) {
        const [updated] = await db.update(proProfiles).set({ profileTypeId, updatedAt: new Date() }).where(eq(proProfiles.id, profile.id)).returning();
        profile = updated || profile;
        // If profile type changed, delete old values to avoid mixing fields
        await db.delete(proProfileValues).where(eq(proProfileValues.profileId, profile.id));
      }

      const fields = await db.query.proProfileFields.findMany({ where: eq(proProfileFields.profileTypeId, profileTypeId) });
      const existingVals = await db.query.proProfileValues.findMany({ where: eq(proProfileValues.profileId, profile.id) });
      const existingByFieldId: Record<string, any> = {};
      existingVals.forEach((v: any) => { existingByFieldId[v.fieldId] = v; });

      for (const f of fields as any[]) {
        if (!Object.prototype.hasOwnProperty.call(payload, f.key)) continue;
        const v = (payload as any)[f.key];
        const existing = existingByFieldId[f.id];
        if (existing) {
          await db.update(proProfileValues).set({ value: v, updatedAt: new Date() }).where(eq(proProfileValues.id, existing.id));
        } else {
          await db.insert(proProfileValues).values({ profileId: profile.id, fieldId: f.id, value: v });
        }
      }

      const saved = await db.query.proProfileValues.findMany({ where: eq(proProfileValues.profileId, profile.id) });
      res.json({ profile, values: saved });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Pro-Profile: get current user's profile (owner view)
  app.get('/api/pro-profile/me', async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      const userId = sessionUser?.id || (typeof (req.query as any)?.userId === 'string' ? String((req.query as any).userId) : undefined);
      if (!userId || typeof userId !== 'string') {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const profile = await db.query.proProfiles.findFirst({
        where: eq(proProfiles.userId, userId),
        with: {
          user: true,
          profileType: true,
          values: {
            with: {
              field: true,
            },
          },
        },
      });

      if (!profile) return res.json({ profile: null });

      const { password: _pw, ...userWithoutPassword } = profile.user || {};
      const valueMap: Record<string, any> = {};
      (profile.values || []).forEach((v: any) => {
        const k = v?.field?.key;
        if (!k) return;
        valueMap[String(k)] = v?.value;
      });

      res.json({
        profile: {
          id: profile.id,
          userId: profile.userId,
          profileTypeId: profile.profileTypeId,
          isActive: profile.isActive,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        },
        user: userWithoutPassword,
        profileType: profile.profileType,
        values: valueMap,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Pro-Profile: toggle active (owner)
  app.patch('/api/pro-profile/toggle-active', async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      const userId = sessionUser?.id || req.body?.userId;
      if (!userId || typeof userId !== 'string') {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const profile = await db.query.proProfiles.findFirst({ where: eq(proProfiles.userId, userId) });
      if (!profile) return res.status(404).json({ message: 'Profile not found' });

      const [updated] = await db
        .update(proProfiles)
        .set({ isActive: !profile.isActive, updatedAt: new Date() })
        .where(eq(proProfiles.id, profile.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Pro-Profile: directory listing (Skilled Labour)
  // Returns only users with accountType === "pro" and their selected pro profile.
  app.get('/api/pro-profiles', async (req, res) => {
    try {
      const typeId = typeof (req.query as any)?.typeId === 'string' ? String((req.query as any).typeId) : '';
      const q = typeof (req.query as any)?.q === 'string' ? String((req.query as any).q).trim().toLowerCase() : '';
      const limitRaw = typeof (req.query as any)?.limit === 'string' ? parseInt(String((req.query as any).limit), 10) : 50;
      const offsetRaw = typeof (req.query as any)?.offset === 'string' ? parseInt(String((req.query as any).offset), 10) : 0;
      const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 50;
      const offset = Number.isFinite(offsetRaw) ? Math.max(offsetRaw, 0) : 0;

      const profiles = await db.query.proProfiles.findMany({
        with: {
          user: true,
          profileType: true,
          values: {
            with: {
              field: true,
            },
          },
        },
        orderBy: [desc(proProfiles.updatedAt), desc(proProfiles.createdAt)],
      });

      const filtered = profiles
        .filter((p: any) => p?.user?.accountType === 'pro')
        .filter((p: any) => p?.isActive !== false)
        .filter((p: any) => {
          if (!typeId) return true;
          return p.profileTypeId === typeId;
        })
        .filter((p: any) => {
          if (!q) return true;
          const u = p.user || {};
          const base = [u.firstName, u.lastName, u.email, u.phone, p.profileType?.name]
            .filter(Boolean)
            .map((s: any) => String(s).toLowerCase());

          if (base.some((s: string) => s.includes(q))) return true;

          const vals = Array.isArray(p.values) ? p.values : [];
          for (const v of vals) {
            const fieldKey = v?.field?.key ? String(v.field.key).toLowerCase() : '';
            const fieldLabel = v?.field?.label ? String(v.field.label).toLowerCase() : '';
            const raw = v?.value;
            let s = '';
            if (raw == null) s = '';
            else if (typeof raw === 'string') s = raw;
            else if (typeof raw === 'number' || typeof raw === 'boolean') s = String(raw);
            else if (Array.isArray(raw)) s = raw.map((x) => (x == null ? '' : String(x))).join(' ');
            else s = JSON.stringify(raw);
            s = s.toLowerCase();

            if (fieldKey.includes(q) || fieldLabel.includes(q) || s.includes(q)) return true;
          }
          return false;
        });

      const total = filtered.length;
      const paged = filtered.slice(offset, offset + limit);

      const items = paged.map((p: any) => {
        const { password: _pw, ...userWithoutPassword } = p.user || {};
        const valueMap: Record<string, any> = {};
        (p.values || []).forEach((v: any) => {
          const k = v?.field?.key;
          if (!k) return;
          valueMap[String(k)] = v?.value;
        });

        return {
          profile: {
            id: p.id,
            userId: p.userId,
            profileTypeId: p.profileTypeId,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          },
          user: userWithoutPassword,
          profileType: p.profileType,
          values: valueMap,
        };
      });

      res.json({ total, limit, offset, items });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Pro-Profile: details
  app.get('/api/pro-profiles/:profileId', async (req, res) => {
    try {
      const profileId = req.params.profileId;
      const profile = await db.query.proProfiles.findFirst({
        where: eq(proProfiles.id, profileId),
        with: {
          user: true,
          profileType: true,
          values: {
            with: {
              field: true,
            },
          },
        },
      });

      if (!profile) return res.status(404).json({ message: 'Profile not found' });
      if (profile.user?.accountType !== 'pro') return res.status(404).json({ message: 'Profile not found' });
      if (profile.isActive === false) return res.status(404).json({ message: 'Profile not found' });

      const { password: _pw, ...userWithoutPassword } = profile.user || {};
      const valueMap: Record<string, any> = {};
      (profile.values || []).forEach((v: any) => {
        const k = v?.field?.key;
        if (!k) return;
        valueMap[String(k)] = v?.value;
      });

      // For UI: return ordered field list with resolved values
      const ordered = (profile.values || [])
        .slice()
        .sort((a: any, b: any) => {
          const sa = a?.field?.sortOrder ?? 0;
          const sb = b?.field?.sortOrder ?? 0;
          if (sa !== sb) return sa - sb;
          const la = String(a?.field?.label ?? '');
          const lb = String(b?.field?.label ?? '');
          return la.localeCompare(lb);
        })
        .map((v: any) => ({
          field: v.field,
          value: v.value,
        }));

      res.json({
        profile: {
          id: profile.id,
          userId: profile.userId,
          profileTypeId: profile.profileTypeId,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        },
        user: userWithoutPassword,
        profileType: profile.profileType,
        values: valueMap,
        fields: ordered,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Middleware: enforce at least 1 image for listing-like forms
  // Applies when request payload explicitly includes `images` or `photos` fields.
  app.use((req, res, next) => {
    try {
      const method = String(req.method || '').toUpperCase();
      if (method !== 'POST' && method !== 'PUT' && method !== 'PATCH') return next();
      if (!req.originalUrl || !req.originalUrl.includes('/api/')) return next();
      if (!req.body || typeof req.body !== 'object') return next();

      const hasImagesField = Object.prototype.hasOwnProperty.call(req.body, 'images');
      const hasPhotosField = Object.prototype.hasOwnProperty.call(req.body, 'photos');
      if (!hasImagesField && !hasPhotosField) return next();

      const normalize = (v: any): string[] => {
        if (v == null) return [];
        if (Array.isArray(v)) return v.filter((x) => typeof x === 'string' && x.trim().length > 0);
        if (typeof v === 'string') {
          const s = v.trim();
          if (!s) return [];
          try {
            const parsed = JSON.parse(s);
            if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === 'string' && x.trim().length > 0);
          } catch {
            // ignore
          }
          return [s];
        }
        return [];
      };

      const images = hasImagesField ? normalize((req.body as any).images) : [];
      const photos = hasPhotosField ? normalize((req.body as any).photos) : [];
      const total = images.length + photos.length;
      if (total <= 0) {
        return res.status(400).json({ message: 'At least one image is required' });
      }
    } catch (e) {
      console.error('Image required middleware error:', e);
    }
    next();
  });

  app.get("/api/stats", async (_req, res) => {
    try {
      const [propertiesCount, agenciesCount, locationsCount] = await Promise.all([
        db.select({ count: sql<number>`count(*)::int` }).from(properties),
        db.select({ count: sql<number>`count(*)::int` }).from(agencies),
        db.select({ count: sql<number>`count(*)::int` }).from(locations),
      ]);

      res.json({
        totalProperties: propertiesCount[0]?.count || 0,
        totalAgencies: agenciesCount[0]?.count || 0,
        totalLocations: locationsCount[0]?.count || 0,
        activeListings: propertiesCount[0]?.count || 0,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Simple global search across multiple tables.
  // Note: This does a lightweight in-memory filter of recent rows.
  // It's intentionally generic to avoid coupling to exact schema fields.
  app.get('/api/search', async (req, res) => {
    try {
      const q = (req.query.q || '').toString().trim();
      if (!q || q.length < 2) return res.json({ q, results: {} });

      const limitPerSource = Math.min(50, Number(req.query.limit) || 10);
      const qLower = q.toLowerCase();
      const tokens = qLower.split(/\s+/).map(t => t.trim()).filter(Boolean);
      const modeAll = (req.query.mode || '').toString().toLowerCase() === 'all' || (req.query.mode || '').toString().toLowerCase() === 'and';
      
      // Category filter - if provided, only search within specific category sources
      const categoryFilter = (req.query.category || '').toString().toLowerCase().trim();
      // Subcategory filter - optional, restrict results to items that mention the subcategory slug/name
      const subcategoryFilterRaw = (req.query.subcategory || '').toString().trim();
      const subcategoryFilter = subcategoryFilterRaw ? subcategoryFilterRaw.toLowerCase() : '';

      // Resolve subcategory ids/slugs/names from adminSubcategories to improve matching
      let resolvedSubcategoryIds: string[] = [];
      let resolvedSubcategorySlugs: string[] = [];
      let resolvedSubcategoryNames: string[] = [];
      if (subcategoryFilter) {
        try {
          const allSubs = await db.query.adminSubcategories.findMany();
          const matches = allSubs.filter((s: any) => {
            const slug = (s.slug || '').toString().toLowerCase();
            const name = (s.name || '').toString().toLowerCase();
            const id = (s.id || '').toString().toLowerCase();
            return slug === subcategoryFilter || name === subcategoryFilter || id === subcategoryFilter;
          });
          resolvedSubcategoryIds = matches.map((m: any) => (m.id || '').toString().toLowerCase());
          resolvedSubcategorySlugs = matches.map((m: any) => (m.slug || '').toString().toLowerCase());
          resolvedSubcategoryNames = matches.map((m: any) => (m.name || '').toString().toLowerCase());
        } catch (e) {
          // ignore resolution errors; fall back to textual matching
        }
      }

      // Fetch candidates from several tables (recent first). Adjust as needed.
      const limitFetch = 200;

      // Map of category names to their associated service sources
      const categorySourcesMap: Record<string, string[]> = {
        'education-learning': ['tuition', 'schools', 'languageClasses', 'skillTraining', 'educationalConsultancy', 'ebooks', 'dance', 'academies', 'cricketTraining'],
        'electronics-technology': ['electronics', 'phones', 'secondHandPhones', 'computerRepair', 'cyberCafe', 'telecommunication', 'serviceCentre'],
        'fashion-lifestyle': ['fashion', 'jewelry', 'healthWellness', 'pharmacy', 'sareeClothing', 'furniture'],
        'real-estate-property': ['properties', 'rentals', 'hostelPg', 'propertyDeals', 'commercialProperties', 'officeSpaces', 'industrialLand', 'constructionMaterials'],
        'vehicles-transportation': ['cars', 'secondHandCars', 'heavyEquipment', 'showrooms', 'carBikeRentals', 'vehicleLicense', 'transportation'],
        'services': ['household', 'healthWellness', 'eventDecoration', 'transportation', 'serviceCentre', 'pharamacy'],
        'furniture-home': ['furniture', 'household', 'eventDecoration'],
      };

      const sourceFetchers: Record<string, () => Promise<any[]>> = {
        // Properties & Real Estate
        properties: () => db.query.properties.findMany({ orderBy: [desc(properties.createdAt)], limit: limitFetch }),
        rentals: () => db.query.rentalListings.findMany({ orderBy: [desc(rentalListings.createdAt)], limit: limitFetch }),
        hostelPg: () => db.query.hostelPgListings.findMany({ orderBy: [desc(hostelPgListings.createdAt)], limit: limitFetch }),
        propertyDeals: () => db.query.propertyDeals.findMany({ orderBy: [desc(propertyDeals.createdAt)], limit: limitFetch }),
        commercialProperties: () => db.query.commercialProperties.findMany({ orderBy: [desc(commercialProperties.createdAt)], limit: limitFetch }),
        officeSpaces: () => db.query.officeSpaces.findMany({ orderBy: [desc(officeSpaces.createdAt)], limit: limitFetch }),
        industrialLand: () => db.query.industrialLand.findMany({ orderBy: [desc(industrialLand.createdAt)], limit: limitFetch }),
        
        // Vehicles
        cars: () => db.query.carsBikes.findMany({ orderBy: [desc(carsBikes.createdAt)], limit: limitFetch }),
        secondHandCars: () => db.query.secondHandCarsBikes.findMany({ orderBy: [desc(secondHandCarsBikes.createdAt)], limit: limitFetch }),
        carBikeRentals: () => db.query.carBikeRentals.findMany({ orderBy: [desc(carBikeRentals.createdAt)], limit: limitFetch }),
        // aliases with kebab-case used by some front-end paths
        'cars-bikes': () => db.query.carsBikes.findMany({ orderBy: [desc(carsBikes.createdAt)], limit: limitFetch }),
        'second-hand-cars-bikes': () => db.query.secondHandCarsBikes.findMany({ orderBy: [desc(secondHandCarsBikes.createdAt)], limit: limitFetch }),
        'car-bike-rentals': () => db.query.carBikeRentals.findMany({ orderBy: [desc(carBikeRentals.createdAt)], limit: limitFetch }),
        
        // Equipment & Machinery
        heavyEquipment: () => db.query.heavyEquipment.findMany({ orderBy: [desc(heavyEquipment.createdAt)], limit: limitFetch }),
        constructionMaterials: () => db.query.constructionMaterials.findMany({ orderBy: [desc(constructionMaterials.createdAt)], limit: limitFetch }),
        // kebab-case alias (frontend may request /api/construction-materials)
        'construction-materials': () => db.query.constructionMaterials.findMany({ orderBy: [desc(constructionMaterials.createdAt)], limit: limitFetch }),
        
        // Electronics & Technology
        electronics: () => db.query.electronicsGadgets.findMany({ orderBy: [desc(electronicsGadgets.createdAt)], limit: limitFetch }),
        phones: () => db.query.phonesTabletsAccessories.findMany({ orderBy: [desc(phonesTabletsAccessories.createdAt)], limit: limitFetch }),
        secondHandPhones: () => db.query.secondHandPhonesTabletsAccessories.findMany({ orderBy: [desc(secondHandPhonesTabletsAccessories.createdAt)], limit: limitFetch }),
        computerRepair: () => db.query.computerMobileLaptopRepairServices.findMany({ orderBy: [desc(computerMobileLaptopRepairServices.createdAt)], limit: limitFetch }),
        cyberCafe: () => db.query.cyberCafeInternetServices.findMany({ orderBy: [desc(cyberCafeInternetServices.createdAt)], limit: limitFetch }),
        telecommunication: () => db.query.telecommunicationServices.findMany({ orderBy: [desc(telecommunicationServices.createdAt)], limit: limitFetch }),
        // kebab-case aliases for frontend endpoints
        'electronics-gadgets': () => db.query.electronicsGadgets.findMany({ orderBy: [desc(electronicsGadgets.createdAt)], limit: limitFetch }),
        'phones-tablets': () => db.query.phonesTabletsAccessories.findMany({ orderBy: [desc(phonesTabletsAccessories.createdAt)], limit: limitFetch }),
        'second-hand-phones': () => db.query.secondHandPhonesTabletsAccessories.findMany({ orderBy: [desc(secondHandPhonesTabletsAccessories.createdAt)], limit: limitFetch }),
        'computer-repair': () => db.query.computerMobileLaptopRepairServices.findMany({ orderBy: [desc(computerMobileLaptopRepairServices.createdAt)], limit: limitFetch }),
        'cyber-cafe': () => db.query.cyberCafeInternetServices.findMany({ orderBy: [desc(cyberCafeInternetServices.createdAt)], limit: limitFetch }),
        
        // Education & Training
        tuition: () => db.query.tuitionPrivateClasses.findMany({ orderBy: [desc(tuitionPrivateClasses.createdAt)], limit: limitFetch }),
        schools: () => db.query.schoolsCollegesCoaching.findMany({ orderBy: [desc(schoolsCollegesCoaching.createdAt)], limit: limitFetch }),
        languageClasses: () => db.query.languageClasses.findMany({ orderBy: [desc(languageClasses.createdAt)], limit: limitFetch }),
        skillTraining: () => db.query.skillTrainingCertification.findMany({ orderBy: [desc(skillTrainingCertification.createdAt)], limit: limitFetch }),
        educationalConsultancy: () => db.query.educationalConsultancyStudyAbroad.findMany({ orderBy: [desc(educationalConsultancyStudyAbroad.createdAt)], limit: limitFetch }),
        ebooks: () => db.query.ebooksOnlineCourses.findMany({ orderBy: [desc(ebooksOnlineCourses.createdAt)], limit: limitFetch }),
        
        // Sports, Fitness & Recreation
        dance: () => db.query.danceKarateGymYoga.findMany({ orderBy: [desc(danceKarateGymYoga.createdAt)], limit: limitFetch }),
        academies: () => db.query.academiesMusicArtsSports.findMany({ orderBy: [desc(academiesMusicArtsSports.createdAt)], limit: limitFetch }),
        cricketTraining: () => db.query.cricketSportsTraining.findMany({ orderBy: [desc(cricketSportsTraining.createdAt)], limit: limitFetch }),
        
        // Shopping & Retail
        fashion: () => db.query.fashionBeautyProducts.findMany({ orderBy: [desc(fashionBeautyProducts.createdAt)], limit: limitFetch }),
        sareeClothing: () => db.query.sareeClothingShopping.findMany({ orderBy: [desc(sareeClothingShopping.createdAt)], limit: limitFetch }),
        jewelry: () => db.query.jewelryAccessories.findMany({ orderBy: [desc(jewelryAccessories.createdAt)], limit: limitFetch }),
        furniture: () => db.query.furnitureInteriorDecor.findMany({ orderBy: [desc(furnitureInteriorDecor.createdAt)], limit: limitFetch }),
        pharmacy: () => db.query.pharmacyMedicalStores.findMany({ orderBy: [desc(pharmacyMedicalStores.createdAt)], limit: limitFetch }),
        // kebab-case aliases for shopping/retail endpoints
        'fashion-beauty': () => db.query.fashionBeautyProducts.findMany({ orderBy: [desc(fashionBeautyProducts.createdAt)], limit: limitFetch }),
        'jewelry-accessories': () => db.query.jewelryAccessories.findMany({ orderBy: [desc(jewelryAccessories.createdAt)], limit: limitFetch }),
        'furniture-interior-decor': () => db.query.furnitureInteriorDecor.findMany({ orderBy: [desc(furnitureInteriorDecor.createdAt)], limit: limitFetch }),
        'pharmacy-medical': () => db.query.pharmacyMedicalStores.findMany({ orderBy: [desc(pharmacyMedicalStores.createdAt)], limit: limitFetch }),
        
        // Services
        household: () => db.query.householdServices.findMany({ orderBy: [desc(householdServices.createdAt)], limit: limitFetch }),
        healthWellness: () => db.query.healthWellnessServices.findMany({ orderBy: [desc(healthWellnessServices.createdAt)], limit: limitFetch }),
        eventDecoration: () => db.query.eventDecorationServices.findMany({ orderBy: [desc(eventDecorationServices.createdAt)], limit: limitFetch }),
        transportation: () => db.query.transportationMovingServices.findMany({ orderBy: [desc(transportationMovingServices.createdAt)], limit: limitFetch }),
        serviceCentre: () => db.query.serviceCentreWarranty.findMany({ orderBy: [desc(serviceCentreWarranty.createdAt)], limit: limitFetch }),
        vehicleLicense: () => db.query.vehicleLicenseClasses.findMany({ orderBy: [desc(vehicleLicenseClasses.createdAt)], limit: limitFetch }),
        // kebab-case aliases for service endpoints
        'household-services': () => db.query.householdServices.findMany({ orderBy: [desc(householdServices.createdAt)], limit: limitFetch }),
        'health-wellness': () => db.query.healthWellnessServices.findMany({ orderBy: [desc(healthWellnessServices.createdAt)], limit: limitFetch }),
        'event-decoration': () => db.query.eventDecorationServices.findMany({ orderBy: [desc(eventDecorationServices.createdAt)], limit: limitFetch }),
        'service-centre': () => db.query.serviceCentreWarranty.findMany({ orderBy: [desc(serviceCentreWarranty.createdAt)], limit: limitFetch }),
        
        // Showrooms & Retail
        showrooms: () => db.query.showrooms.findMany({ orderBy: [desc(showrooms.createdAt)], limit: limitFetch }),
        
        // Content
        blogPosts: () => db.query.blogPosts.findMany({ orderBy: [desc(blogPosts.publishedAt)], limit: limitFetch }),
        articles: () => db.query.articles.findMany({ orderBy: [desc(articles.createdAt)], limit: limitFetch }),
        
        // Categories
        categories: () => db.query.adminCategories.findMany({ with: { subcategories: true }, orderBy: [adminCategories.sortOrder, adminCategories.name], limit: limitFetch }),
        subcategories: () => db.query.adminSubcategories.findMany({ with: { category: true }, orderBy: [desc(adminSubcategories.createdAt)], limit: limitFetch }),
        
        // Users
        users: () => db.query.users.findMany({ orderBy: [desc(users.createdAt)], limit: limitFetch }),
      };

      // Parse optional sources CSV param. If none provided, search all sources.
      const requestedSourcesRaw = (req.query.sources || '').toString();
      let requestedSources = requestedSourcesRaw ? requestedSourcesRaw.split(',').map(s => s.trim()).filter(Boolean) : Object.keys(sourceFetchers);
      
      // If category filter is provided, override requested sources
      if (categoryFilter && categorySourcesMap[categoryFilter]) {
        requestedSources = categorySourcesMap[categoryFilter];
      }

      const toFetch = requestedSources.filter(s => !!sourceFetchers[s]);
      const fetchPromises = toFetch.map((k) => sourceFetchers[k]());
      const fetched = await Promise.all(fetchPromises);

      const safeStringify = (obj: any) => {
        try {
          return JSON.stringify(obj, (_k, v) => (typeof v === 'bigint' ? v.toString() : v));
        } catch (e) {
          return '';
        }
      };

      const makeMatches = (rows: any[]) => {
        // Common brand name aliases
        const brandAliases: Record<string, string[]> = {
          'moto': ['motorola', 'moto'],
          'motorola': ['motorola', 'moto'],
          'samsung': ['samsung'],
          'apple': ['apple', 'iphone', 'ipad'],
          'iphone': ['apple', 'iphone'],
          'redmi': ['redmi', 'xiaomi'],
          'realme': ['realme'],
          'oppo': ['oppo'],
          'vivo': ['vivo'],
          'oneplus': ['oneplus'],
          'huawei': ['huawei'],
          'nokia': ['nokia'],
          'lenovo': ['lenovo'],
          'asus': ['asus'],
          'mi': ['xiaomi', 'mi'],
          'xiaomi': ['xiaomi', 'mi', 'redmi'],
          'poco': ['poco', 'xiaomi'],
          'infinix': ['infinix'],
          'tecno': ['tecno'],
        };
        
        // Normalize brand name
        const normalizeBrand = (brand: string): string => {
          const lowerBrand = brand.toLowerCase();
          for (const [alias, brands] of Object.entries(brandAliases)) {
            if (brands.includes(lowerBrand)) {
              return alias;
            }
          }
          return lowerBrand;
        };
        
        return rows
          .map((r: any) => {
            // Get all possible name/title fields
            const title = r.title || r.name || r.showroomName || r.institutionName || r.username || r.fullName || r.productName || r.serviceName || r.companyName || r.slug || '';
            const titleLower = title.toLowerCase();
            
            // Also include brand and model in searchable text for phones/electronics
            const brand = (r.brand || '').toLowerCase();
            const model = (r.model || '').toLowerCase();
            const normalizedBrand = normalizeBrand(brand);
            
            // Build extended searchable text
            const extendedSearchText = `${titleLower} ${brand} ${model} ${normalizedBrand} ${r.description || ''} ${r.summary || ''}`.toLowerCase();
            
            // Check if query matches the name/title (priority match)
            const nameMatch = tokens.every(t => extendedSearchText.includes(t));
            
            // Build a snippet that includes useful contact information (phone/whatsapp) when available
            let snippet = (r.description || r.summary || r.address || r.title || r.name || r.category || '') as string;
            const phone = (r.contactPhone || r.phone || r.whatsappNumber || r.alternatePhone || r.mobile || r.contact_number);
            if (phone) {
              snippet = `${snippet} Call: ${phone}`.trim();
            }
            
            const raw = r;
            const serialized = ("" + safeStringify({ id: r.id, title, snippet, raw })).toLowerCase();
            const matchedWords = tokens.filter(t => serialized.includes(t));
            
            // Calculate relevance score: name matches are worth more
            const nameMatchCount = tokens.filter(t => extendedSearchText.includes(t)).length;
            const relevanceScore = nameMatchCount * 10 + matchedWords.length;
            
            return { id: r.id, title, snippet, raw, matchedWords, relevanceScore, nameMatch };
          })
          .filter((item: any) => {
            try {
              if (tokens.length === 0) return false;
              if (modeAll) {
                return item.matchedWords.length === tokens.length;
              }
              return item.matchedWords.length > 0;
            } catch (e) {
              return false;
            }
          })
          // Sort by relevance (name matches first, then overall matches)
          .sort((a, b) => {
            if (a.nameMatch !== b.nameMatch) {
              return a.nameMatch ? -1 : 1;
            }
            return b.relevanceScore - a.relevanceScore;
          })
          .slice(0, limitPerSource);
      };

      // Build results object from fetched sources in the same order as `toFetch`.
      const results: Record<string, any[]> = {};
      for (let i = 0; i < toFetch.length; i++) {
        const key = toFetch[i];
        const rows = fetched[i] || [];
        if (key === 'categories') {
          const mapped = (rows || []).map((c: any) => ({ id: c.id, title: c.name, raw: c }));
          results[key] = mapped.filter((item: any) => safeStringify(item).toLowerCase().includes(qLower)).slice(0, limitPerSource);
        } else if (key === 'subcategories') {
          const mapped = (rows || []).map((s: any) => ({ id: s.id, title: s.name, parentCategory: s.category?.name, raw: s }));
          results[key] = mapped.filter((item: any) => safeStringify(item).toLowerCase().includes(qLower)).slice(0, limitPerSource);
        } else {
          results[key] = makeMatches(rows);
        }
      }

      // If subcategory filter is provided, further restrict results to items that contain the
      // subcategory slug or name in their serialized payload. This allows clicking a subcategory
      // in the search popup to show only items relevant to that subcategory.
      if (subcategoryFilter) {
        Object.keys(results).forEach((src) => {
          const arr = results[src] || [];
          results[src] = arr.filter((it: any) => {
            try {
              const raw = it.raw || it;
              const serialized = safeStringify(raw).toLowerCase();
              // Quick hit if serialized payload contains the filter
              if (serialized.includes(subcategoryFilter)) return true;

              // Check resolved ids/slugs/names first (from adminSubcategories lookup)
              for (const id of resolvedSubcategoryIds) {
                if (serialized.includes(id)) return true;
              }
              for (const s of resolvedSubcategorySlugs) {
                if (serialized.includes(s)) return true;
              }
              for (const n of resolvedSubcategoryNames) {
                if (serialized.includes(n)) return true;
              }

              // Check common field names that may reference subcategory info
              const candidates: string[] = [];
              const addIf = (v: any) => { if (v !== undefined && v !== null) candidates.push(String(v).toLowerCase()); };

              addIf(raw.subcategory);
              addIf(raw.subCategory);
              addIf(raw.sub_category);
              addIf(raw.subcategoryName);
              addIf(raw.subcategory_slug);
              addIf(raw.subcategorySlug);
              addIf(raw.subcategory?.slug);
              addIf(raw.subcategory?.name);
              addIf(raw.subcategoryId);
              addIf(raw.sub_category_id);
              addIf(raw.subcategory_id);
              addIf(raw.parentSubcategoryId);
              addIf(raw.parent_subcategory_id);
              addIf(raw.category);
              addIf(raw.categorySlug);
              addIf(raw.category?.slug);
              addIf(raw.category?.name);
              addIf(raw.tags);
              addIf(raw.keywords);
              addIf(it.title);
              addIf(it.name);

              // If any candidate contains the subcategory filter, include the item
              for (const c of candidates) {
                if (c && c.includes(subcategoryFilter)) return true;
              }

              return false;
            } catch (e) {
              return false;
            }
          });
        });
      }

      // Group results by category for "Explore Our Collections" section
      const collectionsByCategory: Record<string, Record<string, any[]>> = {};
      const sourceToCategory: Record<string, string> = {
        // Education & Learning
        'tuition': 'Education & Learning',
        'schools': 'Education & Learning',
        'languageClasses': 'Education & Learning',
        'skillTraining': 'Education & Learning',
        'educationalConsultancy': 'Education & Learning',
        'ebooks': 'Education & Learning',
        'dance': 'Education & Learning',
        'academies': 'Education & Learning',
        'cricketTraining': 'Education & Learning',
        
        // Electronics & Technology
        'electronics': 'Electronics & Technology',
        'phones': 'Electronics & Technology',
        'secondHandPhones': 'Electronics & Technology',
        'computerRepair': 'Electronics & Technology',
        'cyberCafe': 'Electronics & Technology',
        'telecommunication': 'Electronics & Technology',
        'serviceCentre': 'Electronics & Technology',
        'electronics-gadgets': 'Electronics & Technology',
        'phones-tablets': 'Electronics & Technology',
        'second-hand-phones': 'Electronics & Technology',
        'computer-repair': 'Electronics & Technology',
        'cyber-cafe': 'Electronics & Technology',
        
        // Fashion & Lifestyle
        'fashion': 'Fashion & Lifestyle',
        'sareeClothing': 'Fashion & Lifestyle',
        'jewelry': 'Fashion & Lifestyle',
        'healthWellness': 'Fashion & Lifestyle',
        'pharmacy': 'Fashion & Lifestyle',
        'fashion-beauty': 'Fashion & Lifestyle',
        'jewelry-accessories': 'Fashion & Lifestyle',
        'furniture-interior-decor': 'Furniture & Home Décor',
        'pharmacy-medical': 'Fashion & Lifestyle',
        
        // Real Estate & Property
        'properties': 'Real Estate & Property',
        'rentals': 'Real Estate & Property',
        'hostelPg': 'Real Estate & Property',
        'propertyDeals': 'Real Estate & Property',
        'commercialProperties': 'Real Estate & Property',
        'officeSpaces': 'Real Estate & Property',
        'industrialLand': 'Real Estate & Property',
        'constructionMaterials': 'Real Estate & Property',
        'construction-materials': 'Real Estate & Property',
        
        // Vehicles & Transportation
        'cars': 'Vehicles & Transportation',
        'secondHandCars': 'Vehicles & Transportation',
        'carBikeRentals': 'Vehicles & Transportation',
        'heavyEquipment': 'Vehicles & Transportation',
        'showrooms': 'Vehicles & Transportation',
        'vehicleLicense': 'Vehicles & Transportation',
        'transportation': 'Vehicles & Transportation',
        'cars-bikes': 'Vehicles & Transportation',
        'second-hand-cars-bikes': 'Vehicles & Transportation',
        'car-bike-rentals': 'Vehicles & Transportation',
        
        // Furniture & Home Décor
        'furniture': 'Furniture & Home Décor',
        'household': 'Furniture & Home Décor',
        'eventDecoration': 'Furniture & Home Décor',
      };

      // Populate collections
      Object.entries(results).forEach(([source, items]) => {
        const categoryName = sourceToCategory[source] || 'Other';
        if (!collectionsByCategory[categoryName]) {
          collectionsByCategory[categoryName] = {};
        }
        if (items.length > 0) {
          collectionsByCategory[categoryName][source] = items;
        }
      });

      res.json({ q, results, collections: collectionsByCategory });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Return list of searchable sources the global search queries.
  app.get('/api/search/sources', async (_req, res) => {
    try {
      // Keep this list in sync with what /api/search queries.
      const sources = [
        // Properties & Real Estate
        { key: 'properties', label: 'Properties' },
        { key: 'rentals', label: 'Rental Listings' },
        { key: 'hostelPg', label: 'Hostel & PG' },
        { key: 'propertyDeals', label: 'Property Deals' },
        { key: 'commercialProperties', label: 'Commercial Properties' },
        { key: 'officeSpaces', label: 'Office Spaces' },
        { key: 'industrialLand', label: 'Industrial Land' },
        
        // Vehicles
        { key: 'cars', label: 'Cars & Bikes' },
        { key: 'secondHandCars', label: 'Second Hand Vehicles' },
        { key: 'carBikeRentals', label: 'Vehicle Rentals' },
        { key: 'cars-bikes', label: 'Cars & Bikes' },
        { key: 'second-hand-cars-bikes', label: 'Second Hand Vehicles' },
        { key: 'car-bike-rentals', label: 'Vehicle Rentals' },
        
        // Equipment & Machinery
        { key: 'heavyEquipment', label: 'Heavy Equipment' },
        { key: 'constructionMaterials', label: 'Construction Materials' },
        { key: 'construction-materials', label: 'Construction Materials' },
        
        // Electronics & Technology
        { key: 'electronics', label: 'Electronics & Gadgets' },
        { key: 'phones', label: 'Phones & Tablets' },
        { key: 'secondHandPhones', label: 'Second Hand Phones' },
        { key: 'computerRepair', label: 'Computer & Laptop Repair' },
        { key: 'cyberCafe', label: 'Cyber Cafe & Internet' },
        { key: 'telecommunication', label: 'Telecommunication Services' },
        { key: 'electronics-gadgets', label: 'Electronics & Gadgets' },
        { key: 'phones-tablets', label: 'Phones & Tablets' },
        { key: 'second-hand-phones', label: 'Second Hand Phones' },
        { key: 'computer-repair', label: 'Computer & Laptop Repair' },
        { key: 'cyber-cafe', label: 'Cyber Cafe & Internet' },
        
        // Education & Training
        { key: 'tuition', label: 'Tuition & Private Classes' },
        { key: 'schools', label: 'Schools, Colleges & Coaching' },
        { key: 'languageClasses', label: 'Language Classes' },
        { key: 'skillTraining', label: 'Skill Training & Certification' },
        { key: 'educationalConsultancy', label: 'Educational Consultancy' },
        { key: 'ebooks', label: 'E-Books & Online Courses' },
        
        // Sports, Fitness & Recreation
        { key: 'dance', label: 'Dance, Karate, Gym & Yoga' },
        { key: 'academies', label: 'Academies (Music, Arts, Sports)' },
        { key: 'cricketTraining', label: 'Cricket & Sports Training' },
        
        // Shopping & Retail
        { key: 'fashion', label: 'Fashion & Beauty Products' },
        { key: 'sareeClothing', label: 'Saree & Clothing' },
        { key: 'jewelry', label: 'Jewelry & Accessories' },
        { key: 'furniture', label: 'Furniture & Interior Decor' },
        { key: 'pharmacy', label: 'Pharmacy & Medical Stores' },
        { key: 'fashion-beauty', label: 'Fashion & Beauty Products' },
        { key: 'jewelry-accessories', label: 'Jewelry & Accessories' },
        { key: 'furniture-interior-decor', label: 'Furniture & Interior Decor' },
        { key: 'pharmacy-medical', label: 'Pharmacy & Medical Stores' },
        
        // Services
        { key: 'household', label: 'Household Services' },
        { key: 'healthWellness', label: 'Health & Wellness Services' },
        { key: 'eventDecoration', label: 'Event Decoration Services' },
        { key: 'transportation', label: 'Transportation & Moving Services' },
        { key: 'serviceCentre', label: 'Service Centre & Warranty' },
        { key: 'vehicleLicense', label: 'Vehicle License Classes' },
        { key: 'household-services', label: 'Household Services' },
        { key: 'health-wellness', label: 'Health & Wellness Services' },
        { key: 'event-decoration', label: 'Event Decoration Services' },
        { key: 'service-centre', label: 'Service Centre & Warranty' },
        
        // Showrooms & Retail
        { key: 'showrooms', label: 'Showrooms' },
        
        // Content
        { key: 'blogPosts', label: 'Blog Posts' },
        { key: 'articles', label: 'Articles' },
        
        // Categories
        { key: 'categories', label: 'Categories' },
        { key: 'subcategories', label: 'Subcategories' },
        
        // Users
        { key: 'users', label: 'Users' },
      ];

      res.json({ sources });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Articles public endpoints
  app.get("/api/articles", async (req, res) => {
    try {
      const { type, featured } = req.query;
      let rows = await db.query.articles.findMany({ orderBy: desc(articles.createdAt) });

      if (type && typeof type === 'string') {
        rows = rows.filter(r => r.type === type);
      }
      if (featured !== undefined) {
        rows = rows.filter(r => !!r.isFeatured === (featured === 'true' || featured === true));
      }

      res.json(rows);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const item = await db.query.articles.findFirst({ where: eq(articles.id, req.params.id) });
      if (!item) return res.status(404).json({ message: "Article not found" });
      // increment viewCount
      const [updated] = await db.update(articles).set({ viewCount: (item.viewCount || 0) + 1, updatedAt: new Date() }).where(eq(articles.id, item.id)).returning();
      res.json(updated || item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: Articles CRUD
  app.get('/api/admin/articles', async (_req, res) => {
    try {
      const list = await db.query.articles.findMany({ orderBy: [desc(articles.createdAt)] });
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/admin/articles/:id', async (req, res) => {
    try {
      const item = await db.query.articles.findFirst({ where: eq(articles.id, req.params.id) });
      if (!item) return res.status(404).json({ message: 'Article not found' });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/admin/articles', async (req, res) => {
    try {
      const payload: any = { ...(req.body || {}) };

      // Basic coercions
      if (payload.pages !== undefined) {
        const p = Number(payload.pages);
        if (Number.isFinite(p) && !isNaN(p)) payload.pages = Math.floor(p);
        else delete payload.pages;
      }
      payload.isFeatured = !!payload.isFeatured;
      payload.isPublished = !!payload.isPublished;
      payload.isPremium = !!payload.isPremium;

      // Parse publishedAt if present
      if (payload.publishedAt) payload.publishedAt = new Date(payload.publishedAt);

      // Validate foreign keys: authorId and categoryId. If referenced rows don't exist, remove the keys to avoid FK violations.
      if (payload.authorId) {
        const author = await db.query.users.findFirst({ where: eq(users.id, payload.authorId) });
        if (!author) delete payload.authorId;
      }
      if (payload.categoryId) {
        const cat = await db.query.articleCategories.findFirst({ where: eq(articleCategories.id, payload.categoryId) });
        if (!cat) {
          delete payload.categoryId;
          if (!payload.categoryName) delete payload.categoryName;
        }
      }

      // Validate with zod schema if provided (non-blocking)
      try { insertArticleSchema.parse(payload); } catch (e) { /* continue without failing */ }

      try {
        const [created] = await db.insert(articles).values({ ...payload }).returning();
        res.status(201).json(created);
      } catch (dbErr: any) {
        // Handle foreign key violations with clearer messages
        const msg = (dbErr && dbErr.message) ? dbErr.message : String(dbErr);
        if (msg.includes('foreign key') || msg.includes('violates foreign key constraint')) {
          return res.status(400).json({ message: 'Foreign key constraint failed. Check authorId and categoryId exist.' });
        }
        throw dbErr;
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put('/api/admin/articles/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const updateData: any = { ...(req.body || {}), updatedAt: new Date() };

      if (updateData.pages !== undefined) {
        const p = Number(updateData.pages);
        if (Number.isFinite(p) && !isNaN(p)) updateData.pages = Math.floor(p);
        else delete updateData.pages;
      }
      if (updateData.isFeatured !== undefined) updateData.isFeatured = !!updateData.isFeatured;
      if (updateData.isPublished !== undefined) updateData.isPublished = !!updateData.isPublished;
      if (updateData.isPremium !== undefined) updateData.isPremium = !!updateData.isPremium;
      if (updateData.publishedAt) updateData.publishedAt = new Date(updateData.publishedAt);

      // Validate foreign keys before updating
      if (updateData.authorId) {
        const author = await db.query.users.findFirst({ where: eq(users.id, updateData.authorId) });
        if (!author) delete updateData.authorId;
      }
      if (updateData.categoryId) {
        const cat = await db.query.articleCategories.findFirst({ where: eq(articleCategories.id, updateData.categoryId) });
        if (!cat) {
          delete updateData.categoryId;
          if (!updateData.categoryName) delete updateData.categoryName;
        }
      }

      const [updated] = await db.update(articles).set(updateData).where(eq(articles.id, id)).returning();
      if (!updated) return res.status(404).json({ message: 'Article not found' });
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete('/api/admin/articles/:id', async (req, res) => {
    try {
      const deleted = await db.delete(articles).where(eq(articles.id, req.params.id)).returning();
      if (deleted.length === 0) return res.status(404).json({ message: 'Article not found' });
      res.json({ message: 'Article deleted', id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch('/api/admin/articles/:id/toggle-publish', async (req, res) => {
    try {
      const item = await db.query.articles.findFirst({ where: eq(articles.id, req.params.id) });
      if (!item) return res.status(404).json({ message: 'Article not found' });
      const [updated] = await db.update(articles).set({ isPublished: !item.isPublished, updatedAt: new Date() }).where(eq(articles.id, req.params.id)).returning();
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Article Categories - Public
  app.get('/api/article-categories', async (_req, res) => {
    try {
      const list = await db.query.articleCategories.findMany({ orderBy: [articleCategories.name] });
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Article Categories - Admin CRUD
  app.get('/api/admin/article-categories', async (_req, res) => {
    try {
      const list = await db.query.articleCategories.findMany({ orderBy: [articleCategories.name] });
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/admin/article-categories', async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      const headerRole = typeof req.headers['x-user-role'] === 'string' ? req.headers['x-user-role'] as string : undefined;
      const bodyRole = req.body?.role;
      const isAdmin = (sessionUser && sessionUser.role === 'admin') || headerRole === 'admin' || bodyRole === 'admin';
      if (!isAdmin) return res.status(403).json({ message: 'Forbidden: admin access required' });

      const payload = req.body || {};
      try { insertArticleCategorySchema.parse(payload); } catch (e) { /* continue */ }

      const [created] = await db.insert(articleCategories).values({ ...payload }).returning();
      res.status(201).json(created);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Public: list videos (optionally filter featured)
  app.get('/api/videos', async (req, res) => {
    try {
      const featured = req.query.featured;
      let rows = await db.query.videos.findMany({ orderBy: [desc(videos.createdAt)] });
      rows = rows.filter(r => !!r.isActive);
      if (featured !== undefined) {
        rows = rows.filter(r => !!r.isFeatured === (featured === 'true' || featured === true));
      }
      res.json(rows);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: Videos CRUD
  app.get('/api/admin/videos', async (_req, res) => {
    try {
      const list = await db.query.videos.findMany({ orderBy: [desc(videos.createdAt)] });
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/admin/videos/:id', async (req, res) => {
    try {
      const item = await db.query.videos.findFirst({ where: eq(videos.id, req.params.id) });
      if (!item) return res.status(404).json({ message: 'Video not found' });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/admin/videos', async (req, res) => {
    try {
      const payload: any = { ...(req.body || {}) };
      const normalizedVideoUrl = (payload.videoUrl ?? payload.video_url) as string | undefined;
      const normalizedTitle = (payload.title ?? payload.name) as string | undefined;

      if (!normalizedTitle || String(normalizedTitle).trim().length === 0) {
        return res.status(400).json({ message: 'title is required' });
      }
      if (!normalizedVideoUrl || String(normalizedVideoUrl).trim().length === 0) {
        return res.status(400).json({ message: 'videoUrl is required' });
      }
      // Normalize keys from frontend to DB column names
      const insertData: any = {
        title: String(normalizedTitle).trim(),
        description: payload.description,
        videoUrl: String(normalizedVideoUrl).trim(),
        thumbnailUrl: payload.thumbnailUrl ?? payload.thumbnail_url,
        durationMinutes: payload.durationMinutes ?? payload.duration ?? undefined,
        isActive: payload.isActive !== undefined ? !!payload.isActive : true,
        isFeatured: payload.isFeatured !== undefined ? !!payload.isFeatured : false,
        userId: payload.userId || null,
      };
      if (insertData.durationMinutes !== undefined) {
        const d = Number(insertData.durationMinutes);
        if (Number.isFinite(d) && !isNaN(d)) insertData.durationMinutes = Math.floor(d);
        else delete insertData.durationMinutes;
      }

      console.log('[videos] creating video', insertData);
      const [created] = await db.insert(videos).values(insertData).returning();
      console.log('[videos] created', created);
      res.status(201).json(created);
    } catch (error: any) {
      console.error('[videos] create error', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.put('/api/admin/videos/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const payload: any = { ...(req.body || {}) };
      const updateData: any = {
        updatedAt: new Date(),
      };
      if (payload.title !== undefined) updateData.title = payload.title;
      if (payload.description !== undefined) updateData.description = payload.description;
      if (payload.videoUrl !== undefined || payload.video_url !== undefined) updateData.videoUrl = payload.videoUrl ?? payload.video_url;
      if (payload.thumbnailUrl !== undefined || payload.thumbnail_url !== undefined) updateData.thumbnailUrl = payload.thumbnailUrl ?? payload.thumbnail_url;
      if (payload.durationMinutes !== undefined || payload.duration !== undefined) updateData.durationMinutes = payload.durationMinutes ?? payload.duration;
      if (payload.isActive !== undefined) updateData.isActive = !!payload.isActive;
      if (payload.isFeatured !== undefined) updateData.isFeatured = !!payload.isFeatured;

      if (updateData.durationMinutes !== undefined) {
        const d = Number(updateData.durationMinutes);
        if (Number.isFinite(d) && !isNaN(d)) updateData.durationMinutes = Math.floor(d);
        else delete updateData.durationMinutes;
      }

      console.log('[videos] update', id, updateData);
      const [updated] = await db.update(videos).set(updateData).where(eq(videos.id, id)).returning();
      if (!updated) return res.status(404).json({ message: 'Video not found' });
      console.log('[videos] updated', updated);
      res.json(updated);
    } catch (error: any) {
      console.error('[videos] update error', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.delete('/api/admin/videos/:id', async (req, res) => {
    try {
      const deleted = await db.delete(videos).where(eq(videos.id, req.params.id)).returning();
      if (deleted.length === 0) return res.status(404).json({ message: 'Video not found' });
      res.json({ message: 'Video deleted', id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch('/api/admin/videos/:id/toggle-active', async (req, res) => {
    try {
      const item = await db.query.videos.findFirst({ where: eq(videos.id, req.params.id) });
      if (!item) return res.status(404).json({ message: 'Video not found' });
      const [updated] = await db.update(videos).set({ isActive: !item.isActive, updatedAt: new Date() }).where(eq(videos.id, req.params.id)).returning();
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch('/api/admin/videos/:id/toggle-featured', async (req, res) => {
    try {
      const item = await db.query.videos.findFirst({ where: eq(videos.id, req.params.id) });
      if (!item) return res.status(404).json({ message: 'Video not found' });
      const [updated] = await db.update(videos).set({ isFeatured: !item.isFeatured, updatedAt: new Date() }).where(eq(videos.id, req.params.id)).returning();
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Media upload endpoint for admin (thumbnails / videos)
  app.post('/api/admin/upload', uploadMedia.single('file'), (req, res) => {
    try {
      // handleMediaUpload will send JSON response
      return handleMediaUpload(req as any, res as any);
    } catch (err: any) {
      res.status(500).json({ message: err?.message || 'Upload failed' });
    }
  });

  app.post('/api/upload', uploadMedia.single('file'), (req, res) => {
    try {
      return handleMediaUpload(req as any, res as any);
    } catch (err: any) {
      res.status(500).json({ message: err?.message || 'Upload failed' });
    }
  });

  // Multiple media upload endpoint for admin (e.g., listing image galleries)
  app.post('/api/admin/upload-multiple', uploadMedia.any(), (req, res) => {
    try {
      const files = (req as any).files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        console.log('[upload-multiple][admin] No files uploaded', {
          contentType: req.headers['content-type'],
          bodyKeys: req.body ? Object.keys(req.body) : [],
        });
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const mapped = files.map((file) => ({
        url: `/uploads/media/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
      }));

      return res.json({ success: true, files: mapped });
    } catch (err: any) {
      console.error('Multi media upload error:', err);
      return res.status(500).json({ message: err?.message || 'Upload failed' });
    }
  });

  app.post('/api/upload-multiple', uploadMedia.any(), (req, res) => {
    try {
      const files = (req as any).files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        console.log('[upload-multiple] No files uploaded', {
          contentType: req.headers['content-type'],
          bodyKeys: req.body ? Object.keys(req.body) : [],
        });
        return res.status(400).json({ message: 'No files uploaded' });
      }

      const mapped = files.map((file) => ({
        url: `/uploads/media/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
      }));

      return res.json({ success: true, files: mapped });
    } catch (err: any) {
      console.error('Multi media upload error:', err);
      return res.status(500).json({ message: err?.message || 'Upload failed' });
    }
  });

  app.put('/api/admin/article-categories/:id', async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      const headerRole = typeof req.headers['x-user-role'] === 'string' ? req.headers['x-user-role'] as string : undefined;
      const bodyRole = req.body?.role;
      const isAdmin = (sessionUser && sessionUser.role === 'admin') || headerRole === 'admin' || bodyRole === 'admin';
      if (!isAdmin) return res.status(403).json({ message: 'Forbidden: admin access required' });

      const payload = req.body || {};
      try { insertArticleCategorySchema.parse(payload); } catch (e) { /* continue */ }

      const [updated] = await db.update(articleCategories).set({ ...payload, updatedAt: new Date() }).where(eq(articleCategories.id, req.params.id)).returning();
      if (!updated) return res.status(404).json({ message: 'Category not found' });
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete('/api/admin/article-categories/:id', async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      const headerRole = typeof req.headers['x-user-role'] === 'string' ? req.headers['x-user-role'] as string : undefined;
      const bodyRole = req.body?.role;
      const isAdmin = (sessionUser && sessionUser.role === 'admin') || headerRole === 'admin' || bodyRole === 'admin';
      if (!isAdmin) return res.status(403).json({ message: 'Forbidden: admin access required' });

      const deleted = await db.delete(articleCategories).where(eq(articleCategories.id, req.params.id)).returning();
      if (deleted.length === 0) return res.status(404).json({ message: 'Category not found' });
      res.json({ message: 'Category deleted', id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });


  app.get("/api/seller/dashboard", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (sessionUser.accountType !== "seller") {
        return res.status(403).json({ message: "Forbidden: seller access required" });
      }

      const sellerId = sessionUser.id as string;

      const seller = await db.query.users.findFirst({
        where: eq(users.id, sellerId),
        columns: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          accountType: true,
          instagramUrl: true,
          facebookUrl: true,
          tiktokUrl: true,
        },
      });

      const [
        rental,
        hostel,
        carsBikesListings,
        propertyDealsListings,
        commercialProps,
        industrialLands,
        officeSpaceListings,
        fashionBeauty,
        constructionMaterialListings,
        heavyEquipmentListings,
        showroomListings,
        secondHandVehicles,
        carBikeRentalListings,
        tuitionClasses,
        danceGymYogaClasses,
        languageClassListings,
        academiesListings,
        skillTrainingListings,
        telecomServices,
        serviceCentreListings,
        schoolCollegeCoachingListings,
        transportationListings,
      ] = await Promise.all([
        db.query.rentalListings.findMany({
          where: eq(rentalListings.userId, sellerId),
          orderBy: desc(rentalListings.createdAt),
        }),
        db.query.hostelPgListings.findMany({
          where: or(eq(hostelPgListings.userId, sellerId), eq(hostelPgListings.ownerId, sellerId)),
          orderBy: desc(hostelPgListings.createdAt),
        }),
        db.query.carsBikes.findMany({
          where: and(
            or(eq(carsBikes.userId, sellerId), eq(carsBikes.sellerId, sellerId)),
            eq(carsBikes.role, "seller"),
          ),
          orderBy: desc(carsBikes.createdAt),
        }),
        db.query.propertyDeals.findMany({
          where: eq(propertyDeals.userId, sellerId),
          orderBy: desc(propertyDeals.createdAt),
        }),
        db.query.commercialProperties.findMany({
          where: eq(commercialProperties.userId, sellerId),
          orderBy: desc(commercialProperties.createdAt),
        }),
        db.query.industrialLand.findMany({
          where: eq(industrialLand.userId, sellerId),
          orderBy: desc(industrialLand.createdAt),
        }),
        db.query.officeSpaces.findMany({
          where: eq(officeSpaces.userId, sellerId),
          orderBy: desc(officeSpaces.createdAt),
        }),
        db.query.fashionBeautyProducts.findMany({
          where: or(eq(fashionBeautyProducts.userId, sellerId), eq(fashionBeautyProducts.sellerId, sellerId)),
          orderBy: desc(fashionBeautyProducts.createdAt),
        }),
        db.query.constructionMaterials.findMany({
          where: eq(constructionMaterials.userId, sellerId),
          orderBy: desc(constructionMaterials.createdAt),
        }),
        db.query.heavyEquipment.findMany({
          where: and(
            or(eq(heavyEquipment.userId, sellerId), eq(heavyEquipment.sellerId, sellerId)),
            eq(heavyEquipment.role, "seller"),
          ),
          orderBy: desc(heavyEquipment.createdAt),
        }),
        db.query.showrooms.findMany({
          where: and(
            or(eq(showrooms.userId, sellerId), eq(showrooms.sellerId, sellerId)),
            eq(showrooms.role, "seller"),
          ),
          orderBy: desc(showrooms.createdAt),
        }),
        db.query.secondHandCarsBikes.findMany({
          where: and(
            or(eq(secondHandCarsBikes.userId, sellerId), eq(secondHandCarsBikes.sellerId, sellerId)),
            eq(secondHandCarsBikes.role, "seller"),
          ),
          orderBy: desc(secondHandCarsBikes.createdAt),
        }),
        db.query.carBikeRentals.findMany({
          where: and(
            or(eq(carBikeRentals.userId, sellerId), eq(carBikeRentals.ownerId, sellerId)),
            eq(carBikeRentals.role, "seller"),
          ),
          orderBy: desc(carBikeRentals.createdAt),
        }),
        db.query.tuitionPrivateClasses.findMany({
          where: eq(tuitionPrivateClasses.userId, sellerId),
          orderBy: desc(tuitionPrivateClasses.createdAt),
        }),
        db.query.danceKarateGymYoga.findMany({
          where: eq(danceKarateGymYoga.userId, sellerId),
          orderBy: desc(danceKarateGymYoga.createdAt),
        }),
        db.query.languageClasses.findMany({
          where: eq(languageClasses.userId, sellerId),
          orderBy: desc(languageClasses.createdAt),
        }),
        db.query.academiesMusicArtsSports.findMany({
          where: eq(academiesMusicArtsSports.userId, sellerId),
          orderBy: desc(academiesMusicArtsSports.createdAt),
        }),
        db.query.skillTrainingCertification.findMany({
          where: eq(skillTrainingCertification.userId, sellerId),
          orderBy: desc(skillTrainingCertification.createdAt),
        }),
        db.query.telecommunicationServices.findMany({
          where: eq(telecommunicationServices.userId, sellerId),
          orderBy: desc(telecommunicationServices.createdAt),
        }),
        db.query.serviceCentreWarranty.findMany({
          where: eq(serviceCentreWarranty.userId, sellerId),
          orderBy: desc(serviceCentreWarranty.createdAt),
        }),
        db.query.schoolsCollegesCoaching.findMany({
          where: eq(schoolsCollegesCoaching.userId, sellerId),
          orderBy: desc(schoolsCollegesCoaching.createdAt),
        }),
        db.query.transportationMovingServices.findMany({
          where: and(
            or(eq(transportationMovingServices.userId, sellerId), eq(transportationMovingServices.ownerId, sellerId)),
            eq(transportationMovingServices.role, "seller"),
          ),
          orderBy: desc(transportationMovingServices.createdAt),
        }),
      ]);

      const normalize = (items: any[], category: string, opts?: { activeField?: string; featuredField?: string }) => {
        const activeKey = opts?.activeField || "isActive";
        const featuredKey = opts?.featuredField || "isFeatured";

        return items.map((item) => {
          const createdAt = item.createdAt ? new Date(item.createdAt) : null;
          return {
            id: item.id,
            title: item.title || item.name || item.showroomName || item.institutionName || "",
            category,
            isActive: item[activeKey] ?? item.active ?? true,
            isFeatured: item[featuredKey] ?? item.featured ?? false,
            viewCount: item.viewCount ?? 0,
            createdAt,
            raw: item,
          };
        });
      };

      const toUiListing = (l: any) => {
        const raw = l.raw || {};
        const price =
          raw.price ??
          raw.pricePerMonth ??
          raw.rentalPricePerDay ??
          raw.rentalPricePerWeek ??
          raw.rentalPricePerMonth ??
          null;

        const type =
          raw.listingType ??
          raw.rentalType ??
          raw.dealType ??
          raw.commercialType ??
          raw.propertyType ??
          raw.hostelType ??
          raw.vehicleType ??
          raw.category ??
          "";

        return {
          id: String(l.id),
          title: String(l.title || ""),
          status: l.isActive ? "active" : "inactive",
          isFeatured: !!l.isFeatured,
          createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : null,
          price,
          views: Number(l.viewCount || 0),
          category: String(l.category || ""),
          subCategory: raw.subcategory ?? raw.subCategory ?? undefined,
          type: String(type || ""),
        };
      };

      const allListings = [
        ...normalize(rental, "rentalListings"),
        ...normalize(hostel, "hostelPgListings", { activeField: "active", featuredField: "featured" }),
        ...normalize(carsBikesListings, "carsBikes"),
        ...normalize(propertyDealsListings, "propertyDeals"),
        ...normalize(commercialProps, "commercialProperties"),
        ...normalize(industrialLands, "industrialLand"),
        ...normalize(officeSpaceListings, "officeSpaces"),
        ...normalize(fashionBeauty, "fashionBeautyProducts"),
        ...normalize(constructionMaterialListings, "constructionMaterials"),
        ...normalize(heavyEquipmentListings, "heavyEquipment"),
        ...normalize(showroomListings, "showrooms"),
        ...normalize(secondHandVehicles, "secondHandCarsBikes"),
        ...normalize(carBikeRentalListings, "carBikeRentals"),
        ...normalize(tuitionClasses, "tuitionPrivateClasses"),
        ...normalize(danceGymYogaClasses, "danceKarateGymYoga"),
        ...normalize(languageClassListings, "languageClasses"),
        ...normalize(academiesListings, "academiesMusicArtsSports"),
        ...normalize(skillTrainingListings, "skillTrainingCertification"),
        ...normalize(telecomServices, "telecommunicationServices"),
        ...normalize(serviceCentreListings, "serviceCentreWarranty"),
        ...normalize(schoolCollegeCoachingListings, "schoolsCollegesCoaching"),
        ...normalize(transportationListings, "transportationMovingServices"),
      ];

      const totalListings = allListings.length;
      const activeListings = allListings.filter((l) => l.isActive).length;
      const featuredListings = allListings.filter((l) => l.isFeatured).length;
      const totalViews = allListings.reduce((sum, l) => sum + (l.viewCount || 0), 0);

      const today = new Date();
      const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayViews = allListings
        .filter((l) => l.createdAt && l.createdAt >= startOfToday)
        .reduce((sum, l) => sum + (l.viewCount || 0), 0);

      const listingsByCategory: Record<string, number> = {};
      const categoryBreakdown: {
        category: string;
        count: number;
        active: number;
        featured: number;
        totalViews: number;
      }[] = [];

      const categoryMap: Record<string, { count: number; active: number; featured: number; totalViews: number }> = {};

      for (const listing of allListings) {
        if (!categoryMap[listing.category]) {
          categoryMap[listing.category] = { count: 0, active: 0, featured: 0, totalViews: 0 };
        }
        const bucket = categoryMap[listing.category];
        bucket.count += 1;
        if (listing.isActive) bucket.active += 1;
        if (listing.isFeatured) bucket.featured += 1;
        bucket.totalViews += listing.viewCount || 0;
      }

      for (const [category, data] of Object.entries(categoryMap)) {
        listingsByCategory[category] = data.count;
        categoryBreakdown.push({
          category,
          ...data,
        });
      }

      const listingsByCategoryArray = Object.entries(listingsByCategory).map(([category, count]) => ({
        category,
        count,
      }));

      const categoryBreakdownRows = Object.entries(categoryMap).map(([category, stats]) => ({
        category,
        subCategory: "-",
        count: stats.count,
      }));

      const statusOverview = {
        active: activeListings,
        inactive: totalListings - activeListings,
        featured: featuredListings,
        nonFeatured: totalListings - featuredListings,
      };

      const recentListings = [...allListings]
        .sort((a, b) => {
          const ad = a.createdAt ? a.createdAt.getTime() : 0;
          const bd = b.createdAt ? b.createdAt.getTime() : 0;
          return bd - ad;
        })
        .slice(0, 10);

      const allListingsUi = allListings.map(toUiListing);
      const recentListingsUi = recentListings.map(toUiListing).slice(0, 5);

      const avgViewsPerListing = totalListings > 0 ? totalViews / totalListings : 0;
      const featuredRate = totalListings > 0 ? featuredListings / totalListings : 0;

      // Additional aggregates for richer analytics
      const totalCategories = Object.keys(categoryMap).length;
      const avgListingsPerCategory = totalCategories > 0 ? totalListings / totalCategories : 0;

      const topCategoriesByViews = Object.entries(categoryMap)
        .map(([category, stats]) => ({
          category,
          count: stats.count,
          totalViews: stats.totalViews,
          avgViews: stats.count > 0 ? stats.totalViews / stats.count : 0,
        }))
        .sort((a, b) => b.totalViews - a.totalViews)
        .slice(0, 5);

      const topListingsByViews = [...allListings]
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 5);

      res.json({
        sellerId,
        role: (sessionUser.role as string) || (sessionUser.accountType as string) || "seller",
        totalListings,
        activeListings,
        featuredListings,
        totalViews,
        todayViews,
        avgViewsPerListing,
        featuredRate,
        totalCategories,
        avgListingsPerCategory,
        listingsByCategory: listingsByCategoryArray,
        categoryBreakdown: categoryBreakdownRows,
        statusOverview,
        topCategoriesByViews,
        topListingsByViews,
        totalInquiries: 0,
        pendingInquiries: 0,
        recentListings: recentListingsUi,
        allListings: allListingsUi,
      });
    } catch (error: any) {
      console.error("Error fetching seller dashboard data:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/seller/profile", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (sessionUser.accountType !== "seller") {
        return res.status(403).json({ message: "Forbidden: seller access required" });
      }

      const sellerId = sessionUser.id as string;
      const seller = await db.query.users.findFirst({
        where: eq(users.id, sellerId),
        columns: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          accountType: true,
          instagramUrl: true,
          facebookUrl: true,
          tiktokUrl: true,
        },
      });

      if (!seller) {
        return res.status(404).json({ message: "Seller not found" });
      }

      res.json(seller);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/seller/profile/social-links", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (sessionUser.accountType !== "seller") {
        return res.status(403).json({ message: "Forbidden: seller access required" });
      }

      const sellerId = sessionUser.id as string;
      const { instagramUrl, facebookUrl, tiktokUrl } = req.body || {};

      const [updatedUser] = await db
        .update(users)
        .set({
          instagramUrl: typeof instagramUrl === "string" ? instagramUrl : null,
          facebookUrl: typeof facebookUrl === "string" ? facebookUrl : null,
          tiktokUrl: typeof tiktokUrl === "string" ? tiktokUrl : null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, sellerId))
        .returning();

      if (!updatedUser) {
        return res.status(404).json({ message: "Seller not found" });
      }

      const { password: _pw, ...userWithoutPassword } = updatedUser as any;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/properties", async (req, res) => {
    try {
      const allProperties = await db.query.properties.findMany({
        with: {
          location: true,
          category: true,
          agency: true,
        },
        orderBy: desc(properties.createdAt),
      });

      res.json(allProperties);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await db.query.properties.findFirst({
        where: eq(properties.id, req.params.id),
        with: {
          location: true,
          category: true,
          agency: true,
        },
      });

      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      res.json(property);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/agencies", async (_req, res) => {
    try {
      const allAgencies = await db.query.agencies.findMany({
        orderBy: desc(agencies.createdAt),
      });

      res.json(allAgencies);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/locations", async (_req, res) => {
    try {
      const allLocations = await db.query.locations.findMany();
      res.json(allLocations);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/faqs", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;

      const allFaqs = category
        ? await db.query.faqs.findMany({
            where: eq(faqs.category, category),
          })
        : await db.query.faqs.findMany();

      res.json(allFaqs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/schools", async (_req, res) => {
    try {
      res.json([]);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/newsletter/subscribe", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || !email.includes("@")) {
        return res.status(400).json({ message: "Invalid email address" });
      }

      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/post-ad', async (req, res) => {
    try {
      const payload = (req.body || {}) as any;

      const title = String(payload.title || '').trim();
      const category = String(payload.category || '').trim();
      const description = String(payload.description || '').trim();
      const location = String(payload.location || '').trim();
      const contactName = String(payload.contactName || '').trim();
      const email = String(payload.email || '').trim();
      const mobile = String(payload.mobile || '').trim();
      const adType = String(payload.adType || '').trim();

      if (!title) return res.status(400).json({ message: 'Ad Title is required' });
      if (!category) return res.status(400).json({ message: 'Category is required' });
      if (!description) return res.status(400).json({ message: 'Description is required' });
      if (!location) return res.status(400).json({ message: 'Location is required' });
      if (!contactName) return res.status(400).json({ message: 'Contact Name is required' });
      if (!email || !email.includes('@')) return res.status(400).json({ message: 'Valid Email Address is required' });
      if (!mobile) return res.status(400).json({ message: 'Mobile Number is required' });
      if (adType !== 'free' && adType !== 'paid') return res.status(400).json({ message: 'Ad Type must be free or paid' });

      const host = process.env.SMTP_HOST;
      const port = Number(process.env.SMTP_PORT || 587);
      const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';
      const user = process.env.SMTP_USER;
      const pass = process.env.SMTP_PASS;
      const from = process.env.SMTP_FROM || user;

      if (!host || !user || !pass || !from) {
        return res.status(500).json({ message: 'SMTP is not configured on the server' });
      }

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });

      const to = process.env.SMTP_TO || from;

      await transporter.sendMail({
        from,
        to,
        replyTo: email,
        subject: `New Ad Submission: ${title}`,
        text:
          `Ad Title: ${title}\n` +
          `Category: ${category}\n` +
          `Description: ${description}\n` +
          `Location: ${location}\n` +
          `Contact Name: ${contactName}\n` +
          `Email: ${email}\n` +
          `Mobile Number: ${mobile}\n` +
          `Ad Type: ${adType}\n`,
      });

      res.status(200).json({ message: 'Submitted' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Failed to submit' });
    }
  });

  // Contact form - public submit
  app.post('/api/contact', async (req, res) => {
    try {
      const payload = req.body || {};
      try { insertContactMessageSchema.parse(payload); } catch (e) { /* continue */ }

      const [created] = await db.insert(contactMessages).values({ ...payload }).returning();
      res.status(201).json(created);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: list contact messages
  app.get('/api/admin/contact-messages', async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      const headerRole = typeof req.headers['x-user-role'] === 'string' ? req.headers['x-user-role'] as string : undefined;
      const bodyRole = req.body?.role;
      const isAdmin = (sessionUser && sessionUser.role === 'admin') || headerRole === 'admin' || bodyRole === 'admin';
      if (!isAdmin) return res.status(403).json({ message: 'Forbidden: admin access required' });

      const list = await db.query.contactMessages.findMany({ orderBy: [desc(contactMessages.createdAt)] });
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch('/api/admin/contact-messages/:id/read', async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      const headerRole = typeof req.headers['x-user-role'] === 'string' ? req.headers['x-user-role'] as string : undefined;
      const bodyRole = req.body?.role;
      const isAdmin = (sessionUser && sessionUser.role === 'admin') || headerRole === 'admin' || bodyRole === 'admin';
      if (!isAdmin) return res.status(403).json({ message: 'Forbidden: admin access required' });

      const [updated] = await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, req.params.id)).returning();
      if (!updated) return res.status(404).json({ message: 'Message not found' });
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete('/api/admin/contact-messages/:id', async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user;
      const headerRole = typeof req.headers['x-user-role'] === 'string' ? req.headers['x-user-role'] as string : undefined;
      const bodyRole = req.body?.role;
      const isAdmin = (sessionUser && sessionUser.role === 'admin') || headerRole === 'admin' || bodyRole === 'admin';
      if (!isAdmin) return res.status(403).json({ message: 'Forbidden: admin access required' });

      const deleted = await db.delete(contactMessages).where(eq(contactMessages.id, req.params.id)).returning();
      if (deleted.length === 0) return res.status(404).json({ message: 'Message not found' });
      res.json({ message: 'Message deleted', id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/categories", async (_req, res) => {
    try {
      const categories = await db.query.adminCategories.findMany({
        with: {
          subcategories: true,
        },
        orderBy: [adminCategories.sortOrder, adminCategories.name],
      });

      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/categories", async (req, res) => {
    try {
      const validatedData = insertAdminCategorySchema.parse(req.body);

      const [newCategory] = await db
        .insert(adminCategories)
        .values(validatedData)
        .returning();

      res.json(newCategory);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/categories/:id", async (req, res) => {
    try {
      const validatedData = insertAdminCategorySchema.parse(req.body);

      const [updatedCategory] = await db
        .update(adminCategories)
        .set({ ...validatedData, updatedAt: new Date() })
        .where(eq(adminCategories.id, req.params.id))
        .returning();

      if (!updatedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(updatedCategory);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    try {
      await db
        .delete(adminCategories)
        .where(eq(adminCategories.id, req.params.id));

      res.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/subcategories", async (req, res) => {
    try {
      const validatedData = insertAdminSubcategorySchema.parse(req.body);

      const [newSubcategory] = await db
        .insert(adminSubcategories)
        .values(validatedData)
        .returning();

      res.json(newSubcategory);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/subcategories/:id", async (req, res) => {
    try {
      const validatedData = insertAdminSubcategorySchema.parse(req.body);

      const [updatedSubcategory] = await db
        .update(adminSubcategories)
        .set({ ...validatedData, updatedAt: new Date() })
        .where(eq(adminSubcategories.id, req.params.id))
        .returning();

      if (!updatedSubcategory) {
        return res.status(404).json({ message: "Subcategory not found" });
      }

      res.json(updatedSubcategory);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/subcategories/:id", async (req, res) => {
    try {
      await db
        .delete(adminSubcategories)
        .where(eq(adminSubcategories.id, req.params.id));

      res.json({ message: "Subcategory deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/users", async (_req, res) => {
    try {
      const allUsers = await db.query.users.findMany({
        orderBy: desc(users.createdAt),
      });

      const usersWithoutPasswords = allUsers.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // User Login (Public Endpoint) - /api/auth/login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      // Find user by email
      const user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check password (in production, use bcrypt.compare)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({ message: "Account is inactive. Please contact support." });
      }

      // Return user without password and store user in server session
      const { password: _, ...userWithoutPassword } = user;
      try {
        (req as any).session = (req as any).session || {};
        (req as any).session.user = userWithoutPassword;
      } catch (e) {
        // ignore session set errors (session middleware may not be configured)
      }

      res.json({
        message: "Login successful",
        user: userWithoutPassword,
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User Registration (Public Endpoint) - /api/auth/signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        password,
        accountType,
        proProfileTypeId,
        proProfileValues: proProfileValuesPayload,
        categoryIds,
        subcategoryIds,
        location,
        documents,
        additionalInfo,
      } = req.body;

      if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const normalizedPhone = String(phone).trim();

      // Generate username from email
      const username = normalizedEmail.split('@')[0];

      const existingByEmail = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, normalizedEmail),
      });
      if (existingByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const existingByPhone = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.phone, normalizedPhone),
      });
      if (existingByPhone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }

      const existingByUsername = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, username),
      });
      if (existingByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Build selected services array from category and subcategory IDs
      let selectedServicesArray: string[] = [];

      if (categoryIds && Array.isArray(categoryIds)) {
        // Get all categories with their subcategories
        const allCategories = await db.query.adminCategories.findMany({
          with: {
            subcategories: true,
          },
        });

        // Add category slugs
        categoryIds.forEach((categoryId: string) => {
          const category = allCategories.find(c => c.id === categoryId);
          if (category) {
            selectedServicesArray.push(category.slug);
          }
        });

        // Add subcategory slugs
        if (subcategoryIds && Array.isArray(subcategoryIds)) {
          subcategoryIds.forEach((subId: string) => {
            for (const cat of allCategories) {
              const subcategory = cat.subcategories.find(sub => sub.id === subId);
              if (subcategory) {
                selectedServicesArray.push(subcategory.slug);
                break;
              }
            }
          });
        }
      }

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          username,
          email: normalizedEmail,
          password, // In production, hash this password!
          firstName,
          lastName,
          phone: normalizedPhone,
          accountType,
          selectedServices: selectedServicesArray,
          country: location?.country,
          state: location?.state,
          city: location?.city,
          area: location?.area,
          address: location?.address,
          postalCode: location?.postalCode,
          role: "user",
        })
        .returning();

      // Create pro profile (if pro)
      if (accountType === 'pro') {
        if (!proProfileTypeId || typeof proProfileTypeId !== 'string') {
          return res.status(400).json({ message: 'proProfileTypeId is required for pro accounts' });
        }

        const type = await db.query.proProfileTypes.findFirst({ where: eq(proProfileTypes.id, proProfileTypeId) });
        if (!type) {
          return res.status(400).json({ message: 'Invalid proProfileTypeId' });
        }

        const [profile] = await db
          .insert(proProfiles)
          .values({ userId: newUser.id, profileTypeId: proProfileTypeId })
          .returning();

        const payload = (proProfileValuesPayload && typeof proProfileValuesPayload === 'object') ? proProfileValuesPayload : {};
        const fields = await db.query.proProfileFields.findMany({ where: eq(proProfileFields.profileTypeId, proProfileTypeId) });

        const valuesToInsert = fields
          .map((f: any) => {
            const v = (payload as any)[f.key];
            if (v === undefined) return null;
            return { profileId: profile.id, fieldId: f.id, value: v };
          })
          .filter(Boolean) as any[];

        if (valuesToInsert.length > 0) {
          await db.insert(proProfileValues).values(valuesToInsert);
        }
      }

      // Add category preferences if provided
      if (categoryIds && Array.isArray(categoryIds)) {
        // Get all categories with their subcategories (reuse if already fetched)
        const allCategories = await db.query.adminCategories.findMany({
          with: {
            subcategories: true,
          },
        });

        const preferences = categoryIds.map((categoryId: string) => {
          // Find the category
          const category = allCategories.find(c => c.id === categoryId);

          // Filter subcategories that belong to this category and are selected
          const categorySubcategories = subcategoryIds && Array.isArray(subcategoryIds)
            ? subcategoryIds.filter((subId: string) =>
                category?.subcategories.some(sub => sub.id === subId)
              )
            : [];

          return {
            userId: newUser.id,
            categorySlug: categoryId,
            subcategorySlugs: categorySubcategories,
          };
        });

        if (preferences.length > 0) {
          await db.insert(userCategoryPreferences).values(preferences);
        }
      }

      // Add documents if provided
      if (documents && Array.isArray(documents) && documents.length > 0) {
        const docs = documents
          .filter((doc: any) => doc && doc.name && doc.url) // Filter out invalid documents
          .map((doc: any) => ({
            userId: newUser.id,
            documentName: doc.name,
            documentUrl: doc.url,
            documentType: doc.type || 'unknown',
            fileSize: doc.size || 0,
          }));

        if (docs.length > 0) {
          await db.insert(userDocuments).values(docs);
        }
      }

      const { password: _, ...userWithoutPassword } = newUser;
      res.json({
        message: "User registered successfully",
        user: userWithoutPassword,
      });
    } catch (error: any) {
      console.error("Signup error:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // User Registration (Public Endpoint) - /api/users/register (legacy)
  app.post("/api/users/register", async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        firstName,
        lastName,
        phone,
        accountType,
        country,
        state,
        city,
        area,
        address,
        postalCode,
        categoryPreferences,
        documents,
      } = req.body;

      if (!username || !email || !password || !firstName || !lastName || !phone) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const normalizedEmail = String(email).trim().toLowerCase();
      const normalizedPhone = String(phone).trim();
      const normalizedUsername = String(username).trim();

      const existingByEmail = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, normalizedEmail),
      });
      if (existingByEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const existingByPhone = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.phone, normalizedPhone),
      });
      if (existingByPhone) {
        return res.status(400).json({ message: "Phone number already exists" });
      }

      const existingByUsername = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.username, normalizedUsername),
      });
      if (existingByUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          username: normalizedUsername,
          email: normalizedEmail,
          password, // In production, hash this password!
          firstName,
          lastName,
          phone: normalizedPhone,
          accountType,
          country,
          state,
          city,
          area,
          address,
          postalCode,
          role: "user",
        })
        .returning();

      // Add category preferences if provided
      if (categoryPreferences && Array.isArray(categoryPreferences)) {
        await db.insert(userCategoryPreferences).values(
          categoryPreferences.map((pref: any) => ({
            userId: newUser.id,
            categorySlug: pref.categorySlug,
            subcategorySlugs: pref.subcategorySlugs || [],
          }))
        );
      }

      // Add documents if provided
      if (documents && Array.isArray(documents)) {
        await db.insert(userDocuments).values(
          documents.map((doc: any) => ({
            userId: newUser.id,
            documentName: doc.documentName,
            documentUrl: doc.documentUrl,
            documentType: doc.documentType,
            fileSize: doc.fileSize,
          }))
        );
      }

      const { password: _, ...userWithoutPassword } = newUser;
      res.json({
        message: "User registered successfully",
        user: userWithoutPassword,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Forgot Password - Send reset link
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const normalizedEmail = String(email).trim().toLowerCase();

      // Find user by email
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, normalizedEmail),
      });

      // Always return success to prevent email enumeration attacks
      if (!user) {
        return res.json({ 
          message: "If an account with that email exists, we have sent a password reset link." 
        });
      }

      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

      // Update user with reset token
      await db
        .update(users)
        .set({ 
          resetToken,
          resetTokenExpiry,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      // Construct reset URL
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

      // Check if nodemailer is configured
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        // Send email
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: process.env.SMTP_FROM || '"Jeevika Services" <noreply@jeevika.com>',
          to: user.email,
          subject: 'Password Reset - Jeevika Services',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #0B8457;">Password Reset Request</h2>
              <p>Hello ${user.firstName || user.username},</p>
              <p>You requested a password reset for your Jeevika Services account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background-color: #0B8457; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>
              <p><strong>This link expires in 1 hour.</strong></p>
              <p>If you didn't request this, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="color: #999; font-size: 12px;">Jeevika Services Pvt. Ltd.</p>
            </div>
          `,
          text: `Password Reset Request\n\nHello ${user.firstName || user.username},\n\nYou requested a password reset for your Jeevika Services account.\n\nClick the link below to reset your password:\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nJeevika Services Pvt. Ltd.`
        };

        await transporter.sendMail(mailOptions);
      }

      res.json({ 
        message: "If an account with that email exists, we have sent a password reset link." 
      });
    } catch (error: any) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Failed to process request" });
    }
  });

  // Reset Password with token
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ message: "Token and new password are required" });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      // Find user with matching reset token that hasn't expired
      const user = await db.query.users.findFirst({
        where: (users, { and, eq }) => and(
          eq(users.resetToken, token),
          eq(users.resetTokenExpiry, users.resetTokenExpiry)
        ),
      });

      if (!user || !user.resetTokenExpiry || new Date() > user.resetTokenExpiry) {
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Update password and clear reset token
      await db
        .update(users)
        .set({ 
          password,
          resetToken: null,
          resetTokenExpiry: null,
          updatedAt: new Date()
        })
        .where(eq(users.id, user.id));

      res.json({ message: "Password reset successful. You can now login with your new password." });
    } catch (error: any) {
      console.error("Reset password error:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Get user by ID with preferences and documents
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.id, req.params.id),
        with: {
          categoryPreferences: true,
          documents: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Fetch all categories with subcategories for mapping
      const allCategories = await db.query.adminCategories.findMany({
        with: {
          subcategories: true,
        },
      });

      // Fetch selected services details if selectedServices exists
      let selectedServicesDetails = [];
      if (user.selectedServices && Array.isArray(user.selectedServices) && user.selectedServices.length > 0) {
        selectedServicesDetails = user.selectedServices.map(serviceSlug => {
          // Check if it's a category
          const category = allCategories.find(cat => cat.slug === serviceSlug);
          if (category) {
            return {
              slug: category.slug,
              name: category.name,
              type: 'category'
            };
          }

          // Check if it's a subcategory
          for (const cat of allCategories) {
            const subcategory = cat.subcategories.find(sub => sub.slug === serviceSlug);
            if (subcategory) {
              return {
                slug: subcategory.slug,
                name: subcategory.name,
                type: 'subcategory',
                parentCategory: cat.name
              };
            }
          }

          // Return the slug if not found
          return {
            slug: serviceSlug,
            name: serviceSlug,
            type: 'unknown'
          };
        });
      }

      // Enrich categoryPreferences with actual names
      const categoryPreferencesWithNames = user.categoryPreferences.map(pref => {
        const category = allCategories.find(cat => cat.id === pref.categorySlug || cat.slug === pref.categorySlug);

        const subcategoriesWithNames = pref.subcategorySlugs.map((subSlug: string) => {
          if (category) {
            const subcategory = category.subcategories.find(sub => sub.id === subSlug || sub.slug === subSlug);
            if (subcategory) {
              return {
                id: subcategory.id,
                slug: subcategory.slug,
                name: subcategory.name
              };
            }
          }
          // Fallback: search in all categories
          for (const cat of allCategories) {
            const subcategory = cat.subcategories.find(sub => sub.id === subSlug || sub.slug === subSlug);
            if (subcategory) {
              return {
                id: subcategory.id,
                slug: subcategory.slug,
                name: subcategory.name
              };
            }
          }
          return {
            id: subSlug,
            slug: subSlug,
            name: subSlug
          };
        });

        return {
          ...pref,
          categoryName: category?.name || pref.categorySlug,
          categoryId: category?.id,
          subcategoriesWithNames
        };
      });

      const { password: _, ...userWithoutPassword } = user;
      res.json({
        ...userWithoutPassword,
        categoryPreferences: categoryPreferencesWithNames,
        selectedServicesDetails
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update user
  app.put("/api/users/:id", async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        phone,
        country,
        state,
        city,
        area,
        address,
        postalCode,
        avatar,
      } = req.body;

      const [updatedUser] = await db
        .update(users)
        .set({
          firstName,
          lastName,
          phone,
          country,
          state,
          city,
          area,
          address,
          postalCode,
          avatar,
          updatedAt: new Date(),
        })
        .where(eq(users.id, req.params.id))
        .returning();

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Delete user
  app.delete("/api/users/:id", async (req, res) => {
    try {
      await db.delete(users).where(eq(users.id, req.params.id));
      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update user category preferences
  app.put("/api/users/:id/preferences", async (req, res) => {
    try {
      const { categoryPreferences } = req.body;

      // Delete existing preferences
      await db.delete(userCategoryPreferences).where(eq(userCategoryPreferences.userId, req.params.id));

      // Insert new preferences
      if (categoryPreferences && Array.isArray(categoryPreferences)) {
        await db.insert(userCategoryPreferences).values(
          categoryPreferences.map((pref: any) => ({
            userId: req.params.id,
            categorySlug: pref.categorySlug,
            subcategorySlugs: pref.subcategorySlugs || [],
          }))
        );
      }

      res.json({ message: "Preferences updated successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Create a new listing (user endpoint)
  app.post("/api/listings", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const { tableName, ...data } = req.body;
      
      const userId = sessionUser?.id || data.userId;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const tables: Record<string, any> = {
        'properties': properties,
        'rental-listings': rentalListings,
        'cars-bikes': carsBikes,
        'second-hand-cars-bikes': secondHandCarsBikes,
        'electronics-gadgets': electronicsGadgets,
        'phones-tablets-accessories': phonesTabletsAccessories,
        'second-hand-phones-tablets-accessories': secondHandPhonesTabletsAccessories,
        'furniture-interior-decor': furnitureInteriorDecor,
        'fashion-beauty-products': fashionBeautyProducts,
        'household-services': householdServices,
        'car-bike-rentals': carBikeRentals,
        'heavy-equipment': heavyEquipment,
        'construction-materials': constructionMaterials,
        'tuition-classes': tuitionPrivateClasses,
      };

      const table = tables[tableName];
      if (!table) {
        return res.status(400).json({ message: "Invalid table name" });
      }

      // Add userId and defaults
      const insertData = {
        ...data,
        userId,
        isActive: true,
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [newListing] = await db.insert(table).values(insertData).returning();
      res.status(201).json(newListing);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get user's listings
  app.get("/api/user/listings", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const userId = sessionUser?.id || req.query.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const listings: any[] = [];
      
      // Fetch from each table
      const [props, rentals, hostels, cars, secondCars, bikes, electronics, phones, secondPhones, furniture, fashion, services] = await Promise.all([
        db.select().from(properties).where(eq(properties.userId, userId)).orderBy(desc(properties.createdAt)),
        db.select().from(rentalListings).where(eq(rentalListings.userId, userId)).orderBy(desc(rentalListings.createdAt)),
        db.select().from(hostelPgListings).where(eq(hostelPgListings.userId, userId)).orderBy(desc(hostelPgListings.createdAt)),
        db.select().from(carsBikes).where(eq(carsBikes.userId, userId)).orderBy(desc(carsBikes.createdAt)),
        db.select().from(secondHandCarsBikes).where(eq(secondHandCarsBikes.userId, userId)).orderBy(desc(secondHandCarsBikes.createdAt)),
        db.select().from(electronicsGadgets).where(eq(electronicsGadgets.userId, userId)).orderBy(desc(electronicsGadgets.createdAt)),
        db.select().from(phonesTabletsAccessories).where(eq(phonesTabletsAccessories.userId, userId)).orderBy(desc(phonesTabletsAccessories.createdAt)),
        db.select().from(secondHandPhonesTabletsAccessories).where(eq(secondHandPhonesTabletsAccessories.userId, userId)).orderBy(desc(secondHandPhonesTabletsAccessories.createdAt)),
        db.select().from(furnitureInteriorDecor).where(eq(furnitureInteriorDecor.userId, userId)).orderBy(desc(furnitureInteriorDecor.createdAt)),
        db.select().from(fashionBeautyProducts).where(eq(fashionBeautyProducts.userId, userId)).orderBy(desc(fashionBeautyProducts.createdAt)),
        db.select().from(householdServices).where(eq(householdServices.userId, userId)).orderBy(desc(householdServices.createdAt)),
      ]);

      // Add tableName to each listing for routing
      const addTableName = (items: any[], tableName: string) => 
        items.map(item => ({ ...item, tableName, status: item.isActive ? 'active' : 'inactive' }));

      listings.push(
        ...addTableName(props, 'properties'),
        ...addTableName(rentals, 'rental-listings'),
        ...addTableName(hostels, 'hostel-listings'),
        ...addTableName(cars, 'cars-bikes'),
        ...addTableName(secondCars, 'second-hand-cars-bikes'),
        ...addTableName(electronics, 'electronics-gadgets'),
        ...addTableName(phones, 'phones-tablets-accessories'),
        ...addTableName(secondPhones, 'second-hand-phones-tablets-accessories'),
        ...addTableName(furniture, 'furniture-interior-decor'),
        ...addTableName(fashion, 'fashion-beauty-products'),
        ...addTableName(services, 'household-services'),
      );

      // Sort by creation date
      listings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete a user's listing
  app.delete("/api/user/listings/:id", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const userId = sessionUser?.id || req.query.userId;
      const listingId = parseInt(req.params.id);
      const { tableName } = req.query;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const tables: Record<string, any> = {
        'properties': properties,
        'rental-listings': rentalListings,
        'hostel-listings': hostelPgListings,
        'cars-bikes': carsBikes,
        'second-hand-cars-bikes': secondHandCarsBikes,
        'electronics-gadgets': electronicsGadgets,
        'phones-tablets-accessories': phonesTabletsAccessories,
        'second-hand-phones-tablets-accessories': secondHandPhonesTabletsAccessories,
        'furniture-interior-decor': furnitureInteriorDecor,
        'fashion-beauty-products': fashionBeautyProducts,
        'household-services': householdServices,
      };

      const table = tables[tableName as string];
      if (!table) {
        return res.status(400).json({ message: "Invalid table name" });
      }

      // Get the id column name based on table
      const idColumn = 'id';

      // Delete the listing
      await db.delete(table).where(and(eq((table as any)[idColumn], listingId), eq((table as any).userId, userId)));

      res.json({ message: "Listing deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: Create user
  app.post("/api/admin/users", async (req, res) => {
    try {
      const { username, email, password, role, firstName, lastName, phone } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const [newUser] = await db
        .insert(users)
        .values({
          username,
          email,
          password,
          role,
          firstName,
          lastName,
          phone,
        })
        .returning();

      const { password: _, ...userWithoutPassword } = newUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: Update user
  app.put("/api/admin/users/:id", async (req, res) => {
    try {
      const { role, isActive } = req.body;

      const [updatedUser] = await db
        .update(users)
        .set({
          role,
          isActive,
          updatedAt: new Date(),
        })
        .where(eq(users.id, req.params.id))
        .returning();

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: Delete user
  app.delete("/api/admin/users/:id", async (req, res) => {
    try {
      await db.delete(users).where(eq(users.id, req.params.id));
      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Sliders - Admin CRUD + Public list
  // Public: get active sliders, optionally filtered by pageType
  app.get("/api/sliders", async (req, res) => {
    try {
      const { pageType } = req.query;
      
      let whereCondition: any = eq(sliders.isActive, true);
      
      // If pageType is provided, filter by it
      if (pageType && typeof pageType === "string") {
        whereCondition = (sliders, { and, eq }) => and(
          eq(sliders.isActive, true),
          eq(sliders.pageType, pageType)
        );
      }
      
      const allActive = await db.query.sliders.findMany({
        where: whereCondition,
        orderBy: [sliders.sortOrder, desc(sliders.createdAt)],
      });
      res.json(allActive);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Public: get active slider cards for homepage
  app.get("/api/slider-cards", async (_req, res) => {
    try {
      const allActive = await db.query.sliderCard.findMany({
        where: eq(sliderCard.status, "Active"),
        orderBy: [desc(sliderCard.createdAt)],
      });
      res.json(allActive);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: list all sliders
  app.get("/api/admin/sliders", async (_req, res) => {
    try {
      const list = await db.query.sliders.findMany({
        orderBy: [sliders.sortOrder, desc(sliders.createdAt)],
      });
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: list all slider cards
  app.get("/api/admin/slider-card", async (_req, res) => {
    try {
      const list = await db.query.sliderCard.findMany({ orderBy: [sliderCard.createdAt] });
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: get single slider card
  app.get('/api/admin/slider-card/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });
      const item = await db.query.sliderCard.findFirst({ where: eq(sliderCard.id, id) });
      if (!item) return res.status(404).json({ message: 'Slider card not found' });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: create slider card
  app.post('/api/admin/slider-card', async (req, res) => {
    try {
      const payload = req.body || {};
      // Normalize
      if (payload.status !== undefined) payload.status = String(payload.status || 'Active');
      // Remove id if provided to let DB generate it
      delete payload.id;

      const [created] = await db.insert(sliderCard).values({ ...payload }).returning();
      res.status(201).json(created);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: update slider card
  app.put('/api/admin/slider-card/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });
      const payload = { ...(req.body || {}), updatedAt: new Date() };
      if (payload.status !== undefined) payload.status = String(payload.status);

      const [updated] = await db.update(sliderCard).set(payload).where(eq(sliderCard.id, id)).returning();
      if (!updated) return res.status(404).json({ message: 'Slider card not found' });
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: delete slider card
  app.delete('/api/admin/slider-card/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });
      const deleted = await db.delete(sliderCard).where(eq(sliderCard.id, id)).returning();
      if (deleted.length === 0) return res.status(404).json({ message: 'Slider card not found' });
      res.json({ message: 'Slider card deleted successfully', id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: toggle active status
  app.patch('/api/admin/slider-card/:id/toggle-active', async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isFinite(id)) return res.status(400).json({ message: 'Invalid id' });
      const item = await db.query.sliderCard.findFirst({ where: eq(sliderCard.id, id) });
      if (!item) return res.status(404).json({ message: 'Slider card not found' });
      const nextStatus = (item.status || 'Active') === 'Active' ? 'Inactive' : 'Active';
      const [updated] = await db.update(sliderCard).set({ status: nextStatus, updatedAt: new Date() }).where(eq(sliderCard.id, id)).returning();
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: get single slider
  app.get("/api/admin/sliders/:id", async (req, res) => {
    try {
      const item = await db.query.sliders.findFirst({ where: eq(sliders.id, req.params.id) });
      if (!item) return res.status(404).json({ message: "Slider not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: create slider
  app.post("/api/admin/sliders", async (req, res) => {
    try {
      const payload = req.body || {};
      // Basic coercions
      if (payload.sortOrder !== undefined) payload.sortOrder = parseInt(payload.sortOrder) || 0;
      if (payload.isActive !== undefined) payload.isActive = !!payload.isActive;

      const [newSlider] = await db.insert(sliders).values({ ...payload }).returning();
      res.status(201).json(newSlider);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: update slider
  app.put("/api/admin/sliders/:id", async (req, res) => {
    try {
      const payload = req.body || {};
      if (payload.sortOrder !== undefined) payload.sortOrder = parseInt(payload.sortOrder) || 0;
      if (payload.isActive !== undefined) payload.isActive = !!payload.isActive;

      const [updated] = await db
        .update(sliders)
        .set({ ...payload, updatedAt: new Date() })
        .where(eq(sliders.id, req.params.id))
        .returning();

      if (!updated) return res.status(404).json({ message: "Slider not found" });
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Admin: delete slider
  app.delete("/api/admin/sliders/:id", async (req, res) => {
    try {
      const deleted = await db.delete(sliders).where(eq(sliders.id, req.params.id)).returning();
      if (deleted.length === 0) return res.status(404).json({ message: "Slider not found" });
      res.json({ message: "Slider deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: toggle active
  app.patch("/api/admin/sliders/:id/toggle-active", async (req, res) => {
    try {
      const item = await db.query.sliders.findFirst({ where: eq(sliders.id, req.params.id) });
      if (!item) return res.status(404).json({ message: "Slider not found" });
      const [updated] = await db
        .update(sliders)
        .set({ isActive: !item.isActive, updatedAt: new Date() })
        .where(eq(sliders.id, req.params.id))
        .returning();
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Blog public endpoints
  app.get("/api/blog/categories", async (_req, res) => {
    try {
      const categories = await db.query.adminCategories.findMany({
        where: eq(adminCategories.isActive, true),
        orderBy: [adminCategories.sortOrder, adminCategories.name],
      });
      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/blog/posts", async (req, res) => {
    try {
      const { category } = req.query;

      let posts;
      if (category && typeof category === "string") {
        posts = await db.query.blogPosts.findMany({
          where: (blogPosts, { and, eq }) => and(eq(blogPosts.isPublished, true), eq(blogPosts.category, category)),
          orderBy: [desc(blogPosts.publishedAt), desc(blogPosts.createdAt)],
        });
      } else {
        posts = await db.query.blogPosts.findMany({
          where: eq(blogPosts.isPublished, true),
          orderBy: [desc(blogPosts.publishedAt), desc(blogPosts.createdAt)],
        });
      }

      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const slug = req.params.slug;
      const post = await db.query.blogPosts.findFirst({ where: eq(blogPosts.slug, slug) });
      if (!post || !post.isPublished) return res.status(404).json({ message: "Post not found" });

      // increment viewCount
      const [updated] = await db
        .update(blogPosts)
        .set({ viewCount: (post.viewCount || 0) + 1, updatedAt: new Date() })
        .where(eq(blogPosts.id, post.id))
        .returning();

      res.json(updated || post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Admin: Blog posts CRUD (used by admin dashboard)
  app.get('/api/admin/blog/posts', async (_req, res) => {
    try {
      const list = await db.query.blogPosts.findMany({ orderBy: [desc(blogPosts.createdAt)] });
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/admin/blog/posts/:id', async (req, res) => {
    try {
      const item = await db.query.blogPosts.findFirst({ where: eq(blogPosts.id, req.params.id) });
      if (!item) return res.status(404).json({ message: 'Post not found' });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/admin/blog/posts', async (req, res) => {
    try {
      const payload = req.body || {};
      // Ensure minimal coercions
      if (payload.publishedAt) payload.publishedAt = new Date(payload.publishedAt);
      const [created] = await db.insert(blogPosts).values({ ...payload }).returning();
      res.status(201).json(created);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put('/api/admin/blog/posts/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const updateData = { ...req.body, updatedAt: new Date() };
      if (updateData.publishedAt) updateData.publishedAt = new Date(updateData.publishedAt);
      const [updated] = await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id)).returning();
      if (!updated) return res.status(404).json({ message: 'Post not found' });
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete('/api/admin/blog/posts/:id', async (req, res) => {
    try {
      const deleted = await db.delete(blogPosts).where(eq(blogPosts.id, req.params.id)).returning();
      if (deleted.length === 0) return res.status(404).json({ message: 'Post not found' });
      res.json({ message: 'Post deleted', id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch('/api/admin/blog/posts/:id/toggle-publish', async (req, res) => {
    try {
      const item = await db.query.blogPosts.findFirst({ where: eq(blogPosts.id, req.params.id) });
      if (!item) return res.status(404).json({ message: 'Post not found' });
      const [updated] = await db
        .update(blogPosts)
        .set({ isPublished: !item.isPublished, publishedAt: !item.isPublished ? new Date() : item.publishedAt, updatedAt: new Date() })
        .where(eq(blogPosts.id, req.params.id))
        .returning();
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Rental Listings Routes - Full CRUD

  // GET all rental listings
  app.get("/api/admin/rental-listings", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const isAdmin = sessionUser.role === 'admin' || sessionUser.role === 'super_admin';
      const isSeller = sessionUser.accountType === 'seller';

      if (!isAdmin && !isSeller) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const listings = await db.query.rentalListings.findMany({
        where: isAdmin ? undefined : eq(rentalListings.userId, sessionUser.id as string),
        orderBy: desc(rentalListings.createdAt),
      });
      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single rental listing by ID
  app.get("/api/admin/rental-listings/:id", async (req, res) => {
    try {
      const listing = await db.query.rentalListings.findFirst({
        where: eq(rentalListings.id, req.params.id),
      });

      if (!listing) {
        return res.status(404).json({ message: "Rental listing not found" });
      }

      res.json(listing);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new rental listing
  app.post("/api/admin/rental-listings", async (req, res) => {
    try {
      const {
        price,
        bedrooms,
        bathrooms,
        area,
        depositAmount,
        ...otherData
      } = req.body;

      const [newListing] = await db
        .insert(rentalListings)
        .values({
          ...otherData,
          price: price ? parseFloat(price.toString()) : null,
          bedrooms: bedrooms ? parseInt(bedrooms.toString()) : null,
          bathrooms: bathrooms ? parseInt(bathrooms.toString()) : null,
          area: area ? parseInt(area.toString()) : null,
          depositAmount: depositAmount ? parseFloat(depositAmount.toString()) : null,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newListing);
    } catch (error: any) {
      console.error("Error creating rental listing:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE rental listing
  app.put("/api/admin/rental-listings/:id", async (req, res) => {
    try {
      const [updatedListing] = await db
        .update(rentalListings)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(rentalListings.id, req.params.id))
        .returning();

      if (!updatedListing) {
        return res.status(404).json({ message: "Rental listing not found" });
      }

      res.json(updatedListing);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE rental listing
  app.delete("/api/admin/rental-listings/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(rentalListings)
        .where(eq(rentalListings.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Rental listing not found" });
      }

      res.json({ message: "Rental listing deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/rental-listings/:id/toggle-active", async (req, res) => {
    try {
      const listing = await db.query.rentalListings.findFirst({
        where: eq(rentalListings.id, req.params.id),
      });

      if (!listing) {
        return res.status(404).json({ message: "Rental listing not found" });
      }

      const [updated] = await db
        .update(rentalListings)
        .set({ isActive: !listing.isActive, updatedAt: new Date() })
        .where(eq(rentalListings.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/rental-listings/:id/toggle-featured", async (req, res) => {
    try {
      const listing = await db.query.rentalListings.findFirst({
        where: eq(rentalListings.id, req.params.id),
      });

      if (!listing) {
        return res.status(404).json({ message: "Rental listing not found" });
      }

      const [updated] = await db
        .update(rentalListings)
        .set({ isFeatured: !listing.isFeatured, updatedAt: new Date() })
        .where(eq(rentalListings.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Hostel Listings Routes - Full CRUD

  // GET all hostels (with optional filters)
  app.get("/api/admin/hostel-pg", async (req, res) => {
    try {
      const { active, featured, ownerId } = req.query;

      const sessionUser = (req as any).session?.user || null;
      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const isAdmin = sessionUser.role === 'admin' || sessionUser.role === 'super_admin';
      const isSeller = sessionUser.accountType === 'seller';
      if (!isAdmin && !isSeller) {
        return res.status(403).json({ message: "Forbidden" });
      }

      let query = db.query.hostelPgListings.findMany({
        where: isAdmin
          ? undefined
          : or(eq(hostelPgListings.userId, sessionUser.id as string), eq(hostelPgListings.ownerId, sessionUser.id as string)),
        orderBy: desc(hostelPgListings.createdAt),
      });

      const listings = await query;

      // Apply filters if provided
      let filtered = listings;
      if (active !== undefined) {
        filtered = filtered.filter(h => h.active === (active === 'true'));
      }
      if (featured !== undefined) {
        filtered = filtered.filter(h => h.featured === (featured === 'true'));
      }
      if (ownerId) {
        filtered = filtered.filter(h => h.ownerId === ownerId);
      }

      res.json(filtered);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single hostel by ID
  app.get("/api/admin/hostel-pg/:id", async (req, res) => {
    try {
      const hostel = await db.query.hostelPgListings.findFirst({
        where: eq(hostelPgListings.id, req.params.id),
      });

      if (!hostel) {
        return res.status(404).json({ message: "Hostel/PG not found" });
      }

      res.json(hostel);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new hostel
  app.post("/api/admin/hostel-pg", async (req, res) => {
    try {
      const {
        name,
        description,
        pricePerMonth,
        hostelType,
        roomType,
        totalBeds,
        availableBeds,
        country,
        stateProvince,
        city,
        area,
        fullAddress,
        contactPerson,
        contactPhone,
        rules,
        facilities,
        images,
        foodIncluded,
        featured,
        active,
        ownerId,
      } = req.body;

      // Validate required fields
      if (!name || !pricePerMonth || !hostelType || !roomType || !totalBeds ||
          !availableBeds || !country || !city || !fullAddress) {
        return res.status(400).json({
          message: "Missing required fields: name, pricePerMonth, hostelType, roomType, totalBeds, availableBeds, country, city, fullAddress"
        });
      }

      // Validate availableBeds <= totalBeds
      if (parseInt(availableBeds) > parseInt(totalBeds)) {
        return res.status(400).json({
          message: "Available beds cannot exceed total beds"
        });
      }

      const [newHostel] = await db
        .insert(hostelPgListings)
        .values({
          name,
          description: description || null,
          pricePerMonth,
          hostelType,
          roomType,
          totalBeds: parseInt(totalBeds),
          availableBeds: parseInt(availableBeds),
          country,
          stateProvince: stateProvince || null,
          city,
          area: area || null,
          fullAddress,
          contactPerson: contactPerson || null,
          contactPhone: contactPhone || null,
          rules: rules || null,
          facilities: facilities || [],
          images: images || [],
          foodIncluded: foodIncluded || false,
          featured: featured || false,
          active: active !== undefined ? active : true,
          ownerId: ownerId || null,
        })
        .returning();

      res.status(201).json(newHostel);
    } catch (error: any) {
      console.error("Error creating hostel:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE hostel
  app.put("/api/admin/hostel-pg/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };

      // Validate availableBeds <= totalBeds if both are provided
      if (updateData.availableBeds !== undefined && updateData.totalBeds !== undefined) {
        if (parseInt(updateData.availableBeds) > parseInt(updateData.totalBeds)) {
          return res.status(400).json({
            message: "Available beds cannot exceed total beds"
          });
        }
      }

      const [updatedHostel] = await db
        .update(hostelPgListings)
        .set(updateData)
        .where(eq(hostelPgListings.id, id))
        .returning();

      if (!updatedHostel) {
        return res.status(404).json({ message: "Hostel/PG not found" });
      }

      res.json(updatedHostel);
    } catch (error: any) {
      console.error("Error updating hostel:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE hostel
  app.delete("/api/admin/hostel-pg/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(hostelPgListings)
        .where(eq(hostelPgListings.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Hostel/PG not found" });
      }

      res.json({ message: "Hostel/PG deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting hostel:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/hostel-pg/:id/toggle-active", async (req, res) => {
    try {
      const hostel = await db.query.hostelPgListings.findFirst({
        where: eq(hostelPgListings.id, req.params.id),
      });

      if (!hostel) {
        return res.status(404).json({ message: "Hostel/PG not found" });
      }

      const [updated] = await db
        .update(hostelPgListings)
        .set({ active: !hostel.active, updatedAt: new Date() })
        .where(eq(hostelPgListings.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/hostel-pg/:id/toggle-featured", async (req, res) => {
    try {
      const hostel = await db.query.hostelPgListings.findFirst({
        where: eq(hostelPgListings.id, req.params.id),
      });

      if (!hostel) {
        return res.status(404).json({ message: "Hostel/PG not found" });
      }

      const [updated] = await db
        .update(hostelPgListings)
        .set({ featured: !hostel.featured, updatedAt: new Date() })
        .where(eq(hostelPgListings.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Construction Materials Routes - Full CRUD

  // GET all materials (with optional filters)
  app.get("/api/admin/construction-materials", async (req, res) => {
    try {
      const { isActive, isFeatured, category, city } = req.query;
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      // Build conditions array
      const conditions = [];

      let materials;
      // Role-based filtering
      if (sessionUser?.role === 'admin' || sessionUser?.role === 'super_admin') {
        conditions.push(eq(constructionMaterials.role, sessionUser.role));
        const adminId = sessionUser.id as string;
        conditions.push(eq(constructionMaterials.userId, adminId));
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
      } else if (sessionUser?.role === 'user') {
        conditions.push(eq(constructionMaterials.role, 'user'));
        if (sessionUser?.id) {
          const uid = sessionUser.id as string;
          conditions.push(eq(constructionMaterials.userId, uid));
        }
      } else if (queryUserId) {
        conditions.push(eq(constructionMaterials.userId, queryUserId));
        if (queryRole) {
          conditions.push(eq(constructionMaterials.role, queryRole));
        }
      }

      materials = await db.query.constructionMaterials.findMany({
        where: conditions.length > 0 ? and(...conditions) : undefined,
        orderBy: desc(constructionMaterials.createdAt),
      });

      // Apply additional filters
      let filtered = materials;
      if (isActive !== undefined) {
        filtered = filtered.filter(m => m.isActive === (isActive === 'true'));
      }
      if (isFeatured !== undefined) {
        filtered = filtered.filter(m => m.isFeatured === (isFeatured === 'true'));
      }
      if (category) {
        filtered = filtered.filter(m => m.category === category);
      }
      if (city) {
        filtered = filtered.filter(m => m.city === city);
      }

      res.json(filtered);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single material by ID
  app.get("/api/admin/construction-materials/:id", async (req, res) => {
    try {
      const material = await db.query.constructionMaterials.findFirst({
        where: eq(constructionMaterials.id, req.params.id),
      });

      if (!material) {
        return res.status(404).json({ message: "Construction material not found" });
      }

      res.json(material);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new material
  app.post("/api/admin/construction-materials", async (req, res) => {
    try {
      const {
        name,
        category,
        description,
        price,
        unit,
        brand,
        specifications,
        images,
        supplierId,
        supplierName,
        supplierContact,
        country,
        stateProvince,
        city,
        area,
        fullAddress,
        locationId,
        stockStatus,
        minimumOrder,
        isActive,
        isFeatured,
        userId,
        role,
      } = req.body;

      // Validate required fields
      if (!name || !category || !price || !unit) {
        return res.status(400).json({
          message: "Missing required fields: name, category, price, unit"
        });
      }

      // Validate userId
      if (!userId) {
        return res.status(400).json({
          message: "User ID is required"
        });
      }

      const [newMaterial] = await db
        .insert(constructionMaterials)
        .values({
          name,
          category,
          description: description || null,
          price,
          unit,
          brand: brand || null,
          specifications: specifications || {},
          images: images || [],
          supplierId: supplierId || null,
          supplierName: supplierName || null,
          supplierContact: supplierContact || null,
          country: country || "India",
          stateProvince: stateProvince || null,
          city: city || null,
          area: area || null,
          fullAddress: fullAddress || null,
          locationId: locationId || null,
          stockStatus: stockStatus || "in_stock",
          minimumOrder: minimumOrder ? parseInt(minimumOrder) : null,
          isActive: isActive !== undefined ? isActive : true,
          isFeatured: isFeatured || false,
          userId: userId,
          role: role || 'user',
        })
        .returning();

      res.status(201).json(newMaterial);
    } catch (error: any) {
      console.error("Error creating material:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE material
  app.put("/api/admin/construction-materials/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, role, ...otherData } = req.body;

      const updateData = {
        ...otherData,
        updatedAt: new Date()
      };

      // Include userId and role if provided
      if (userId) {
        updateData.userId = userId;
      }
      if (role) {
        updateData.role = role;
      }

      const [updatedMaterial] = await db
        .update(constructionMaterials)
        .set(updateData)
        .where(eq(constructionMaterials.id, id))
        .returning();

      if (!updatedMaterial) {
        return res.status(404).json({ message: "Construction material not found" });
      }

      res.json(updatedMaterial);
    } catch (error: any) {
      console.error("Error updating material:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE material
  app.delete("/api/admin/construction-materials/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(constructionMaterials)
        .where(eq(constructionMaterials.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Construction material not found" });
      }

      res.json({ message: "Construction material deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting material:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/construction-materials/:id/toggle-active", async (req, res) => {
    try {
      const material = await db.query.constructionMaterials.findFirst({
        where: eq(constructionMaterials.id, req.params.id),
      });

      if (!material) {
        return res.status(404).json({ message: "Construction material not found" });
      }

      const [updated] = await db
        .update(constructionMaterials)
        .set({ isActive: !material.isActive, updatedAt: new Date() })
        .where(eq(constructionMaterials.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/construction-materials/:id/toggle-featured", async (req, res) => {
    try {
      const material = await db.query.constructionMaterials.findFirst({
        where: eq(constructionMaterials.id, req.params.id),
      });

      if (!material) {
        return res.status(404).json({ message: "Construction material not found" });
      }

      const [updated] = await db
        .update(constructionMaterials)
        .set({ isFeatured: !material.isFeatured, updatedAt: new Date() })
        .where(eq(constructionMaterials.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Property Deals Routes - Full CRUD

  // GET all property deals
  app.get("/api/admin/property-deals", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let deals;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        deals = await db.query.propertyDeals.findMany({
          where: and(eq(propertyDeals.userId, adminId), eq(propertyDeals.role, sessionUser.role as string)),
          orderBy: desc(propertyDeals.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        deals = await db.query.propertyDeals.findMany({
          where: eq(propertyDeals.userId, sessionUser.id as string),
          orderBy: desc(propertyDeals.createdAt),
        });
      } else if (queryUserId) {
        deals = await db.query.propertyDeals.findMany({
          where: queryRole
            ? and(eq(propertyDeals.userId, queryUserId), eq(propertyDeals.role, queryRole))
            : eq(propertyDeals.userId, queryUserId),
          orderBy: desc(propertyDeals.createdAt),
        });
      } else {
        deals = [];
      }
      
      res.json(deals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single property deal by ID
  app.get("/api/admin/property-deals/:id", async (req, res) => {
    try {
      const deal = await db.query.propertyDeals.findFirst({
        where: eq(propertyDeals.id, req.params.id),
      });

      if (!deal) {
        return res.status(404).json({ message: "Property deal not found" });
      }

      res.json(deal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new property deal
  app.post("/api/admin/property-deals", async (req, res) => {
    try {
      const [newDeal] = await db
        .insert(propertyDeals)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newDeal);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE property deal
  app.put("/api/admin/property-deals/:id", async (req, res) => {
    try {
      const [updatedDeal] = await db
        .update(propertyDeals)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(propertyDeals.id, req.params.id))
        .returning();

      if (!updatedDeal) {
        return res.status(404).json({ message: "Property deal not found" });
      }

      res.json(updatedDeal);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE property deal
  app.delete("/api/admin/property-deals/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(propertyDeals)
        .where(eq(propertyDeals.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Property deal not found" });
      }

      res.json({ message: "Property deal deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/property-deals/:id/toggle-active", async (req, res) => {
    try {
      const deal = await db.query.propertyDeals.findFirst({
        where: eq(propertyDeals.id, req.params.id),
      });

      if (!deal) {
        return res.status(404).json({ message: "Property deal not found" });
      }

      const [updated] = await db
        .update(propertyDeals)
        .set({ isActive: !deal.isActive, updatedAt: new Date() })
        .where(eq(propertyDeals.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/property-deals/:id/toggle-featured", async (req, res) => {
    try {
      const deal = await db.query.propertyDeals.findFirst({
        where: eq(propertyDeals.id, req.params.id),
      });

      if (!deal) {
        return res.status(404).json({ message: "Property deal not found" });
      }

      const [updated] = await db
        .update(propertyDeals)
        .set({ isFeatured: !deal.isFeatured, updatedAt: new Date() })
        .where(eq(propertyDeals.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Commercial Properties Routes - Full CRUD

  // GET all commercial properties
  app.get("/api/admin/commercial-properties", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let properties;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        properties = await db.query.commercialProperties.findMany({
          where: and(eq(commercialProperties.userId, adminId), eq(commercialProperties.role, sessionUser.role as string)),
          orderBy: desc(commercialProperties.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        properties = await db.query.commercialProperties.findMany({
          where: eq(commercialProperties.userId, sessionUser.id as string),
          orderBy: desc(commercialProperties.createdAt),
        });
      } else if (queryUserId) {
        properties = await db.query.commercialProperties.findMany({
          where: queryRole
            ? and(eq(commercialProperties.userId, queryUserId), eq(commercialProperties.role, queryRole))
            : eq(commercialProperties.userId, queryUserId),
          orderBy: desc(commercialProperties.createdAt),
        });
      } else {
        properties = [];
      }

      res.json(properties);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single commercial property by ID
  app.get("/api/admin/commercial-properties/:id", async (req, res) => {
    try {
      const property = await db.query.commercialProperties.findFirst({
        where: eq(commercialProperties.id, req.params.id),
      });

      if (!property) {
        return res.status(404).json({ message: "Commercial property not found" });
      }

      res.json(property);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new commercial property
  app.post("/api/admin/commercial-properties", async (req, res) => {
    try {
      const [newProperty] = await db
        .insert(commercialProperties)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newProperty);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE commercial property
  app.put("/api/admin/commercial-properties/:id", async (req, res) => {
    try {
      const [updatedProperty] = await db
        .update(commercialProperties)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(commercialProperties.id, req.params.id))
        .returning();

      if (!updatedProperty) {
        return res.status(404).json({ message: "Commercial property not found" });
      }

      res.json(updatedProperty);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE commercial property
  app.delete("/api/admin/commercial-properties/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(commercialProperties)
        .where(eq(commercialProperties.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Commercial property not found" });
      }

      res.json({ message: "Commercial property deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/commercial-properties/:id/toggle-active", async (req, res) => {
    try {
      const property = await db.query.commercialProperties.findFirst({
        where: eq(commercialProperties.id, req.params.id),
      });

      if (!property) {
        return res.status(404).json({ message: "Commercial property not found" });
      }

      const [updated] = await db
        .update(commercialProperties)
        .set({ isActive: !property.isActive, updatedAt: new Date() })
        .where(eq(commercialProperties.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/commercial-properties/:id/toggle-featured", async (req, res) => {
    try {
      const property = await db.query.commercialProperties.findFirst({
        where: eq(commercialProperties.id, req.params.id),
      });

      if (!property) {
        return res.status(404).json({ message: "Commercial property not found" });
      }

      const [updated] = await db
        .update(commercialProperties)
        .set({ isFeatured: !property.isFeatured, updatedAt: new Date() })
        .where(eq(commercialProperties.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Industrial Land Routes - Full CRUD

  // GET all industrial land
  app.get("/api/admin/industrial-land", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let lands;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        lands = await db.query.industrialLand.findMany({
          where: and(eq(industrialLand.userId, adminId), eq(industrialLand.role, sessionUser.role as string)),
          orderBy: desc(industrialLand.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        lands = await db.query.industrialLand.findMany({
          where: eq(industrialLand.userId, sessionUser.id as string),
          orderBy: desc(industrialLand.createdAt),
        });
      } else if (queryUserId) {
        lands = await db.query.industrialLand.findMany({
          where: queryRole
            ? and(eq(industrialLand.userId, queryUserId), eq(industrialLand.role, queryRole))
            : eq(industrialLand.userId, queryUserId),
          orderBy: desc(industrialLand.createdAt),
        });
      } else {
        lands = [];
      }

      res.json(lands);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single industrial land by ID
  app.get("/api/admin/industrial-land/:id", async (req, res) => {
    try {
      const land = await db.query.industrialLand.findFirst({
        where: eq(industrialLand.id, req.params.id),
      });

      if (!land) {
        return res.status(404).json({ message: "Industrial land not found" });
      }

      res.json(land);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new industrial land
  app.post("/api/admin/industrial-land", async (req, res) => {
    try {
      const [newLand] = await db
        .insert(industrialLand)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newLand);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE industrial land
  app.put("/api/admin/industrial-land/:id", async (req, res) => {
    try {
      const [updatedLand] = await db
        .update(industrialLand)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(industrialLand.id, req.params.id))
        .returning();

      if (!updatedLand) {
        return res.status(404).json({ message: "Industrial land not found" });
      }

      res.json(updatedLand);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE industrial land
  app.delete("/api/admin/industrial-land/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(industrialLand)
        .where(eq(industrialLand.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Industrial land not found" });
      }

      res.json({ message: "Industrial land deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/industrial-land/:id/toggle-active", async (req, res) => {
    try {
      const land = await db.query.industrialLand.findFirst({
        where: eq(industrialLand.id, req.params.id),
      });

      if (!land) {
        return res.status(404).json({ message: "Industrial land not found" });
      }

      const [updated] = await db
        .update(industrialLand)
        .set({ isActive: !land.isActive, updatedAt: new Date() })
        .where(eq(industrialLand.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/industrial-land/:id/toggle-featured", async (req, res) => {
    try {
      const land = await db.query.industrialLand.findFirst({
        where: eq(industrialLand.id, req.params.id),
      });

      if (!land) {
        return res.status(404).json({ message: "Industrial land not found" });
      }

      const [updated] = await db
        .update(industrialLand)
        .set({ isFeatured: !land.isFeatured, updatedAt: new Date() })
        .where(eq(industrialLand.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Office Spaces Routes - Full CRUD

  // GET all office spaces
  app.get("/api/admin/office-spaces", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let offices;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        offices = await db.query.officeSpaces.findMany({
          where: and(eq(officeSpaces.userId, adminId), eq(officeSpaces.role, sessionUser.role as string)),
          orderBy: desc(officeSpaces.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        offices = await db.query.officeSpaces.findMany({
          where: eq(officeSpaces.userId, sessionUser.id as string),
          orderBy: desc(officeSpaces.createdAt),
        });
      } else if (queryUserId) {
        offices = await db.query.officeSpaces.findMany({
          where: queryRole
            ? and(eq(officeSpaces.userId, queryUserId), eq(officeSpaces.role, queryRole))
            : eq(officeSpaces.userId, queryUserId),
          orderBy: desc(officeSpaces.createdAt),
        });
      } else {
        offices = [];
      }
      
      res.json(offices);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single office space by ID
  app.get("/api/admin/office-spaces/:id", async (req, res) => {
    try {
      const office = await db.query.officeSpaces.findFirst({
        where: eq(officeSpaces.id, req.params.id),
      });

      if (!office) {
        return res.status(404).json({ message: "Office space not found" });
      }

      res.json(office);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new office space
  app.post("/api/admin/office-spaces", async (req, res) => {
    try {
      const [newOffice] = await db
        .insert(officeSpaces)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newOffice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE office space
  app.put("/api/admin/office-spaces/:id", async (req, res) => {
    try {
      const [updatedOffice] = await db
        .update(officeSpaces)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(officeSpaces.id, req.params.id))
        .returning();

      if (!updatedOffice) {
        return res.status(404).json({ message: "Office space not found" });
      }

      res.json(updatedOffice);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE office space
  app.delete("/api/admin/office-spaces/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(officeSpaces)
        .where(eq(officeSpaces.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Office space not found" });
      }

      res.json({ message: "Office space deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/office-spaces/:id/toggle-active", async (req, res) => {
    try {
      const office = await db.query.officeSpaces.findFirst({
        where: eq(officeSpaces.id, req.params.id),
      });

      if (!office) {
        return res.status(404).json({ message: "Office space not found" });
      }

      const [updated] = await db
        .update(officeSpaces)
        .set({ isActive: !office.isActive, updatedAt: new Date() })
        .where(eq(officeSpaces.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/office-spaces/:id/toggle-featured", async (req, res) => {
    try {
      const office = await db.query.officeSpaces.findFirst({
        where: eq(officeSpaces.id, req.params.id),
      });

      if (!office) {
        return res.status(404).json({ message: "Office space not found" });
      }

      const [updated] = await db
        .update(officeSpaces)
        .set({ isFeatured: !office.isFeatured, updatedAt: new Date() })
        .where(eq(officeSpaces.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cars & Bikes Routes - Full CRUD

  // GET all cars & bikes
  app.get("/api/admin/cars-bikes", async (req, res) => {
    try {
      // Allow optional query filtering by userId for admin pages
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;

      let listings = [];

      if (sessionUser && sessionUser.role === 'admin') {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        listings = await db.query.carsBikes.findMany({
          where: and(eq(carsBikes.userId, adminId), eq(carsBikes.role, 'admin')),
          orderBy: desc(carsBikes.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        // Regular users: only their own listings. If queryUserId is provided but doesn't match session user, ignore it.
        listings = await db.query.carsBikes.findMany({
          where: or(eq(carsBikes.sellerId, sessionUser.id as string), eq(carsBikes.userId, sessionUser.id as string)),
          orderBy: desc(carsBikes.createdAt),
        });
      } else if (queryUserId) {
        // No session present but userId provided (used by some client code): try to return listings for that userId
        // This branch is conservative and only returns rows filtering by userId to avoid exposing other data.
        listings = await db.query.carsBikes.findMany({
          where: or(eq(carsBikes.userId, queryUserId), eq(carsBikes.sellerId, queryUserId)),
          orderBy: desc(carsBikes.createdAt),
        });
      } else {
        listings = [];
      }

      res.json(listings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single vehicle by ID
  app.get("/api/admin/cars-bikes/:id", async (req, res) => {
    try {
      const vehicle = await db.query.carsBikes.findFirst({
        where: eq(carsBikes.id, req.params.id),
      });

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.json(vehicle);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new vehicle
  app.post("/api/admin/cars-bikes", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const {
        title,
        description,
        listingType,
        vehicleType,
        brand,
        model,
        year,
        price,
        emiAvailable,
        emiStartingFrom,
        emiMonths,
        kilometersDriven,
        fuelType,
        transmission,
        ownerNumber,
        registrationNumber,
        registrationState,
        insuranceValidUntil,
        color,
        images,
        documents,
        features,
        condition,
        isNegotiable,
        country,
        stateProvince,
        city,
        areaName,
        fullAddress,
        isActive,
        isFeatured,
        userId,
        role,
      } = req.body;

      // Validate required fields
      if (!title || !listingType || !vehicleType || !brand || !model || !year || !price) {
        return res.status(400).json({
          message: "Missing required fields: title, listingType, vehicleType, brand, model, year, price"
        });
      }

      // Validate userId
      if (!userId) {
        return res.status(400).json({
          message: "User ID is required"
        });
      }

      // Convert date string to Date object if provided
      const insuranceValidUntilDate = insuranceValidUntil ? new Date(insuranceValidUntil) : null;

      // Determine effective user info
      const effectiveUserId = sessionUser?.id || userId;
      const effectiveRole = sessionUser?.role || role || 'user';

      const [newVehicle] = await db
        .insert(carsBikes)
        .values({
          title,
          description: description || null,
          listingType,
          vehicleType,
          brand,
          model,
          year,
          price,
          emiAvailable: emiAvailable || false,
          emiStartingFrom: emiStartingFrom ? parseFloat(emiStartingFrom.toString()) : null,
          emiMonths: emiMonths ? parseInt(emiMonths.toString()) : null,
          kilometersDriven: kilometersDriven || null,
          fuelType: fuelType || null,
          transmission: transmission || null,
          ownerNumber: ownerNumber || null,
          registrationNumber: registrationNumber || null,
          registrationState: registrationState || null,
          insuranceValidUntil: insuranceValidUntilDate,
          color: color || null,
          images: images || [],
          documents: documents || null,
          features: features || null,
          condition: condition || null,
          isNegotiable: isNegotiable || false,
          country: country || null,
          stateProvince: stateProvince || null,
          city: city || null,
          areaName: areaName || null,
          fullAddress: fullAddress || null,
          isActive: isActive !== undefined ? isActive : true,
          isFeatured: isFeatured || false,
          sellerId: effectiveUserId,
          userId: effectiveUserId,
          role: effectiveRole,
        })
        .returning();

      res.status(201).json(newVehicle);
    } catch (error: any) {
      console.error("Error creating car/bike:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE vehicle
  app.put("/api/admin/cars-bikes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        listingType,
        vehicleType,
        brand,
        model,
        year,
        price,
        emiAvailable,
        emiStartingFrom,
        emiMonths,
        kilometersDriven,
        fuelType,
        transmission,
        ownerNumber,
        registrationNumber,
        registrationState,
        insuranceValidUntil,
        color,
        images,
        documents,
        features,
        condition,
        isNegotiable,
        country,
        stateProvince,
        city,
        areaName,
        fullAddress,
        isActive,
        isFeatured,
        userId,
        role,
      } = req.body;

      // Convert date string to Date object if provided, handle invalid dates
      let insuranceValidUntilDate = null;
      if (insuranceValidUntil) {
        try {
          insuranceValidUntilDate = new Date(insuranceValidUntil);
          if (isNaN(insuranceValidUntilDate.getTime())) {
            insuranceValidUntilDate = null;
          }
        } catch (e) {
          insuranceValidUntilDate = null;
        }
      }

      const updateData: any = {
        updatedAt: new Date(),
      };

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description || null;
      if (listingType !== undefined) updateData.listingType = listingType;
      if (vehicleType !== undefined) updateData.vehicleType = vehicleType;
      if (brand !== undefined) updateData.brand = brand;
      if (model !== undefined) updateData.model = model;
      if (year !== undefined) updateData.year = parseInt(year.toString());
      if (price !== undefined) updateData.price = parseFloat(price.toString());
      if (emiAvailable !== undefined) updateData.emiAvailable = emiAvailable;
      if (emiStartingFrom !== undefined) updateData.emiStartingFrom = emiStartingFrom ? parseFloat(emiStartingFrom.toString()) : null;
      if (emiMonths !== undefined) updateData.emiMonths = emiMonths ? parseInt(emiMonths.toString()) : null;
      if (kilometersDriven !== undefined) updateData.kilometersDriven = kilometersDriven ? parseInt(kilometersDriven.toString()) : null;
      if (fuelType !== undefined) updateData.fuelType = fuelType || null;
      if (transmission !== undefined) updateData.transmission = transmission || null;
      if (ownerNumber !== undefined) updateData.ownerNumber = ownerNumber ? parseInt(ownerNumber.toString()) : null;
      if (registrationNumber !== undefined) updateData.registrationNumber = registrationNumber || null;
      if (registrationState !== undefined) updateData.registrationState = registrationState || null;
      if (insuranceValidUntil !== undefined) updateData.insuranceValidUntil = insuranceValidUntilDate;
      if (color !== undefined) updateData.color = color || null;
      if (images !== undefined) updateData.images = images || [];
      if (documents !== undefined) updateData.documents = documents || [];
      if (features !== undefined) updateData.features = features || [];
      if (condition !== undefined) updateData.condition = condition || null;
      if (isNegotiable !== undefined) updateData.isNegotiable = isNegotiable;
      if (country !== undefined) updateData.country = country;
      if (stateProvince !== undefined) updateData.stateProvince = stateProvince || null;
      if (city !== undefined) updateData.city = city || null;
      if (areaName !== undefined) updateData.areaName = areaName || null;
      if (fullAddress !== undefined) updateData.fullAddress = fullAddress || null;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
      if (userId !== undefined) updateData.userId = userId;
      if (role !== undefined) updateData.role = role;

      const [updatedVehicle] = await db
        .update(carsBikes)
        .set(updateData)
        .where(eq(carsBikes.id, id))
        .returning();

      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.json(updatedVehicle);
    } catch (error: any) {
      console.error("Error updating car/bike:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE vehicle
  app.delete("/api/admin/cars-bikes/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(carsBikes)
        .where(eq(carsBikes.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.json({ message: "Vehicle deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting car/bike:", error);
      res.status(500).json({ message: error.message });
    }
  });



  // PATCH - Toggle active status
  app.patch("/api/admin/cars-bikes/:id/toggle-active", async (req, res) => {
    try {
      const vehicle = await db.query.carsBikes.findFirst({
        where: eq(carsBikes.id, req.params.id),
      });

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      const [updated] = await db
        .update(carsBikes)
        .set({ isActive: !vehicle.isActive, updatedAt: new Date() })
        .where(eq(carsBikes.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling active status for car/bike:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/cars-bikes/:id/toggle-featured", async (req, res) => {
    try {
      const vehicle = await db.query.carsBikes.findFirst({
        where: eq(carsBikes.id, req.params.id),
      });

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      const [updated] = await db
        .update(carsBikes)
        .set({ isFeatured: !vehicle.isFeatured, updatedAt: new Date() })
        .where(eq(carsBikes.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling featured status for car/bike:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Showrooms Routes - Full CRUD

  // Public Showrooms Listings
  app.get("/api/showrooms", async (_req, res) => {
    try {
      const items = await db.query.showrooms.findMany({
        where: eq(showrooms.isActive, true),
        orderBy: desc(showrooms.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Public Showroom Detail
  app.get("/api/showrooms/:id", async (req, res) => {
    try {
      const item = await db.query.showrooms.findFirst({
        where: and(eq(showrooms.id, req.params.id), eq(showrooms.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Showroom not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET all showrooms
  app.get("/api/admin/showrooms", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let showroomsList;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        showroomsList = await db.query.showrooms.findMany({
          where: and(
            or(eq(showrooms.userId, adminId), eq(showrooms.sellerId, adminId)),
            eq(showrooms.role, sessionUser.role as string),
          ),
          orderBy: desc(showrooms.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        showroomsList = await db.query.showrooms.findMany({
          where: eq(showrooms.userId, sessionUser.id as string),
          orderBy: desc(showrooms.createdAt),
        });
      } else if (queryUserId) {
        showroomsList = await db.query.showrooms.findMany({
          where: queryRole
            ? and(
                or(eq(showrooms.userId, queryUserId), eq(showrooms.sellerId, queryUserId)),
                eq(showrooms.role, queryRole)
              )
            : or(eq(showrooms.userId, queryUserId), eq(showrooms.sellerId, queryUserId)),
          orderBy: desc(showrooms.createdAt),
        });
      } else {
        showroomsList = [];
      }
      
      res.json(showroomsList);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single showroom by ID
  app.get("/api/admin/showrooms/:id", async (req, res) => {
    try {
      const showroom = await db.query.showrooms.findFirst({
        where: eq(showrooms.id, req.params.id),
      });

      if (!showroom) {
        return res.status(404).json({ message: "Showroom not found" });
      }

      res.json(showroom);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new showroom
  app.post("/api/admin/showrooms", async (req, res) => {
    try {
      const {
        year,
        mileage,
        registrationYear,
        ownerCount,
        price,
        ...otherData
      } = req.body;

      const [newShowroom] = await db
        .insert(showrooms)
        .values({
          ...otherData,
          year: year ? parseInt(year.toString()) : null,
          mileage: mileage ? parseInt(mileage.toString()) : null,
          registrationYear: registrationYear ? parseInt(registrationYear.toString()) : null,
          ownerCount: ownerCount ? parseInt(ownerCount.toString()) : null,
          price: parseFloat(price.toString()),
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newShowroom);
    } catch (error: any) {
      console.error("Error creating showroom:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE showroom
  app.put("/api/admin/showrooms/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };

      const [updatedShowroom] = await db
        .update(showrooms)
        .set(updateData)
        .where(eq(showrooms.id, id))
        .returning();

      if (!updatedShowroom) {
        return res.status(404).json({ message: "Showroom not found" });
      }

      res.json(updatedShowroom);
    } catch (error: any) {
      console.error("Error updating showroom:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE showroom
  app.delete("/api/admin/showrooms/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(showrooms)
        .where(eq(showrooms.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Showroom not found" });
      }

      res.json({ message: "Showroom deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting showroom:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/showrooms/:id/toggle-active", async (req, res) => {
    try {
      const showroom = await db.query.showrooms.findFirst({
        where: eq(showrooms.id, req.params.id),
      });

      if (!showroom) {
        return res.status(404).json({ message: "Showroom not found" });
      }

      const [updated] = await db
        .update(showrooms)
        .set({ isActive: !showroom.isActive, updatedAt: new Date() })
        .where(eq(showrooms.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling active status:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/showrooms/:id/toggle-featured", async (req, res) => {
    try {
      const showroom = await db.query.showrooms.findFirst({
        where: eq(showrooms.id, req.params.id),
      });

      if (!showroom) {
        return res.status(404).json({ message: "Showroom not found" });
      }

      const [updated] = await db
        .update(showrooms)
        .set({ isFeatured: !showroom.isFeatured, updatedAt: new Date() })
        .where(eq(showrooms.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling featured status:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Heavy Equipment Routes - Full CRUD

  // Public Heavy Equipment Listings
  app.get("/api/heavy-equipment", async (_req, res) => {
    try {
      const items = await db.query.heavyEquipment.findMany({
        where: eq(heavyEquipment.isActive, true),
        orderBy: desc(heavyEquipment.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Public Heavy Equipment Detail
  app.get("/api/heavy-equipment/:id", async (req, res) => {
    try {
      const item = await db.query.heavyEquipment.findFirst({
        where: and(eq(heavyEquipment.id, req.params.id), eq(heavyEquipment.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Equipment not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET all heavy equipment
  app.get("/api/admin/heavy-equipment", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let equipment;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        equipment = await db.query.heavyEquipment.findMany({
          where: and(
            or(eq(heavyEquipment.userId, adminId), eq(heavyEquipment.sellerId, adminId)),
            eq(heavyEquipment.role, sessionUser.role as string),
          ),
          orderBy: desc(heavyEquipment.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        const sid = sessionUser.id as string;
        equipment = await db.query.heavyEquipment.findMany({
          where: or(eq(heavyEquipment.userId, sid), eq(heavyEquipment.sellerId, sid)),
          orderBy: desc(heavyEquipment.createdAt),
        });
      } else if (queryUserId) {
        equipment = await db.query.heavyEquipment.findMany({
          where: queryRole
            ? and(
                or(eq(heavyEquipment.userId, queryUserId), eq(heavyEquipment.sellerId, queryUserId)),
                eq(heavyEquipment.role, queryRole)
              )
            : or(eq(heavyEquipment.userId, queryUserId), eq(heavyEquipment.sellerId, queryUserId)),
          orderBy: desc(heavyEquipment.createdAt),
        });
      } else {
        equipment = [];
      }
      res.json(equipment);
    } catch (error: any) {
      console.error('Error fetching heavy equipment:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // GET single equipment by ID
  app.get("/api/admin/heavy-equipment/:id", async (req, res) => {
    try {
      const equipment = await db.query.heavyEquipment.findFirst({
        where: eq(heavyEquipment.id, req.params.id),
      });

      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      res.json(equipment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new equipment
  app.post("/api/admin/heavy-equipment", async (req, res) => {
    try {
      const {
        title,
        description,
        listingType,
        equipmentType,
        category,
        brand,
        model,
        year,
        price,
        priceType,
        condition,
        hoursUsed,
        serialNumber,
        specifications,
        images,
        documents,
        features,
        maintenanceHistory,
        warrantyInfo,
        isNegotiable,
        country,
        stateProvince,
        city,
        areaName,
        fullAddress,
        isActive,
        isFeatured,
        userId,
        role,
        sellerId,
      } = req.body;

      if (!title || !listingType || !equipmentType || !category || !price) {
        return res.status(400).json({
          message: "Missing required fields: title, listingType, equipmentType, category, price"
        });
      }

      if (!userId) {
        return res.status(400).json({
          message: "userId is required"
        });
      }

      const [newEquipment] = await db
        .insert(heavyEquipment)
        .values({
          title,
          description: description || null,
          listingType,
          equipmentType,
          category,
          brand: brand || null,
          model: model || null,
          year: year ? parseInt(year.toString()) : null,
          price: parseFloat(price.toString()),
          priceType: priceType || "total",
          condition: condition || null,
          hoursUsed: hoursUsed ? parseInt(hoursUsed.toString()) : null,
          serialNumber: serialNumber || null,
          sellerId: sellerId || userId,
          userId: userId,
          role: role || 'user',
          specifications: specifications || {},
          images: images || [],
          documents: documents || [],
          features: features || [],
          maintenanceHistory: maintenanceHistory || null,
          warrantyInfo: warrantyInfo || null,
          isNegotiable: isNegotiable || false,
          country: country || "India",
          stateProvince: stateProvince || null,
          city: city || null,
          areaName: areaName || null,
          fullAddress: fullAddress || null,
          isActive: isActive !== undefined ? isActive : true,
          isFeatured: isFeatured || false,
        })
        .returning();

      res.status(201).json(newEquipment);
    } catch (error: any) {
      console.error("Error creating heavy equipment:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE equipment
  app.put("/api/admin/heavy-equipment/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, role, sellerId, ...otherData } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const updateData = {
        ...otherData,
        userId: userId,
        role: role || 'user',
        sellerId: sellerId || userId,
        updatedAt: new Date()
      };

      const [updatedEquipment] = await db
        .update(heavyEquipment)
        .set(updateData)
        .where(eq(heavyEquipment.id, id))
        .returning();

      if (!updatedEquipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      res.json(updatedEquipment);
    } catch (error: any) {
      console.error("Error updating heavy equipment:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE equipment
  app.delete("/api/admin/heavy-equipment/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(heavyEquipment)
        .where(eq(heavyEquipment.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      res.json({ message: "Equipment deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting heavy equipment:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/heavy-equipment/:id/toggle-active", async (req, res) => {
    try {
      const equipment = await db.query.heavyEquipment.findFirst({
        where: eq(heavyEquipment.id, req.params.id),
      });

      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      const [updated] = await db
        .update(heavyEquipment)
        .set({ isActive: !equipment.isActive, updatedAt: new Date() })
        .where(eq(heavyEquipment.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling active status for heavy equipment:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/heavy-equipment/:id/toggle-featured", async (req, res) => {
    try {
      const equipment = await db.query.heavyEquipment.findFirst({
        where: eq(heavyEquipment.id, req.params.id),
      });

      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      const [updated] = await db
        .update(heavyEquipment)
        .set({ isFeatured: !equipment.isFeatured, updatedAt: new Date() })
        .where(eq(heavyEquipment.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling featured status for heavy equipment:", error);
      res.status(500).json({ message: error.message });
    }
  });


  app.get("/api/admin/second-hand-cars-bikes", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let vehicles;
      const isAdmin = sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin');
      const isSeller = sessionUser && sessionUser.accountType === 'seller';

      if (isAdmin) {
        // Admin sees all data
        if (queryUserId) {
          // If queryUserId is specified, filter by that user
          vehicles = await db.query.secondHandCarsBikes.findMany({
            where: or(eq(secondHandCarsBikes.userId, queryUserId), eq(secondHandCarsBikes.sellerId, queryUserId)),
            orderBy: desc(secondHandCarsBikes.createdAt),
          });
        } else {
          // Admin sees all
          vehicles = await db.query.secondHandCarsBikes.findMany({
            orderBy: desc(secondHandCarsBikes.createdAt),
          });
        }
      } else if (isSeller || sessionUser?.id) {
        // Seller sees only their own data
        const sid = sessionUser.id as string;
        vehicles = await db.query.secondHandCarsBikes.findMany({
          where: or(eq(secondHandCarsBikes.userId, sid), eq(secondHandCarsBikes.sellerId, sid)),
          orderBy: desc(secondHandCarsBikes.createdAt),
        });
      } else if (queryUserId) {
        vehicles = await db.query.secondHandCarsBikes.findMany({
          where: queryRole
            ? and(
                or(eq(secondHandCarsBikes.userId, queryUserId), eq(secondHandCarsBikes.sellerId, queryUserId)),
                eq(secondHandCarsBikes.role, queryRole)
              )
            : or(eq(secondHandCarsBikes.userId, queryUserId), eq(secondHandCarsBikes.sellerId, queryUserId)),
          orderBy: desc(secondHandCarsBikes.createdAt),
        });
      } else {
        vehicles = [];
      }

      res.json(vehicles);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single vehicle by ID
  app.get("/api/admin/second-hand-cars-bikes/:id", async (req, res) => {
    try {
      const vehicle = await db.query.secondHandCarsBikes.findFirst({
        where: eq(secondHandCarsBikes.id, req.params.id),
      });

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.json(vehicle);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new vehicle
  app.post("/api/admin/second-hand-cars-bikes", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const body = { ...req.body };
      
      // Sanitize numeric fields - convert empty strings to null
      const numericFields = ['price', 'emiStartingFrom', 'kilometersDriven', 'ownerNumber', 'registrationYear', 'seatingCapacity', 'engineCapacity', 'mileageKmpl', 'year'];
      numericFields.forEach(field => {
        if (body[field] === '' || body[field] === undefined) {
          body[field] = null;
        }
      });

      const [newVehicle] = await db
        .insert(secondHandCarsBikes)
        .values({
          ...body,
          country: body.country || "India",
          userId: sessionUser.id,
          sellerId: sessionUser.id,
          sellerType: sessionUser.accountType || sessionUser.role || "seller",
        })
        .returning();

      res.status(201).json(newVehicle);
    } catch (error: any) {
      console.error("Error creating second hand vehicle:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE vehicle
  app.put("/api/admin/second-hand-cars-bikes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const body = { ...req.body };
      
      // Sanitize numeric fields - convert empty strings to null
      const numericFields = ['price', 'emiStartingFrom', 'kilometersDriven', 'ownerNumber', 'registrationYear', 'seatingCapacity', 'engineCapacity', 'mileageKmpl', 'year'];
      numericFields.forEach(field => {
        if (body[field] === '' || body[field] === undefined) {
          body[field] = null;
        }
      });

      const updateData = { ...body, updatedAt: new Date() };

      const [updatedVehicle] = await db
        .update(secondHandCarsBikes)
        .set(updateData)
        .where(eq(secondHandCarsBikes.id, id))
        .returning();

      if (!updatedVehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.json(updatedVehicle);
    } catch (error: any) {
      console.error("Error updating second hand vehicle:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE vehicle
  app.delete("/api/admin/second-hand-cars-bikes/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(secondHandCarsBikes)
        .where(eq(secondHandCarsBikes.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      res.json({ message: "Vehicle deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting second hand vehicle:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/second-hand-cars-bikes/:id/toggle-active", async (req, res) => {
    try {
      const vehicle = await db.query.secondHandCarsBikes.findFirst({
        where: eq(secondHandCarsBikes.id, req.params.id),
      });

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      const [updated] = await db
        .update(secondHandCarsBikes)
        .set({ isActive: !vehicle.isActive, updatedAt: new Date() })
        .where(eq(secondHandCarsBikes.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling active status:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/second-hand-cars-bikes/:id/toggle-featured", async (req, res) => {
    try {
      const vehicle = await db.query.secondHandCarsBikes.findFirst({
        where: eq(secondHandCarsBikes.id, req.params.id),
      });

      if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
      }

      const [updated] = await db
        .update(secondHandCarsBikes)
        .set({ isFeatured: !vehicle.isFeatured, updatedAt: new Date() })
        .where(eq(secondHandCarsBikes.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling featured status:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/second-hand-cars-bikes", async (req, res) => {
    const sessionUser = (req as any).session?.user || null;
    const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
    const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

    let listings;
    if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
      listings = await db
        .select()
        .from(secondHandCarsBikes)
        .where(
          queryUserId
            ? or(eq(secondHandCarsBikes.userId, queryUserId), eq(secondHandCarsBikes.sellerId, queryUserId))
            : undefined
        );
    } else if (sessionUser && sessionUser.id) {
      const sid = sessionUser.id as string;
      listings = await db
        .select()
        .from(secondHandCarsBikes)
        .where(or(eq(secondHandCarsBikes.userId, sid), eq(secondHandCarsBikes.sellerId, sid)));
    } else if (queryUserId) {
      listings = await db
        .select()
        .from(secondHandCarsBikes)
        .where(
          queryRole
            ? and(
                or(eq(secondHandCarsBikes.userId, queryUserId), eq(secondHandCarsBikes.sellerId, queryUserId)),
                eq(secondHandCarsBikes.role, queryRole)
              )
            : or(eq(secondHandCarsBikes.userId, queryUserId), eq(secondHandCarsBikes.sellerId, queryUserId))
        );
    } else {
      listings = await db
        .select()
        .from(secondHandCarsBikes)
        .where(eq(secondHandCarsBikes.isActive, true));
    }
    res.json(listings);
  });


  app.post("/api/second-hand-cars-bikes", async (req, res) => {
    try {
      const { createdAt, updatedAt, ...data } = req.body || {};
      const [newListing] = await db.insert(secondHandCarsBikes).values({ ...data }).returning();
      res.json(newListing);
    } catch (error: any) {
      console.error('Error creating second-hand listing:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/second-hand-cars-bikes/:id", async (req, res) => {
    const listing = await db.select().from(secondHandCarsBikes).where(eq(secondHandCarsBikes.id, req.params.id));
    if (listing.length === 0) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing[0]);
  });

  app.put("/api/second-hand-cars-bikes/:id", async (req, res) => {
    try {
      const { createdAt, updatedAt, ...data } = req.body || {};
      const updated = await db.update(secondHandCarsBikes).set({ ...data, updatedAt: new Date() }).where(eq(secondHandCarsBikes.id, req.params.id)).returning();
      if (updated.length === 0) {
        return res.status(404).json({ error: "Listing not found" });
      }
      res.json(updated[0]);
    } catch (error: any) {
      console.error('Error updating second-hand listing:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/second-hand-cars-bikes/:id", async (req, res) => {
    await db.delete(secondHandCarsBikes).where(eq(secondHandCarsBikes.id, req.params.id));
    res.json({ success: true });
  });

  // Car & Bike Rentals routes
  app.get("/api/car-bike-rentals", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let rentals;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        rentals = await db.query.carBikeRentals.findMany({
          where: and(
            or(eq(carBikeRentals.userId, adminId), eq(carBikeRentals.ownerId, adminId)),
            eq(carBikeRentals.role, sessionUser.role as string),
          ),
          orderBy: desc(carBikeRentals.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        const sid = sessionUser.id as string;
        rentals = await db.query.carBikeRentals.findMany({
          where: or(eq(carBikeRentals.userId, sid), eq(carBikeRentals.ownerId, sid)),
          orderBy: desc(carBikeRentals.createdAt),
        });
      } else if (queryUserId) {
        rentals = await db.query.carBikeRentals.findMany({
          where: queryRole
            ? and(
                or(eq(carBikeRentals.userId, queryUserId), eq(carBikeRentals.ownerId, queryUserId)),
                eq(carBikeRentals.role, queryRole)
              )
            : or(eq(carBikeRentals.userId, queryUserId), eq(carBikeRentals.ownerId, queryUserId)),
          orderBy: desc(carBikeRentals.createdAt),
        });
      } else {
        rentals = await db.query.carBikeRentals.findMany({
          where: eq(carBikeRentals.isActive, true),
          orderBy: desc(carBikeRentals.createdAt),
        });
      }
      res.json(rentals);
    } catch (error: any) {
      console.error('Error fetching car/bike rentals:', error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/car-bike-rentals", async (req, res) => {
    try {
      const { createdAt, updatedAt, ...data } = req.body || {};
      const [newRental] = await db.insert(carBikeRentals).values({ ...data }).returning();
      res.json(newRental);
    } catch (error: any) {
      console.error('Error creating car-bike rental:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/car-bike-rentals/:id", async (req, res) => {
    const rental = await db.select().from(carBikeRentals).where(eq(carBikeRentals.id, req.params.id));
    if (rental.length === 0) {
      return res.status(404).json({ error: "Rental not found" });
    }
    res.json(rental[0]);
  });

  app.put("/api/car-bike-rentals/:id", async (req, res) => {
    try {
      // Exclude id, createdAt, and updatedAt from the request body
      const { id, createdAt, updatedAt, ...restData } = req.body;

      const updateData: any = {
        ...restData,
        updatedAt: new Date(),
      };

      // Remove any fields that are undefined to avoid overwriting with undefined
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      const updated = await db.update(carBikeRentals).set(updateData).where(eq(carBikeRentals.id, req.params.id)).returning();
      if (updated.length === 0) {
        return res.status(404).json({ error: "Rental not found" });
      }
      res.json(updated[0]);
    } catch (error: any) {
      console.error("Error updating car-bike rental:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/car-bike-rentals/:id", async (req, res) => {
    await db.delete(carBikeRentals).where(eq(carBikeRentals.id, req.params.id));
    res.json({ success: true });
  });

  // Public Transportation/Moving Services Listings
  app.get("/api/transportation-moving-services", async (_req, res) => {
    try {
      const services = await db.query.transportationMovingServices.findMany({
        where: eq(transportationMovingServices.isActive, true),
        orderBy: desc(transportationMovingServices.createdAt),
      });

      res.json(services);
    } catch (error: any) {
      console.error("Error fetching public transportation services:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Public Transportation/Moving Services Detail
  app.get("/api/transportation-moving-services/:id", async (req, res) => {
    try {
      const service = await db.query.transportationMovingServices.findFirst({
        where: and(
          eq(transportationMovingServices.id, req.params.id),
          eq(transportationMovingServices.isActive, true),
        ),
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.json(service);
    } catch (error: any) {
      console.error("Error fetching public transportation service detail:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Transportation/Moving Services Routes - Full CRUD

  // GET all transportation services
  app.get("/api/admin/transportation-moving-services", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let services;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        services = await db.query.transportationMovingServices.findMany({
          where: and(
            or(eq(transportationMovingServices.userId, adminId), eq(transportationMovingServices.ownerId, adminId)),
            eq(transportationMovingServices.role, sessionUser.role as string),
          ),
          orderBy: desc(transportationMovingServices.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        const sid = sessionUser.id as string;
        services = await db.query.transportationMovingServices.findMany({
          where: or(eq(transportationMovingServices.userId, sid), eq(transportationMovingServices.ownerId, sid)),
          orderBy: desc(transportationMovingServices.createdAt),
        });
      } else if (queryUserId) {
        services = await db.query.transportationMovingServices.findMany({
          where: queryRole
            ? and(
                or(
                  eq(transportationMovingServices.userId, queryUserId),
                  eq(transportationMovingServices.ownerId, queryUserId)
                ),
                eq(transportationMovingServices.role, queryRole)
              )
            : or(
                eq(transportationMovingServices.userId, queryUserId),
                eq(transportationMovingServices.ownerId, queryUserId)
              ),
          orderBy: desc(transportationMovingServices.createdAt),
        });
      } else {
        services = [];
      }
      res.json(services);
    } catch (error: any) {
      console.error('Error fetching transportation services:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // GET single service by ID
  app.get("/api/admin/transportation-moving-services/:id", async (req, res) => {
    try {
      const service = await db.query.transportationMovingServices.findFirst({
        where: eq(transportationMovingServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new service
  app.post("/api/admin/transportation-moving-services", async (req, res) => {
    try {
      const [newService] = await db
        .insert(transportationMovingServices)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE service
  app.put("/api/admin/transportation-moving-services/:id", async (req, res) => {
    try {
      const [updatedService] = await db
        .update(transportationMovingServices)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(transportationMovingServices.id, req.params.id))
        .returning();

      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.json(updatedService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE service
  app.delete("/api/admin/transportation-moving-services/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(transportationMovingServices)
        .where(eq(transportationMovingServices.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.json({ message: "Service deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/transportation-moving-services/:id/toggle-active", async (req, res) => {
    try {
      const service = await db.query.transportationMovingServices.findFirst({
        where: eq(transportationMovingServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      const [updated] = await db
        .update(transportationMovingServices)
        .set({ isActive: !service.isActive, updatedAt: new Date() })
        .where(eq(transportationMovingServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/transportation-moving-services/:id/toggle-featured", async (req, res) => {
    try {
      const service = await db.query.transportationMovingServices.findFirst({
        where: eq(transportationMovingServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      const [updated] = await db
        .update(transportationMovingServices)
        .set({ isFeatured: !service.isFeatured, updatedAt: new Date() })
        .where(eq(transportationMovingServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await db.query.adminCategories.findMany({
        with: {
          subcategories: true,
        },
        orderBy: [adminCategories.sortOrder, adminCategories.name],
      });

      res.json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/categories/:slugOrId", async (req, res) => {
    try {
      const raw = typeof req.params.slugOrId === 'string' ? req.params.slugOrId : '';
      const slugOrId = decodeURIComponent(raw || '').trim();
      if (!slugOrId) return res.status(400).json({ message: 'Missing category slug' });

      const isNumericId = /^\d+$/.test(slugOrId);

      const category = await db.query.adminCategories.findFirst({
        where: isNumericId
          ? eq(adminCategories.id, Number(slugOrId))
          : eq(adminCategories.slug, slugOrId),
        with: {
          subcategories: true,
        },
      });

      if (!category) return res.status(404).json({ message: 'Category not found' });
      if ((category as any)?.isActive === false) return res.status(404).json({ message: 'Category not found' });

      const normalized = {
        ...category,
        subcategories: Array.isArray((category as any).subcategories)
          ? (category as any).subcategories
              .filter((s: any) => s?.isActive !== false)
              .map((s: any) => ({ ...s, listingCount: s?.listingCount ?? 0 }))
          : [],
      };

      res.json(normalized);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Public Vehicle License Classes Listings
  app.get("/api/vehicle-license-classes", async (_req, res) => {
    try {
      const classes = await db.query.vehicleLicenseClasses.findMany({
        where: eq(vehicleLicenseClasses.isActive, true),
        orderBy: desc(vehicleLicenseClasses.createdAt),
      });

      res.json(classes);
    } catch (error: any) {
      console.error("Error fetching public vehicle license classes:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Public Vehicle License Classes Detail
  app.get("/api/vehicle-license-classes/:id", async (req, res) => {
    try {
      const licenseClass = await db.query.vehicleLicenseClasses.findFirst({
        where: and(
          eq(vehicleLicenseClasses.id, req.params.id),
          eq(vehicleLicenseClasses.isActive, true),
        ),
      });

      if (!licenseClass) {
        return res.status(404).json({ message: "Class not found" });
      }

      res.json(licenseClass);
    } catch (error: any) {
      console.error("Error fetching public vehicle license class detail:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Vehicle License Classes Routes - Full CRUD

  // GET all vehicle license classes
  app.get("/api/admin/vehicle-license-classes", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let classes;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        classes = await db.query.vehicleLicenseClasses.findMany({
          where: and(
            or(eq(vehicleLicenseClasses.userId, adminId), eq(vehicleLicenseClasses.ownerId, adminId)),
            eq(vehicleLicenseClasses.role, sessionUser.role as string),
          ),
          orderBy: desc(vehicleLicenseClasses.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        const sid = sessionUser.id as string;
        classes = await db.query.vehicleLicenseClasses.findMany({
          where: or(eq(vehicleLicenseClasses.userId, sid), eq(vehicleLicenseClasses.ownerId, sid)),
          orderBy: desc(vehicleLicenseClasses.createdAt),
        });
      } else if (queryUserId) {
        classes = await db.query.vehicleLicenseClasses.findMany({
          where: queryRole
            ? and(
                or(
                  eq(vehicleLicenseClasses.userId, queryUserId),
                  eq(vehicleLicenseClasses.ownerId, queryUserId)
                ),
                eq(vehicleLicenseClasses.role, queryRole)
              )
            : or(
                eq(vehicleLicenseClasses.userId, queryUserId),
                eq(vehicleLicenseClasses.ownerId, queryUserId)
              ),
          orderBy: desc(vehicleLicenseClasses.createdAt),
        });
      } else {
        classes = [];
      }
      res.json(classes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single vehicle license class by ID
  app.get("/api/admin/vehicle-license-classes/:id", async (req, res) => {
    try {
      const licenseClass = await db.query.vehicleLicenseClasses.findFirst({
        where: eq(vehicleLicenseClasses.id, req.params.id),
      });

      if (!licenseClass) {
        return res.status(404).json({ message: "License class not found" });
      }

      res.json(licenseClass);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new vehicle license class
  app.post("/api/admin/vehicle-license-classes", async (req, res) => {
    try {
      const { nextBatchStartDate, ...restData } = req.body;

      // Handle date field - convert to Date if valid, otherwise set to null
      let nextBatchStartDateValue: string | null = null;
      if (nextBatchStartDate) {
        try {
          const date = new Date(nextBatchStartDate);
          nextBatchStartDateValue = isNaN(date.getTime()) ? null : date.toISOString();
        } catch {
          nextBatchStartDateValue = null;
        }
      }

      // Remove system-managed timestamp fields if client sent them
      if ((restData as any).createdAt !== undefined) delete (restData as any).createdAt;
      if ((restData as any).updatedAt !== undefined) delete (restData as any).updatedAt;

      const payloadToInsert = {
        ...restData,
        nextBatchStartDate: nextBatchStartDateValue,
        country: req.body.country || "India",
      };

      try {
        const [newClass] = await db.insert(vehicleLicenseClasses).values(payloadToInsert).returning();
        res.status(201).json(newClass);
      } catch (dbErr: any) {
        console.error('DB insert error for vehicleLicenseClasses payload:', inspectPayloadForLogging(payloadToInsert));
        console.error('DB error:', dbErr);
        throw dbErr;
      }
    } catch (error: any) {
      console.error("Error creating vehicle license class:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE vehicle license class
  app.put("/api/admin/vehicle-license-classes/:id", async (req, res) => {
    try {
      const { nextBatchStartDate, ...restData } = req.body;

      // Handle date field - convert to Date if valid, otherwise set to null
      let nextBatchStartDateValue: string | null = null;
      if (nextBatchStartDate) {
        try {
          const date = new Date(nextBatchStartDate);
          nextBatchStartDateValue = isNaN(date.getTime()) ? null : date.toISOString();
        } catch {
          nextBatchStartDateValue = null;
        }
      }

      // Remove system-managed timestamp fields if client sent them
      if ((restData as any).createdAt !== undefined) delete (restData as any).createdAt;
      if ((restData as any).updatedAt !== undefined) delete (restData as any).updatedAt;

      const updateData = {
        ...restData,
        nextBatchStartDate: nextBatchStartDateValue,
        updatedAt: new Date(),
      };

      try {
        const [updatedClass] = await db.update(vehicleLicenseClasses).set(updateData).where(eq(vehicleLicenseClasses.id, req.params.id)).returning();

        if (!updatedClass) {
          return res.status(404).json({ message: "License class not found" });
        }

        res.json(updatedClass);
      } catch (dbErr: any) {
        console.error('DB update error for vehicleLicenseClasses updateData:', inspectPayloadForLogging(updateData));
        console.error('DB error:', dbErr);
        throw dbErr;
      }
    } catch (error: any) {
      console.error("Error updating vehicle license class:", error);
      res.status(400).json({ message: error.message });
    }
  });

  function inspectPayloadForLogging(obj: Record<string, any>) {
    const result: Record<string, { type: string; hasToISOString: boolean; preview: any }> = {};
    for (const [k, v] of Object.entries(obj || {})) {
      result[k] = {
        type: v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v,
        hasToISOString: v != null && typeof (v as any).toISOString === 'function',
        preview: (() => {
          try {
            if (v === null) return null;
            if (typeof v === 'string') return v.length > 200 ? v.slice(0, 200) + '...' : v;
            if (typeof v === 'object') return JSON.stringify(v).slice(0, 200);
            return String(v);
          } catch (e) {
            return String(v);
          }
        })(),
      };
    }
    return result;
  }

  // DELETE vehicle license class
  app.delete("/api/admin/vehicle-license-classes/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(vehicleLicenseClasses)
        .where(eq(vehicleLicenseClasses.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "License class not found" });
      }

      res.json({ message: "License class deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/vehicle-license-classes/:id/toggle-active", async (req, res) => {
    try {
      const licenseClass = await db.query.vehicleLicenseClasses.findFirst({
        where: eq(vehicleLicenseClasses.id, req.params.id),
      });

      if (!licenseClass) {
        return res.status(404).json({ message: "License class not found" });
      }

      const [updated] = await db
        .update(vehicleLicenseClasses)
        .set({ isActive: !licenseClass.isActive, updatedAt: new Date() })
        .where(eq(vehicleLicenseClasses.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/vehicle-license-classes/:id/toggle-featured", async (req, res) => {
    try {
      const licenseClass = await db.query.vehicleLicenseClasses.findFirst({
        where: eq(vehicleLicenseClasses.id, req.params.id),
      });

      if (!licenseClass) {
        return res.status(404).json({ message: "License class not found" });
      }

      const [updated] = await db
        .update(vehicleLicenseClasses)
        .set({ isFeatured: !licenseClass.isFeatured, updatedAt: new Date() })
        .where(eq(vehicleLicenseClasses.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Electronics & Gadgets Routes - Full CRUD

  // GET all electronics & gadgets
  app.get("/api/admin/electronics-gadgets", async (req, res) => {
    try {
      // Support both session and header-based auth
      let sessionUser = (req as any).session?.user || null;
      
      // Fallback to headers if no session
      if (!sessionUser?.id) {
        const headerUserId = req.headers['x-user-id'] as string;
        const headerRole = req.headers['x-user-role'] as string;
        const headerAccountType = req.headers['x-account-type'] as string;
        
        if (headerUserId) {
          sessionUser = {
            id: headerUserId,
            role: headerRole || 'user',
            accountType: headerAccountType || 'user',
          };
        }
      }

      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const isSeller = sessionUser.accountType === 'seller';
      // IMPORTANT: For seller accounts, always scope to their own data even if role is incorrectly set.
      const isAdmin = !isSeller && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin');
      if (!isAdmin && !isSeller) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // For sellers: only show items with valid sellerId (not null)
      // For admins: show all items that have a valid sellerId or are admin-owned
      const gadgets = await db.query.electronicsGadgets.findMany({
        where: isAdmin 
          ? or(isNotNull(electronicsGadgets.sellerId), eq(electronicsGadgets.userId, sessionUser.id as string))
          : and(
              eq(electronicsGadgets.userId, sessionUser.id as string),
              isNotNull(electronicsGadgets.sellerId)
            ),
        orderBy: desc(electronicsGadgets.createdAt),
      });
      res.json(gadgets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single electronics gadget by ID
  app.get("/api/admin/electronics-gadgets/:id", async (req, res) => {
    try {
      const gadget = await db.query.electronicsGadgets.findFirst({
        where: eq(electronicsGadgets.id, req.params.id),
      });

      if (!gadget) {
        return res.status(404).json({ message: "Electronics gadget not found" });
      }

      res.json(gadget);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new electronics gadget
  app.post("/api/admin/electronics-gadgets", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const isSeller = sessionUser.accountType === 'seller';
      const isAdmin = !isSeller && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin');
      if (!isAdmin && !isSeller) {
        return res.status(403).json({ message: "Forbidden" });
      }

      // Sanitize request body - remove empty strings for seller fields
      const body = { ...req.body };
      if (body.sellerId === '') body.sellerId = null;
      if (body.sellerType === '') body.sellerType = null;

      // Map accountType/role to allowed seller_type values
      const getSellerType = (accountType?: string, role?: string) => {
        if (accountType === 'seller') return 'individual';
        if (accountType === 'dealer') return 'dealer';
        if (accountType === 'retailer') return 'retailer';
        if (role === 'admin' || role === 'super_admin') return 'retailer';
        return 'individual';
      };

      const [newGadget] = await db
        .insert(electronicsGadgets)
        .values({
          ...body,
          // Enforce ownership for seller accounts
          userId: isSeller ? (sessionUser.id as string) : body?.userId,
          sellerId: sessionUser.id as string,
          sellerType: getSellerType(sessionUser.accountType, sessionUser.role),
          role: isSeller ? 'seller' : (body?.role || sessionUser.role || 'user'),
          country: body.country || "India",
        })
        .returning();

      res.status(201).json(newGadget);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE electronics gadget
  app.put("/api/admin/electronics-gadgets/:id", async (req, res) => {
    try {
      const [updatedGadget] = await db
        .update(electronicsGadgets)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(electronicsGadgets.id, req.params.id))
        .returning();

      if (!updatedGadget) {
        return res.status(404).json({ message: "Electronics gadget not found" });
      }

      res.json(updatedGadget);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE electronics gadget
  app.delete("/api/admin/electronics-gadgets/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(electronicsGadgets)
        .where(eq(electronicsGadgets.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Electronics gadget not found" });
      }

      res.json({ message: "Electronics gadget deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/electronics-gadgets/:id/toggle-active", async (req, res) => {
    try {
      const gadget = await db.query.electronicsGadgets.findFirst({
        where: eq(electronicsGadgets.id, req.params.id),
      });

      if (!gadget) {
        return res.status(404).json({ message: "Electronics gadget not found" });
      }

      const [updated] = await db
        .update(electronicsGadgets)
        .set({ isActive: !gadget.isActive, updatedAt: new Date() })
        .where(eq(electronicsGadgets.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });


  // Jewelry & Accessories Routes - Full CRUD

  // GET all jewelry & accessories
  app.get("/api/admin/jewelry-accessories", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let items;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        items = await db.query.jewelryAccessories.findMany({
          where: and(eq(jewelryAccessories.userId, adminId), eq(jewelryAccessories.role, sessionUser.role as string)),
          orderBy: desc(jewelryAccessories.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        const sid = sessionUser.id as string;
        items = await db.query.jewelryAccessories.findMany({
          where: eq(jewelryAccessories.userId, sid),
          orderBy: desc(jewelryAccessories.createdAt),
        });
      } else if (queryUserId) {
        items = await db.query.jewelryAccessories.findMany({
          where: queryRole
            ? and(eq(jewelryAccessories.userId, queryUserId), eq(jewelryAccessories.role, queryRole))
            : eq(jewelryAccessories.userId, queryUserId),
          orderBy: desc(jewelryAccessories.createdAt),
        });
      } else {
        items = [];
      }
      res.json(items);
    } catch (error: any) {
      console.error('Error fetching jewelry & accessories:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Jewelry & Accessories (public)
  app.get("/api/jewelry-accessories", async (_req, res) => {
    try {
      const items = await db.query.jewelryAccessories.findMany({
        where: eq(jewelryAccessories.isActive, true),
        orderBy: desc(jewelryAccessories.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/jewelry-accessories/:id", async (req, res) => {
    try {
      const item = await db.query.jewelryAccessories.findFirst({
        where: and(eq(jewelryAccessories.id, req.params.id), eq(jewelryAccessories.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single jewelry/accessory by ID
  app.get("/api/admin/jewelry-accessories/:id", async (req, res) => {
    try {
      const item = await db.query.jewelryAccessories.findFirst({
        where: eq(jewelryAccessories.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new jewelry/accessory
  app.post("/api/admin/jewelry-accessories", async (req, res) => {
    try {
      const {
        price,
        originalPrice,
        discountPercentage,
        makingCharges,
        ...otherData
      } = req.body;

      const sanitizedData = {
        ...otherData,
        price: price ? parseFloat(price.toString()) : null,
        originalPrice: originalPrice ? parseFloat(originalPrice.toString()) : null,
        discountPercentage: discountPercentage ? parseFloat(discountPercentage.toString()) : null,
        makingCharges: makingCharges ? parseFloat(makingCharges.toString()) : null,
        country: req.body.country || "India",
      };

      const [newItem] = await db
        .insert(jewelryAccessories)
        .values(sanitizedData)
        .returning();

      res.status(201).json(newItem);
    } catch (error: any) {
      console.error("Error creating jewelry/accessory:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE jewelry/accessory
  app.put("/api/admin/jewelry-accessories/:id", async (req, res) => {
    try {
      const {
        price,
        originalPrice,
        discountPercentage,
        makingCharges,
        ...otherData
      } = req.body;

      const sanitizedData = {
        ...otherData,
        price: price ? parseFloat(price.toString()) : null,
        originalPrice: originalPrice ? parseFloat(originalPrice.toString()) : null,
        discountPercentage: discountPercentage ? parseFloat(discountPercentage.toString()) : null,
        makingCharges: makingCharges ? parseFloat(makingCharges.toString()) : null,
        updatedAt: new Date(),
      };

      const [updatedItem] = await db
        .update(jewelryAccessories)
        .set(sanitizedData)
        .where(eq(jewelryAccessories.id, req.params.id))
        .returning();

      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json(updatedItem);
    } catch (error: any) {
      console.error("Error updating jewelry/accessory:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE jewelry/accessory
  app.delete("/api/admin/jewelry-accessories/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(jewelryAccessories)
        .where(eq(jewelryAccessories.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json({ message: "Item deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting jewelry/accessory:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/jewelry-accessories/:id/toggle-active", async (req, res) => {
    try {
      const item = await db.query.jewelryAccessories.findFirst({
        where: eq(jewelryAccessories.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const [updated] = await db
        .update(jewelryAccessories)
        .set({ isActive: !item.isActive, updatedAt: new Date() })
        .where(eq(jewelryAccessories.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/jewelry-accessories/:id/toggle-featured", async (req, res) => {
    try {
      const item = await db.query.jewelryAccessories.findFirst({
        where: eq(jewelryAccessories.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const [updated] = await db
        .update(jewelryAccessories)
        .set({ isFeatured: !item.isFeatured, updatedAt: new Date() })
        .where(eq(jewelryAccessories.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });


  // PATCH - Toggle featured status
  app.patch("/api/admin/electronics-gadgets/:id/toggle-featured", async (req, res) => {
    try {
      const gadget = await db.query.electronicsGadgets.findFirst({
        where: eq(electronicsGadgets.id, req.params.id),
      });

      if (!gadget) {
        return res.status(404).json({ message: "Electronics gadget not found" });
      }

      const [updated] = await db
        .update(electronicsGadgets)
        .set({ isFeatured: !gadget.isFeatured, updatedAt: new Date() })
        .where(eq(electronicsGadgets.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Phones, Tablets & Accessories Routes - Full CRUD

  // GET all phones, tablets & accessories
  app.get("/api/admin/phones-tablets-accessories", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const isAdmin = sessionUser.role === 'admin' || sessionUser.role === 'super_admin';
      const isSeller = sessionUser.accountType === 'seller';
      if (!isAdmin && !isSeller) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const products = await db.query.phonesTabletsAccessories.findMany({
        where: isAdmin ? undefined : eq(phonesTabletsAccessories.userId, sessionUser.id as string),
        orderBy: desc(phonesTabletsAccessories.createdAt),
      });
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single product by ID
  app.get("/api/admin/phones-tablets-accessories/:id", async (req, res) => {
    try {
      const product = await db.query.phonesTabletsAccessories.findFirst({
        where: eq(phonesTabletsAccessories.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new product
  app.post("/api/admin/phones-tablets-accessories", async (req, res) => {
    try {
      if (!req.body?.listingType) {
        return res.status(400).json({ message: "listingType is required" });
      }
      if (!req.body?.title) {
        return res.status(400).json({ message: "title is required" });
      }
      if (!req.body?.category) {
        return res.status(400).json({ message: "category is required" });
      }
      if (!req.body?.brand) {
        return res.status(400).json({ message: "brand is required" });
      }
      if (!req.body?.model) {
        return res.status(400).json({ message: "model is required" });
      }
      if (req.body?.price == null) {
        return res.status(400).json({ message: "price is required" });
      }
      if (!req.body?.contactPhone) {
        return res.status(400).json({ message: "contactPhone is required" });
      }

      const [newProduct] = await db
        .insert(phonesTabletsAccessories)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newProduct);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE product
  app.put("/api/admin/phones-tablets-accessories/:id", async (req, res) => {
    try {
      if ("listingType" in (req.body || {}) && !req.body?.listingType) {
        return res.status(400).json({ message: "listingType cannot be empty" });
      }

      const [updatedProduct] = await db
        .update(phonesTabletsAccessories)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(phonesTabletsAccessories.id, req.params.id))
        .returning();

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(updatedProduct);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE product
  app.delete("/api/admin/phones-tablets-accessories/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(phonesTabletsAccessories)
        .where(eq(phonesTabletsAccessories.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/phones-tablets-accessories/:id/toggle-active", async (req, res) => {
    try {
      const product = await db.query.phonesTabletsAccessories.findFirst({
        where: eq(phonesTabletsAccessories.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const [updated] = await db
        .update(phonesTabletsAccessories)
        .set({ isActive: !product.isActive, updatedAt: new Date() })
        .where(eq(phonesTabletsAccessories.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/phones-tablets-accessories/:id/toggle-featured", async (req, res) => {
    try {
      const product = await db.query.phonesTabletsAccessories.findFirst({
        where: eq(phonesTabletsAccessories.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const [updated] = await db
        .update(phonesTabletsAccessories)
        .set({ isFeatured: !product.isFeatured, updatedAt: new Date() })
        .where(eq(phonesTabletsAccessories.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Second Hand Phones, Tablets & Accessories Routes - Full CRUD

  // GET all second hand phones, tablets & accessories
  app.get("/api/admin/second-hand-phones-tablets-accessories", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const isAdmin = sessionUser.role === 'admin' || sessionUser.role === 'super_admin';
      const isSeller = sessionUser.accountType === 'seller';
      if (!isAdmin && !isSeller) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const products = await db.query.secondHandPhonesTabletsAccessories.findMany({
        where: isAdmin ? undefined : eq(secondHandPhonesTabletsAccessories.userId, sessionUser.id as string),
        orderBy: desc(secondHandPhonesTabletsAccessories.createdAt),
      });
      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Second Hand Phones, Tablets & Accessories (public)
  app.get("/api/second-hand-phones-tablets-accessories", async (_req, res) => {
    try {
      const items = await db.query.secondHandPhonesTabletsAccessories.findMany({
        where: eq(secondHandPhonesTabletsAccessories.isActive, true),
        orderBy: desc(secondHandPhonesTabletsAccessories.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/second-hand-phones-tablets-accessories/:id", async (req, res) => {
    try {
      const item = await db.query.secondHandPhonesTabletsAccessories.findFirst({
        where: and(
          eq(secondHandPhonesTabletsAccessories.id, req.params.id),
          eq(secondHandPhonesTabletsAccessories.isActive, true)
        ),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single product by ID
  app.get("/api/admin/second-hand-phones-tablets-accessories/:id", async (req, res) => {
    try {
      const product = await db.query.secondHandPhonesTabletsAccessories.findFirst({
        where: eq(secondHandPhonesTabletsAccessories.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new product
  app.post("/api/admin/second-hand-phones-tablets-accessories", async (req, res) => {
    try {
      const [newProduct] = await db
        .insert(secondHandPhonesTabletsAccessories)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newProduct);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE product
  app.put("/api/admin/second-hand-phones-tablets-accessories/:id", async (req, res) => {
    try {
      const [updatedProduct] = await db
        .update(secondHandPhonesTabletsAccessories)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(secondHandPhonesTabletsAccessories.id, req.params.id))
        .returning();

      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(updatedProduct);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE product
  app.delete("/api/admin/second-hand-phones-tablets-accessories/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(secondHandPhonesTabletsAccessories)
        .where(eq(secondHandPhonesTabletsAccessories.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/second-hand-phones-tablets-accessories/:id/toggle-active", async (req, res) => {
    try {
      const product = await db.query.secondHandPhonesTabletsAccessories.findFirst({
        where: eq(secondHandPhonesTabletsAccessories.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const [updated] = await db
        .update(secondHandPhonesTabletsAccessories)
        .set({ isActive: !product.isActive, updatedAt: new Date() })
        .where(eq(secondHandPhonesTabletsAccessories.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/second-hand-phones-tablets-accessories/:id/toggle-featured", async (req, res) => {
    try {
      const product = await db.query.secondHandPhonesTabletsAccessories.findFirst({
        where: eq(secondHandPhonesTabletsAccessories.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const [updated] = await db
        .update(secondHandPhonesTabletsAccessories)
        .set({ isFeatured: !product.isFeatured, updatedAt: new Date() })
        .where(eq(secondHandPhonesTabletsAccessories.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Event & Decoration Services Routes - Full CRUD

  // GET all event decoration services
  app.get("/api/admin/event-decoration-services", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let services;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        services = await db.query.eventDecorationServices.findMany({
          where: and(eq(eventDecorationServices.userId, adminId), eq(eventDecorationServices.role, sessionUser.role as string)),
          orderBy: desc(eventDecorationServices.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        const sid = sessionUser.id as string;
        services = await db.query.eventDecorationServices.findMany({
          where: eq(eventDecorationServices.userId, sid),
          orderBy: desc(eventDecorationServices.createdAt),
        });
      } else if (queryUserId) {
        services = await db.query.eventDecorationServices.findMany({
          where: queryRole
            ? and(eq(eventDecorationServices.userId, queryUserId), eq(eventDecorationServices.role, queryRole))
            : eq(eventDecorationServices.userId, queryUserId),
          orderBy: desc(eventDecorationServices.createdAt),
        });
      } else {
        services = [];
      }

      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/event-decoration-services", async (_req, res) => {
    try {
      const items = await db.query.eventDecorationServices.findMany({
        where: eq(eventDecorationServices.isActive, true),
        orderBy: desc(eventDecorationServices.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/event-decoration-services/:id", async (req, res) => {
    try {
      const item = await db.query.eventDecorationServices.findFirst({
        where: and(eq(eventDecorationServices.id, req.params.id), eq(eventDecorationServices.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single event decoration service by ID
  app.get("/api/admin/event-decoration-services/:id", async (req, res) => {
    try {
      const service = await db.query.eventDecorationServices.findFirst({
        where: eq(eventDecorationServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Event decoration service not found" });
      }

      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new event decoration service
  app.post("/api/admin/event-decoration-services", async (req, res) => {
    try {
      const [newService] = await db
        .insert(eventDecorationServices)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newService);
    } catch (error: any) {
      console.error("Error creating event decoration service:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE event decoration service
  app.put("/api/admin/event-decoration-services/:id", async (req, res) => {
    try {
      const [updatedService] = await db
        .update(eventDecorationServices)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(eventDecorationServices.id, req.params.id))
        .returning();

      if (!updatedService) {
        return res.status(404).json({ message: "Event decoration service not found" });
      }

      res.json(updatedService);
    } catch (error: any) {
      console.error("Error updating event decoration service:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE event decoration service
  app.delete("/api/admin/event-decoration-services/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(eventDecorationServices)
        .where(eq(eventDecorationServices.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Event decoration service not found" });
      }

      res.json({ message: "Event decoration service deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting event decoration service:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/event-decoration-services/:id/toggle-active", async (req, res) => {
    try {
      const service = await db.query.eventDecorationServices.findFirst({
        where: eq(eventDecorationServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Event decoration service not found" });
      }

      const [updated] = await db
        .update(eventDecorationServices)
        .set({ isActive: !service.isActive, updatedAt: new Date() })
        .where(eq(eventDecorationServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/event-decoration-services/:id/toggle-featured", async (req, res) => {
    try {
      const service = await db.query.eventDecorationServices.findFirst({
        where: eq(eventDecorationServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Event decoration service not found" });
      }

      const [updated] = await db
        .update(eventDecorationServices)
        .set({ isFeatured: !service.isFeatured, updatedAt: new Date() })
        .where(eq(eventDecorationServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Computer, Mobile & Laptop Repair Services Routes - Full CRUD

  // GET all repair services
  app.get("/api/admin/computer-mobile-laptop-repair-services", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const isAdmin = sessionUser.role === 'admin' || sessionUser.role === 'super_admin';
      const isSeller = sessionUser.accountType === 'seller';
      if (!isAdmin && !isSeller) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const services = await db.query.computerMobileLaptopRepairServices.findMany({
        where: isAdmin ? undefined : eq(computerMobileLaptopRepairServices.userId, sessionUser.id as string),
        orderBy: desc(computerMobileLaptopRepairServices.createdAt),
      });
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Computer, Mobile & Laptop Repair Services (public)
  app.get("/api/computer-mobile-laptop-repair-services", async (_req, res) => {
    try {
      const items = await db.query.computerMobileLaptopRepairServices.findMany({
        where: eq(computerMobileLaptopRepairServices.isActive, true),
        orderBy: desc(computerMobileLaptopRepairServices.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/computer-mobile-laptop-repair-services/:id", async (req, res) => {
    try {
      const item = await db.query.computerMobileLaptopRepairServices.findFirst({
        where: and(
          eq(computerMobileLaptopRepairServices.id, req.params.id),
          eq(computerMobileLaptopRepairServices.isActive, true)
        ),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single repair service by ID
  app.get("/api/admin/computer-mobile-laptop-repair-services/:id", async (req, res) => {
    try {
      const service = await db.query.computerMobileLaptopRepairServices.findFirst({
        where: eq(computerMobileLaptopRepairServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Repair service not found" });
      }

      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new repair service
  app.post("/api/admin/computer-mobile-laptop-repair-services", async (req, res) => {
    try {
      const [newService] = await db
        .insert(computerMobileLaptopRepairServices)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE repair service
  app.put("/api/admin/computer-mobile-laptop-repair-services/:id", async (req, res) => {
    try {
      const [updatedService] = await db
        .update(computerMobileLaptopRepairServices)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(computerMobileLaptopRepairServices.id, req.params.id))
        .returning();

      if (!updatedService) {
        return res.status(404).json({ message: "Repair service not found" });
      }

      res.json(updatedService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE repair service
  app.delete("/api/admin/computer-mobile-laptop-repair-services/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(computerMobileLaptopRepairServices)
        .where(eq(computerMobileLaptopRepairServices.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Repair service not found" });
      }

      res.json({ message: "Repair service deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/computer-mobile-laptop-repair-services/:id/toggle-active", async (req, res) => {
    try {
      const service = await db.query.computerMobileLaptopRepairServices.findFirst({
        where: eq(computerMobileLaptopRepairServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Repair service not found" });
      }

      const [updated] = await db
        .update(computerMobileLaptopRepairServices)
        .set({ isActive: !service.isActive, updatedAt: new Date() })
        .where(eq(computerMobileLaptopRepairServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/computer-mobile-laptop-repair-services/:id/toggle-featured", async (req, res) => {
    try {
      const service = await db.query.computerMobileLaptopRepairServices.findFirst({
        where: eq(computerMobileLaptopRepairServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Repair service not found" });
      }

      const [updated] = await db
        .update(computerMobileLaptopRepairServices)
        .set({ isFeatured: !service.isFeatured, updatedAt: new Date() })
        .where(eq(computerMobileLaptopRepairServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Household Services Routes - Full CRUD

  // GET all household services
  app.get("/api/admin/household-services", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let services;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        services = await db.query.householdServices.findMany({
          where: and(eq(householdServices.userId, adminId), eq(householdServices.role, sessionUser.role as string)),
          orderBy: desc(householdServices.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        const sid = sessionUser.id as string;
        services = await db.query.householdServices.findMany({
          where: eq(householdServices.userId, sid),
          orderBy: desc(householdServices.createdAt),
        });
      } else if (queryUserId) {
        services = await db.query.householdServices.findMany({
          where: queryRole
            ? and(eq(householdServices.userId, queryUserId), eq(householdServices.role, queryRole))
            : eq(householdServices.userId, queryUserId),
          orderBy: desc(householdServices.createdAt),
        });
      } else {
        services = [];
      }

      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/household-services", async (_req, res) => {
    try {
      const items = await db.query.householdServices.findMany({
        where: eq(householdServices.isActive, true),
        orderBy: desc(householdServices.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/household-services/:id", async (req, res) => {
    try {
      const item = await db.query.householdServices.findFirst({
        where: and(eq(householdServices.id, req.params.id), eq(householdServices.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single household service by ID
  app.get("/api/admin/household-services/:id", async (req, res) => {
    try {
      const service = await db.query.householdServices.findFirst({
        where: eq(householdServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Household service not found" });
      }

      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new household service
  app.post("/api/admin/household-services", async (req, res) => {
    try {
      const [newService] = await db
        .insert(householdServices)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE household service
  app.put("/api/admin/household-services/:id", async (req, res) => {
    try {
      const [updatedService] = await db
        .update(householdServices)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(householdServices.id, req.params.id))
        .returning();

      if (!updatedService) {
        return res.status(404).json({ message: "Household service not found" });
      }

      res.json(updatedService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE household service
  app.delete("/api/admin/household-services/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(householdServices)
        .where(eq(householdServices.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Household service not found" });
      }

      res.json({ message: "Household service deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/household-services/:id/toggle-active", async (req, res) => {
    try {
      const service = await db.query.householdServices.findFirst({
        where: eq(householdServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Household service not found" });
      }

      const [updated] = await db
        .update(householdServices)
        .set({ isActive: !service.isActive, updatedAt: new Date() })
        .where(eq(householdServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/household-services/:id/toggle-featured", async (req, res) => {
    try {
      const service = await db.query.householdServices.findFirst({
        where: eq(householdServices.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Household service not found" });
      }

      const [updated] = await db
        .update(householdServices)
        .set({ isFeatured: !service.isFeatured, updatedAt: new Date() })
        .where(eq(householdServices.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Furniture & Interior Decor Routes - Full CRUD

  // GET all furniture & interior decor
  app.get("/api/admin/furniture-interior-decor", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const isAdmin = sessionUser.role === 'admin' || sessionUser.role === 'super_admin';
      const isSeller = sessionUser.accountType === 'seller';
      if (!isAdmin && !isSeller) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const items = await db.query.furnitureInteriorDecor.findMany({
        where: isAdmin ? undefined : eq(furnitureInteriorDecor.userId, sessionUser.id as string),
        orderBy: desc(furnitureInteriorDecor.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single furniture item by ID
  app.get("/api/admin/furniture-interior-decor/:id", async (req, res) => {
    try {
      const item = await db.query.furnitureInteriorDecor.findFirst({
        where: eq(furnitureInteriorDecor.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Furniture item not found" });
      }

      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new furniture item
  app.post("/api/admin/furniture-interior-decor", async (req, res) => {
    try {
      const [newItem] = await db
        .insert(furnitureInteriorDecor)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE furniture item
  app.put("/api/admin/furniture-interior-decor/:id", async (req, res) => {
    try {
      const [updatedItem] = await db
        .update(furnitureInteriorDecor)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(furnitureInteriorDecor.id, req.params.id))
        .returning();

      if (!updatedItem) {
        return res.status(404).json({ message: "Furniture item not found" });
      }

      res.json(updatedItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE furniture item
  app.delete("/api/admin/furniture-interior-decor/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(furnitureInteriorDecor)
        .where(eq(furnitureInteriorDecor.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Furniture item not found" });
      }

      res.json({ message: "Furniture item deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/furniture-interior-decor/:id/toggle-active", async (req, res) => {
    try {
      const item = await db.query.furnitureInteriorDecor.findFirst({
        where: eq(furnitureInteriorDecor.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Furniture item not found" });
      }

      const [updated] = await db
        .update(furnitureInteriorDecor)
        .set({ isActive: !item.isActive, updatedAt: new Date() })
        .where(eq(furnitureInteriorDecor.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/furniture-interior-decor/:id/toggle-featured", async (req, res) => {
    try {
      const item = await db.query.furnitureInteriorDecor.findFirst({
        where: eq(furnitureInteriorDecor.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Furniture item not found" });
      }

      const [updated] = await db
        .update(furnitureInteriorDecor)
        .set({ isFeatured: !item.isFeatured, updatedAt: new Date() })
        .where(eq(furnitureInteriorDecor.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Fashion & Beauty Products Routes - Full CRUD

  // GET all fashion & beauty products
  app.get("/api/admin/fashion-beauty-products", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let products;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        products = await db.query.fashionBeautyProducts.findMany({
          where: and(eq(fashionBeautyProducts.userId, adminId), eq(fashionBeautyProducts.role, sessionUser.role as string)),
          orderBy: desc(fashionBeautyProducts.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        const sid = sessionUser.id as string;
        products = await db.query.fashionBeautyProducts.findMany({
          where: eq(fashionBeautyProducts.userId, sid),
          orderBy: desc(fashionBeautyProducts.createdAt),
        });
      } else if (queryUserId) {
        products = await db.query.fashionBeautyProducts.findMany({
          where: queryRole
            ? and(eq(fashionBeautyProducts.userId, queryUserId), eq(fashionBeautyProducts.role, queryRole))
            : eq(fashionBeautyProducts.userId, queryUserId),
          orderBy: desc(fashionBeautyProducts.createdAt),
        });
      } else {
        products = [];
      }

      res.json(products);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Fashion & Beauty Products (public)
  app.get("/api/fashion-beauty-products", async (_req, res) => {
    try {
      const items = await db.query.fashionBeautyProducts.findMany({
        where: eq(fashionBeautyProducts.isActive, true),
        orderBy: desc(fashionBeautyProducts.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/fashion-beauty-products/:id", async (req, res) => {
    try {
      const item = await db.query.fashionBeautyProducts.findFirst({
        where: and(eq(fashionBeautyProducts.id, req.params.id), eq(fashionBeautyProducts.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single fashion & beauty product by ID
  app.get("/api/admin/fashion-beauty-products/:id", async (req, res) => {
    try {
      const product = await db.query.fashionBeautyProducts.findFirst({
        where: eq(fashionBeautyProducts.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new fashion & beauty product
  app.post("/api/admin/fashion-beauty-products", async (req, res) => {
    try {
      // Sanitize payload: convert timestamp strings to Date for timestamp columns and remove client-managed timestamps
      const { saleEndDate, createdAt, updatedAt, ...rest } = req.body || {};

      let saleEndDateValue: Date | null = null;
      if (saleEndDate) {
        try {
          const d = new Date(saleEndDate);
          saleEndDateValue = isNaN(d.getTime()) ? null : d;
        } catch {
          saleEndDateValue = null;
        }
      }

      const payloadToInsert = {
        ...rest,
        saleEndDate: saleEndDateValue,
        country: req.body.country || "India",
      };

      try {
        const [newProduct] = await db.insert(fashionBeautyProducts).values(payloadToInsert).returning();
        res.status(201).json(newProduct);
      } catch (dbErr: any) {
        console.error('DB insert error for fashionBeautyProducts payload:', payloadToInsert, dbErr);
        throw dbErr;
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE fashion & beauty product
  app.put("/api/admin/fashion-beauty-products/:id", async (req, res) => {
    try {
      // Sanitize payload: convert timestamp strings to Date for timestamp columns and remove client-managed timestamps
      const { saleEndDate, createdAt, updatedAt, ...rest } = req.body || {};

      let saleEndDateValue: Date | null = null;
      if (saleEndDate) {
        try {
          const d = new Date(saleEndDate);
          saleEndDateValue = isNaN(d.getTime()) ? null : d;
        } catch {
          saleEndDateValue = null;
        }
      }

      const updateData = {
        ...rest,
        saleEndDate: saleEndDateValue,
        updatedAt: new Date(),
      };

      try {
        const [updatedProduct] = await db.update(fashionBeautyProducts).set(updateData).where(eq(fashionBeautyProducts.id, req.params.id)).returning();

        if (!updatedProduct) {
          return res.status(404).json({ message: "Product not found" });
        }

        res.json(updatedProduct);
      } catch (dbErr: any) {
        console.error('DB update error for fashionBeautyProducts updateData:', updateData, dbErr);
        throw dbErr;
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE fashion & beauty product
  app.delete("/api/admin/fashion-beauty-products/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(fashionBeautyProducts)
        .where(eq(fashionBeautyProducts.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/fashion-beauty-products/:id/toggle-active", async (req, res) => {
    try {
      const product = await db.query.fashionBeautyProducts.findFirst({
        where: eq(fashionBeautyProducts.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const [updated] = await db
        .update(fashionBeautyProducts)
        .set({ isActive: !product.isActive, updatedAt: new Date() })
        .where(eq(fashionBeautyProducts.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/fashion-beauty-products/:id/toggle-featured", async (req, res) => {
    try {
      const product = await db.query.fashionBeautyProducts.findFirst({
        where: eq(fashionBeautyProducts.id, req.params.id),
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const [updated] = await db
        .update(fashionBeautyProducts)
        .set({ isFeatured: !product.isFeatured, updatedAt: new Date() })
        .where(eq(fashionBeautyProducts.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cricket Sports Training Routes - Full CRUD

  // GET all cricket training programs
  app.get("/api/admin/cricket-sports-training", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const isAdmin = sessionUser.role === 'admin' || sessionUser.role === 'super_admin';
      const isSeller = sessionUser.accountType === 'seller';
      if (!isAdmin && !isSeller) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const programs = await db.query.cricketSportsTraining.findMany({
        where: isAdmin ? undefined : eq(cricketSportsTraining.userId, sessionUser.id as string),
        orderBy: desc(cricketSportsTraining.createdAt),
      });
      res.json(programs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single program by ID
  app.get("/api/admin/cricket-sports-training/:id", async (req, res) => {
    try {
      const program = await db.query.cricketSportsTraining.findFirst({
        where: eq(cricketSportsTraining.id, req.params.id),
      });

      if (!program) {
        return res.status(404).json({ message: "Training program not found" });
      }

      res.json(program);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new program
  app.post("/api/admin/cricket-sports-training", async (req, res) => {
    try {
      const [newProgram] = await db
        .insert(cricketSportsTraining)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newProgram);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE program
  app.put("/api/admin/cricket-sports-training/:id", async (req, res) => {
    try {
      const [updatedProgram] = await db
        .update(cricketSportsTraining)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(cricketSportsTraining.id, req.params.id))
        .returning();

      if (!updatedProgram) {
        return res.status(404).json({ message: "Training program not found" });
      }

      res.json(updatedProgram);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE program
  app.delete("/api/admin/cricket-sports-training/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(cricketSportsTraining)
        .where(eq(cricketSportsTraining.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Training program not found" });
      }

      res.json({ message: "Training program deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/cricket-sports-training/:id/toggle-active", async (req, res) => {
    try {
      const program = await db.query.cricketSportsTraining.findFirst({
        where: eq(cricketSportsTraining.id, req.params.id),
      });

      if (!program) {
        return res.status(404).json({ message: "Training program not found" });
      }

      const [updated] = await db
        .update(cricketSportsTraining)
        .set({ isActive: !program.isActive, updatedAt: new Date() })
        .where(eq(cricketSportsTraining.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/cricket-sports-training/:id/toggle-featured", async (req, res) => {
    try {
      const program = await db.query.cricketSportsTraining.findFirst({
        where: eq(cricketSportsTraining.id, req.params.id),
      });

      if (!program) {
        return res.status(404).json({ message: "Training program not found" });
      }

      const [updated] = await db
        .update(cricketSportsTraining)
        .set({ isFeatured: !program.isFeatured, updatedAt: new Date() })
        .where(eq(cricketSportsTraining.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // E-Books & Online Courses Routes - Full CRUD

  // GET all ebooks & online courses
  app.get("/api/admin/ebooks-online-courses", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const isAdmin = sessionUser.role === 'admin' || sessionUser.role === 'super_admin';
      const isSeller = sessionUser.accountType === 'seller';

      if (!isAdmin && !isSeller) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const items = await db.query.ebooksOnlineCourses.findMany({
        where: isAdmin ? undefined : eq(ebooksOnlineCourses.userId, sessionUser.id as string),
        orderBy: desc(ebooksOnlineCourses.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single item by ID
  app.get("/api/admin/ebooks-online-courses/:id", async (req, res) => {
    try {
      const item = await db.query.ebooksOnlineCourses.findFirst({
        where: eq(ebooksOnlineCourses.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new item
  app.post("/api/admin/ebooks-online-courses", async (req, res) => {
    try {
      const [newItem] = await db
        .insert(ebooksOnlineCourses)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newItem);
    } catch (error: any) {
      console.error("Error creating ebook/course:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE item
  app.put("/api/admin/ebooks-online-courses/:id", async (req, res) => {
    try {
      const [updatedItem] = await db
        .update(ebooksOnlineCourses)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(ebooksOnlineCourses.id, req.params.id))
        .returning();

      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json(updatedItem);
    } catch (error: any) {
      console.error("Error updating ebook/course:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE item
  app.delete("/api/admin/ebooks-online-courses/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(ebooksOnlineCourses)
        .where(eq(ebooksOnlineCourses.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json({ message: "Item deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting ebook/course:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/ebooks-online-courses/:id/toggle-active", async (req, res) => {
    try {
      const item = await db.query.ebooksOnlineCourses.findFirst({
        where: eq(ebooksOnlineCourses.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const [updated] = await db
        .update(ebooksOnlineCourses)
        .set({ isActive: !item.isActive, updatedAt: new Date() })
        .where(eq(ebooksOnlineCourses.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/ebooks-online-courses/:id/toggle-featured", async (req, res) => {
    try {
      const item = await db.query.ebooksOnlineCourses.findFirst({
        where: eq(ebooksOnlineCourses.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const [updated] = await db
        .update(ebooksOnlineCourses)
        .set({ isFeatured: !item.isFeatured, updatedAt: new Date() })
        .where(eq(ebooksOnlineCourses.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Saree/Clothing/Shopping Routes - Full CRUD

  // GET all saree/clothing/shopping items
  app.get("/api/admin/saree-clothing-shopping", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let items;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        items = await db.query.sareeClothingShopping.findMany({
          where: and(eq(sareeClothingShopping.userId, adminId), eq(sareeClothingShopping.role, sessionUser.role as string)),
          orderBy: desc(sareeClothingShopping.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        const sid = sessionUser.id as string;
        items = await db.query.sareeClothingShopping.findMany({
          where: eq(sareeClothingShopping.userId, sid),
          orderBy: desc(sareeClothingShopping.createdAt),
        });
      } else if (queryUserId) {
        items = await db.query.sareeClothingShopping.findMany({
          where: queryRole
            ? and(eq(sareeClothingShopping.userId, queryUserId), eq(sareeClothingShopping.role, queryRole))
            : eq(sareeClothingShopping.userId, queryUserId),
          orderBy: desc(sareeClothingShopping.createdAt),
        });
      } else {
        items = [];
      }

      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Saree/Clothing/Shopping (public)
  app.get("/api/saree-clothing-shopping", async (_req, res) => {
    try {
      const items = await db.query.sareeClothingShopping.findMany({
        where: eq(sareeClothingShopping.isActive, true),
        orderBy: desc(sareeClothingShopping.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/saree-clothing-shopping/:id", async (req, res) => {
    try {
      const item = await db.query.sareeClothingShopping.findFirst({
        where: and(eq(sareeClothingShopping.id, req.params.id), eq(sareeClothingShopping.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single item by ID
  app.get("/api/admin/saree-clothing-shopping/:id", async (req, res) => {
    try {
      const item = await db.query.sareeClothingShopping.findFirst({
        where: eq(sareeClothingShopping.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new item
  app.post("/api/admin/saree-clothing-shopping", async (req, res) => {
    try {
      const [newItem] = await db
        .insert(sareeClothingShopping)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newItem);
    } catch (error: any) {
      console.error("Error creating item:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE item
  app.put("/api/admin/saree-clothing-shopping/:id", async (req, res) => {
    try {
      const [updatedItem] = await db
        .update(sareeClothingShopping)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(sareeClothingShopping.id, req.params.id))
        .returning();

      if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json(updatedItem);
    } catch (error: any) {
      console.error("Error updating item:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE item
  app.delete("/api/admin/saree-clothing-shopping/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(sareeClothingShopping)
        .where(eq(sareeClothingShopping.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Item not found" });
      }

      res.json({ message: "Item deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting item:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/saree-clothing-shopping/:id/toggle-active", async (req, res) => {
    try {
      const item = await db.query.sareeClothingShopping.findFirst({
        where: eq(sareeClothingShopping.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const [updated] = await db
        .update(sareeClothingShopping)
        .set({ isActive: !item.isActive, updatedAt: new Date() })
        .where(eq(sareeClothingShopping.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/saree-clothing-shopping/:id/toggle-featured", async (req, res) => {
    try {
      const item = await db.query.sareeClothingShopping.findFirst({
        where: eq(sareeClothingShopping.id, req.params.id),
      });

      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }

      const [updated] = await db
        .update(sareeClothingShopping)
        .set({ isFeatured: !item.isFeatured, updatedAt: new Date() })
        .where(eq(sareeClothingShopping.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dance, Karate, Gym & Yoga Classes Routes - Full CRUD

  // GET all dance/karate/gym/yoga classes
  app.get("/api/admin/dance-karate-gym-yoga", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const headerRole = typeof req.headers['x-user-role'] === 'string' ? (req.headers['x-user-role'] as string) : undefined;
      const queryRole = typeof req.query.role === 'string' ? (req.query.role as string) : undefined;
      const isAdmin = (sessionUser && sessionUser.role === 'admin') || headerRole === 'admin' || queryRole === 'admin';

      const headerUserId = typeof req.headers['x-user-id'] === 'string' ? (req.headers['x-user-id'] as string) : undefined;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;

      let classes;
      if (isAdmin) {
        classes = await db.query.danceKarateGymYoga.findMany({
          where: queryUserId ? eq(danceKarateGymYoga.userId, queryUserId) : undefined,
          orderBy: desc(danceKarateGymYoga.createdAt),
        });
      } else if ((sessionUser && sessionUser.id) || headerUserId || queryUserId) {
        const effectiveUserId = (sessionUser && sessionUser.id) ? (sessionUser.id as string) : (headerUserId || queryUserId) as string;
        classes = await db.query.danceKarateGymYoga.findMany({
          where: eq(danceKarateGymYoga.userId, effectiveUserId),
          orderBy: desc(danceKarateGymYoga.createdAt),
        });
      } else {
        classes = [];
      }

      res.json(classes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single dance/karate/gym/yoga class by ID
  app.get("/api/admin/dance-karate-gym-yoga/:id", async (req, res) => {
    try {
      const classItem = await db.query.danceKarateGymYoga.findFirst({
        where: eq(danceKarateGymYoga.id, req.params.id),
      });

      if (!classItem) {
        return res.status(404).json({ message: "Class not found" });
      }

      res.json(classItem);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new dance/karate/gym/yoga class
  app.post("/api/admin/dance-karate-gym-yoga", async (req, res) => {
    try {
      // Sanitize numeric fields
      const sanitizedData = {
        ...req.body,
        country: req.body.country || "India",
        instructorExperienceYears: req.body.instructorExperienceYears ? parseInt(req.body.instructorExperienceYears) : null,
        feePerMonth: req.body.feePerMonth ? parseFloat(req.body.feePerMonth) : null,
        feePerSession: req.body.feePerSession ? parseFloat(req.body.feePerSession) : null,
        registrationFee: req.body.registrationFee ? parseFloat(req.body.registrationFee) : null,
        sessionDurationMinutes: req.body.sessionDurationMinutes ? parseInt(req.body.sessionDurationMinutes) : null,
        sessionsPerWeek: req.body.sessionsPerWeek ? parseInt(req.body.sessionsPerWeek) : null,
        batchSize: req.body.batchSize ? parseInt(req.body.batchSize) : null,
      };

      const [newClass] = await db
        .insert(danceKarateGymYoga)
        .values(sanitizedData)
        .returning();

      res.status(201).json(newClass);
    } catch (error: any) {
      console.error("Error creating class:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE dance/karate/gym/yoga class
  app.put("/api/admin/dance-karate-gym-yoga/:id", async (req, res) => {
    try {
      // Sanitize numeric fields
      const sanitizedData = {
        ...req.body,
        instructorExperienceYears: req.body.instructorExperienceYears ? parseInt(req.body.instructorExperienceYears) : null,
        feePerMonth: req.body.feePerMonth ? parseFloat(req.body.feePerMonth) : null,
        feePerSession: req.body.feePerSession ? parseFloat(req.body.feePerSession) : null,
        registrationFee: req.body.registrationFee ? parseFloat(req.body.registrationFee) : null,
        sessionDurationMinutes: req.body.sessionDurationMinutes ? parseInt(req.body.sessionDurationMinutes) : null,
        sessionsPerWeek: req.body.sessionsPerWeek ? parseInt(req.body.sessionsPerWeek) : null,
        batchSize: req.body.batchSize ? parseInt(req.body.batchSize) : null,
        updatedAt: new Date()
      };

      const [updatedClass] = await db
        .update(danceKarateGymYoga)
        .set(sanitizedData)
        .where(eq(danceKarateGymYoga.id, req.params.id))
        .returning();

      if (!updatedClass) {
        return res.status(404).json({ message: "Class not found" });
      }

      res.json(updatedClass);
    } catch (error: any) {
      console.error("Error updating class:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE dance/karate/gym/yoga class
  app.delete("/api/admin/dance-karate-gym-yoga/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(danceKarateGymYoga)
        .where(eq(danceKarateGymYoga.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Class not found" });
      }

      res.json({ message: "Class deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting class:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/dance-karate-gym-yoga/:id/toggle-active", async (req, res) => {
    try {
      const classItem = await db.query.danceKarateGymYoga.findFirst({
        where: eq(danceKarateGymYoga.id, req.params.id),
      });

      if (!classItem) {
        return res.status(404).json({ message: "Class not found" });
      }

      const [updated] = await db
        .update(danceKarateGymYoga)
        .set({ isActive: !classItem.isActive, updatedAt: new Date() })
        .where(eq(danceKarateGymYoga.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling active status:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/dance-karate-gym-yoga/:id/toggle-featured", async (req, res) => {
    try {
      const classItem = await db.query.danceKarateGymYoga.findFirst({
        where: eq(danceKarateGymYoga.id, req.params.id),
      });

      if (!classItem) {
        return res.status(404).json({ message: "Class not found" });
      }

      const [updated] = await db
        .update(danceKarateGymYoga)
        .set({ isFeatured: !classItem.isFeatured, updatedAt: new Date() })
        .where(eq(danceKarateGymYoga.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling featured status:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Language Classes Routes - Full CRUD

  // GET all language classes
  app.get("/api/admin/language-classes", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const headerRole = typeof req.headers['x-user-role'] === 'string' ? (req.headers['x-user-role'] as string) : undefined;
      const queryRole = typeof req.query.role === 'string' ? (req.query.role as string) : undefined;
      const isAdmin = (sessionUser && sessionUser.role === 'admin') || headerRole === 'admin' || queryRole === 'admin';

      const headerUserId = typeof req.headers['x-user-id'] === 'string' ? (req.headers['x-user-id'] as string) : undefined;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;

      let classes;
      if (isAdmin) {
        classes = await db.query.languageClasses.findMany({
          where: queryUserId ? eq(languageClasses.userId, queryUserId) : undefined,
          orderBy: desc(languageClasses.createdAt),
        });
      } else if ((sessionUser && sessionUser.id) || headerUserId || queryUserId) {
        const effectiveUserId = (sessionUser && sessionUser.id) ? (sessionUser.id as string) : (headerUserId || queryUserId) as string;
        classes = await db.query.languageClasses.findMany({
          where: eq(languageClasses.userId, effectiveUserId),
          orderBy: desc(languageClasses.createdAt),
        });
      } else {
        classes = [];
      }

      res.json(classes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single language class by ID
  app.get("/api/admin/language-classes/:id", async (req, res) => {
    try {
      const cls = await db.query.languageClasses.findFirst({ where: eq(languageClasses.id, req.params.id) });
      if (!cls) return res.status(404).json({ message: "Language class not found" });
      res.json(cls);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new language class
  app.post("/api/admin/language-classes", async (req, res) => {
    try {
      const data = req.body;

      // required fields
      const required = ["title", "listingType", "languageName", "proficiencyLevel", "courseDurationMonths", "feePerMonth", "contactPerson", "contactPhone", "userId"];
      for (const f of required) {
        if (!data[f]) return res.status(400).json({ message: `${f} is required` });
      }

      const sanitized = {
        title: data.title,
        description: data.description || null,
        listingType: data.listingType,
        languageName: data.languageName,
        proficiencyLevel: data.proficiencyLevel,
        courseDurationMonths: data.courseDurationMonths ? parseInt(data.courseDurationMonths) : null,
        classesPerWeek: data.classesPerWeek ? parseInt(data.classesPerWeek) : null,
        classDurationHours: data.classDurationHours ? parseFloat(data.classDurationHours) : null,
        teachingMode: data.teachingMode || null,
        classType: data.classType || null,
        batchSize: data.batchSize ? parseInt(data.batchSize) : null,
        instructorName: data.instructorName || null,
        instructorQualification: data.instructorQualification || null,
        instructorExperience: data.instructorExperience ? parseInt(data.instructorExperience) : null,
        nativeSpeaker: parseBoolean(data.nativeSpeaker, false),
        feePerMonth: parseFloat(data.feePerMonth.toString()),
        registrationFee: data.registrationFee ? parseFloat(data.registrationFee.toString()) : null,
        totalCourseFee: data.totalCourseFee ? parseFloat(data.totalCourseFee.toString()) : null,
        studyMaterialsProvided: Array.isArray(data.studyMaterialsProvided) ? data.studyMaterialsProvided : [],
        certificationProvided: parseBoolean(data.certificationProvided, false),
        freeDemoClass: parseBoolean(data.freeDemoClass, false),
        images: asStringArray(data.images),
        contactPerson: data.contactPerson,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail || null,
        country: data.country || "India",
        stateProvince: data.stateProvince || null,
        city: data.city || null,
        areaName: data.areaName || null,
        fullAddress: data.fullAddress || null,
        isActive: parseBoolean(data.isActive, true),
        isFeatured: parseBoolean(data.isFeatured, false),
        userId: data.userId,
        role: data.role || 'user',
      };

      const [newRow] = await db.insert(languageClasses).values(sanitized).returning();
      res.status(201).json(newRow);
    } catch (error: any) {
      console.error("Error creating language class:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE language class
  app.put("/api/admin/language-classes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!data.userId) return res.status(400).json({ message: "userId is required" });

      const updateData: any = { ...data, updatedAt: new Date() };
      if (data.courseDurationMonths !== undefined) updateData.courseDurationMonths = data.courseDurationMonths ? parseInt(data.courseDurationMonths) : null;
      if (data.classesPerWeek !== undefined) updateData.classesPerWeek = data.classesPerWeek ? parseInt(data.classesPerWeek) : null;
      if (data.classDurationHours !== undefined) updateData.classDurationHours = data.classDurationHours ? parseFloat(data.classDurationHours) : null;
      if (data.batchSize !== undefined) updateData.batchSize = data.batchSize ? parseInt(data.batchSize) : null;
      if (data.instructorExperience !== undefined) updateData.instructorExperience = data.instructorExperience ? parseInt(data.instructorExperience) : null;
      if (data.feePerMonth !== undefined) updateData.feePerMonth = data.feePerMonth ? parseFloat(data.feePerMonth.toString()) : null;
      if (data.registrationFee !== undefined) updateData.registrationFee = data.registrationFee ? parseFloat(data.registrationFee.toString()) : null;
      if (data.totalCourseFee !== undefined) updateData.totalCourseFee = data.totalCourseFee ? parseFloat(data.totalCourseFee.toString()) : null;

       if (data.nativeSpeaker !== undefined) updateData.nativeSpeaker = parseBoolean(data.nativeSpeaker, false);
       if (data.certificationProvided !== undefined) updateData.certificationProvided = parseBoolean(data.certificationProvided, false);
       if (data.freeDemoClass !== undefined) updateData.freeDemoClass = parseBoolean(data.freeDemoClass, false);
       if (data.isActive !== undefined) updateData.isActive = parseBoolean(data.isActive, true);
       if (data.isFeatured !== undefined) updateData.isFeatured = parseBoolean(data.isFeatured, false);
       if (data.images !== undefined) updateData.images = asStringArray(data.images);
       if (data.studyMaterialsProvided !== undefined) updateData.studyMaterialsProvided = Array.isArray(data.studyMaterialsProvided) ? data.studyMaterialsProvided : [];

      const [updated] = await db.update(languageClasses).set(updateData).where(eq(languageClasses.id, id)).returning();
      if (!updated) return res.status(404).json({ message: "Language class not found" });
      res.json(updated);
    } catch (error: any) {
      console.error("Error updating language class:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE language class
  app.delete("/api/admin/language-classes/:id", async (req, res) => {
    try {
      const deleted = await db.delete(languageClasses).where(eq(languageClasses.id, req.params.id)).returning();
      if (deleted.length === 0) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Delete error:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active
  app.patch("/api/admin/language-classes/:id/toggle-active", async (req, res) => {
    try {
      const row = await db.query.languageClasses.findFirst({ where: eq(languageClasses.id, req.params.id) });
      if (!row) return res.status(404).json({ message: "Not found" });
      const [updated] = await db.update(languageClasses).set({ isActive: !row.isActive, updatedAt: new Date() }).where(eq(languageClasses.id, req.params.id)).returning();
      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling active:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured
  app.patch("/api/admin/language-classes/:id/toggle-featured", async (req, res) => {
    try {
      const row = await db.query.languageClasses.findFirst({ where: eq(languageClasses.id, req.params.id) });
      if (!row) return res.status(404).json({ message: "Not found" });
      const [updated] = await db.update(languageClasses).set({ isFeatured: !row.isFeatured, updatedAt: new Date() }).where(eq(languageClasses.id, req.params.id)).returning();
      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling featured:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Academies - Music, Arts, Sports Routes - Full CRUD

app.get("/api/admin/academies-music-arts-sports", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const headerRole = typeof req.headers['x-user-role'] === 'string' ? (req.headers['x-user-role'] as string) : undefined;
      const queryRole = typeof req.query.role === 'string' ? (req.query.role as string) : undefined;
      const isAdmin = (sessionUser && sessionUser.role === 'admin') || headerRole === 'admin' || queryRole === 'admin';

      const headerUserId = typeof req.headers['x-user-id'] === 'string' ? (req.headers['x-user-id'] as string) : undefined;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;

      let academies;
      if (isAdmin) {
        academies = await db.query.academiesMusicArtsSports.findMany({
          where: queryUserId ? eq(academiesMusicArtsSports.userId, queryUserId) : undefined,
          orderBy: desc(academiesMusicArtsSports.createdAt),
        });
      } else if ((sessionUser && sessionUser.id) || headerUserId || queryUserId) {
        const effectiveUserId = (sessionUser && sessionUser.id) ? (sessionUser.id as string) : (headerUserId || queryUserId) as string;
        academies = await db.query.academiesMusicArtsSports.findMany({
          where: eq(academiesMusicArtsSports.userId, effectiveUserId),
          orderBy: desc(academiesMusicArtsSports.createdAt),
        });
      } else {
        academies = [];
      }
      res.json(academies);
    } catch (error: any) {
      console.error('Error fetching academies:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // GET single academy by ID
  app.get("/api/admin/academies-music-arts-sports/:id", async (req, res) => {
    try {
      const academy = await db.query.academiesMusicArtsSports.findFirst({
        where: eq(academiesMusicArtsSports.id, req.params.id),
      });

      if (!academy) {
        return res.status(404).json({ message: "Academy not found" });
      }

      res.json(academy);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new academy
  app.post("/api/admin/academies-music-arts-sports", async (req, res) => {
    try {
      const {
        title,
        description,
        academyCategory,
        specialization,
        establishedYear,
        coursesOffered,
        classType,
        ageGroup,
        courseDurationMonths,
        feePerMonth,
        admissionFee,
        instrumentRentalFee,
        certificationOffered,
        freeTrialClass,
        facilities,
        airConditioned,
        parkingAvailable,
        changingRooms,
        equipmentProvided,
        headInstructor,
        totalInstructors,
        instructorQualification,
        awardsAchievements,
        contactPerson,
        contactPhone,
        contactEmail,
        website,
        country,
        stateProvince,
        city,
        areaName,
        fullAddress,
        images,
        isActive,
        isFeatured,
        userId,
        role,
      } = req.body;

      // Validate required fields
      if (!title || !academyCategory || !feePerMonth || !contactPerson || !contactPhone || !fullAddress) {
        return res.status(400).json({
          message: "Missing required fields: title, academyCategory, feePerMonth, contactPerson, contactPhone, fullAddress"
        });
      }

      if (!userId) {
        return res.status(400).json({
          message: "userId is required"
        });
      }

      const [newAcademy] = await db
        .insert(academiesMusicArtsSports)
        .values({
          title,
          description: description || null,
          academyCategory,
          specialization: specialization || null,
          establishedYear: establishedYear ? parseInt(establishedYear.toString()) : null,
          coursesOffered: Array.isArray(coursesOffered) ? coursesOffered : [],
          classType: classType || null,
          ageGroup: ageGroup || null,
          courseDurationMonths: courseDurationMonths ? parseInt(courseDurationMonths.toString()) : null,
          feePerMonth: parseFloat(feePerMonth.toString()),
          admissionFee: admissionFee ? parseFloat(admissionFee.toString()) : null,
          instrumentRentalFee: instrumentRentalFee ? parseFloat(instrumentRentalFee.toString()) : null,
          certificationOffered: parseBoolean(certificationOffered, false),
          freeTrialClass: parseBoolean(freeTrialClass, false),
          facilities: Array.isArray(facilities) ? facilities : [],
          airConditioned: parseBoolean(airConditioned, false),
          parkingAvailable: parseBoolean(parkingAvailable, false),
          changingRooms: parseBoolean(changingRooms, false),
          equipmentProvided: parseBoolean(equipmentProvided, false),
          headInstructor: headInstructor || null,
          totalInstructors: totalInstructors ? parseInt(totalInstructors.toString()) : null,
          instructorQualification: instructorQualification || null,
          awardsAchievements: awardsAchievements || null,
          contactPerson,
          contactPhone,
          contactEmail: contactEmail || null,
          website: website || null,
          country: country || "India",
          stateProvince: stateProvince || null,
          city: city || null,
          areaName: areaName || null,
          fullAddress,
          images: asStringArray(images),
          isActive: parseBoolean(isActive, true),
          isFeatured: parseBoolean(isFeatured, false),
          userId: userId,
          role: role || 'user',
        })
        .returning();

      res.status(201).json(newAcademy);
    } catch (error: any) {
      console.error("Error creating academy:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE academy
  app.put("/api/admin/academies-music-arts-sports/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { userId, role, ...otherData } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const updateData: any = {
        ...otherData,
        userId: userId,
        role: role || 'user',
        updatedAt: new Date()
      };

      if (otherData.establishedYear !== undefined) updateData.establishedYear = otherData.establishedYear ? parseInt(otherData.establishedYear.toString()) : null;
      if (otherData.courseDurationMonths !== undefined) updateData.courseDurationMonths = otherData.courseDurationMonths ? parseInt(otherData.courseDurationMonths.toString()) : null;
      if (otherData.totalInstructors !== undefined) updateData.totalInstructors = otherData.totalInstructors ? parseInt(otherData.totalInstructors.toString()) : null;

      if (otherData.feePerMonth !== undefined) updateData.feePerMonth = otherData.feePerMonth ? parseFloat(otherData.feePerMonth.toString()) : null;
      if (otherData.admissionFee !== undefined) updateData.admissionFee = otherData.admissionFee ? parseFloat(otherData.admissionFee.toString()) : null;
      if (otherData.instrumentRentalFee !== undefined) updateData.instrumentRentalFee = otherData.instrumentRentalFee ? parseFloat(otherData.instrumentRentalFee.toString()) : null;

      if (otherData.coursesOffered !== undefined) updateData.coursesOffered = Array.isArray(otherData.coursesOffered) ? otherData.coursesOffered : [];
      if (otherData.facilities !== undefined) updateData.facilities = Array.isArray(otherData.facilities) ? otherData.facilities : [];
      if (otherData.images !== undefined) updateData.images = asStringArray(otherData.images);

      if (otherData.certificationOffered !== undefined) updateData.certificationOffered = parseBoolean(otherData.certificationOffered, false);
      if (otherData.freeTrialClass !== undefined) updateData.freeTrialClass = parseBoolean(otherData.freeTrialClass, false);
      if (otherData.airConditioned !== undefined) updateData.airConditioned = parseBoolean(otherData.airConditioned, false);
      if (otherData.parkingAvailable !== undefined) updateData.parkingAvailable = parseBoolean(otherData.parkingAvailable, false);
      if (otherData.changingRooms !== undefined) updateData.changingRooms = parseBoolean(otherData.changingRooms, false);
      if (otherData.equipmentProvided !== undefined) updateData.equipmentProvided = parseBoolean(otherData.equipmentProvided, false);
      if (otherData.isActive !== undefined) updateData.isActive = parseBoolean(otherData.isActive, true);
      if (otherData.isFeatured !== undefined) updateData.isFeatured = parseBoolean(otherData.isFeatured, false);

      const [updatedAcademy] = await db
        .update(academiesMusicArtsSports)
        .set(updateData)
        .where(eq(academiesMusicArtsSports.id, id))
        .returning();

      if (!updatedAcademy) {
        return res.status(404).json({ message: "Academy not found" });
      }

      res.json(updatedAcademy);
    } catch (error: any) {
      console.error("Error updating academy:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE academy
  app.delete("/api/admin/academies-music-arts-sports/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(academiesMusicArtsSports)
        .where(eq(academiesMusicArtsSports.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Academy not found" });
      }

      res.json({ message: "Academy deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting academy:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/academies-music-arts-sports/:id/toggle-active", async (req, res) => {
    try {
      const academy = await db.query.academiesMusicArtsSports.findFirst({
        where: eq(academiesMusicArtsSports.id, req.params.id),
      });

      if (!academy) {
        return res.status(404).json({ message: "Academy not found" });
      }

      const [updated] = await db
        .update(academiesMusicArtsSports)
        .set({ isActive: !academy.isActive, updatedAt: new Date() })
        .where(eq(academiesMusicArtsSports.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling active status:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/academies-music-arts-sports/:id/toggle-featured", async (req, res) => {
    try {
      const academy = await db.query.academiesMusicArtsSports.findFirst({
        where: eq(academiesMusicArtsSports.id, req.params.id),
      });

      if (!academy) {
        return res.status(404).json({ message: "Academy not found" });
      }

      const [updated] = await db
        .update(academiesMusicArtsSports)
        .set({ isFeatured: !academy.isFeatured, updatedAt: new Date() })
        .where(eq(academiesMusicArtsSports.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling featured status:", error);
      res.status(500).json({ message: error.message });
    }
  });


  // Academies - Music, Arts, Sports Routes - Full CRUD
app.get("/api/admin/schools-colleges-coaching", async (req, res) => {
  try {
    const sessionUser = (req as any).session?.user || null;
    const headerRole = typeof req.headers['x-user-role'] === 'string' ? (req.headers['x-user-role'] as string) : undefined;
    const queryRole = typeof req.query.role === 'string' ? (req.query.role as string) : undefined;
    const isAdmin = (sessionUser && sessionUser.role === 'admin') || headerRole === 'admin' || queryRole === 'admin';

    const headerUserId = typeof req.headers['x-user-id'] === 'string' ? (req.headers['x-user-id'] as string) : undefined;
    const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;

    let results;
    if (isAdmin) {
      results = await db.query.schoolsCollegesCoaching.findMany({
        where: queryUserId ? eq(schoolsCollegesCoaching.userId, queryUserId) : undefined,
        orderBy: desc(schoolsCollegesCoaching.createdAt),
      });
    } else if ((sessionUser && sessionUser.id) || headerUserId || queryUserId) {
      const effectiveUserId = (sessionUser && sessionUser.id) ? (sessionUser.id as string) : (headerUserId || queryUserId) as string;
      results = await db.query.schoolsCollegesCoaching.findMany({
        where: eq(schoolsCollegesCoaching.userId, effectiveUserId),
        orderBy: desc(schoolsCollegesCoaching.createdAt),
      });
    } else {
      results = [];
    }

    res.json(results);

  } catch (error: any) {
    console.error("Error fetching schools/colleges/coaching:", error);
    res.status(500).json({ message: error.message });
  }
});

  // GET single academy by ID
  app.get("/api/admin/schools-colleges-coaching/:id", async (req, res) => {
  try {
    const school = await db.query.schoolsCollegesCoaching.findFirst({
      where: eq(schoolsCollegesCoaching.id, req.params.id),
    });

    if (!school) {
      return res.status(404).json({ message: "School/College/Coaching not found" });
    }

    res.json(school);

  } catch (error: any) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: error.message });
  }
});


  // CREATE new academy
app.post("/api/admin/schools-colleges-coaching", async (req, res) => {
  try {
    const data = req.body;

    // Required fields validation
    const required = ["title", "listingType", "institutionCategory", "institutionName", "contactPerson", "contactPhone", "fullAddress", "userId"];
    for (const field of required) {
      if (!data[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    const [newRow] = await db.insert(schoolsCollegesCoaching).values({
      title: data.title,
      description: data.description || null,
      listingType: data.listingType,
      institutionCategory: data.institutionCategory,
      institutionName: data.institutionName,
      institutionType: data.institutionType || null,
      affiliation: data.affiliation || null,
      accreditation: data.accreditation || null,
      establishmentYear: data.establishmentYear ? Number(data.establishmentYear) : null,
      boardAffiliation: data.boardAffiliation || null,
      universityAffiliation: data.universityAffiliation || null,
      coursesOffered: data.coursesOffered || [],
      examPreparationFor: data.examPreparationFor || [],
      annualTuitionFee: data.annualTuitionFee ? Number(data.annualTuitionFee) : null,
      totalFeePerYear: data.totalFeePerYear ? Number(data.totalFeePerYear) : null,
      scholarshipAvailable: data.scholarshipAvailable ?? false,
      hostelFacility: data.hostelFacility ?? false,
      transportFacility: data.transportFacility ?? false,
      libraryAvailable: data.libraryAvailable ?? false,
      computerLab: data.computerLab ?? false,
      contactPerson: data.contactPerson,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail || null,
      country: data.country || "India",
      stateProvince: data.stateProvince || null,
      city: data.city || null,
      areaName: data.areaName || null,
      fullAddress: data.fullAddress,
      images: Array.isArray(data.images) ? data.images : [],
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      viewCount: data.viewCount ?? 0,
      userId: data.userId,
      role: data.role || "user",
    }).returning();

    res.status(201).json(newRow);

  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.put("/api/admin/schools-colleges-coaching/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!data.userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const updateData = {
      ...data,
      images: Array.isArray(data.images) ? data.images : [],
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(schoolsCollegesCoaching)
      .set(updateData)
      .where(eq(schoolsCollegesCoaching.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(updated);

  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
});


  // DELETE academy
 app.delete("/api/admin/schools-colleges-coaching/:id", async (req, res) => {
  try {
    const deleted = await db
      .delete(schoolsCollegesCoaching)
      .where(eq(schoolsCollegesCoaching.id, req.params.id))
      .returning();

    if (deleted.length === 0)
      return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted successfully" });

  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: error.message });
  }
});
app.delete("/api/admin/schools-colleges-coaching/:id", async (req, res) => {
  try {
    const [deleted] = await db
      .delete(schoolsCollegesCoaching)
      .where(eq(schoolsCollegesCoaching.id, req.params.id))
      .returning();

    if (!deleted) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted successfully", id: req.params.id });

  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.patch("/api/admin/schools-colleges-coaching/:id/toggle-active", async (req, res) => {
  try {
    const row = await db.query.schoolsCollegesCoaching.findFirst({
      where: eq(schoolsCollegesCoaching.id, req.params.id)
    });

    if (!row) return res.status(404).json({ message: "Not found" });

    const [updated] = await db
      .update(schoolsCollegesCoaching)
      .set({ isActive: !row.isActive, updatedAt: new Date() })
      .where(eq(schoolsCollegesCoaching.id, req.params.id))
      .returning();

    res.json(updated);

  } catch (error) {
    console.error("Error toggling active:", error);
    res.status(500).json({ message: error.message });
  }
});
app.patch("/api/admin/schools-colleges-coaching/:id/toggle-featured", async (req, res) => {
  try {
    const row = await db.query.schoolsCollegesCoaching.findFirst({
      where: eq(schoolsCollegesCoaching.id, req.params.id)
    });

    if (!row) return res.status(404).json({ message: "Not found" });

    const [updated] = await db
      .update(schoolsCollegesCoaching)
      .set({ isFeatured: !row.isFeatured, updatedAt: new Date() })
      .where(eq(schoolsCollegesCoaching.id, req.params.id))
      .returning();

    res.json(updated);

  } catch (error) {
    console.error("Error toggling featured:", error);
    res.status(500).json({ message: error.message });
  }
});
app.get("/api/admin/skill-training-certification", async (req, res) => {
  try {
    const sessionUser = (req as any).session?.user || null;
    const headerRole = typeof req.headers['x-user-role'] === 'string' ? (req.headers['x-user-role'] as string) : undefined;
    const queryRole = typeof req.query.role === 'string' ? (req.query.role as string) : undefined;
    const isAdmin = (sessionUser && sessionUser.role === 'admin') || headerRole === 'admin' || queryRole === 'admin';

    const headerUserId = typeof req.headers['x-user-id'] === 'string' ? (req.headers['x-user-id'] as string) : undefined;
    const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;

    let results;
    if (isAdmin) {
      results = await db.query.skillTrainingCertification.findMany({
        where: queryUserId ? eq(skillTrainingCertification.userId, queryUserId) : undefined,
        orderBy: desc(skillTrainingCertification.createdAt),
      });
    } else if ((sessionUser && sessionUser.id) || headerUserId || queryUserId) {
      const effectiveUserId = (sessionUser && sessionUser.id) ? (sessionUser.id as string) : (headerUserId || queryUserId) as string;
      results = await db.query.skillTrainingCertification.findMany({
        where: eq(skillTrainingCertification.userId, effectiveUserId),
        orderBy: desc(skillTrainingCertification.createdAt),
      });
    } else {
      results = [];
    }

    res.json(results);

  } catch (error: any) {
    console.error("Error fetching skill training:", error);
    res.status(500).json({ message: error.message });
  }
});
app.get("/api/admin/skill-training-certification/:id", async (req, res) => {
  try {
    const training = await db.query.skillTrainingCertification.findFirst({
      where: eq(skillTrainingCertification.id, req.params.id),
    });

    if (!training) {
      return res.status(404).json({ message: "Training not found" });
    }

    res.json(training);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
app.post("/api/admin/skill-training-certification", async (req, res) => {
  try {
    const {
      title,
      description,
      skillCategory,
      trainingType,
      skillsTaught,
      instituteName,
      certificationBody,
      certificationName,
      governmentRecognized,
      internationallyRecognized,
      courseDurationDays,
      courseDurationMonths,
      totalClassHours,
      onlineMode,
      offlineMode,
      weekendBatches,
      practicalTraining,
      studyMaterialProvided,
      internshipIncluded,
      totalFee,
      registrationFee,
      examFee,
      installmentAvailable,
      scholarshipAvailable,
      placementAssistance,
      placementRate,
      careerOpportunities,
      averageSalaryPackage,
      contactPerson,
      contactPhone,
      contactEmail,
      country,
      stateProvince,
      city,
      areaName,
      fullAddress,
      images,
      isActive,
      isFeatured,
      userId,
      role,
    } = req.body;

    // Required fields
    if (!title || !skillCategory || !trainingType || !instituteName || !totalFee || !contactPerson || !contactPhone) {
      return res.status(400).json({
        message: "Missing required fields: title, skillCategory, trainingType, instituteName, totalFee, contactPerson, contactPhone"
      });
    }

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const [newTraining] = await db
      .insert(skillTrainingCertification)
      .values({
        title,
        description: description || null,
        skillCategory,
        trainingType,
        skillsTaught: skillsTaught || [],
        instituteName,
        certificationBody: certificationBody || null,
        certificationName: certificationName || null,
        governmentRecognized: governmentRecognized || false,
        internationallyRecognized: internationallyRecognized || false,
        courseDurationDays: courseDurationDays ? parseInt(courseDurationDays) : null,
        courseDurationMonths: courseDurationMonths ? parseInt(courseDurationMonths) : null,
        totalClassHours: totalClassHours ? parseInt(totalClassHours) : null,
        onlineMode: onlineMode || false,
        offlineMode: offlineMode || false,
        weekendBatches: weekendBatches || false,
        practicalTraining: practicalTraining || false,
        studyMaterialProvided: studyMaterialProvided || false,
        internshipIncluded: internshipIncluded || false,
        totalFee: parseFloat(totalFee),
        registrationFee: registrationFee ? parseFloat(registrationFee) : null,
        examFee: examFee ? parseFloat(examFee) : null,
        installmentAvailable: installmentAvailable || false,
        scholarshipAvailable: scholarshipAvailable || false,
        placementAssistance: placementAssistance || false,
        placementRate: placementRate ? parseFloat(placementRate) : null,
        careerOpportunities: careerOpportunities || [],
        averageSalaryPackage: averageSalaryPackage ? parseFloat(averageSalaryPackage) : null,
        contactPerson,
        contactPhone,
        contactEmail: contactEmail || null,
        country: country || "India",
        stateProvince,
        city,
        areaName,
        fullAddress,
        images: Array.isArray(images) ? images : [],
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: isFeatured || false,
        userId,
        role: role || "user",
      })
      .returning();

    res.status(201).json(newTraining);

  } catch (error: any) {
    console.error("Error creating training:", error);
    res.status(400).json({ message: error.message });
  }
});
app.put("/api/admin/skill-training-certification/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role, ...data } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const updateData = {
      ...data,
      userId,
      role: role || "user",
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(skillTrainingCertification)
      .set(updateData)
      .where(eq(skillTrainingCertification.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ message: "Training not found" });
    }

    res.json(updated);

  } catch (error: any) {
    console.error("Error updating training:", error);
    res.status(400).json({ message: error.message });
  }
});
app.delete("/api/admin/skill-training-certification/:id", async (req, res) => {
  try {
    const rows = await db
      .delete(skillTrainingCertification)
      .where(eq(skillTrainingCertification.id, req.params.id))
      .returning();

    if (rows.length === 0) {
      return res.status(404).json({ message: "Training not found" });
    }

    res.json({ message: "Training deleted successfully", id: req.params.id });

  } catch (error: any) {
    console.error("Error deleting training:", error);
    res.status(500).json({ message: error.message });
  }
});
app.patch("/api/admin/skill-training-certification/:id/toggle-active", async (req, res) => {
  try {
    const record = await db.query.skillTrainingCertification.findFirst({
      where: eq(skillTrainingCertification.id, req.params.id),
    });

    if (!record) {
      return res.status(404).json({ message: "Training not found" });
    }

    const [updated] = await db
      .update(skillTrainingCertification)
      .set({
        isActive: !record.isActive,
        updatedAt: new Date(),
      })
      .where(eq(skillTrainingCertification.id, req.params.id))
      .returning();

    res.json(updated);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});
app.patch("/api/admin/skill-training-certification/:id/toggle-featured", async (req, res) => {
  try {
    const record = await db.query.skillTrainingCertification.findFirst({
      where: eq(skillTrainingCertification.id, req.params.id),
    });

    if (!record) {
      return res.status(404).json({ message: "Training not found" });
    }

    const [updated] = await db
      .update(skillTrainingCertification)
      .set({
        isFeatured: !record.isFeatured,
        updatedAt: new Date(),
      })
      .where(eq(skillTrainingCertification.id, req.params.id))
      .returning();

    res.json(updated);

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

 
  // GET all tuition classes
  app.get("/api/admin/tuition-private-classes", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let classes;
      if ((sessionUser && sessionUser.role === 'admin') || queryRole === 'admin') {
        classes = await db.query.tuitionPrivateClasses.findMany({
          where: queryUserId ? eq(tuitionPrivateClasses.userId, queryUserId) : undefined,
          orderBy: desc(tuitionPrivateClasses.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        classes = await db.query.tuitionPrivateClasses.findMany({
          where: eq(tuitionPrivateClasses.userId, sessionUser.id as string),
          orderBy: desc(tuitionPrivateClasses.createdAt),
        });
      } else {
        classes = [];
      }

      res.json(classes);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single tuition class by ID
  app.get("/api/admin/tuition-private-classes/:id", async (req, res) => {
    try {
      console.log(`GET /api/admin/tuition-private-classes/${req.params.id} query=${JSON.stringify(req.query)}`);
      const tuitionClass = await db.query.tuitionPrivateClasses.findFirst({
        where: eq(tuitionPrivateClasses.id, req.params.id),
      });

      if (!tuitionClass) {
        console.warn(`Tuition class not found for id=${req.params.id}`);
        return res.status(404).json({ message: "Tuition class not found" });
      }

      res.json(tuitionClass);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new tuition class
  app.post("/api/admin/tuition-private-classes", async (req, res) => {
    try {
      const [newClass] = await db
        .insert(tuitionPrivateClasses)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newClass);
    } catch (error: any) {
      console.error("Error creating tuition class:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE tuition class
  app.put("/api/admin/tuition-private-classes/:id", async (req, res) => {
    try {
      const [updatedClass] = await db
        .update(tuitionPrivateClasses)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(tuitionPrivateClasses.id, req.params.id))
        .returning();

      if (!updatedClass) {
        return res.status(404).json({ message: "Tuition class not found" });
      }

      res.json(updatedClass);
    } catch (error: any) {
      console.error("Error updating tuition class:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE tuition class
  app.delete("/api/admin/tuition-private-classes/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(tuitionPrivateClasses)
        .where(eq(tuitionPrivateClasses.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Tuition class not found" });
      }

      res.json({ message: "Tuition class deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting tuition class:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/tuition-private-classes/:id/toggle-active", async (req, res) => {
    try {
      const tuitionClass = await db.query.tuitionPrivateClasses.findFirst({
        where: eq(tuitionPrivateClasses.id, req.params.id),
      });

      if (!tuitionClass) {
        return res.status(404).json({ message: "Tuition class not found" });
      }

      const [updated] = await db
        .update(tuitionPrivateClasses)
        .set({ isActive: !tuitionClass.isActive, updatedAt: new Date() })
        .where(eq(tuitionPrivateClasses.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/tuition-private-classes/:id/toggle-featured", async (req, res) => {
    try {
      const tuitionClass = await db.query.tuitionPrivateClasses.findFirst({
        where: eq(tuitionPrivateClasses.id, req.params.id),
      });

      if (!tuitionClass) {
        return res.status(404).json({ message: "Tuition class not found" });
      }

      const [updated] = await db
        .update(tuitionPrivateClasses)
        .set({ isFeatured: !tuitionClass.isFeatured, updatedAt: new Date() })
        .where(eq(tuitionPrivateClasses.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Educational Consultancy Study Abroad Routes - Full CRUD

  // GET all educational consultancy services
  app.get("/api/admin/educational-consultancy-study-abroad", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;

      const q = typeof (req.query as any)?.q === 'string' ? String((req.query as any).q).trim().toLowerCase() : '';
      const country = typeof (req.query as any)?.country === 'string' ? String((req.query as any).country).trim() : '';
      const isActiveParam = typeof (req.query as any)?.isActive === 'string' ? String((req.query as any).isActive).trim() : '';
      const isFeaturedParam = typeof (req.query as any)?.isFeatured === 'string' ? String((req.query as any).isFeatured).trim() : '';

      let services;
      if (sessionUser && sessionUser.role === 'admin') {
        const conditions: any[] = [];
        if (queryUserId) conditions.push(eq(educationalConsultancyStudyAbroad.userId, queryUserId));
        if (country) conditions.push(eq(educationalConsultancyStudyAbroad.country, country));
        if (isActiveParam !== '') conditions.push(eq(educationalConsultancyStudyAbroad.isActive, parseBoolean(isActiveParam)));
        if (isFeaturedParam !== '') conditions.push(eq(educationalConsultancyStudyAbroad.isFeatured, parseBoolean(isFeaturedParam)));
        if (q) {
          const like = `%${q}%`;
          conditions.push(
            or(
              sql`lower(${educationalConsultancyStudyAbroad.title}) like ${like}`,
              sql`lower(${educationalConsultancyStudyAbroad.description}) like ${like}`,
              sql`lower(${educationalConsultancyStudyAbroad.companyName}) like ${like}`,
              sql`lower(${educationalConsultancyStudyAbroad.contactPerson}) like ${like}`,
              sql`lower(${educationalConsultancyStudyAbroad.contactPhone}) like ${like}`,
              sql`lower(${educationalConsultancyStudyAbroad.contactEmail}) like ${like}`
            )
          );
        }

        services = await db.query.educationalConsultancyStudyAbroad.findMany({
          where: conditions.length ? and(...conditions) : undefined,
          orderBy: desc(educationalConsultancyStudyAbroad.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        const conditions: any[] = [eq(educationalConsultancyStudyAbroad.userId, sessionUser.id as string)];
        if (country) conditions.push(eq(educationalConsultancyStudyAbroad.country, country));
        if (isActiveParam !== '') conditions.push(eq(educationalConsultancyStudyAbroad.isActive, parseBoolean(isActiveParam)));
        if (isFeaturedParam !== '') conditions.push(eq(educationalConsultancyStudyAbroad.isFeatured, parseBoolean(isFeaturedParam)));
        if (q) {
          const like = `%${q}%`;
          conditions.push(
            or(
              sql`lower(${educationalConsultancyStudyAbroad.title}) like ${like}`,
              sql`lower(${educationalConsultancyStudyAbroad.description}) like ${like}`,
              sql`lower(${educationalConsultancyStudyAbroad.companyName}) like ${like}`,
              sql`lower(${educationalConsultancyStudyAbroad.contactPerson}) like ${like}`,
              sql`lower(${educationalConsultancyStudyAbroad.contactPhone}) like ${like}`,
              sql`lower(${educationalConsultancyStudyAbroad.contactEmail}) like ${like}`
            )
          );
        }

        services = await db.query.educationalConsultancyStudyAbroad.findMany({
          where: and(...conditions),
          orderBy: desc(educationalConsultancyStudyAbroad.createdAt),
        });
      } else {
        services = [];
      }

      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single service by ID
  app.get("/api/admin/educational-consultancy-study-abroad/:id", async (req, res) => {
    try {
      const service = await db.query.educationalConsultancyStudyAbroad.findFirst({
        where: eq(educationalConsultancyStudyAbroad.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new service
  app.post("/api/admin/educational-consultancy-study-abroad", async (req, res) => {
    try {
      const [newService] = await db
        .insert(educationalConsultancyStudyAbroad)
        .values({
          ...req.body,
          country: req.body.country || "India",
        })
        .returning();

      res.status(201).json(newService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // UPDATE service
  app.put("/api/admin/educational-consultancy-study-abroad/:id", async (req, res) => {
    try {
      const [updatedService] = await db
        .update(educationalConsultancyStudyAbroad)
        .set({ ...req.body, updatedAt: new Date() })
        .where(eq(educationalConsultancyStudyAbroad.id, req.params.id))
        .returning();

      if (!updatedService) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.json(updatedService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE service
  app.delete("/api/admin/educational-consultancy-study-abroad/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(educationalConsultancyStudyAbroad)
        .where(eq(educationalConsultancyStudyAbroad.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.json({ message: "Service deleted successfully", id: req.params.id });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/educational-consultancy-study-abroad/:id/toggle-active", async (req, res) => {
    try {
      const service = await db.query.educationalConsultancyStudyAbroad.findFirst({
        where: eq(educationalConsultancyStudyAbroad.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      const [updated] = await db
        .update(educationalConsultancyStudyAbroad)
        .set({ isActive: !service.isActive, updatedAt: new Date() })
        .where(eq(educationalConsultancyStudyAbroad.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/educational-consultancy-study-abroad/:id/toggle-featured", async (req, res) => {
    try {
      const service = await db.query.educationalConsultancyStudyAbroad.findFirst({
        where: eq(educationalConsultancyStudyAbroad.id, req.params.id),
      });

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      const [updated] = await db
        .update(educationalConsultancyStudyAbroad)
        .set({ isFeatured: !service.isFeatured, updatedAt: new Date() })
        .where(eq(educationalConsultancyStudyAbroad.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Pharmacy & Medical Stores Routes - Full CRUD
  app.get("/api/admin/pharmacy-medical-stores", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let stores;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        stores = await db.query.pharmacyMedicalStores.findMany({
          where: and(eq(pharmacyMedicalStores.userId, adminId), eq(pharmacyMedicalStores.role, sessionUser.role as string)),
          orderBy: desc(pharmacyMedicalStores.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        const sid = sessionUser.id as string;
        stores = await db.query.pharmacyMedicalStores.findMany({
          where: eq(pharmacyMedicalStores.userId, sid),
          orderBy: desc(pharmacyMedicalStores.createdAt),
        });
      } else if (queryUserId) {
        stores = await db.query.pharmacyMedicalStores.findMany({
          where: queryRole
            ? and(eq(pharmacyMedicalStores.userId, queryUserId), eq(pharmacyMedicalStores.role, queryRole))
            : eq(pharmacyMedicalStores.userId, queryUserId),
          orderBy: desc(pharmacyMedicalStores.createdAt),
        });
      } else {
        stores = [];
      }
      res.json(stores);
    } catch (error: any) {
      console.error('Error fetching pharmacy stores:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // Pharmacy & Medical Stores (public)
  app.get("/api/pharmacy-medical-stores", async (_req, res) => {
    try {
      const items = await db.query.pharmacyMedicalStores.findMany({
        where: eq(pharmacyMedicalStores.isActive, true),
        orderBy: desc(pharmacyMedicalStores.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/pharmacy-medical-stores/:id", async (req, res) => {
    try {
      const item = await db.query.pharmacyMedicalStores.findFirst({
        where: and(eq(pharmacyMedicalStores.id, req.params.id), eq(pharmacyMedicalStores.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // GET single pharmacy/medical store by ID
  app.get("/api/admin/pharmacy-medical-stores/:id", async (req, res) => {
    try {
      const store = await db.query.pharmacyMedicalStores.findFirst({
        where: eq(pharmacyMedicalStores.id, req.params.id),
      });

      if (!store) {
        return res.status(404).json({ message: "Pharmacy/Medical store not found" });
      }

      res.json(store);
    } catch (error: any) {
      console.error('Error fetching pharmacy/medical store by ID:', error);
      res.status(500).json({ message: error.message });
    }
  });

  // CREATE new pharmacy/medical store
  app.post("/api/admin/pharmacy-medical-stores", async (req, res) => {
    try {
      const data = req.body;

      // Ensure userId and role are included
      const pharmacyData = {
        ...data,
        userId: data.userId || null,
        role: data.role || null,
      };

      const [result] = await db.insert(pharmacyMedicalStores).values(pharmacyData).returning();
      res.json(result);
    } catch (error) {
      console.error("Error creating pharmacy:", error);
      res.status(500).json({ message: "Failed to create pharmacy", error: error.message });
    }
  });

  // UPDATE pharmacy/medical store
  app.put("/api/admin/pharmacy-medical-stores/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };

      const [updatedStore] = await db
        .update(pharmacyMedicalStores)
        .set(updateData)
        .where(eq(pharmacyMedicalStores.id, id))
        .returning();

      if (!updatedStore) {
        return res.status(404).json({ message: "Pharmacy/Medical store not found" });
      }

      res.json(updatedStore);
    } catch (error: any) {
      console.error("Error updating pharmacy/medical store:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE pharmacy/medical store
  app.delete("/api/admin/pharmacy-medical-stores/:id", async (req, res) => {
    try {
      const deletedRows = await db
        .delete(pharmacyMedicalStores)
        .where(eq(pharmacyMedicalStores.id, req.params.id))
        .returning();

      if (deletedRows.length === 0) {
        return res.status(404).json({ message: "Pharmacy/Medical store not found" });
      }

      res.json({ message: "Pharmacy/Medical store deleted successfully", id: req.params.id });
    } catch (error: any) {
      console.error("Error deleting pharmacy/medical store:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle active status
  app.patch("/api/admin/pharmacy-medical-stores/:id/toggle-active", async (req, res) => {
    try {
      const store = await db.query.pharmacyMedicalStores.findFirst({
        where: eq(pharmacyMedicalStores.id, req.params.id),
      });

      if (!store) {
        return res.status(404).json({ message: "Pharmacy/Medical store not found" });
      }

      const [updated] = await db
        .update(pharmacyMedicalStores)
        .set({ isActive: !store.isActive, updatedAt: new Date() })
        .where(eq(pharmacyMedicalStores.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling active status:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // PATCH - Toggle featured status
  app.patch("/api/admin/pharmacy-medical-stores/:id/toggle-featured", async (req, res) => {
    try {
      const store = await db.query.pharmacyMedicalStores.findFirst({
        where: eq(pharmacyMedicalStores.id, req.params.id),
      });

      if (!store) {
        return res.status(404).json({ message: "Pharmacy/Medical store not found" });
      }

      const [updated] = await db
        .update(pharmacyMedicalStores)
        .set({ isFeatured: !store.isFeatured, updatedAt: new Date() })
        .where(eq(pharmacyMedicalStores.id, req.params.id))
        .returning();

      res.json(updated);
    } catch (error: any) {
      console.error("Error toggling featured status:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // Telecommunication Services Routes - Full CRUD
  app.get("/api/admin/telecommunication-services", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      if (!sessionUser?.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const isAdmin = sessionUser.role === 'admin' || sessionUser.role === 'super_admin';
      const isSeller = sessionUser.accountType === 'seller';
      if (!isAdmin && !isSeller) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const services = await db.query.telecommunicationServices.findMany({
        where: isAdmin ? undefined : eq(telecommunicationServices.userId, sessionUser.id as string),
        orderBy: desc(telecommunicationServices.createdAt),
      });
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Telecommunication Services (public)
  app.get("/api/telecommunication-services", async (_req, res) => {
    try {
      const items = await db.query.telecommunicationServices.findMany({
        where: eq(telecommunicationServices.isActive, true),
        orderBy: desc(telecommunicationServices.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/telecommunication-services/:id", async (req, res) => {
    try {
      const item = await db.query.telecommunicationServices.findFirst({
        where: and(eq(telecommunicationServices.id, req.params.id), eq(telecommunicationServices.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/telecommunication-services", async (req, res) => {
    try {
      // sanitize numeric fields coming as empty strings
      const body = { ...req.body } as any;
      const toDecimal = (v: any) => {
        if (v === undefined || v === null || v === "") return null;
        const n = Number(String(v).replace(/,/g, ''));
        return Number.isFinite(n) ? n : null;
      };
      const toInt = (v: any) => {
        if (v === undefined || v === null || v === "") return null;
        const n = parseInt(String(v), 10);
        return Number.isFinite(n) ? n : null;
      };

      body.monthlyPrice = toDecimal(body.monthlyPrice);
      body.yearlyPrice = toDecimal(body.yearlyPrice);
      body.installationCharges = toDecimal(body.installationCharges);
      body.securityDeposit = toDecimal(body.securityDeposit);
      body.dthChannels = toInt(body.dthChannels);
      body.hdChannels = toInt(body.hdChannels);

      const [newService] = await db
        .insert(telecommunicationServices)
        .values({ ...body, country: body.country || "India" })
        .returning();
      res.status(201).json(newService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/telecommunication-services/:id", async (req, res) => {
    try {
      // sanitize numeric fields for update as well
      const body = { ...req.body } as any;
      const toDecimal = (v: any) => {
        if (v === undefined || v === null || v === "") return null;
        const n = Number(String(v).replace(/,/g, ''));
        return Number.isFinite(n) ? n : null;
      };
      const toInt = (v: any) => {
        if (v === undefined || v === null || v === "") return null;
        const n = parseInt(String(v), 10);
        return Number.isFinite(n) ? n : null;
      };

      body.monthlyPrice = toDecimal(body.monthlyPrice);
      body.yearlyPrice = toDecimal(body.yearlyPrice);
      body.installationCharges = toDecimal(body.installationCharges);
      body.securityDeposit = toDecimal(body.securityDeposit);
      body.dthChannels = toInt(body.dthChannels);
      body.hdChannels = toInt(body.hdChannels);

      const [updated] = await db
        .update(telecommunicationServices)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(telecommunicationServices.id, req.params.id))
        .returning();
      if (!updated) return res.status(404).json({ message: "Service not found" });
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/telecommunication-services/:id", async (req, res) => {
    try {
      await db.delete(telecommunicationServices).where(eq(telecommunicationServices.id, req.params.id));
      res.json({ message: "Service deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/telecommunication-services/:id/toggle-active", async (req, res) => {
    try {
      const service = await db.query.telecommunicationServices.findFirst({
        where: eq(telecommunicationServices.id, req.params.id),
      });
      if (!service) return res.status(404).json({ message: "Service not found" });
      const [updated] = await db
        .update(telecommunicationServices)
        .set({ isActive: !service.isActive, updatedAt: new Date() })
        .where(eq(telecommunicationServices.id, req.params.id))
        .returning();
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/telecommunication-services/:id/toggle-featured", async (req, res) => {
    try {
      const service = await db.query.telecommunicationServices.findFirst({
        where: eq(telecommunicationServices.id, req.params.id),
      });
      if (!service) return res.status(404).json({ message: "Service not found" });
      const [updated] = await db
        .update(telecommunicationServices)
        .set({ isFeatured: !service.isFeatured, updatedAt: new Date() })
        .where(eq(telecommunicationServices.id, req.params.id))
        .returning();
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Service Centre / Warranty Routes
  app.get("/api/admin/service-centre-warranty", async (_req, res) => {
    try {
      const services = await db.query.serviceCentreWarranty.findMany({
        orderBy: desc(serviceCentreWarranty.createdAt),
      });
      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Service Centre / Warranty (public)
  app.get("/api/service-centre-warranty", async (_req, res) => {
    try {
      const items = await db.query.serviceCentreWarranty.findMany({
        where: eq(serviceCentreWarranty.isActive, true),
        orderBy: desc(serviceCentreWarranty.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/service-centre-warranty/:id", async (req, res) => {
    try {
      const item = await db.query.serviceCentreWarranty.findFirst({
        where: and(eq(serviceCentreWarranty.id, req.params.id), eq(serviceCentreWarranty.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/service-centre-warranty", async (req, res) => {
    try {
      // sanitize numeric fields coming as empty strings
      const body = { ...req.body } as any;
      const toDecimal = (v: any) => {
        if (v === undefined || v === null || v === "") return null;
        const n = Number(String(v).replace(/,/g, ''));
        return Number.isFinite(n) ? n : null;
      };

      body.inspectionCharge = toDecimal(body.inspectionCharge);
      body.minimumServiceCharge = toDecimal(body.minimumServiceCharge);
      body.homeServiceCharge = toDecimal(body.homeServiceCharge);
      body.pickupDropCharge = toDecimal(body.pickupDropCharge);
      body.amcPrice = toDecimal(body.amcPrice);

      const [newService] = await db
        .insert(serviceCentreWarranty)
        .values({ ...body, country: body.country || "India" })
        .returning();
      res.status(201).json(newService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/service-centre-warranty/:id", async (req, res) => {
    try {
      // sanitize numeric fields coming as empty strings
      const body = { ...req.body } as any;
      const toDecimal = (v: any) => {
        if (v === undefined || v === null || v === "") return null;
        const n = Number(String(v).replace(/,/g, ''));
        return Number.isFinite(n) ? n : null;
      };

      body.inspectionCharge = toDecimal(body.inspectionCharge);
      body.minimumServiceCharge = toDecimal(body.minimumServiceCharge);
      body.homeServiceCharge = toDecimal(body.homeServiceCharge);
      body.pickupDropCharge = toDecimal(body.pickupDropCharge);
      body.amcPrice = toDecimal(body.amcPrice);

      const [updated] = await db
        .update(serviceCentreWarranty)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(serviceCentreWarranty.id, req.params.id))
        .returning();
      if (!updated) return res.status(404).json({ message: "Service not found" });
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/service-centre-warranty/:id", async (req, res) => {
    try {
      await db.delete(serviceCentreWarranty).where(eq(serviceCentreWarranty.id, req.params.id));
      res.json({ message: "Service deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/service-centre-warranty/:id/toggle-active", async (req, res) => {
    try {
      const service = await db.query.serviceCentreWarranty.findFirst({
        where: eq(serviceCentreWarranty.id, req.params.id),
      });
      if (!service) return res.status(404).json({ message: "Service not found" });
      const [updated] = await db
        .update(serviceCentreWarranty)
        .set({ isActive: !service.isActive, updatedAt: new Date() })
        .where(eq(serviceCentreWarranty.id, req.params.id))
        .returning();
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/service-centre-warranty/:id/toggle-featured", async (req, res) => {
    try {
      const service = await db.query.serviceCentreWarranty.findFirst({
        where: eq(serviceCentreWarranty.id, req.params.id),
      });
      if (!service) return res.status(404).json({ message: "Service not found" });
      const [updated] = await db
        .update(serviceCentreWarranty)
        .set({ isFeatured: !service.isFeatured, updatedAt: new Date() })
        .where(eq(serviceCentreWarranty.id, req.params.id))
        .returning();
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Health & Wellness Services Routes - Full CRUD
  app.get("/api/admin/health-wellness-services", async (req, res) => {
    try {
      const sessionUser = (req as any).session?.user || null;
      const queryUserId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
      const queryRole = typeof req.query.role === 'string' ? req.query.role : undefined;

      let services;
      if (sessionUser && (sessionUser.role === 'admin' || sessionUser.role === 'super_admin')) {
        const adminId = sessionUser.id as string;
        if (queryUserId && queryUserId !== adminId) {
          return res.status(403).json({ message: "Forbidden: cannot access other users' listings" });
        }
        services = await db.query.healthWellnessServices.findMany({
          where: and(eq(healthWellnessServices.userId, adminId), eq(healthWellnessServices.role, sessionUser.role as string)),
          orderBy: desc(healthWellnessServices.createdAt),
        });
      } else if (sessionUser && sessionUser.id) {
        const sid = sessionUser.id as string;
        services = await db.query.healthWellnessServices.findMany({
          where: eq(healthWellnessServices.userId, sid),
          orderBy: desc(healthWellnessServices.createdAt),
        });
      } else if (queryUserId) {
        services = await db.query.healthWellnessServices.findMany({
          where: queryRole
            ? and(eq(healthWellnessServices.userId, queryUserId), eq(healthWellnessServices.role, queryRole))
            : eq(healthWellnessServices.userId, queryUserId),
          orderBy: desc(healthWellnessServices.createdAt),
        });
      } else {
        services = [];
      }

      res.json(services);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Health & Wellness Services (public)
  app.get("/api/health-wellness-services", async (_req, res) => {
    try {
      const items = await db.query.healthWellnessServices.findMany({
        where: eq(healthWellnessServices.isActive, true),
        orderBy: desc(healthWellnessServices.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/health-wellness-services/:id", async (req, res) => {
    try {
      const item = await db.query.healthWellnessServices.findFirst({
        where: and(eq(healthWellnessServices.id, req.params.id), eq(healthWellnessServices.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/health-wellness-services/:id", async (req, res) => {
    try {
      const service = await db.query.healthWellnessServices.findFirst({
        where: eq(healthWellnessServices.id, req.params.id),
      });
      if (!service) return res.status(404).json({ message: "Service not found" });
      res.json(service);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/admin/health-wellness-services", async (req, res) => {
    try {
      // sanitize numeric fields coming as empty strings
      const body = { ...req.body } as any;
      const toDecimal = (v: any) => {
        if (v === undefined || v === null || v === "") return null;
        const n = Number(String(v).replace(/,/g, ''));
        return Number.isFinite(n) ? n : null;
      };
      const toInt = (v: any) => {
        if (v === undefined || v === null || v === "") return null;
        const n = parseInt(String(v), 10);
        return Number.isFinite(n) ? n : null;
      };

      body.consultationFee = toDecimal(body.consultationFee);
      body.experienceYears = toInt(body.experienceYears);

      const [newService] = await db
        .insert(healthWellnessServices)
        .values({ ...body, country: body.country || "India" })
        .returning();
      res.status(201).json(newService);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/admin/health-wellness-services/:id", async (req, res) => {
    try {
      const body = { ...req.body } as any;
      const toDecimal = (v: any) => {
        if (v === undefined || v === null || v === "") return null;
        const n = Number(String(v).replace(/,/g, ''));
        return Number.isFinite(n) ? n : null;
      };
      const toInt = (v: any) => {
        if (v === undefined || v === null || v === "") return null;
        const n = parseInt(String(v), 10);
        return Number.isFinite(n) ? n : null;
      };

      body.consultationFee = toDecimal(body.consultationFee);
      body.experienceYears = toInt(body.experienceYears);

      const [updated] = await db
        .update(healthWellnessServices)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(healthWellnessServices.id, req.params.id))
        .returning();
      if (!updated) return res.status(404).json({ message: "Service not found" });
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete("/api/admin/health-wellness-services/:id", async (req, res) => {
    try {
      await db.delete(healthWellnessServices).where(eq(healthWellnessServices.id, req.params.id));
      res.json({ message: "Service deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/health-wellness-services/:id/toggle-active", async (req, res) => {
    try {
      const service = await db.query.healthWellnessServices.findFirst({
        where: eq(healthWellnessServices.id, req.params.id),
      });
      if (!service) return res.status(404).json({ message: "Service not found" });
      const [updated] = await db
        .update(healthWellnessServices)
        .set({ isActive: !service.isActive, updatedAt: new Date() })
        .where(eq(healthWellnessServices.id, req.params.id))
        .returning();
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/admin/health-wellness-services/:id/toggle-featured", async (req, res) => {
    try {
      const service = await db.query.healthWellnessServices.findFirst({
        where: eq(healthWellnessServices.id, req.params.id),
      });
      if (!service) return res.status(404).json({ message: "Service not found" });
      const [updated] = await db
        .update(healthWellnessServices)
        .set({ isFeatured: !service.isFeatured, updatedAt: new Date() })
        .where(eq(healthWellnessServices.id, req.params.id))
        .returning();
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ========== PUBLIC ENDPOINTS FOR HOME PAGE ==========
  // These endpoints return data for various product/service categories displayed on the home page

  // Fashion & Beauty Products
  app.get("/api/fashion-beauty", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.fashionBeautyProducts.findMany({
        where: eq(fashionBeautyProducts.isActive, true),
        limit,
        orderBy: desc(fashionBeautyProducts.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single fashion beauty product by ID
  app.get("/api/fashion-beauty/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await db.query.fashionBeautyProducts.findFirst({
        where: eq(fashionBeautyProducts.id, id),
      });
      if (!item) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Electronics & Gadgets
  app.get("/api/electronics-gadgets", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.electronicsGadgets.findMany({
        where: eq(electronicsGadgets.isActive, true),
        limit,
        orderBy: desc(electronicsGadgets.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single electronics gadget by ID
  app.get("/api/electronics-gadgets/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await db.query.electronicsGadgets.findFirst({
        where: eq(electronicsGadgets.id, id),
      });
      if (!item) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Phones, Tablets & Accessories
  app.get("/api/phones-tablets-accessories", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.phonesTabletsAccessories.findMany({
        where: eq(phonesTabletsAccessories.isActive, true),
        limit,
        orderBy: desc(phonesTabletsAccessories.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Phones, Tablets & Accessories Detail
  app.get("/api/phones-tablets-accessories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await db.query.phonesTabletsAccessories.findFirst({
        where: eq(phonesTabletsAccessories.id, id),
      });
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cars & Bikes
  app.get("/api/cars-bikes", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.carsBikes.findMany({
        where: eq(carsBikes.isActive, true),
        limit,
        orderBy: desc(carsBikes.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single car/bike by ID
  app.get("/api/cars-bikes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await db.query.carsBikes.findFirst({
        where: eq(carsBikes.id, id),
      });
      if (!item) {
        return res.status(404).json({ message: "Vehicle not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Skill Training & Certification
  app.get("/api/skill-training", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.skillTrainingCertification.findMany({
        where: eq(skillTrainingCertification.isActive, true),
        limit,
        orderBy: desc(skillTrainingCertification.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single skill training by ID
  app.get("/api/skill-training/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await db.query.skillTrainingCertification.findFirst({
        where: eq(skillTrainingCertification.id, id),
      });
      if (!item) {
        return res.status(404).json({ message: "Training not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Construction Materials
  app.get("/api/construction-materials", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.constructionMaterials.findMany({
        where: eq(constructionMaterials.isActive, true),
        limit,
        orderBy: desc(constructionMaterials.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Construction Materials Detail
  app.get("/api/construction-materials/:id", async (req, res) => {
    try {
      const item = await db.query.constructionMaterials.findFirst({
        where: eq(constructionMaterials.id, req.params.id),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Rental Listings
  app.get("/api/rental-listings", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.rentalListings.findMany({
        where: eq(rentalListings.isActive, true),
        limit,
        orderBy: desc(rentalListings.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Rental Listings Detail
  app.get("/api/rental-listings/:id", async (req, res) => {
    try {
      const item = await db.query.rentalListings.findFirst({
        where: eq(rentalListings.id, req.params.id),
      });
      if (!item) return res.status(404).json({ message: "Listing not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Hostel & PG Listings
  app.get("/api/hostel-listings", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.hostelPgListings.findMany({
        where: eq(hostelPgListings.isActive, true),
        limit,
        orderBy: desc(hostelPgListings.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Hostel Listings Detail
  app.get("/api/hostel-listings/:id", async (req, res) => {
    try {
      const item = await db.query.hostelPgListings.findFirst({
        where: and(eq(hostelPgListings.id, req.params.id), eq(hostelPgListings.active, true)),
      });
      if (!item) return res.status(404).json({ message: "Listing not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Furniture & Interior Decor
  app.get("/api/furniture-decor", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.furnitureInteriorDecor.findMany({
        where: eq(furnitureInteriorDecor.isActive, true),
        limit,
        orderBy: desc(furnitureInteriorDecor.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Furniture & Interior Decor Detail (public)
  app.get("/api/furniture-decor/:id", async (req, res) => {
    try {
      const item = await db.query.furnitureInteriorDecor.findFirst({
        where: eq(furnitureInteriorDecor.id, req.params.id),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Jewelry & Accessories
  app.get("/api/jewelry-accessories", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.jewelryAccessories.findMany({
        where: eq(jewelryAccessories.isActive, true),
        limit,
        orderBy: desc(jewelryAccessories.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Health & Wellness Services
  app.get("/api/health-wellness", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.healthWellnessServices.findMany({
        where: eq(healthWellnessServices.isActive, true),
        limit,
        orderBy: desc(healthWellnessServices.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single health wellness service by ID
  app.get("/api/health-wellness/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await db.query.healthWellnessServices.findFirst({
        where: eq(healthWellnessServices.id, id),
      });
      if (!item) {
        return res.status(404).json({ message: "Health wellness service not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Tuition & Private Classes
  app.get("/api/tuition-classes", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.tuitionPrivateClasses.findMany({
        where: eq(tuitionPrivateClasses.isActive, true),
        limit,
        orderBy: desc(tuitionPrivateClasses.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single tuition class by ID
  app.get("/api/tuition-classes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await db.query.tuitionPrivateClasses.findFirst({
        where: eq(tuitionPrivateClasses.id, id),
      });
      if (!item) {
        return res.status(404).json({ message: "Tuition class not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dance, Karate, Gym & Yoga
  app.get("/api/dance-gym-yoga", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.danceKarateGymYoga.findMany({
        where: eq(danceKarateGymYoga.isActive, true),
        limit,
        orderBy: desc(danceKarateGymYoga.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single dance/gym/yoga by ID
  app.get("/api/dance-gym-yoga/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await db.query.danceKarateGymYoga.findFirst({
        where: eq(danceKarateGymYoga.id, id),
      });
      if (!item) {
        return res.status(404).json({ message: "Class not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Language Classes
  app.get("/api/language-classes", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.languageClasses.findMany({
        where: eq(languageClasses.isActive, true),
        limit,
        orderBy: desc(languageClasses.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single language class by ID
  app.get("/api/language-classes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await db.query.languageClasses.findFirst({
        where: eq(languageClasses.id, id),
      });
      if (!item) {
        return res.status(404).json({ message: "Language class not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Academies, Music, Arts & Sports
  app.get("/api/academy-music-arts", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.academiesMusicArtsSports.findMany({
        where: eq(academiesMusicArtsSports.isActive, true),
        limit,
        orderBy: desc(academiesMusicArtsSports.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get single academy/music/arts by ID
  app.get("/api/academy-music-arts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const item = await db.query.academiesMusicArtsSports.findFirst({
        where: eq(academiesMusicArtsSports.id, id),
      });
      if (!item) {
        return res.status(404).json({ message: "Academy not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Schools, Colleges & Coaching
  app.get("/api/schools-colleges-coaching", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.schoolsCollegesCoaching.findMany({
        where: eq(schoolsCollegesCoaching.isActive, true),
        limit,
        orderBy: desc(schoolsCollegesCoaching.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Education Consultancy & Study Abroad
  app.get("/api/education-consultancy", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.educationalConsultancyStudyAbroad.findMany({
        where: eq(educationalConsultancyStudyAbroad.isActive, true),
        limit,
        orderBy: desc(educationalConsultancyStudyAbroad.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Pharmacy & Medical Stores
  app.get("/api/pharmacy-medical", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.pharmacyMedicalStores.findMany({
        where: eq(pharmacyMedicalStores.isActive, true),
        limit,
        orderBy: desc(pharmacyMedicalStores.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Second Hand Phones, Tablets & Accessories
  app.get("/api/second-hand-phones", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.secondHandPhonesTabletsAccessories.findMany({
        where: eq(secondHandPhonesTabletsAccessories.isActive, true),
        limit,
        orderBy: desc(secondHandPhonesTabletsAccessories.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Computer, Mobile & Laptop Repair Services
  app.get("/api/computer-repair", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.computerMobileLaptopRepairServices.findMany({
        where: eq(computerMobileLaptopRepairServices.isActive, true),
        limit,
        orderBy: desc(computerMobileLaptopRepairServices.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Event & Decoration Services
  app.get("/api/event-decoration", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.eventDecorationServices.findMany({
        where: eq(eventDecorationServices.isActive, true),
        limit,
        orderBy: desc(eventDecorationServices.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Household Services
  app.get("/api/household-services", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.householdServices.findMany({
        where: eq(householdServices.isActive, true),
        limit,
        orderBy: desc(householdServices.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Saree & Clothing Shopping
  app.get("/api/saree-clothing", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.sareeClothingShopping.findMany({
        where: eq(sareeClothingShopping.isActive, true),
        limit,
        orderBy: desc(sareeClothingShopping.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Saree & Clothing Shopping Detail (public)
  app.get("/api/saree-clothing/:id", async (req, res) => {
    try {
      const item = await db.query.sareeClothingShopping.findFirst({
        where: eq(sareeClothingShopping.id, req.params.id),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // E-Books & Online Courses
  app.get("/api/ebooks-courses", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.ebooksOnlineCourses.findMany({
        where: eq(ebooksOnlineCourses.isActive, true),
        limit,
        orderBy: desc(ebooksOnlineCourses.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // E-Books & Online Courses (public alias used by subcategory pages)
  app.get("/api/ebooks-online-courses", async (_req, res) => {
    try {
      const items = await db.query.ebooksOnlineCourses.findMany({
        where: eq(ebooksOnlineCourses.isActive, true),
        orderBy: desc(ebooksOnlineCourses.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/ebooks-online-courses/:id", async (req, res) => {
    try {
      const item = await db.query.ebooksOnlineCourses.findFirst({
        where: and(eq(ebooksOnlineCourses.id, req.params.id), eq(ebooksOnlineCourses.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cricket & Sports Training
  app.get("/api/cricket-sports", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.cricketSportsTraining.findMany({
        where: eq(cricketSportsTraining.isActive, true),
        limit,
        orderBy: desc(cricketSportsTraining.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cricket & Sports Training (public alias used by subcategory pages)
  app.get("/api/cricket-sports-training", async (_req, res) => {
    try {
      const items = await db.query.cricketSportsTraining.findMany({
        where: eq(cricketSportsTraining.isActive, true),
        orderBy: desc(cricketSportsTraining.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/cricket-sports-training/:id", async (req, res) => {
    try {
      const item = await db.query.cricketSportsTraining.findFirst({
        where: and(eq(cricketSportsTraining.id, req.params.id), eq(cricketSportsTraining.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Tuition & Private Classes (public alias used by subcategory pages)
  app.get("/api/tuition-private-classes", async (_req, res) => {
    try {
      const items = await db.query.tuitionPrivateClasses.findMany({
        where: eq(tuitionPrivateClasses.isActive, true),
        orderBy: desc(tuitionPrivateClasses.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/tuition-private-classes/:id", async (req, res) => {
    try {
      const item = await db.query.tuitionPrivateClasses.findFirst({
        where: and(eq(tuitionPrivateClasses.id, req.params.id), eq(tuitionPrivateClasses.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Skill Training & Certification (public alias used by subcategory pages)
  app.get("/api/skill-training-certification", async (_req, res) => {
    try {
      const items = await db.query.skillTrainingCertification.findMany({
        where: eq(skillTrainingCertification.isActive, true),
        orderBy: desc(skillTrainingCertification.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/skill-training-certification/:id", async (req, res) => {
    try {
      const item = await db.query.skillTrainingCertification.findFirst({
        where: and(eq(skillTrainingCertification.id, req.params.id), eq(skillTrainingCertification.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Educational Consultancy & Study Abroad (public alias used by subcategory pages)
  app.get("/api/educational-consultancy-study-abroad", async (_req, res) => {
    try {
      const items = await db.query.educationalConsultancyStudyAbroad.findMany({
        where: eq(educationalConsultancyStudyAbroad.isActive, true),
        orderBy: desc(educationalConsultancyStudyAbroad.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/educational-consultancy-study-abroad/:id", async (req, res) => {
    try {
      const item = await db.query.educationalConsultancyStudyAbroad.findFirst({
        where: and(eq(educationalConsultancyStudyAbroad.id, req.params.id), eq(educationalConsultancyStudyAbroad.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dance, Karate, Gym & Yoga (public alias used by subcategory pages)
  app.get("/api/dance-karate-gym-yoga", async (_req, res) => {
    try {
      const items = await db.query.danceKarateGymYoga.findMany({
        where: eq(danceKarateGymYoga.isActive, true),
        orderBy: desc(danceKarateGymYoga.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/dance-karate-gym-yoga/:id", async (req, res) => {
    try {
      const item = await db.query.danceKarateGymYoga.findFirst({
        where: and(eq(danceKarateGymYoga.id, req.params.id), eq(danceKarateGymYoga.isActive, true)),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Cyber Cafe & Internet Services
  app.get("/api/cyber-cafe", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.cyberCafeInternetServices.findMany({
        where: eq(cyberCafeInternetServices.isActive, true),
        limit,
        orderBy: desc(cyberCafeInternetServices.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Telecommunication Services
  app.get("/api/telecommunication", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.telecommunicationServices.findMany({
        where: eq(telecommunicationServices.isActive, true),
        limit,
        orderBy: desc(telecommunicationServices.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Service Centre & Warranty
  app.get("/api/service-centre", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.serviceCentreWarranty.findMany({
        where: eq(serviceCentreWarranty.isActive, true),
        limit,
        orderBy: desc(serviceCentreWarranty.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Car & Bike Rentals (public endpoint)
  app.get("/api/car-bike-rental-public", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.carBikeRentals.findMany({
        limit,
        orderBy: desc(carBikeRentals.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Car & Bike Rentals Detail (public)
  app.get("/api/car-bike-rental-public/:id", async (req, res) => {
    try {
      const item = await db.query.carBikeRentals.findFirst({
        where: eq(carBikeRentals.id, req.params.id),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Heavy Equipment (public endpoint)
  app.get("/api/heavy-equipment-public", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.heavyEquipment.findMany({
        limit,
        orderBy: desc(heavyEquipment.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Property Deals (public endpoint)
  app.get("/api/property-deals-public", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.propertyDeals.findMany({
        limit,
        orderBy: desc(propertyDeals.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Property Deals Detail (public)
  app.get("/api/property-deals-public/:id", async (req, res) => {
    try {
      const item = await db.query.propertyDeals.findFirst({
        where: eq(propertyDeals.id, req.params.id),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Commercial Properties (public endpoint)
  app.get("/api/commercial-properties-public", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.commercialProperties.findMany({
        limit,
        orderBy: desc(commercialProperties.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Commercial Properties Detail (public)
  app.get("/api/commercial-properties-public/:id", async (req, res) => {
    try {
      const item = await db.query.commercialProperties.findFirst({
        where: eq(commercialProperties.id, req.params.id),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Industrial Land (public endpoint)
  app.get("/api/industrial-land-public", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.industrialLand.findMany({
        limit,
        orderBy: desc(industrialLand.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Industrial Land Detail (public)
  app.get("/api/industrial-land-public/:id", async (req, res) => {
    try {
      const item = await db.query.industrialLand.findFirst({
        where: eq(industrialLand.id, req.params.id),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Office Spaces (public endpoint)
  app.get("/api/office-spaces-public", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.officeSpaces.findMany({
        limit,
        orderBy: desc(officeSpaces.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Office Spaces Detail (public)
  app.get("/api/office-spaces-public/:id", async (req, res) => {
    try {
      const item = await db.query.officeSpaces.findFirst({
        where: eq(officeSpaces.id, req.params.id),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Showrooms (public endpoint)
  app.get("/api/showrooms-public", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.showrooms.findMany({
        limit,
        orderBy: desc(showrooms.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Second Hand Cars & Bikes (public endpoint)
  app.get("/api/second-hand-cars-bikes-public", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.secondHandCarsBikes.findMany({
        limit,
        orderBy: desc(secondHandCarsBikes.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Second Hand Cars & Bikes Detail (public)
  app.get("/api/second-hand-cars-bikes-public/:id", async (req, res) => {
    try {
      const item = await db.query.secondHandCarsBikes.findFirst({
        where: eq(secondHandCarsBikes.id, req.params.id),
      });
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Vehicle License Classes (public endpoint)
  app.get("/api/vehicle-license-classes", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.vehicleLicenseClasses.findMany({
        limit,
        orderBy: desc(vehicleLicenseClasses.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Transportation & Moving Services (public endpoint)
  app.get("/api/transportation-services", async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 100, 200);
      const items = await db.query.transportationMovingServices.findMany({
        limit,
        orderBy: desc(transportationMovingServices.createdAt),
      });
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}