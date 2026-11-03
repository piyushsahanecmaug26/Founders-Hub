
import db from "../config/db.js";

// =====================================
// CREATE FOUNDER PROFILE
// =====================================

export const createProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const {
            bio,
            location,
            education,
            experience_years,
            current_role,
            linkedin_url,
            portfolio_url,
            availability,
            preferred_role,
            industry,
            startup_stage
        } = req.body;

        // Check whether profile already exists
        const [existingProfile] = await db.query(
            "SELECT profile_id FROM founder_profiles WHERE user_id = ?",
            [userId]
        );

        if (existingProfile.length > 0) {
            return res.status(409).json({
                message: "Profile already exists. Please update your profile."
            });
        }

        // Validate experience
        const experience = Number(experience_years ?? 0);

        if (!Number.isInteger(experience) || experience < 0) {
            return res.status(400).json({
                message: "Experience must be a non-negative whole number."
            });
        }

        // Insert profile into database
        const [result] = await db.query(
            `INSERT INTO founder_profiles
            (
                user_id,
                bio,
                location,
                education,
                experience_years,
                current_role,
                linkedin_url,
                portfolio_url,
                availability,
                preferred_role,
                industry,
                startup_stage
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                bio || null,
                location || null,
                education || null,
                experience,
                current_role || null,
                linkedin_url || null,
                portfolio_url || null,
                availability || null,
                preferred_role || null,
                industry || null,
                startup_stage || null
            ]
        );

        res.status(201).json({
            message: "Founder profile created successfully!",
            profile_id: result.insertId
        });

    } catch (error) {
        console.error("Create Profile Error:", error);

        res.status(500).json({
            message: "Failed to create founder profile."
        });
    }
};


// =====================================
// GET FOUNDER PROFILE
// =====================================

export const getProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [profiles] = await db.query(
            `SELECT
                p.*,
                u.name,
                u.email
             FROM founder_profiles p
             JOIN users u ON p.user_id = u.user_id
             WHERE p.user_id = ?`,
            [userId]
        );

        if (profiles.length === 0) {
            return res.status(404).json({
                message: "Founder profile not found. Please create your profile."
            });
        }

        res.status(200).json({
            message: "Profile fetched successfully!",
            profile: profiles[0]
        });

    } catch (error) {
        console.error("Get Profile Error:", error);

        res.status(500).json({
            message: "Failed to fetch founder profile."
        });
    }
};


// =====================================
// UPDATE FOUNDER PROFILE
// =====================================

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const {
            bio,
            location,
            education,
            experience_years,
            current_role,
            linkedin_url,
            portfolio_url,
            availability,
            preferred_role,
            industry,
            startup_stage
        } = req.body;

        const experience = Number(experience_years ?? 0);

        if (!Number.isInteger(experience) || experience < 0) {
            return res.status(400).json({
                message: "Experience must be a non-negative whole number."
            });
        }

        const [existingProfile] = await db.query(
            "SELECT profile_id FROM founder_profiles WHERE user_id = ?",
            [userId]
        );

        if (existingProfile.length === 0) {
            return res.status(404).json({
                message: "Profile not found. Please create your profile first."
            });
        }

        await db.query(
            `UPDATE founder_profiles
             SET
                bio = ?,
                location = ?,
                education = ?,
                experience_years = ?,
                current_role = ?,
                linkedin_url = ?,
                portfolio_url = ?,
                availability = ?,
                preferred_role = ?,
                industry = ?,
                startup_stage = ?
             WHERE user_id = ?`,
            [
                bio || null,
                location || null,
                education || null,
                experience,
                current_role || null,
                linkedin_url || null,
                portfolio_url || null,
                availability || null,
                preferred_role || null,
                industry || null,
                startup_stage || null,
                userId
            ]
        );

        res.status(200).json({
            message: "Founder profile updated successfully!"
        });

    } catch (error) {
        console.error("Update Profile Error:", error);

        res.status(500).json({
            message: "Failed to update founder profile."
        });
    }
};
