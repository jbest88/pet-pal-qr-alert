
import { User, Pet, ScanEvent } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

// Mock storage - in a real app, this would be a database
let users: User[] = [];
let pets: Pet[] = [];
let scanEvents: ScanEvent[] = [];

// Check if we have data in localStorage
const loadFromStorage = () => {
  try {
    const storedUsers = localStorage.getItem("petpal_users");
    const storedPets = localStorage.getItem("petpal_pets");
    const storedScanEvents = localStorage.getItem("petpal_scanEvents");

    if (storedUsers) users = JSON.parse(storedUsers);
    if (storedPets) pets = JSON.parse(storedPets);
    if (storedScanEvents) scanEvents = JSON.parse(storedScanEvents);
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
  }
};

// Save data to localStorage
const saveToStorage = () => {
  try {
    localStorage.setItem("petpal_users", JSON.stringify(users));
    localStorage.setItem("petpal_pets", JSON.stringify(pets));
    localStorage.setItem("petpal_scanEvents", JSON.stringify(scanEvents));
  } catch (error) {
    console.error("Error saving data to localStorage:", error);
  }
};

// Initialize data
loadFromStorage();

// User methods
export const createUser = (userData: Omit<User, "id">): User => {
  const newUser = { ...userData, id: uuidv4() };
  users.push(newUser);
  saveToStorage();
  return newUser;
};

export const getUserById = (userId: string): User | undefined => {
  return users.find((user) => user.id === userId);
};

export const getCurrentUser = (): User | null => {
  const currentUserId = localStorage.getItem("currentUserId");
  if (!currentUserId) return null;
  return users.find((user) => user.id === currentUserId) || null;
};

export const setCurrentUser = (userId: string | null) => {
  if (userId) {
    localStorage.setItem("currentUserId", userId);
  } else {
    localStorage.removeItem("currentUserId");
  }
};

// Pet methods
export const createPet = (petData: Omit<Pet, "id">): Pet => {
  const newPet = { ...petData, id: uuidv4() };
  pets.push(newPet);
  saveToStorage();
  return newPet;
};

export const getPetsByOwnerId = (ownerId: string): Pet[] => {
  return pets.filter((pet) => pet.ownerId === ownerId);
};

export const getPetById = (petId: string): Pet | undefined => {
  return pets.find((pet) => pet.id === petId);
};

// Scan event methods
export const createScanEvent = (scanData: Omit<ScanEvent, "id">): ScanEvent => {
  const newScan = { ...scanData, id: uuidv4() };
  scanEvents.push(newScan);
  saveToStorage();
  
  // Notify the owner
  const pet = getPetById(scanData.petId);
  if (pet) {
    const owner = getUserById(pet.ownerId);
    if (owner) {
      // In a real app, this would send an SMS, email, or push notification
      toast.success(`Alert sent to ${owner.name} about ${pet.name}`);
      console.log(`ALERT: ${pet.name} has been found! Owner: ${owner.name}, Contact: ${owner.phone}`);
    }
  }
  
  return newScan;
};

export const getScanEventsByPetId = (petId: string): ScanEvent[] => {
  return scanEvents.filter((event) => event.petId === petId);
};

// Initialize with demo data if no users exist
if (users.length === 0) {
  const demoUser = createUser({
    name: "Demo User",
    email: "demo@example.com",
    phone: "555-123-4567"
  });
  
  setCurrentUser(demoUser.id);
  
  const demoPet = createPet({
    ownerId: demoUser.id,
    name: "Buddy",
    type: "dog",
    breed: "Golden Retriever",
    description: "Friendly and playful, loves tennis balls",
    qrCodeUrl: `/pet/${uuidv4()}`
  });
}
