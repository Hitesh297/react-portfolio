export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const BLOG_API_BASE_URL = import.meta.env.VITE_BLOG_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined");
}

if (!BLOG_API_BASE_URL) {
  throw new Error("VITE_BLOG_API_BASE_URL is not defined");
}