import { 
  User, InsertUser,
  LondonArea, InsertLondonArea,
  Property, InsertProperty,
  PropertyInquiry, InsertPropertyInquiry,
  Contact, InsertContact, 
  Valuation, InsertValuation,
  users, londonAreas, properties, propertyInquiries, contacts, valuations
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, and, desc } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods (admin only)
  createUser(user: InsertUser): Promise<User>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // London Area methods
  getLondonAreas(): Promise<LondonArea[]>;
  getLondonArea(id: number): Promise<LondonArea | undefined>;
  
  // Property methods
  createProperty(property: InsertProperty): Promise<Property>;
  getProperty(id: number): Promise<Property | undefined>;
  getAllProperties(): Promise<Property[]>;
  getPropertiesByListingType(listingType: string): Promise<Property[]>;
  getPropertiesByPostcode(postcode: string): Promise<Property[]>;
  getPropertiesByArea(areaId: number): Promise<Property[]>;
  getFilteredProperties(filters: any): Promise<Property[]>;
  
  // Property Inquiry methods
  createPropertyInquiry(inquiry: InsertPropertyInquiry): Promise<PropertyInquiry>;
  getPropertyInquiry(id: number): Promise<PropertyInquiry | undefined>;
  getPropertyInquiriesByProperty(propertyId: number): Promise<PropertyInquiry[]>;
  
  // Contact methods
  createContact(contact: InsertContact): Promise<Contact>;
  getContact(id: number): Promise<Contact | undefined>;
  getAllContacts(): Promise<Contact[]>;
  
  // Valuation methods
  createValuation(valuation: InsertValuation): Promise<Valuation>;
  getValuation(id: number): Promise<Valuation | undefined>;
  getValuationsByContact(contactId: number): Promise<Valuation[]>;
  
  // Session store
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Create the session store with PostgreSQL
    this.sessionStore = new PostgresSessionStore({
      conObject: {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      },
      createTableIfMissing: true
    });
  }
  
  // User methods
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  
  // London Area methods
  async getLondonAreas(): Promise<LondonArea[]> {
    return await db.select().from(londonAreas);
  }

  async getLondonArea(id: number): Promise<LondonArea | undefined> {
    const [area] = await db
      .select()
      .from(londonAreas)
      .where(eq(londonAreas.id, id));
    return area || undefined;
  }
  
  // Property methods
  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const [property] = await db.insert(properties).values(insertProperty).returning();
    return property;
  }
  
  async getProperty(id: number): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }
  
  async getPropertiesByPostcode(postcode: string): Promise<Property[]> {
    const results = await db.select().from(properties).where(ilike(properties.postcode, `%${postcode}%`));
    return results;
  }
  
  async getAllProperties(): Promise<Property[]> {
    return await db.select()
      .from(properties)
      .orderBy(desc(properties.createdAt));
  }

  async getPropertiesByListingType(listingType: string): Promise<Property[]> {
    return await db.select()
      .from(properties)
      .where(eq(properties.listingType, listingType))
      .orderBy(desc(properties.createdAt));
  }

  async getPropertiesByArea(areaId: number): Promise<Property[]> {
    return await db.select()
      .from(properties)
      .where(eq(properties.areaId, areaId))
      .orderBy(desc(properties.createdAt));
  }
  
  // Property Inquiry methods
  async createPropertyInquiry(insertInquiry: InsertPropertyInquiry): Promise<PropertyInquiry> {
    const [inquiry] = await db
      .insert(propertyInquiries)
      .values(insertInquiry)
      .returning();
    return inquiry;
  }

  async getPropertyInquiry(id: number): Promise<PropertyInquiry | undefined> {
    const [inquiry] = await db
      .select()
      .from(propertyInquiries)
      .where(eq(propertyInquiries.id, id));
    return inquiry || undefined;
  }

  async getPropertyInquiriesByProperty(propertyId: number): Promise<PropertyInquiry[]> {
    return await db
      .select()
      .from(propertyInquiries)
      .where(eq(propertyInquiries.propertyId, propertyId))
      .orderBy(desc(propertyInquiries.createdAt));
  }
  
  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(insertContact).returning();
    return contact;
  }
  
  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact;
  }
  
  async getAllContacts(): Promise<Contact[]> {
    return await db.select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));
  }
  
  // Valuation methods
  async createValuation(insertValuation: InsertValuation): Promise<Valuation> {
    const [valuation] = await db.insert(valuations).values(insertValuation).returning();
    return valuation;
  }
  
  async getValuation(id: number): Promise<Valuation | undefined> {
    const [valuation] = await db.select().from(valuations).where(eq(valuations.id, id));
    return valuation;
  }
  
  async getValuationsByContact(contactId: number): Promise<Valuation[]> {
    return await db.select()
      .from(valuations)
      .where(eq(valuations.contactId, contactId))
      .orderBy(desc(valuations.createdAt));
  }
  
  async getFilteredProperties(filters: any): Promise<Property[]> {
    const conditions = [];

    if (filters.listingType) {
      conditions.push(eq(properties.listingType, filters.listingType));
    }

    if (filters.propertyType && Array.isArray(filters.propertyType)) {
      // For array of property types, use the first one for simplicity
      if (filters.propertyType.length > 0) {
        conditions.push(eq(properties.propertyType, filters.propertyType[0]));
      }
    }

    if (filters.bedrooms) {
      conditions.push(eq(properties.bedrooms, filters.bedrooms));
    }

    if (filters.bathrooms) {
      conditions.push(eq(properties.bathrooms, filters.bathrooms));
    }

    if (filters.postcode) {
      conditions.push(ilike(properties.postcode, `%${filters.postcode}%`));
    }

    if (conditions.length > 0) {
      return await db.select()
        .from(properties)
        .where(and(...conditions))
        .orderBy(desc(properties.id));
    } else {
      return await db.select()
        .from(properties)
        .orderBy(desc(properties.id));
    }
  }
}

export const storage = new DatabaseStorage();