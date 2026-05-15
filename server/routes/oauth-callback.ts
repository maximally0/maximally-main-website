/**
 * OAuth Callback Routes
 * 
 * Handles OAuth callbacks from Neon Auth to ensure user profiles are created
 * after successful OAuth authentication (Google, GitHub, etc.)
 */

import type { Express, Request, Response } from "express";

export function registerOAuthCallbackRoutes(app: Express) {
  const supabaseAdmin = app.locals.supabaseAdmin as any;

  // OAuth callback handler - called by Neon Auth after successful OAuth
  app.post("/api/auth/oauth-callback", async (req: Request, res: Response) => {
    try {
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const { user, session } = req.body;
      
      if (!user?.id) {
        return res.status(400).json({ success: false, message: "Invalid callback data" });
      }

      console.log(`OAuth callback received for user: ${user.id}`);

      // Check if profile already exists
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (existingProfile) {
        console.log(`Profile already exists for user: ${user.id}`);
        return res.json({ success: true, message: "Profile already exists" });
      }

      // Generate a unique username if not provided
      let username = user.username;
      if (!username && (user.name || user.email)) {
        const baseName = user.name || user.email?.split('@')[0] || 'user';
        username = baseName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
        if (username.length < 3) username = 'user' + username;
        
        // Make it unique by adding random suffix
        const randomSuffix = Math.random().toString(36).slice(2, 6);
        username = username + randomSuffix;
      }

      // Extract avatar URL from OAuth user data
      // Check user.image field (GitHub OAuth) and user.picture field (Google OAuth)
      // Handle missing avatar URLs gracefully (set to null)
      const avatarUrl = user.image || user.picture || null;
      console.log(`Avatar URL extracted: ${avatarUrl ? 'present' : 'null'}`);

      // CRITICAL: Create auth.users record BEFORE profile to satisfy foreign key constraint
      // Use UPSERT to handle existing records: INSERT ... ON CONFLICT (id) DO UPDATE
      console.log(`Creating/updating auth.users record for user: ${user.id}`);
      
      try {
        // Step 1: UPSERT into auth.users (required for foreign key constraint)
        // Equivalent to: INSERT INTO auth.users (...) VALUES (...) ON CONFLICT (id) DO UPDATE SET ...
        const { error: authUserError } = await supabaseAdmin
          .from('auth.users')
          .upsert({
            id: user.id,
            email: user.email || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            raw_user_meta_data: {
              full_name: user.name || null,
              name: user.name || null,
              avatar_url: avatarUrl
            }
          }, { 
            onConflict: 'id',
            ignoreDuplicates: false  // Explicitly update on conflict (default behavior)
          });
        
        if (authUserError) {
          console.error('Error creating/updating auth.users record:', authUserError);
          return res.status(500).json({ 
            success: false, 
            message: `Failed to create/update auth.users record: ${authUserError.message}` 
          });
        }
        
        console.log(`Auth.users record created/updated successfully for user: ${user.id}`);
        
        // Step 2: Create the profile (now that auth.users exists)
        console.log(`Creating profile record for user: ${user.id}`);
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email || null,
            full_name: user.name || null,
            username: username || null,
            avatar_url: avatarUrl,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' })
          .select()
          .maybeSingle();

        if (profileError) {
          console.error('Error creating profile:', profileError);
          return res.status(500).json({ 
            success: false, 
            message: `Failed to create profile: ${profileError.message}` 
          });
        }

        console.log(`Profile created successfully for user: ${user.id}`);
        
        return res.json({ 
          success: true, 
          message: "Profile created successfully",
          profile: profile
        });
        
      } catch (dbError: any) {
        console.error('Database operation error:', dbError);
        return res.status(500).json({ 
          success: false, 
          message: `Database error: ${dbError.message}` 
        });
      }

    } catch (error: any) {
      console.error('OAuth callback error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // OAuth session sync - called when session changes
  app.post("/api/auth/session-sync", async (req: Request, res: Response) => {
    try {
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const { user, session } = req.body;
      
      if (!user?.id) {
        return res.status(400).json({ success: false, message: "Invalid session data" });
      }

      // Ensure profile exists for this user
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!existingProfile) {
        console.log(`Creating missing profile for user: ${user.id}`);
        
        // Create the profile
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email || null,
            full_name: user.name || null,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (profileError) {
          console.error('Error creating profile during session sync:', profileError);
          return res.status(500).json({ success: false, message: profileError.message });
        }
      }

      return res.json({ success: true, message: "Session synced" });

    } catch (error: any) {
      console.error('Session sync error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // Debug endpoint to check user data
  app.get("/api/debug/user/:email", async (req: Request, res: Response) => {
    try {
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const { email } = req.params;

      // Check profiles table
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      console.log('Profile found:', profile);
      console.log('Profile error:', profileError);

      // Check auth.users table if it exists
      let authUser = null;
      try {
        const { data: authUserData, error: authError } = await supabaseAdmin
          .from('auth.users')
          .select('*')
          .eq('email', email)
          .maybeSingle();
        authUser = authUserData;
        console.log('Auth user found:', authUser);
        console.log('Auth user error:', authError);
      } catch (authTableError) {
        console.log('Auth users table not accessible:', authTableError);
      }

      // Try to get user via Supabase Auth admin
      let neonAuthUser = null;
      try {
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers();
        neonAuthUser = users?.find((u: any) => u.email === email) || null;
      } catch (neonError) {
        console.log('Auth admin lookup failed:', neonError);
      }

      return res.json({
        success: true,
        debug: {
          email,
          profile,
          profileError: profileError?.message,
          authUser,
          neonAuthUser,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error: any) {
      console.error('Debug endpoint error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
  app.post("/api/auth/ensure-profile", async (req: Request, res: Response) => {
    try {
      if (!supabaseAdmin) {
        return res.status(500).json({ success: false, message: "Server not configured" });
      }

      const authHeader = req.headers['authorization'];
      if (!authHeader?.toString().startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'Missing token' });
      }
      
      const token = authHeader.toString().slice(7);
      
      // Get user from Neon Auth
      const { data: { user: authUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
      const user = authUser as any;
      
      if (authError || !user?.id) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
      }

      console.log(`Ensuring profile exists for user: ${user.id}`);

      // IDEMPOTENCY: Check if profile exists before creating
      // This handles the common case where profile already exists
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (existingProfile) {
        console.log(`Profile already exists for user: ${user.id}`);
        return res.json({ success: true, profile: existingProfile, created: false });
      }

      // Generate a unique username if not provided
      let username = user.username;
      if (!username && (user.name || user.email)) {
        const baseName = user.name || user.email?.split('@')[0] || 'user';
        username = baseName.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 20);
        if (username.length < 3) username = 'user' + username;
        
        // Make it unique by adding random suffix
        const randomSuffix = Math.random().toString(36).slice(2, 6);
        username = username + randomSuffix;
      }

      // Extract avatar URL from OAuth user data
      // Check user.image field (GitHub OAuth) and user.picture field (Google OAuth)
      // Handle missing avatar URLs gracefully (set to null)
      const avatarUrl = user.image || user.picture || null;
      console.log(`Avatar URL extracted: ${avatarUrl ? 'present' : 'null'}`);

      // CRITICAL: Create auth.users record BEFORE profile to satisfy foreign key constraint
      // Use UPSERT to handle existing records: INSERT ... ON CONFLICT (id) DO UPDATE
      console.log(`Creating/updating auth.users record for user: ${user.id}`);
      
      try {
        // Step 1: UPSERT into auth.users (required for foreign key constraint)
        // Equivalent to: INSERT INTO auth.users (...) VALUES (...) ON CONFLICT (id) DO UPDATE SET ...
        const { error: authUserError } = await supabaseAdmin
          .from('auth.users')
          .upsert({
            id: user.id,
            email: user.email || null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            raw_user_meta_data: {
              full_name: user.name || null,
              name: user.name || null,
              avatar_url: avatarUrl
            }
          }, { 
            onConflict: 'id',
            ignoreDuplicates: false  // Explicitly update on conflict (default behavior)
          });
        
        if (authUserError) {
          console.error('Error creating/updating auth.users record:', authUserError);
          return res.status(500).json({ 
            success: false, 
            message: `Failed to create/update auth.users record: ${authUserError.message}` 
          });
        }
        
        console.log(`Auth.users record created/updated successfully for user: ${user.id}`);
        
        // Step 2: IDEMPOTENT profile creation using UPSERT with proper conflict resolution
        // This handles concurrent requests gracefully - if another request created the profile
        // between our check and this operation, the UPSERT will update instead of failing
        console.log(`Creating/updating profile record for user: ${user.id}`);
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email || null,
            full_name: user.name || null,
            username: username || null,
            avatar_url: avatarUrl,
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'id',
            ignoreDuplicates: false  // Update existing profile if concurrent request created it
          })
          .select()
          .maybeSingle();

        if (profileError) {
          console.error('Error creating/updating profile:', profileError);
          
          // RACE CONDITION HANDLING: If profile creation fails, check if it was created by concurrent request
          const { data: retryProfile } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (retryProfile) {
            console.log(`Profile was created by concurrent request for user: ${user.id}`);
            return res.json({ 
              success: true, 
              profile: retryProfile,
              created: false,
              note: 'Profile created by concurrent request'
            });
          }
          
          // If still no profile, return the error
          return res.status(500).json({ 
            success: false, 
            message: `Failed to create profile: ${profileError.message}` 
          });
        }

        console.log(`Profile created/updated successfully for user: ${user.id}`);
        
        return res.json({ 
          success: true, 
          profile: profile,
          created: true
        });
        
      } catch (dbError: any) {
        console.error('Database operation error:', dbError);
        
        // CONCURRENT REQUEST HANDLING: Check if profile exists after database error
        // This handles race conditions where concurrent requests may have succeeded
        try {
          const { data: fallbackProfile } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (fallbackProfile) {
            console.log(`Profile exists after error - concurrent request succeeded for user: ${user.id}`);
            return res.json({ 
              success: true, 
              profile: fallbackProfile,
              created: false,
              note: 'Profile retrieved after concurrent request'
            });
          }
        } catch (fallbackError) {
          console.error('Fallback profile check failed:', fallbackError);
        }
        
        return res.status(500).json({ 
          success: false, 
          message: `Database error: ${dbError.message}` 
        });
      }

    } catch (error: any) {
      console.error('Ensure profile error:', error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });
}