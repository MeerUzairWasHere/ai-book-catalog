import { Star, BookOpen, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/types/book";

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
  onView: (book: Book) => void;
}

export function BookCard({ book, onEdit, onDelete, onView }: BookCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-muted text-muted-foreground"
            : "fill-secondary text-secondary"
        }`}
      />
    ));
  };

  return (
    <Card className="group  h-[500px] transition-all duration-200 p-0 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-border/50">
      <div onClick={() => onView(book)} className="flex flex-col h-full">
        <div className="aspect-[3/4] overflow-hidden rounded-t-lg bg-primary-light">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={`${book.title} cover`}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-light to-primary/10">
              <BookOpen className="h-16 w-16 text-primary/40" />
            </div>
          )}
        </div>

        <CardContent className="flex-1 p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2 text-foreground capitalize">
              {book.title}
            </h3>
            <p className="text-muted-foreground font-medium">{book.author}</p>

            <div className="flex items-center gap-1">
              {renderStars(book.rating)}
              <span className="text-sm text-muted-foreground ml-1">
                ({book.rating})
              </span>
            </div>

            <Badge
              variant="secondary"
              className="w-fit bg-secondary-light text-secondary-foreground"
            >
              {book.genre}
            </Badge>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(book);
            }}
            className="flex-1 text-primary border-primary/20 hover:bg-primary-light"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(book._id);
            }}
            className="flex-1 text-destructive border-destructive/20 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
