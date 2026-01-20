import express from "express";
import { ENV } from "./config/env.js";
import { db } from "./config/db.js";
import { and, eq } from "drizzle-orm";
import { favoritesTable } from "./db/schema.js";

const app = express();
const PORT = ENV.PORT || 5000;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true});
});

// Add favorite
app.post("/api/favorites", async (req, res) => {
    
    const { userId, recipeId, title, image, cookTime, servings } = req.body;
    if (!userId || !recipeId || !title) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const [newFavorite] = await db.insert(favoritesTable).values({
            userId,
            recipeId,
            title,
            image,
            cookTime,
            servings,
        }).returning();
        return res.status(201).json(newFavorite);
    } catch (error) {
        console.log("Error adding favorite", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

// Get favorites
app.get("/api/favorites/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const favorites = await db.select().from(favoritesTable)
            .where(eq(favoritesTable.userId, userId));
        res.status(200).json(favorites);
    } catch (error) {
        console.log("Error getting favorites", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Remove favorite
app.delete("/api/favorites/:userId/:recipeId", async (req, res) => {
    const { userId, recipeId } = req.params;
    try {
       await db
      .delete(favoritesTable)
      .where(
        and(
          eq(favoritesTable.userId, userId),
          eq(favoritesTable.recipeId, parseInt(recipeId)),
        ),
      );

    res.status(200).json({ message: "Favorite removed successfully" });
  } catch (error) {
    console.log("Error removing a favorite", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
    console.log("Server is running on port: " + PORT);
});
