import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENRES } from "@/types/book";

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedGenre: string;
  onGenreChange: (value: string) => void;
}

export function SearchFilters({
  searchTerm,
  onSearchChange,
  selectedGenre,
  onGenreChange,
}: SearchFiltersProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }

    if (selectedGenre && selectedGenre !== "all") {
      params.set("genre", selectedGenre);
    } else {
      params.delete("genre");
    }

    // Debounce the URL update
    const timer = setTimeout(() => {
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, 1200);

    return () => clearTimeout(timer);
  }, [searchTerm, selectedGenre, navigate, location]);

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border shadow-sm">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border-border/50 focus:border-primary"
        />
      </div>

      <Select value={selectedGenre} onValueChange={onGenreChange}>
        <SelectTrigger className="w-full sm:w-48 border-border/50 focus:border-primary">
          <SelectValue placeholder="Filter by genre" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Genres</SelectItem>
          {GENRES.map((genre) => (
            <SelectItem key={genre} value={genre}>
              {genre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
