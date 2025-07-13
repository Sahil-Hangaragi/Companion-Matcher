import { RequestHandler } from "express";
import {
  UserProfile,
  CreateUserRequest,
  CreateUserResponse,
  GetMatchesResponse,
  UserMatch,
  ShortlistRequest,
  ShortlistResponse,
  GetShortlistResponse,
} from "@shared/api";

// In-memory storage (in production, this would be a database)
const users: Map<string, UserProfile> = new Map();
const shortlists: Map<string, Set<string>> = new Map(); // username -> set of shortlisted usernames

export function getUsersStore(): Map<string, UserProfile> {
  return users;
}

export const createUser: RequestHandler = (req, res) => {
  try {
    const {
      name,
      age,
      interests,
      photo,
      bio,
      location,
      occupation,
      lookingFor,
    }: CreateUserRequest = req.body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Name is required and must be a non-empty string",
      } as CreateUserResponse);
    }

    if (!age || typeof age !== "number" || age < 13 || age > 120) {
      return res.status(400).json({
        success: false,
        message: "Age is required and must be between 13 and 120",
      } as CreateUserResponse);
    }

    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Interests are required and must be a non-empty array",
      } as CreateUserResponse);
    }

    // Validate optional fields
    if (bio && typeof bio !== "string") {
      return res.status(400).json({
        success: false,
        message: "Bio must be a string",
      } as CreateUserResponse);
    }

    if (location && typeof location !== "string") {
      return res.status(400).json({
        success: false,
        message: "Location must be a string",
      } as CreateUserResponse);
    }

    if (occupation && typeof occupation !== "string") {
      return res.status(400).json({
        success: false,
        message: "Occupation must be a string",
      } as CreateUserResponse);
    }

    if (lookingFor && typeof lookingFor !== "string") {
      return res.status(400).json({
        success: false,
        message: "Looking for must be a string",
      } as CreateUserResponse);
    }

    // Check if user already exists
    if (users.has(name.toLowerCase())) {
      return res.status(409).json({
        success: false,
        message: "User with this name already exists",
      } as CreateUserResponse);
    }

    const user: UserProfile = {
      name: name.trim(),
      age,
      interests: interests.map((interest) => interest.toLowerCase()),
      ...(photo && { photo }),
      ...(bio && { bio: bio.trim() }),
      ...(location && { location: location.trim() }),
      ...(occupation && { occupation: occupation.trim() }),
      ...(lookingFor && { lookingFor: lookingFor.trim() }),
    };

    users.set(name.toLowerCase(), user);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    } as CreateUserResponse);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as CreateUserResponse);
  }
};

export const getMatches: RequestHandler = (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        matches: [],
        totalMatches: 0,
      } as GetMatchesResponse);
    }

    const targetUser = users.get(username.toLowerCase());
    if (!targetUser) {
      return res.status(404).json({
        matches: [],
        totalMatches: 0,
      } as GetMatchesResponse);
    }

    const matches: UserMatch[] = [];

    // Find users with at least 2 shared interests
    for (const [otherUsername, otherUser] of users) {
      if (otherUsername === username.toLowerCase()) continue;

      const sharedInterests = targetUser.interests.filter((interest) =>
        otherUser.interests.includes(interest),
      );

      if (sharedInterests.length >= 2) {
        matches.push({
          name: otherUser.name,
          interests: otherUser.interests,
          sharedInterests,
          compatibilityScore: Math.round(
            (sharedInterests.length /
              Math.max(
                targetUser.interests.length,
                otherUser.interests.length,
              )) *
              100,
          ),
          age: otherUser.age,
          photo: otherUser.photo,
          bio: otherUser.bio,
          location: otherUser.location,
          occupation: otherUser.occupation,
          lookingFor: otherUser.lookingFor,
        });
      }
    }

    // Sort by compatibility score (descending)
    matches.sort(
      (a, b) => (b.compatibilityScore || 0) - (a.compatibilityScore || 0),
    );

    res.json({
      matches,
      totalMatches: matches.length,
    } as GetMatchesResponse);
  } catch (error) {
    console.error("Error getting matches:", error);
    res.status(500).json({
      matches: [],
      totalMatches: 0,
    } as GetMatchesResponse);
  }
};

export const addToShortlist: RequestHandler = (req, res) => {
  try {
    const { username, targetUsername }: ShortlistRequest = req.body;

    if (!username || !targetUsername) {
      return res.status(400).json({
        success: false,
        message: "Both username and targetUsername are required",
      } as ShortlistResponse);
    }

    // Check if both users exist
    if (
      !users.has(username.toLowerCase()) ||
      !users.has(targetUsername.toLowerCase())
    ) {
      return res.status(404).json({
        success: false,
        message: "One or both users not found",
      } as ShortlistResponse);
    }

    if (username.toLowerCase() === targetUsername.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "Cannot shortlist yourself",
      } as ShortlistResponse);
    }

    // Initialize shortlist if it doesn't exist
    if (!shortlists.has(username.toLowerCase())) {
      shortlists.set(username.toLowerCase(), new Set());
    }

    const userShortlist = shortlists.get(username.toLowerCase())!;
    userShortlist.add(targetUsername.toLowerCase());

    res.json({
      success: true,
      message: "User added to shortlist",
    } as ShortlistResponse);
  } catch (error) {
    console.error("Error adding to shortlist:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    } as ShortlistResponse);
  }
};

export const getShortlist: RequestHandler = (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        shortlist: [],
      } as GetShortlistResponse);
    }

    const userShortlist = shortlists.get(username.toLowerCase()) || new Set();
    const shortlist: UserMatch[] = [];

    for (const shortlistedUsername of userShortlist) {
      const user = users.get(shortlistedUsername);
      if (user) {
        shortlist.push({
          name: user.name,
          interests: user.interests,
          age: user.age,
          photo: user.photo,
          bio: user.bio,
          location: user.location,
          occupation: user.occupation,
          lookingFor: user.lookingFor,
        });
      }
    }

    res.json({
      shortlist,
    } as GetShortlistResponse);
  } catch (error) {
    console.error("Error getting shortlist:", error);
    res.status(500).json({
      shortlist: [],
    } as GetShortlistResponse);
  }
};
