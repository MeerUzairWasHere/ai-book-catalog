import { ArrowLeft, Star, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/types/book";
import { format } from "date-fns";

interface BookDetailsProps {
  book: Book;
  onBack: () => void;
}

export function BookDetails({ book, onBack }: BookDetailsProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < rating
            ? "fill-muted text-muted-foreground"
            : "fill-secondary text-secondary"
        }`}
      />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="text-primary border-primary/20 hover:bg-primary-light"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Books
        </Button>
      </div>

      {/* Hero Section */}
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <div className="md:flex">
            {/* Book Cover */}
            <div className="md:w-1/3 aspect-[3/4] md:aspect-auto">
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={`${book.title} cover`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-light to-primary/10">
                  <BookOpen className="h-24 w-24 text-primary/40" />
                </div>
              )}
            </div>

            {/* Book Info */}
            <div className="md:w-2/3 p-8">
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {book.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl text-muted-foreground font-medium">
                    by {book.author}
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {renderStars(book.rating)}
                    <span className="text-sm text-muted-foreground ml-2">
                      {book.rating} out of 5 stars
                    </span>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-secondary-light text-secondary-foreground"
                  >
                    {book.genre}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      {book.summary && (
        <Card className="shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-foreground">
              Summary
            </h3>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {book.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Metadata Section */}
      <Card className="shadow-md">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-4 text-foreground">
            Book Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-foreground">Genre:</span>
              <span className="ml-2 text-muted-foreground">{book.genre}</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Rating:</span>
              <span className="ml-2 text-muted-foreground">
                {book.rating}/5 stars
              </span>
            </div>
            <div>
              <span className="font-medium text-foreground">Date Added:</span>
              <span className="ml-2 text-muted-foreground">
                {book?.createdAt &&
                  format(new Date(book.createdAt), "dd, MMM yyyy")}
              </span>
            </div>
            <div>
              <span className="font-medium text-foreground">Last Updated:</span>
              <span className="ml-2 text-muted-foreground">
                {book?.updatedAt &&
                  format(new Date(book.updatedAt), "dd, MMM yyyy")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
