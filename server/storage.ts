
import { db } from "./db";
import { 
  adminCategories, 
  adminSubcategories, 
  users,
  properties,
  agencies,
  locations,
  propertyCategories,
  faqs
} from "../shared/schema";
import { eq, desc, asc, and, like, or } from "drizzle-orm";
import type { CategoryWithSubcategories } from "./interfaces";

export const storage = {
  // Admin Categories
  async getAllCategoriesWithSubcategories(): Promise<CategoryWithSubcategories[]> {
    const categories = await db
      .select()
      .from(adminCategories)
      .orderBy(asc(adminCategories.sortOrder));

    const subcategories = await db
      .select()
      .from(adminSubcategories)
      .orderBy(asc(adminSubcategories.sortOrder));

    return categories.map(category => ({
      ...category,
      subcategories: subcategories.filter(sub => sub.parentCategoryId === category.id)
    }));
  },

  async getCategoryById(id: string) {
    const [category] = await db
      .select()
      .from(adminCategories)
      .where(eq(adminCategories.id, id));
    return category;
  },

  async createCategory(data: typeof adminCategories.$inferInsert) {
    const [category] = await db.insert(adminCategories).values(data).returning();
    return category;
  },

  async updateCategory(id: string, data: Partial<typeof adminCategories.$inferInsert>) {
    const [category] = await db
      .update(adminCategories)
      .set(data)
      .where(eq(adminCategories.id, id))
      .returning();
    return category;
  },

  async deleteCategory(id: string) {
    await db.delete(adminCategories).where(eq(adminCategories.id, id));
  },

  // Admin Subcategories
  async getSubcategoryById(id: string) {
    const [subcategory] = await db
      .select()
      .from(adminSubcategories)
      .where(eq(adminSubcategories.id, id));
    return subcategory;
  },

  async createSubcategory(data: typeof adminSubcategories.$inferInsert) {
    const [subcategory] = await db.insert(adminSubcategories).values(data).returning();
    return subcategory;
  },

  async updateSubcategory(id: string, data: Partial<typeof adminSubcategories.$inferInsert>) {
    const [subcategory] = await db
      .update(adminSubcategories)
      .set(data)
      .where(eq(adminSubcategories.id, id))
      .returning();
    return subcategory;
  },

  async deleteSubcategory(id: string) {
    await db.delete(adminSubcategories).where(eq(adminSubcategories.id, id));
  },

  // Users
  async getAllUsers() {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  },

  async getUserById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },

  async getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  },

  async createUser(data: typeof users.$inferInsert) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  },

  async updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  },

  async deleteUser(id: string) {
    await db.delete(users).where(eq(users.id, id));
  },

  // Properties
  async getAllProperties() {
    return await db.select().from(properties).orderBy(desc(properties.createdAt));
  },

  async getPropertyById(id: string) {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  },

  async createProperty(data: typeof properties.$inferInsert) {
    const [property] = await db.insert(properties).values(data).returning();
    return property;
  },

  async updateProperty(id: string, data: Partial<typeof properties.$inferInsert>) {
    const [property] = await db
      .update(properties)
      .set(data)
      .where(eq(properties.id, id))
      .returning();
    return property;
  },

  async deleteProperty(id: string) {
    await db.delete(properties).where(eq(properties.id, id));
  },

  // Agencies
  async getAllAgencies() {
    return await db.select().from(agencies).orderBy(desc(agencies.createdAt));
  },

  async getAgencyById(id: string) {
    const [agency] = await db.select().from(agencies).where(eq(agencies.id, id));
    return agency;
  },

  async createAgency(data: typeof agencies.$inferInsert) {
    const [agency] = await db.insert(agencies).values(data).returning();
    return agency;
  },

  async updateAgency(id: string, data: Partial<typeof agencies.$inferInsert>) {
    const [agency] = await db
      .update(agencies)
      .set(data)
      .where(eq(agencies.id, id))
      .returning();
    return agency;
  },

  async deleteAgency(id: string) {
    await db.delete(agencies).where(eq(agencies.id, id));
  },

  // Locations
  async getAllLocations() {
    return await db.select().from(locations);
  },

  async getLocationById(id: string) {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location;
  },

  async createLocation(data: typeof locations.$inferInsert) {
    const [location] = await db.insert(locations).values(data).returning();
    return location;
  },

  async updateLocation(id: string, data: Partial<typeof locations.$inferInsert>) {
    const [location] = await db
      .update(locations)
      .set(data)
      .where(eq(locations.id, id))
      .returning();
    return location;
  },

  async deleteLocation(id: string) {
    await db.delete(locations).where(eq(locations.id, id));
  },

  // FAQs
  async getAllFaqs() {
    return await db.select().from(faqs).orderBy(asc(faqs.order));
  },

  async getFaqById(id: string) {
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    return faq;
  },

  async createFaq(data: typeof faqs.$inferInsert) {
    const [faq] = await db.insert(faqs).values(data).returning();
    return faq;
  },

  async updateFaq(id: string, data: Partial<typeof faqs.$inferInsert>) {
    const [faq] = await db
      .update(faqs)
      .set(data)
      .where(eq(faqs.id, id))
      .returning();
    return faq;
  },

  async deleteFaq(id: string) {
    await db.delete(faqs).where(eq(faqs.id, id));
  },
};
