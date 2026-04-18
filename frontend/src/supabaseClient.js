import { createClient } from '@supabase/supabase-js'

// .env ගොනුවේ ඇති තොරතුරු ලබා ගැනීම
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// තොරතුරු පරීක්ෂා කිරීම
if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase environment variables are missing! ❌");
}

// Supabase සම්බන්ධතාවය ඇති කිරීම
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImageToSupabase = async (file) => {
    try {
        // එකම නම තිබුණොත් පින්තූර එකිනෙක වැසෙන නිසා අලුත් නමක් සෑදීම
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}_${Date.now()}.${fileExt}`;

        // 1. පින්තූරය 'student-images' bucket එකට upload කිරීම
        const { data, error } = await supabase.storage
            .from('student-images')
            .upload(fileName, file);

        if (error) throw error;

        // 2. Upload කළ පින්තූරයට අදාළ Public URL එක ලබා ගැනීම
        const { data: { publicUrl } } = supabase.storage
            .from('student-images')
            .getPublicUrl(fileName);

        return publicUrl; // මෙතැනදී ලැබෙන URL එක Backend එකට යවන්න පුළුවන්
    } catch (error) {
        console.error("Error during upload:", error.message);
        return null;
    }
};