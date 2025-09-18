import { pgTable, text, serial, integer, boolean, timestamp, uniqueIndex, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// AI Chat and Search Schemas
export const SearchFiltersSchema = z.object({
  listingType: z.enum(["sale", "rental"]).optional(),
  propertyType: z.array(z.string()).optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  postcode: z.string().optional(),
  areas: z.array(z.string()).optional()
});

export const ParsedIntentSchema = z.object({
  intent: z.enum(["conversation", "property_search", "unknown"]),
  filters: SearchFiltersSchema,
  explanation: z.string().optional(),
  confidence: z.number().min(0).max(1)
});

export type SearchFilters = z.infer<typeof SearchFiltersSchema>;
export type ParsedIntent = z.infer<typeof ParsedIntentSchema>;

// Admin user schema (simple single admin login)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("admin"),
  createdAt: timestamp("created_at").notNull().defaultNow()
}, (table) => {
  return {
    usernameIdx: uniqueIndex("username_idx").on(table.username),
    emailIdx: uniqueIndex("email_idx").on(table.email)
  };
});

// London areas covered
export const londonAreas = pgTable("london_areas", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  postcode: text("postcode").notNull(),
  description: text("description").notNull(),
  investmentPerspective: text("investment_perspective").notNull(),
  marketAnalysis: text("market_analysis").notNull(),
  positiveAspects: text("positive_aspects").array().notNull(),
  negativeAspects: text("negative_aspects").array().notNull(),
  averagePrice: integer("average_price"),
  priceGrowthPercentage: decimal("price_growth_percentage"),
  nearestTubeStation: text("nearest_tube_station"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Estate agent properties schema (for sales and rentals)
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  // Listing type
  listingType: text("listing_type").notNull(), // 'sale' or 'rental'
  status: text("status").notNull().default("active"), // 'active', 'under_offer', 'sold', 'let', 'withdrawn'
  
  // Basic property information
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in pence for precision
  priceQualifier: text("price_qualifier"), // 'guide_price', 'offers_over', 'poa', etc.
  
  // Property details
  propertyType: text("property_type").notNull(), // 'flat', 'house', 'maisonette', 'penthouse', etc.
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  receptions: integer("receptions"),
  squareFootage: integer("square_footage"),
  
  // Address and location
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  postcode: text("postcode").notNull(),
  areaId: integer("area_id").notNull(), // Link to london_areas
  
  // Property characteristics
  tenure: text("tenure").notNull(), // 'freehold', 'leasehold', 'share_of_freehold'
  councilTaxBand: text("council_tax_band"),
  energyRating: text("energy_rating"), // A, B, C, D, E, F, G
  yearBuilt: integer("year_built"),
  
  // Features (JSON arrays for flexibility)
  features: text("features").array(), // ['garden', 'parking', 'balcony', 'recently_renovated', etc.]
  amenities: text("amenities").array(), // local amenities
  
  // Images
  images: text("images").array(), // Array of image URLs/paths
  floorPlan: text("floor_plan"), // Floor plan image URL
  
  // Viewing and contact
  viewingArrangements: text("viewing_arrangements"), // 'by_appointment', 'viewing_times', etc.
  agentContact: text("agent_contact"),
  
  // Rental specific fields
  rentPeriod: text("rent_period"), // 'per_month', 'per_week' for rentals
  furnished: text("furnished"), // 'furnished', 'unfurnished', 'part_furnished'
  availableFrom: timestamp("available_from"),
  minimumTenancy: integer("minimum_tenancy"), // in months
  deposit: integer("deposit"), // deposit amount for rentals
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

// Property relations
export const propertiesRelations = relations(properties, ({ one, many }) => ({
  area: one(londonAreas, {
    fields: [properties.areaId],
    references: [londonAreas.id],
    relationName: "area_properties"
  }),
  inquiries: many(propertyInquiries, { relationName: "property_inquiries" })
}));

// London areas relations
export const londonAreasRelations = relations(londonAreas, ({ many }) => ({
  properties: many(properties, { relationName: "area_properties" })
}));

// Property inquiries schema (for potential buyers/renters)
export const propertyInquiries = pgTable("property_inquiries", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  inquiryType: text("inquiry_type").notNull(), // 'viewing_request', 'information_request', 'offer'
  
  // Contact details
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  
  // Inquiry details
  message: text("message"),
  preferredViewingTimes: text("preferred_viewing_times"),
  financialPosition: text("financial_position"), // 'cash_buyer', 'mortgage_required', 'first_time_buyer', etc.
  
  // Status tracking
  status: text("status").notNull().default("new"), // 'new', 'contacted', 'viewing_arranged', 'closed'
  
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// General contact inquiries (valuation requests, general questions)
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  inquiryType: text("inquiry_type").notNull(), // 'valuation', 'selling', 'letting', 'general'
  
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  
  // Property details for valuation/selling inquiries
  propertyAddress: text("property_address"),
  postcode: text("postcode"),
  propertyType: text("property_type"),
  bedrooms: integer("bedrooms"),
  
  message: text("message"),
  timeframe: text("timeframe"),
  
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Property inquiry relations
export const propertyInquiriesRelations = relations(propertyInquiries, ({ one }) => ({
  property: one(properties, {
    fields: [propertyInquiries.propertyId],
    references: [properties.id],
    relationName: "property_inquiries"
  })
}));

// Property valuations for selling services
export const valuations = pgTable("valuations", {
  id: serial("id").primaryKey(),
  contactId: integer("contact_id").notNull(),
  
  // Property details
  propertyAddress: text("property_address").notNull(),
  postcode: text("postcode").notNull(),
  propertyType: text("property_type").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  
  // Valuation results
  estimatedValue: integer("estimated_value"),
  valuationRange: text("valuation_range"), // "£850,000 - £950,000"
  
  // Valuation details
  comparableProperties: json("comparable_properties"), // JSON array of similar properties
  marketConditions: text("market_conditions"),
  recommendations: text("recommendations"),
  
  status: text("status").notNull().default("pending"), // 'pending', 'completed', 'sent'
  valuationDate: timestamp("valuation_date"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Valuation relations
export const valuationsRelations = relations(valuations, ({ one }) => ({
  contact: one(contacts, {
    fields: [valuations.contactId],
    references: [contacts.id],
    relationName: "contact_valuations"
  })
}));

// Contact relations
export const contactsRelations = relations(contacts, ({ many }) => ({
  valuations: many(valuations, { relationName: "contact_valuations" })
}));

// Remove old ownership and chat schemas - not needed for estate agent website
// User relations (simplified for admin-only access)
export const usersRelations = relations(users, ({ }) => ({
  // Admin users don't have direct property ownership relationships
}));


// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true,
  createdAt: true
});

export const insertLondonAreaSchema = createInsertSchema(londonAreas).omit({ 
  id: true,
  createdAt: true
});

export const insertPropertySchema = createInsertSchema(properties).omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertPropertyInquirySchema = createInsertSchema(propertyInquiries).omit({ 
  id: true,
  createdAt: true
});

export const insertContactSchema = createInsertSchema(contacts).omit({ 
  id: true,
  createdAt: true
});

export const insertValuationSchema = createInsertSchema(valuations).omit({ 
  id: true,
  createdAt: true
});


// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;

export type Valuation = typeof valuations.$inferSelect;
export type InsertValuation = z.infer<typeof insertValuationSchema>;

export type LondonArea = typeof londonAreas.$inferSelect;
export type InsertLondonArea = z.infer<typeof insertLondonAreaSchema>;

export type PropertyInquiry = typeof propertyInquiries.$inferSelect;
export type InsertPropertyInquiry = z.infer<typeof insertPropertyInquirySchema>;

// Authentication schemas (simplified for admin-only access)
export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Please enter a valid email address"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

// Legacy support for existing forms (to be updated later)
export type PropertyValuationFormData = ContactFormData;

// Estate agent form schemas

// Property search/filter schema
export const propertySearchSchema = z.object({
  listingType: z.enum(["sale", "rental", "all"]).optional(),
  areaId: z.number().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  bedrooms: z.number().optional(),
  propertyType: z.enum(["flat", "house", "maisonette", "penthouse", "studio", "all"]).optional(),
  features: z.array(z.string()).optional()
});

export type PropertySearchData = z.infer<typeof propertySearchSchema>;

// Property inquiry form schema
export const propertyInquiryFormSchema = z.object({
  propertyId: z.number(),
  inquiryType: z.enum(["viewing_request", "information_request", "offer"]),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().optional(),
  preferredViewingTimes: z.string().optional(),
  financialPosition: z.enum(["cash_buyer", "mortgage_required", "first_time_buyer", "chain_free", "other"]).optional()
});

export type PropertyInquiryFormData = z.infer<typeof propertyInquiryFormSchema>;

// Contact form schema (for general inquiries, valuations)
export const contactFormSchema = z.object({
  inquiryType: z.enum(["valuation", "selling", "letting", "general"]),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  propertyAddress: z.string().optional(),
  postcode: z.string().optional(),
  propertyType: z.enum(["flat", "house", "maisonette", "penthouse", "studio", "other"]).optional(),
  bedrooms: z.number().optional(),
  message: z.string().min(10, "Please provide some details"),
  timeframe: z.enum(["asap", "1-3_months", "3-6_months", "just_curious"]).optional()
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Property valuation request schema
export const valuationRequestSchema = z.object({
  propertyAddress: z.string().min(1, "Property address is required"),
  postcode: z.string().min(5, "Please enter a valid postcode"),
  propertyType: z.enum(["flat", "house", "maisonette", "penthouse", "studio", "other"]),
  bedrooms: z.number().min(1).max(10),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  timeframe: z.enum(["asap", "1-3_months", "3-6_months", "just_curious"])
});

export type ValuationRequestData = z.infer<typeof valuationRequestSchema>;

// London area enums for validation
export const LONDON_AREAS = [
  { name: "Bayswater", postcode: "W2" },
  { name: "Harlesden", postcode: "NW10" },
  { name: "Kensal Green", postcode: "NW10" },
  { name: "Kensal Rise", postcode: "NW10" },
  { name: "Kilburn", postcode: "NW6" },
  { name: "Ladbroke Grove", postcode: "W10" },
  { name: "Maida Vale", postcode: "W9" },
  { name: "Maida Hill", postcode: "W9" },
  { name: "North Kensington", postcode: "W10" },
  { name: "Queens Park", postcode: "NW6" },
  { name: "St Johns Wood", postcode: "NW8" },
  { name: "Westbourne Park", postcode: "W10" },
  { name: "Westbourne Park", postcode: "W11" },
  { name: "Willesden", postcode: "NW10" },
  { name: "Willesden", postcode: "NW2" }
] as const;

export const PROPERTY_FEATURES = [
  "garden", "parking", "balcony", "terrace", "patio", "recently_renovated", 
  "period_features", "high_ceilings", "wooden_floors", "modern_kitchen", 
  "ensuite_bathroom", "walk_in_wardrobe", "gym", "concierge", "lift", 
  "air_conditioning", "underfloor_heating", "fireplace", "roof_terrace", 
  "canal_views", "park_views", "city_views"
] as const;
