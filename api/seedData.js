import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("DB_URL:", process.env.DB_URL);
import mongoose from "mongoose";
import { Pet } from "./models/petModel.js";
import { Product } from "./models/productModel.js";
import Doctor from "./models/doctorModel.js";

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("Database connected for seeding"))
  .catch((err) => console.log(`Error connecting database ${err}`));

// Bangladesh-specific pet products data (30-50 items)
const products = [
  // Dog Food
  { name: "Premium Dog Food (Pedigree)", category: "Food", price: 1250, description: "Complete nutrition dog food for adult dogs - 5kg pack", image: "/dog_food.webp", stock: 50 },
  { name: "Puppy Starter Food", category: "Food", price: 980, description: "Specially formulated for puppies up to 12 months", image: "/dog_food.webp", stock: 35 },
  { name: "Royal Canin Dog Food", category: "Food", price: 2800, description: "Premium imported dog food for all breeds", image: "/dog_food.webp", stock: 25 },
  { name: "Home Cooked Dog Meal Combo", category: "Food", price: 450, description: "Ready to serve chicken and rice meal for dogs", image: "/dog_food.webp", stock: 40 },
  { name: "Dry Dog Kibble Premium", category: "Food", price: 1650, description: "High protein dry kibble for active dogs", image: "/dog_food.webp", stock: 30 },

  // Cat Food
  { name: "Whiskas Cat Food", category: "Food", price: 850, description: "Complete cat food with real chicken flavor", image: "/dog_food.webp", stock: 60 },
  { name: "Kitten Food Formula", category: "Food", price: 720, description: "Specially for kittens with DHA for brain development", image: "/dog_food.webp", stock: 45 },
  { name: "Premium Cat Wet Food", category: "Food", price: 120, description: "Tuna and salmon pouches - pack of 6", image: "/dog_food.webp", stock: 80 },
  { name: "Indoor Cat Formula", category: "Food", price: 1100, description: "Special formula for indoor cats", image: "/dog_food.webp", stock: 30 },

  // Dog Toys
  { name: "Rubber Chew Toy", category: "Toys", price: 250, description: "Durable rubber toy for teething puppies", image: "/chew_toy.jpg", stock: 50 },
  { name: "Squeaky Plush Toy", category: "Toys", price: 380, description: "Soft plush toy with squeaker for interactive play", image: "/chew_toy.jpg", stock: 40 },
  { name: "Rope Tug Toy", category: "Toys", price: 320, description: "Cotton rope toy for tug of war", image: "/chew_toy.jpg", stock: 35 },
  { name: "Tennis Ball Set", category: "Toys", price: 180, description: "Pack of 3 durable tennis balls", image: "/chew_toy.jpg", stock: 60 },
  { name: "Puzzle Feeder", category: "Toys", price: 650, description: "Mental stimulation puzzle toy for dogs", image: "/chew_toy.jpg", stock: 20 },

  // Cat Toys
  { name: "Feather Wand Toy", category: "Toys", price: 280, description: "Interactive feather wand for cats", image: "/cat_scratching.webp", stock: 45 },
  { name: "Cat Scratching Post", category: "Toys", price: 1200, description: "Multi-level scratching post with toys", image: "/cat_scratching.webp", stock: 15 },
  { name: "Laser Pointer Cat Toy", category: "Toys", price: 150, description: "USB rechargeable laser pointer", image: "/cat_scratching.webp", stock: 50 },
  { name: "Cat Ball Tunnel", category: "Toys", price: 450, description: "Play tunnel with crinkle balls", image: "/cat_scratching.webp", stock: 25 },

  // Dog Accessories
  { name: "Adjustable Dog Collar", category: "Accessories", price: 350, description: "Nylon collar with buckle - adjustable size", image: "/dog_leash.webp", stock: 70 },
  { name: "Dog Leash (6ft)", category: "Accessories", price: 480, description: "Strong leather leash for walking", image: "/dog_leash.webp", stock: 55 },
  { name: "Dog Shampoo", category: "Accessories", price: 420, description: "Gentle formula shampoo for sensitive skin", image: "/dog_shampoo.jpg", stock: 40 },
  { name: "Dog Bed (Medium)", category: "Accessories", price: 1800, description: "Comfortable orthopedic dog bed", image: "/pet_bed.webp", stock: 20 },
  { name: "Dog Raincoat", category: "Accessories", price: 650, description: "Waterproof raincoat for small dogs", image: "/dog_shampoo.jpg", stock: 25 },
  { name: "Dog Booties Set", category: "Accessories", price: 520, description: "Protective booties for all seasons - set of 4", image: "/dog_shampoo.jpg", stock: 30 },

  // Cat Accessories
  { name: "Cat Carrier (Medium)", category: "Accessories", price: 1500, description: "Airline approved cat carrier", image: "/cat_carrier.jpg", stock: 20 },
  { name: "Litter Box (Large)", category: "Accessories", price: 850, description: "Covered litter box with filter", image: "/cat_litter.jpeg", stock: 30 },
  { name: "Cat Harness & Leash Set", category: "Accessories", price: 580, description: "Adjustable harness for outdoor walks", image: "/cat_carrier.jpg", stock: 25 },
  { name: "Automatic Cat Feeder", category: "Accessories", price: 3200, description: "Programmable feeder with timer", image: "/pet_feeding_bowl.avif", stock: 10 },
  { name: "Ceramic Food Bowl", category: "Accessories", price: 280, description: "Heavy duty ceramic bowl", image: "/pet_feeding_bowl.avif", stock: 45 },
  { name: "Water Fountain", category: "Accessories", price: 1450, description: "Filtered water fountain for cats", image: "/pet_feeding_bowl.avif", stock: 15 },

  // Bird Supplies
  { name: "Bird Cage (Large)", category: "Accessories", price: 3500, description: "Spacious cage for parrots and cockatoos", image: "/parrot_cage.jpg", stock: 10 },
  { name: "Bird Seed Mix", category: "Food", price: 350, description: "Premium mixed seeds for parrots", image: "/bird_feeder.jpg", stock: 50 },
  { name: "Bird Feeder", category: "Accessories", price: 450, description: "Hanging feeder for outdoor birds", image: "/bird_feeder.jpg", stock: 30 },
  { name: "Bird Perch Set", category: "Accessories", price: 280, description: "Natural wood perches - set of 3", image: "/bird_feeder.jpg", stock: 35 },
  { name: "Bird Bath", category: "Accessories", price: 380, description: "Hanging bird bath for cooling", image: "/bird_feeder.jpg", stock: 25 },

  // Fish Supplies
  { name: "Fish Tank (20 Gallon)", category: "Accessories", price: 4500, description: "Complete aquarium setup with filter", image: "/fish_tank.webp", stock: 8 },
  { name: "Fish Food Flakes", category: "Food", price: 220, description: "Tropical fish flakes - 100g", image: "/fish.jpg", stock: 60 },
  { name: "Aquarium Filter", category: "Accessories", price: 1200, description: "Internal filter for up to 30 gallon tank", image: "/fish_tank.webp", stock: 15 },
  { name: "Fish Tank Decorations", category: "Accessories", price: 550, description: "Artificial plants and ornaments set", image: "/fish_tank.webp", stock: 25 },
  { name: "Water Test Kit", category: "Accessories", price: 680, description: "pH and ammonia test strips", image: "/fish.jpg", stock: 20 },

  // Small Pets
  { name: "Hamster Cage Complete", category: "Accessories", price: 2200, description: "Multi-level cage with wheel and tubes", image: "/hamster_cage.jpg", stock: 12 },
  { name: "Hamster Food Mix", category: "Food", price: 180, description: "Complete nutrition hamster food", image: "/hamster_cage.jpg", stock: 40 },
  { name: "Rabbit Hutch (Outdoor)", category: "Accessories", price: 5500, description: "Wooden hutch with run area", image: "/rabbit_hutch.jpg", stock: 5 },
  { name: "Rabbit Food Pellets", category: "Food", price: 320, description: "High fiber pellets for rabbits", image: "/rabbit_hutch.jpg", stock: 35 },
  { name: "Guinea Pig Cage", category: "Accessories", price: 2800, description: "Spacious cage for guinea pigs", image: "/other1ginipig.jpg", stock: 8 },
  { name: "Guinea Pig Vitamin C Supplement", category: "Food", price: 250, description: "Essential vitamin supplement", image: "/other1ginipig.jpg", stock: 30 },
];

// Bangladesh-specific doctors data (10-15 doctors)
const doctors = [
  { name: "Dr. Mohammad Rahman", specialization: "General Veterinary Medicine", email: "dr.rahman@petzy.com", phone: "+8801712345678", image: "/contact.png", experience: 12 },
  { name: "Dr. Fatema Islam", specialization: "Small Animal Surgery", email: "dr.islam@petzy.com", phone: "+8801712345679", image: "/contact.png", experience: 8 },
  { name: "Dr. Ahmed Hassan", specialization: "Pet Dermatology", email: "dr.ahmed@petzy.com", phone: "+8801712345680", image: "/contact.png", experience: 10 },
  { name: "Dr. Nuruzzaman", specialization: "Large Animal Medicine", email: "dr.nuruzzaman@petzy.com", phone: "+8801712345681", image: "/contact.png", experience: 15 },
  { name: "Dr. Shapla Khatun", specialization: "Avian Veterinary", email: "dr.shapla@petzy.com", phone: "+8801712345682", image: "/contact.png", experience: 6 },
  { name: "Dr. Mainuddin", specialization: "Exotic Pets Specialist", email: "dr.mainuddin@petzy.com", phone: "+8801712345683", image: "/contact.png", experience: 9 },
  { name: "Dr. Reshma Begum", specialization: "Pet Nutrition", email: "dr.reshma@petzy.com", phone: "+8801712345684", image: "/contact.png", experience: 7 },
  { name: "Dr. Kamal Hossain", specialization: "Emergency Care", email: "dr.kamal@petzy.com", phone: "+8801712345685", image: "/contact.png", experience: 11 },
  { name: "Dr. Jahanara", specialization: "Feline Medicine", email: "dr.jahanara@petzy.com", phone: "+8801712345686", image: "/contact.png", experience: 5 },
  { name: "Dr. Shahidul Islam", specialization: "Aquatic Animal Care", email: "dr.shahidul@petzy.com", phone: "+8801712345687", image: "/contact.png", experience: 8 },
  { name: "Dr. Rina Akter", specialization: "Pet Cardiology", email: "dr.rina@petzy.com", phone: "+8801712345688", image: "/contact.png", experience: 6 },
  { name: "Dr. Azizur Rahman", specialization: "Orthopedic Surgery", email: "dr.azizur@petzy.com", phone: "+8801712345689", image: "/contact.png", experience: 14 },
];

// Bangladesh-specific pets for adoption (20-30 pets)
const pets = [
  // Dogs
  { name: "Tommy", type: "Dog", breed: "Golden Retriever", age: 2, price: 25000, description: "Friendly and playful golden retriever puppy, well trained", image: "/dog1.jpg", status: "available", address: "Gulshan, Dhaka" },
  { name: "Max", type: "Dog", breed: "German Shepherd", age: 3, price: 30000, description: "Loyal guard dog, good with family, vaccinated", image: "/dog2.jpg", status: "available", address: "Banani, Dhaka" },
  { name: "Buddy", type: "Dog", breed: "Labrador", age: 1, price: 20000, description: "Energetic labrador puppy, great with kids", image: "/dog3.jpg", status: "available", address: "Mirpur, Dhaka" },
  { name: "Charlie", type: "Dog", breed: "Pug", age: 2, price: 18000, description: "Adorable pug, perfect for apartment living", image: "/dog4.jpg", status: "available", address: "Uttara, Dhaka" },
  { name: "Rocky", type: "Dog", breed: "Bullmastiff", age: 4, price: 35000, description: "Gentle giant, excellent guard dog", image: "/dog1.jpg", status: "available", address: "Dhanmondi, Dhaka" },
  { name: "Biscuit", type: "Dog", breed: "Beagle", age: 1, price: 22000, description: "Curious beagle puppy, loves to explore", image: "/dog2.jpg", status: "available", address: "Baridhara, Dhaka" },
  { name: "Simba", type: "Dog", breed: "Golden Retriever", age: 5, price: 28000, description: "Mature golden, great with children", image: "/dog3.jpg", status: "available", address: "Mohakhali, Dhaka" },
  { name: "Luna", type: "Dog", breed: "Husky", age: 2, price: 40000, description: "Beautiful husky, needs active owner", image: "/dog4.jpg", status: "available", address: "Badda, Dhaka" },

  // Cats
  { name: "Mimi", type: "Cat", breed: "Persian", age: 2, price: 15000, description: "Fluffy Persian cat, very calm and affectionate", image: "/cat1.jpg", status: "available", address: "Gulshan, Dhaka" },
  { name: "Bella", type: "Cat", breed: "Bengal", age: 1, price: 18000, description: "Playful Bengal kitten, loves climbing", image: "/cat2.jpg", status: "available", address: "Banani, Dhaka" },
  { name: "Whiskers", type: "Cat", breed: "British Shorthair", age: 3, price: 12000, description: "Calm British Shorthair, great indoor cat", image: "/cat3.jpg", status: "available", address: "Mirpur, Dhaka" },
  { name: "Luna", type: "Cat", breed: "Maine Coon", age: 2, price: 22000, description: "Gentle giant, very friendly", image: "/cat4.jpg", status: "available", address: "Uttara, Dhaka" },
  { name: "Shadow", type: "Cat", breed: "Bombay", age: 1, price: 10000, description: "Playful black kitten, loves attention", image: "/cat1.jpg", status: "available", address: "Dhanmondi, Dhaka" },
  { name: "Cleo", type: "Cat", breed: "Siamese", age: 2, price: 14000, description: "Vocal Siamese, very affectionate", image: "/cat2.jpg", status: "available", address: "Baridhara, Dhaka" },
  { name: "Oreo", type: "Cat", breed: "Domestic Shorthair", age: 1, price: 5000, description: "Sweet tabby kitten, great with other pets", image: "/cat3.jpg", status: "available", address: "Mohakhali, Dhaka" },
  { name: "Snowball", type: "Cat", breed: "Persian", age: 3, price: 16000, description: "White Persian, very docile", image: "/cat4.jpg", status: "available", address: "Badda, Dhaka" },

  // Birds
  { name: "Polly", type: "Bird", breed: "Cockatiel", age: 1, price: 3500, description: "Friendly cockatiel, can whistle tunes", image: "/bird1.jpg", status: "available", address: "Gulshan, Dhaka" },
  { name: "Rio", type: "Bird", breed: "Budgerigar", age: 1, price: 1500, description: "Colorful parakeet, talks a little", image: "/bird2.jpg", status: "available", address: "Banani, Dhaka" },
  { name: "Mithu", type: "Bird", breed: "Indian Ringneck", age: 2, price: 8000, description: "Talking parrot, learns quickly", image: "/bird1.jpg", status: "available", address: "Mirpur, Dhaka" },
  { name: "Coco", type: "Bird", breed: "Lovebird", age: 1, price: 2500, description: "Affectionate lovebird pair", image: "/bird2.jpg", status: "available", address: "Uttara, Dhaka" },
  { name: "Tweety", type: "Bird", breed: "Canary", age: 1, price: 1200, description: "Beautiful singing canary", image: "/bird1.jpg", status: "available", address: "Dhanmondi, Dhaka" },

  // Fish
  { name: "Goldie", type: "Fish", breed: "Goldfish", age: 1, price: 500, description: "Healthy goldfish, orange colored", image: "/fish.jpg", status: "available", address: "Gulshan, Dhaka" },
  { name: "Nemo", type: "Fish", breed: "Clownfish", age: 1, price: 800, description: "Colorful clownfish, marine trained", image: "/fish_tank.webp", status: "available", address: "Banani, Dhaka" },
  { name: "Bubbles", type: "Fish", breed: "Betta", age: 1, price: 350, description: "Stunning betta fish, royal blue", image: "/fish.jpg", status: "available", address: "Mirpur, Dhaka" },
  { name: "Flash", type: "Fish", breed: "Guppy", age: 0.5, price: 200, description: "Active guppy school, multiple colors", image: "/fish_tank.webp", status: "available", address: "Uttara, Dhaka" },

  // Rabbits
  { name: "Cotton", type: "Rabbit", breed: "Holland Lop", age: 1, price: 2500, description: "Adorable lop-eared bunny, very gentle", image: "/rabbit1.jpg", status: "available", address: "Gulshan, Dhaka" },
  { name: "Thumper", type: "Rabbit", breed: "Dutch", age: 1, price: 2000, description: "Friendly Dutch rabbit, loves hay", image: "/rabbit2.jpg", status: "available", address: "Banani, Dhaka" },
  { name: "Snowball", type: "Rabbit", breed: "White Flemish", age: 2, price: 3000, description: "Large white rabbit, great for breeding", image: "/rabbit1.jpg", status: "available", address: "Mirpur, Dhaka" },
  { name: "Peanut", type: "Rabbit", breed: "Netherland Dwarf", age: 1, price: 2800, description: "Tiny dwarf rabbit, cute bundle of joy", image: "/rabbit2.jpg", status: "available", address: "Uttara, Dhaka" },

  // Guinea Pigs
  { name: "Pip", type: "Guinea Pig", breed: "American", age: 1, price: 1500, description: "Social guinea pig, loves veggies", image: "/other1ginipig.jpg", status: "available", address: "Gulshan, Dhaka" },
  { name: "Nibbles", type: "Guinea Pig", breed: "Abyssinian", age: 1, price: 1800, description: "Curious Abyssinian, very vocal", image: "/other1ginipig.jpg", status: "available", address: "Banani, Dhaka" },

  // Hamsters
  { name: "Nibbles", type: "Hamster", breed: "Syrian", age: 0.5, price: 800, description: "Cute Syrian hamster, very friendly", image: "/hamster_cage.jpg", status: "available", address: "Mirpur, Dhaka" },
  { name: "Cookie", type: "Hamster", breed: "Dwarf", age: 0.5, price: 600, description: "Active dwarf hamster, fun to watch", image: "/hamster_cage.jpg", status: "available", address: "Uttara, Dhaka" },
];

// Seed function
const seedData = async () => {
  try {
    // First, delete all existing data to ensure fresh seed
    console.log("Deleting existing data...");
    await Product.deleteMany({});
    console.log("✓ Deleted all existing products");
    await Doctor.deleteMany({});
    console.log("✓ Deleted all existing doctors");
    await Pet.deleteMany({});
    console.log("✓ Deleted all existing pets\n");

    // Seed Products
    await Product.insertMany(products);
    console.log(`✓ Successfully seeded ${products.length} products`);

    // Seed Doctors
    await Doctor.insertMany(doctors);
    console.log(`✓ Successfully seeded ${doctors.length} doctors`);

    // Seed Pets
    await Pet.insertMany(pets);
    console.log(`✓ Successfully seeded ${pets.length} pets`);

    // Final summary
    const productCount = await Product.countDocuments();
    const doctorCount = await Doctor.countDocuments();
    const petCount = await Pet.countDocuments();

    console.log("\n========================================");
    console.log("✅ Seed data completed successfully!");
    console.log("========================================");
    console.log(`📦 Total Products: ${productCount}`);
    console.log(`👨‍⚕️ Total Doctors: ${doctorCount}`);
    console.log(`🐾 Total Pets: ${petCount}`);
    console.log("========================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

// Run the seed function
seedData();
