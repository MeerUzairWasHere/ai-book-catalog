import { BookOpen, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  type: "no-books" | "no-search-results";
  onAddBook?: () => void;
  searchTerm?: string;
}

export function EmptyState({ type, onAddBook, searchTerm }: EmptyStateProps) {
  if (type === "no-search-results") {
    return (
      <Card className="w-full max-w-md mx-auto shadow-md">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">
            No books found
          </h3>
          <p className="text-muted-foreground mb-4">
            No books match your search for "{searchTerm}". Try different
            keywords or browse all books.
          </p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="border-primary/20 text-primary hover:bg-primary-light"
          >
            Clear search
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardContent className="p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-light to-primary/10 flex items-center justify-center">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-foreground">
          Start Your Library
        </h3>
        <p className="text-muted-foreground mb-6">
          You haven't added any books yet. Start building your personal catalog
          by adding your first book.
        </p>
        {onAddBook && (
          <Button
            onClick={onAddBook}
            className="bg-primary hover:bg-primary-hover text-primary-foreground"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Book
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
