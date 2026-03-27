
import { db } from "./db";
import { adminCategories, adminSubcategories, proProfileFields, proProfileTypes } from "../shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  try {
    console.log("Seeding database...");

    // Check if data already exists
    const existingCategories = await db.select().from(adminCategories);

    // Seed Pro-Profile types + baseline fields independently (so admin seeding doesn't block it)
    const existingProTypes = await db.select().from(proProfileTypes);
    if (existingProTypes.length === 0) {
      const inserted = await db.insert(proProfileTypes).values([
        { name: 'Job / Professional Profile', slug: 'job-professional', description: 'Job & professional profile', icon: 'briefcase', sortOrder: 1 },
        { name: 'Business Profile', slug: 'business', description: 'Business / shop / startup profile', icon: 'building', sortOrder: 2 },
        { name: 'Freelancing Profile', slug: 'freelancing', description: 'Freelance profile', icon: 'laptop', sortOrder: 3 },
        { name: 'Matrimony Profile', slug: 'matrimony', description: 'Matrimony profile', icon: 'heart', sortOrder: 4 },
        { name: 'Social Media / Influencer Profile', slug: 'influencer', description: 'Influencer profile', icon: 'instagram', sortOrder: 5 },
        { name: 'Company / Organization Profile', slug: 'company', description: 'Company or organization profile', icon: 'office', sortOrder: 6 },
        { name: 'Student Profile', slug: 'student', description: 'Student profile', icon: 'graduation-cap', sortOrder: 7 },
        { name: 'Doctor / Medical Profile', slug: 'doctor', description: 'Doctor / medical profile', icon: 'stethoscope', sortOrder: 8 },
        { name: 'Teacher / Trainer Profile', slug: 'teacher', description: 'Teacher / trainer profile', icon: 'chalkboard', sortOrder: 9 },
        { name: 'Personal / General Profile', slug: 'personal', description: 'Personal / general profile', icon: 'user', sortOrder: 10 },
        { name: 'Artist / Creator Profile', slug: 'artist', description: 'Artist / creator profile', icon: 'palette', sortOrder: 11 },
        { name: 'NGO / Trust Profile', slug: 'ngo', description: 'NGO / trust profile', icon: 'hand-heart', sortOrder: 12 },
      ]).returning();
      console.log(`Inserted ${inserted.length} pro profile types`);
    }

    const allTypes = await db.select().from(proProfileTypes);
    const typeIdBySlug: Record<string, string> = {};
    allTypes.forEach((t: any) => { typeIdBySlug[t.slug] = t.id; });

    const existingProFields = await db.select().from(proProfileFields);
    const existingKeySet = new Set(existingProFields.map((f: any) => `${f.profileTypeId}:${f.key}`));

    const common = [
      { key: 'fullName', label: 'Full Name', fieldType: 'text', isRequired: true },
      { key: 'profilePhoto', label: 'Profile Photo', fieldType: 'image', isRequired: false },
      { key: 'about', label: 'About / Description', fieldType: 'textarea', isRequired: false },
      { key: 'skills', label: 'Skills / Services', fieldType: 'tags', isRequired: false },
      { key: 'experience', label: 'Experience', fieldType: 'text', isRequired: false },
      { key: 'location', label: 'Location', fieldType: 'text', isRequired: false },
      { key: 'contactDetails', label: 'Contact Details', fieldType: 'textarea', isRequired: false },
    ];

    const defs: Record<string, any[]> = {
      'job-professional': [
        ...common,
        { key: 'designation', label: 'Designation / Job Title', fieldType: 'text' },
        { key: 'professionalSummary', label: 'Professional Summary', fieldType: 'textarea' },
        { key: 'totalExperience', label: 'Total Experience', fieldType: 'text' },
        { key: 'workExperience', label: 'Work Experience', fieldType: 'textarea' },
        { key: 'companyName', label: 'Company Name', fieldType: 'text' },
        { key: 'role', label: 'Role', fieldType: 'text' },
        { key: 'department', label: 'Department', fieldType: 'text' },
        { key: 'duration', label: 'Duration', fieldType: 'text' },
        { key: 'responsibilities', label: 'Responsibilities', fieldType: 'textarea' },
        { key: 'education', label: 'Education', fieldType: 'textarea' },
        { key: 'certifications', label: 'Certifications', fieldType: 'textarea' },
        { key: 'projects', label: 'Projects', fieldType: 'textarea' },
        { key: 'achievements', label: 'Achievements', fieldType: 'textarea' },
        { key: 'languages', label: 'Languages', fieldType: 'tags' },
        { key: 'currentSalary', label: 'Current Salary', fieldType: 'text' },
        { key: 'expectedSalary', label: 'Expected Salary', fieldType: 'text' },
        { key: 'jobTypePreference', label: 'Job Type Preference', fieldType: 'select', options: [
          { label: 'Government', value: 'government' },
          { label: 'Private', value: 'private' },
          { label: 'Freelance', value: 'freelance' },
          { label: 'Remote', value: 'remote' },
        ] },
        { key: 'locationPreference', label: 'Location Preference', fieldType: 'text' },
        { key: 'noticePeriod', label: 'Notice Period', fieldType: 'text' },
      ],
      'business': [
        { key: 'businessName', label: 'Business Name', fieldType: 'text', isRequired: true },
        { key: 'ownerFounderName', label: 'Owner / Founder Name', fieldType: 'text' },
        { key: 'logo', label: 'Logo', fieldType: 'image' },
        { key: 'businessCategory', label: 'Business Category', fieldType: 'text' },
        { key: 'aboutBusiness', label: 'About Business', fieldType: 'textarea' },
        { key: 'productsServices', label: 'Products / Services', fieldType: 'textarea' },
        { key: 'experienceYears', label: 'Experience (Years)', fieldType: 'number' },
        { key: 'address', label: 'Address', fieldType: 'textarea' },
        { key: 'workingHours', label: 'Working Hours', fieldType: 'text' },
        { key: 'contactDetails', label: 'Contact Details', fieldType: 'textarea' },
        { key: 'website', label: 'Website', fieldType: 'text' },
        { key: 'socialMediaLinks', label: 'Social Media Links', fieldType: 'textarea' },
        { key: 'gstRegistrationNo', label: 'GST / Registration No.', fieldType: 'text' },
        { key: 'teamSize', label: 'Team Size', fieldType: 'number' },
        { key: 'clients', label: 'Clients', fieldType: 'textarea' },
        { key: 'awards', label: 'Awards', fieldType: 'textarea' },
      ],
      'freelancing': [
        { key: 'brandName', label: 'Name / Brand Name', fieldType: 'text', isRequired: true },
        { key: 'profilePhoto', label: 'Profile Photo', fieldType: 'image' },
        { key: 'headline', label: 'Headline', fieldType: 'text' },
        { key: 'aboutMe', label: 'About Me', fieldType: 'textarea' },
        { key: 'servicesOffered', label: 'Services Offered', fieldType: 'textarea' },
        { key: 'skills', label: 'Skills', fieldType: 'tags' },
        { key: 'toolsUsed', label: 'Tools Used', fieldType: 'tags' },
        { key: 'experience', label: 'Experience', fieldType: 'text' },
        { key: 'portfolio', label: 'Portfolio', fieldType: 'textarea' },
        { key: 'pastClients', label: 'Past Clients', fieldType: 'textarea' },
        { key: 'ratingsReviews', label: 'Ratings & Reviews', fieldType: 'textarea' },
        { key: 'hourlyProjectRate', label: 'Hourly / Project Rate', fieldType: 'text' },
        { key: 'availability', label: 'Availability', fieldType: 'text' },
        { key: 'communicationLanguage', label: 'Communication Language', fieldType: 'text' },
        { key: 'contactMethod', label: 'Contact Method', fieldType: 'text' },
      ],
      'matrimony': [
        { key: 'fullName', label: 'Full Name', fieldType: 'text', isRequired: true },
        { key: 'photos', label: 'Photo(s)', fieldType: 'images' },
        { key: 'dobAge', label: 'Date of Birth / Age', fieldType: 'text' },
        { key: 'gender', label: 'Gender', fieldType: 'select', options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ] },
        { key: 'heightWeight', label: 'Height / Weight', fieldType: 'text' },
        { key: 'religionCaste', label: 'Religion / Caste', fieldType: 'text' },
        { key: 'education', label: 'Education', fieldType: 'text' },
        { key: 'profession', label: 'Profession', fieldType: 'text' },
        { key: 'income', label: 'Income', fieldType: 'text' },
        { key: 'familyDetails', label: 'Family Details', fieldType: 'textarea' },
        { key: 'maritalStatus', label: 'Marital Status', fieldType: 'text' },
        { key: 'location', label: 'Location', fieldType: 'text' },
        { key: 'lifestyle', label: 'Lifestyle (Food, Habits)', fieldType: 'textarea' },
        { key: 'partnerPreferences', label: 'Partner Preferences', fieldType: 'textarea' },
        { key: 'horoscope', label: 'Horoscope (optional)', fieldType: 'text' },
        { key: 'contactOptional', label: 'Contact (optional)', fieldType: 'text' },
      ],
      'influencer': [
        { key: 'username', label: 'Name / Username', fieldType: 'text', isRequired: true },
        { key: 'profilePicture', label: 'Profile Picture', fieldType: 'image' },
        { key: 'bio', label: 'Bio', fieldType: 'textarea' },
        { key: 'contentCategory', label: 'Content Category', fieldType: 'text' },
        { key: 'platformName', label: 'Platform Name', fieldType: 'text' },
        { key: 'followersCount', label: 'Followers Count', fieldType: 'text' },
        { key: 'engagementRate', label: 'Engagement Rate', fieldType: 'text' },
        { key: 'collaborationInterest', label: 'Collaboration Interest', fieldType: 'text' },
        { key: 'brandDeals', label: 'Brand Deals', fieldType: 'textarea' },
        { key: 'contactEmail', label: 'Contact Email', fieldType: 'text' },
        { key: 'location', label: 'Location', fieldType: 'text' },
        { key: 'mediaKitLink', label: 'Media Kit Link', fieldType: 'text' },
      ],
      'company': [
        { key: 'companyName', label: 'Company Name', fieldType: 'text', isRequired: true },
        { key: 'logo', label: 'Logo', fieldType: 'image' },
        { key: 'companyType', label: 'Company Type', fieldType: 'text' },
        { key: 'industry', label: 'Industry', fieldType: 'text' },
        { key: 'foundedYear', label: 'Founded Year', fieldType: 'text' },
        { key: 'aboutCompany', label: 'About Company', fieldType: 'textarea' },
        { key: 'visionMission', label: 'Vision & Mission', fieldType: 'textarea' },
        { key: 'productsServices', label: 'Products / Services', fieldType: 'textarea' },
        { key: 'directorManagement', label: 'Director / Management', fieldType: 'textarea' },
        { key: 'employeesCount', label: 'Employees Count', fieldType: 'text' },
        { key: 'officeAddress', label: 'Office Address', fieldType: 'textarea' },
        { key: 'contactDetails', label: 'Contact Details', fieldType: 'textarea' },
        { key: 'website', label: 'Website', fieldType: 'text' },
        { key: 'certifications', label: 'Certifications', fieldType: 'textarea' },
        { key: 'clients', label: 'Clients', fieldType: 'textarea' },
        { key: 'awards', label: 'Awards', fieldType: 'textarea' },
      ],
      'student': [
        { key: 'name', label: 'Name', fieldType: 'text', isRequired: true },
        { key: 'photo', label: 'Photo', fieldType: 'image' },
        { key: 'courseClass', label: 'Course / Class', fieldType: 'text' },
        { key: 'stream', label: 'Stream', fieldType: 'text' },
        { key: 'collegeSchool', label: 'College / School', fieldType: 'text' },
        { key: 'universityBoard', label: 'University / Board', fieldType: 'text' },
        { key: 'yearSemester', label: 'Year / Semester', fieldType: 'text' },
        { key: 'academicPerformance', label: 'Academic Performance', fieldType: 'text' },
        { key: 'skills', label: 'Skills', fieldType: 'tags' },
        { key: 'projects', label: 'Projects', fieldType: 'textarea' },
        { key: 'internships', label: 'Internships', fieldType: 'textarea' },
        { key: 'certifications', label: 'Certifications', fieldType: 'textarea' },
        { key: 'achievements', label: 'Achievements', fieldType: 'textarea' },
        { key: 'careerObjective', label: 'Career Objective', fieldType: 'textarea' },
        { key: 'contactDetails', label: 'Contact Details', fieldType: 'textarea' },
      ],
      'doctor': [
        { key: 'name', label: 'Name (Dr.)', fieldType: 'text', isRequired: true },
        { key: 'photo', label: 'Photo', fieldType: 'image' },
        { key: 'specialty', label: 'Specialty', fieldType: 'text' },
        { key: 'qualification', label: 'Qualification', fieldType: 'text' },
        { key: 'registrationNumber', label: 'Registration Number', fieldType: 'text' },
        { key: 'experience', label: 'Experience', fieldType: 'text' },
        { key: 'hospitalClinicName', label: 'Hospital / Clinic Name', fieldType: 'text' },
        { key: 'diseasesTreated', label: 'Diseases Treated', fieldType: 'textarea' },
        { key: 'procedures', label: 'Procedures', fieldType: 'textarea' },
        { key: 'opdTiming', label: 'OPD Timing', fieldType: 'text' },
        { key: 'consultationFees', label: 'Consultation Fees', fieldType: 'text' },
        { key: 'onlineConsultation', label: 'Online Consultation', fieldType: 'text' },
        { key: 'contactDetails', label: 'Contact Details', fieldType: 'textarea' },
      ],
      'teacher': [
        { key: 'name', label: 'Name', fieldType: 'text', isRequired: true },
        { key: 'photo', label: 'Photo', fieldType: 'image' },
        { key: 'subjectExpertise', label: 'Subject / Expertise', fieldType: 'text' },
        { key: 'qualification', label: 'Qualification', fieldType: 'text' },
        { key: 'teachingExperience', label: 'Teaching Experience', fieldType: 'text' },
        { key: 'instituteName', label: 'Institute Name', fieldType: 'text' },
        { key: 'coursesOffered', label: 'Courses Offered', fieldType: 'textarea' },
        { key: 'mode', label: 'Mode (Online/Offline)', fieldType: 'select', options: [
          { label: 'Online', value: 'online' },
          { label: 'Offline', value: 'offline' },
          { label: 'Hybrid', value: 'hybrid' },
        ] },
        { key: 'achievements', label: 'Achievements', fieldType: 'textarea' },
        { key: 'certifications', label: 'Certifications', fieldType: 'textarea' },
        { key: 'languages', label: 'Languages', fieldType: 'tags' },
        { key: 'contactDetails', label: 'Contact Details', fieldType: 'textarea' },
      ],
      'personal': [
        { key: 'name', label: 'Name', fieldType: 'text', isRequired: true },
        { key: 'photo', label: 'Photo', fieldType: 'image' },
        { key: 'aboutMe', label: 'About Me', fieldType: 'textarea' },
        { key: 'interests', label: 'Interests', fieldType: 'tags' },
        { key: 'hobbies', label: 'Hobbies', fieldType: 'tags' },
        { key: 'skills', label: 'Skills', fieldType: 'tags' },
        { key: 'experienceAny', label: 'Experience (if any)', fieldType: 'text' },
        { key: 'socialLinks', label: 'Social Links', fieldType: 'textarea' },
        { key: 'contactInfo', label: 'Contact Info', fieldType: 'textarea' },
      ],
      'artist': [
        { key: 'nameStageName', label: 'Name / Stage Name', fieldType: 'text', isRequired: true },
        { key: 'artType', label: 'Art Type', fieldType: 'text' },
        { key: 'portfolio', label: 'Portfolio', fieldType: 'textarea' },
        { key: 'experience', label: 'Experience', fieldType: 'text' },
        { key: 'performancesWork', label: 'Performances / Work', fieldType: 'textarea' },
        { key: 'awards', label: 'Awards', fieldType: 'textarea' },
        { key: 'socialMedia', label: 'Social Media', fieldType: 'textarea' },
        { key: 'contactInfo', label: 'Contact Info', fieldType: 'textarea' },
      ],
      'ngo': [
        { key: 'organizationName', label: 'Organization Name', fieldType: 'text', isRequired: true },
        { key: 'logo', label: 'Logo', fieldType: 'image' },
        { key: 'registrationNumber', label: 'Registration Number', fieldType: 'text' },
        { key: 'aboutNgo', label: 'About NGO', fieldType: 'textarea' },
        { key: 'cause', label: 'Cause', fieldType: 'text' },
        { key: 'founder', label: 'Founder', fieldType: 'text' },
        { key: 'activities', label: 'Activities', fieldType: 'textarea' },
        { key: 'location', label: 'Location', fieldType: 'text' },
        { key: 'contactDetails', label: 'Contact Details', fieldType: 'textarea' },
        { key: 'website', label: 'Website', fieldType: 'text' },
        { key: 'socialMedia', label: 'Social Media', fieldType: 'textarea' },
      ],
    };

    const toInsert: any[] = [];
    for (const [slug, fields] of Object.entries(defs)) {
      const profileTypeId = typeIdBySlug[slug];
      if (!profileTypeId) continue;
      fields.forEach((f: any, idx: number) => {
        const k = `${profileTypeId}:${f.key}`;
        if (existingKeySet.has(k)) return;
        toInsert.push({
          profileTypeId,
          key: f.key,
          label: f.label,
          fieldType: f.fieldType,
          isRequired: !!f.isRequired,
          sortOrder: idx + 1,
          options: Array.isArray(f.options) ? f.options : [],
          config: {},
        });
      });
    }

    if (toInsert.length > 0) {
      const insertedFields = await db.insert(proProfileFields).values(toInsert).returning();
      console.log(`Inserted ${insertedFields.length} pro profile fields`);
    }
    
    if (existingCategories.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Insert categories
    const categoryData = [
      { name: 'Property Management', slug: 'property-management', description: 'Manage all property related operations', icon: 'building', color: '#1e40af', sortOrder: 1 },
      { name: 'Location Management', slug: 'location-management', description: 'Manage cities, areas and locations', icon: 'map-pin', color: '#059669', sortOrder: 2 },
      { name: 'Agency Management', slug: 'agency-management', description: 'Manage real estate agencies', icon: 'briefcase', color: '#dc2626', sortOrder: 3 },
      { name: 'User Management', slug: 'user-management', description: 'Manage system users and permissions', icon: 'users', color: '#7c3aed', sortOrder: 4 },
      { name: 'Content Management', slug: 'content-management', description: 'Manage FAQs, content and settings', icon: 'file-text', color: '#ea580c', sortOrder: 5 },
      { name: 'Analytics & Reports', slug: 'analytics-reports', description: 'View analytics and generate reports', icon: 'bar-chart', color: '#0891b2', sortOrder: 6 },
    ];

    const insertedCategories = await db.insert(adminCategories).values(categoryData).returning();
    console.log(`Inserted ${insertedCategories.length} categories`);

    // Get category IDs
    const propertyMgmtId = insertedCategories.find(c => c.slug === 'property-management')?.id;
    const locationMgmtId = insertedCategories.find(c => c.slug === 'location-management')?.id;
    const agencyMgmtId = insertedCategories.find(c => c.slug === 'agency-management')?.id;
    const userMgmtId = insertedCategories.find(c => c.slug === 'user-management')?.id;
    const contentMgmtId = insertedCategories.find(c => c.slug === 'content-management')?.id;
    const analyticsId = insertedCategories.find(c => c.slug === 'analytics-reports')?.id;

    // Insert subcategories
    const subcategoryData = [
      // Property Management
      { name: 'Residential Properties', slug: 'residential-properties', description: 'Manage apartments, houses, villas', parentCategoryId: propertyMgmtId!, sortOrder: 1 },
      { name: 'Commercial Properties', slug: 'commercial-properties', description: 'Manage offices, shops, warehouses', parentCategoryId: propertyMgmtId!, sortOrder: 2 },
      { name: 'Property Categories', slug: 'property-categories', description: 'Manage property type categories', parentCategoryId: propertyMgmtId!, sortOrder: 3 },
      { name: 'Property Amenities', slug: 'property-amenities', description: 'Manage available amenities', parentCategoryId: propertyMgmtId!, sortOrder: 4 },
      
      // Location Management
      { name: 'Cities', slug: 'cities', description: 'Manage cities across Nepal', parentCategoryId: locationMgmtId!, sortOrder: 1 },
      { name: 'Areas & Districts', slug: 'areas-districts', description: 'Manage specific areas and districts', parentCategoryId: locationMgmtId!, sortOrder: 2 },
      { name: 'Popular Locations', slug: 'popular-locations', description: 'Manage featured locations', parentCategoryId: locationMgmtId!, sortOrder: 3 },
      
      // Agency Management
      { name: 'Agency Profiles', slug: 'agency-profiles', description: 'Manage agency information and profiles', parentCategoryId: agencyMgmtId!, sortOrder: 1 },
      { name: 'Agency Verification', slug: 'agency-verification', description: 'Verify and approve agencies', parentCategoryId: agencyMgmtId!, sortOrder: 2 },
      { name: 'Agency Performance', slug: 'agency-performance', description: 'Monitor agency performance metrics', parentCategoryId: agencyMgmtId!, sortOrder: 3 },
      
      // User Management
      { name: 'System Users', slug: 'system-users', description: 'Manage admin and regular users', parentCategoryId: userMgmtId!, sortOrder: 1 },
      { name: 'User Roles', slug: 'user-roles', description: 'Manage user permissions and roles', parentCategoryId: userMgmtId!, sortOrder: 2 },
      { name: 'User Activity', slug: 'user-activity', description: 'Monitor user activity and logs', parentCategoryId: userMgmtId!, sortOrder: 3 },
      
      // Content Management
      { name: 'FAQs', slug: 'faqs', description: 'Manage frequently asked questions', parentCategoryId: contentMgmtId!, sortOrder: 1 },
      { name: 'Site Settings', slug: 'site-settings', description: 'Manage global site configurations', parentCategoryId: contentMgmtId!, sortOrder: 2 },
      { name: 'SEO Management', slug: 'seo-management', description: 'Manage SEO settings and metadata', parentCategoryId: contentMgmtId!, sortOrder: 3 },
      
      // Analytics & Reports
      { name: 'Property Analytics', slug: 'property-analytics', description: 'View property performance metrics', parentCategoryId: analyticsId!, sortOrder: 1 },
      { name: 'User Analytics', slug: 'user-analytics', description: 'View user engagement metrics', parentCategoryId: analyticsId!, sortOrder: 2 },
      { name: 'Financial Reports', slug: 'financial-reports', description: 'Generate financial and revenue reports', parentCategoryId: analyticsId!, sortOrder: 3 },
      { name: 'System Reports', slug: 'system-reports', description: 'Generate system usage reports', parentCategoryId: analyticsId!, sortOrder: 4 },
    ];

    const insertedSubcategories = await db.insert(adminSubcategories).values(subcategoryData).returning();
    console.log(`Inserted ${insertedSubcategories.length} subcategories`);

    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
