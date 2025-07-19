import { useCallback, useEffect, useState } from "react";
import { Star, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { type Book, type BookFormData } from "@/types/book";
import { toast } from "sonner";
import { customFetch } from "@/lib/customFetch";

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BookFormData) => void;
  initialData?: Book | null;
  mode: "add" | "edit";
}

export function BookForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: BookFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [formData, setFormData] = useState<BookFormData>(() => ({
    title: initialData?.title || "",
    author: initialData?.author || "",
    genre: initialData?.genre || "",
    rating: initialData?.rating || 1,
    summary: initialData?.summary || "",
    coverImage: initialData?.coverImage || "",
  }));

  useEffect(() => {
    setFormData({
      title: initialData?.title || "",
      author: initialData?.author || "",
      genre: initialData?.genre || "",
      rating: initialData?.rating || 1,
      summary: initialData?.summary || "",
      coverImage: initialData?.coverImage || "",
    });
  }, [initialData]);

  const [errors, setErrors] = useState<Partial<BookFormData>>({});

  const handleInputChange = (
    field: keyof BookFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleStarClick = (rating: number) => {
    handleInputChange("rating", rating);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<BookFormData> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.author.trim()) newErrors.author = "Author is required";
    if (!formData.genre) newErrors.genre = "Genre is required";
    if (formData.rating === 0) newErrors.rating = 1; // Just a marker for error state

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
      handleClose();
    } catch (error) {
      toast.error("Failed to add book. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  // Memoize the autofill function
  const handleAIAutofill = useCallback(async () => {
    if (!formData.title.trim() || formData.title.length < 3) {
      return;
    }

    setIsAILoading(true);
    try {
      const { data } = await customFetch.get(
        "/books/autofill?title=" + formData.title
      );
      setFormData((prev) => ({
        ...prev,
        rating: data.rating > 5 ? 5 : data.rating,
        ...data,
      }));
      toast.success("AI Auto-fill Complete");
    } catch (error) {
      toast.error("AI Auto-fill Failed");
    } finally {
      setIsAILoading(false);
    }
  }, [formData.title]);

  // Handle title change with debounce
  const handleTitleChange = (value: string) => {
    handleInputChange("title", value);

    // Clear previous timer if it exists
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer
    if (value.length >= 3) {
      setDebounceTimer(
        setTimeout(() => {
          handleAIAutofill();
        }, 1200)
      );
    }
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const handleClose = () => {
    setFormData({
      title: "",
      author: "",
      genre: "",
      rating: 0,
      summary: "",
      coverImage: "",
    });
    setErrors({});
    onClose();
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          i < rating
            ? "fill-muted text-muted-foreground hover:fill-secondary/50"
            : "fill-secondary text-secondary hover:fill-secondary-hover"
        }`}
        onClick={() => handleStarClick(i + 1)}
      />
    ));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "add" ? "Add New Book" : "Edit Book"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title *
            </Label>
            <div className="flex gap-2">
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter book title"
                className={`flex-1 ${
                  errors.title
                    ? "border-destructive"
                    : "border-border/50 focus:border-primary"
                }`}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAIAutofill}
                disabled={isAILoading || formData.title.length < 3}
                className="px-3 border-primary/20 text-primary hover:bg-primary-light"
              >
                {isAILoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="author" className="text-sm font-medium">
              Author *
            </Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => handleInputChange("author", e.target.value)}
              placeholder="Enter author name"
              className={
                errors.author
                  ? "border-destructive"
                  : "border-border/50 focus:border-primary"
              }
            />
            {errors.author && (
              <p className="text-sm text-destructive">{errors.author}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre" className="text-sm font-medium">
              Genre *
            </Label>
            <Input
              id="genre"
              value={formData.genre}
              onChange={(e) => handleInputChange("genre", e.target.value)}
              placeholder="Enter genre name"
              className={
                errors.genre
                  ? "border-destructive"
                  : "border-border/50 focus:border-primary"
              }
            />
            {errors.genre && (
              <p className="text-sm text-destructive">{errors.genre}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Rating *
              <span className="text-muted-foreground ml-1">
                ({formData.rating}/5)
              </span>
            </Label>
            <div className="flex gap-1">{renderStars(formData.rating)}</div>
            {errors.rating && (
              <p className="text-sm text-destructive">Please select a rating</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary" className="text-sm font-medium">
              Summary
            </Label>
            <Textarea
              id="summary"
              value={formData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              placeholder="Enter book summary or description"
              rows={4}
              className="border-border/50 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverImage" className="text-sm font-medium">
              Cover Image URL
            </Label>
            <Input
              id="coverImage"
              value={formData.coverImage}
              onChange={(e) => handleInputChange("coverImage", e.target.value)}
              placeholder="Enter cover image URL (optional)"
              className="border-border/50 focus:border-primary"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-primary hover:bg-primary-hover"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {mode === "add" ? "Adding..." : "Updating..."}
              </>
            ) : mode === "add" ? (
              "Add Book"
            ) : (
              "Update Book"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
