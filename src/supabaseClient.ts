import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL: string = "https://vlyovcposnnbhkmouyby.supabase.co";
const SUPABASE_ANON_KEY: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZseW92Y3Bvc25uYmhrbW91eWJ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyMDgxODcsImV4cCI6MjA1ODc4NDE4N30.EyKaSegguDuCIE01es214tNUOB2v9f5Vwmk2CTcuC30";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
