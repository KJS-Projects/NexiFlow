// app/favorites/page.js
import FavoritesClient from "./FavoritesClient";

// This server component just renders the client component
export default function FavoritesPage() {
  return <FavoritesClient />;
}
