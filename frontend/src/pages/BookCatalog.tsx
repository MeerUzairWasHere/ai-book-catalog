import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Plus, Grid3X3, List, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { BookCard } from "@/components/BookCard";
import { SearchFilters } from "@/components/SearchFilters";
import { BookForm } from "@/components/BookForm";
import { BookDetails } from "@/components/BookDetails";
import { EmptyState } from "@/components/EmptyState";
import type { Book, BookFormData } from "@/types/book";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBooks } from "@/lib/queries";
import { customFetch } from "@/lib/customFetch";
import { useLocation } from "react-router-dom";

type ViewMode = "grid" | "list";
type Page = "list" | "details";

export default function BookCatalog() {
  const queryClient = useQueryClient();
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const genre = searchParams.get("genre") || "all";
  const searchFilter = searchParams.get("search") || "";

  const { data: books, isLoading } = useQuery<Book[] | []>(
    getBooks({
      genre,
      search: searchFilter,
    })
  );

  const [currentPage, setCurrentPage] = useState<Page>("list");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isDark, setIsDark] = useState(false);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingBook, setEditingBook] = useState<Book | null>();

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");

  // Delete confirmation
  const [deleteConfirmBook, setDeleteConfirmBook] = useState<string | null>(
    null
  );

  const handleAddBook = () => {
    setFormMode("add");
    setEditingBook(null);
    setIsFormOpen(true);
  };

  const handleEditBook = (book: Book) => {
    setFormMode("edit");
    setEditingBook(book);
    setIsFormOpen(true);
  };

  const handleDeleteBook = (id: string) => {
    setDeleteConfirmBook(id);
  };

  const confirmDelete = async () => {
    if (true) {
      try {
        await customFetch.delete(`/books/${deleteConfirmBook}`);
        queryClient.invalidateQueries({
          queryKey: ["books"],
        });

        setDeleteConfirmBook(null);

        // If we're viewing details of the deleted book, go back to list
        if (selectedBook?._id === deleteConfirmBook) {
          setCurrentPage("list");
          setSelectedBook(null);
        }

        toast.success("Book Deleted");
      } catch (error) {
        toast.error("Failed to delete book. Please try again.");
      }
    }
  };

  const handleViewBook = (book: Book) => {
    setSelectedBook(book);
    setCurrentPage("details");
  };

  const handleBackToList = () => {
    setCurrentPage("list");
    setSelectedBook(null);
  };

  useEffect(() => {
    if (formMode === "edit" && editingBook) {
      const fetchBookDetails = async () => {
        const book: Book = await customFetch.get(`/books/${editingBook?._id}`);
        setEditingBook((prev) => ({ ...prev, ...book }));
      };
      fetchBookDetails();
    }
  }, [isFormOpen]);

  const handleFormSubmit = async (data: BookFormData) => {
    if (formMode === "edit" && editingBook) {
      await customFetch.put(`/books/${editingBook._id}`, data);
      toast.success("Book Edited");
    } else {
      await customFetch.post("/books", data);
      toast.success("Book Added");
    }
    queryClient.invalidateQueries({
      queryKey: ["books"],
    });
    setIsFormOpen(false);
    setEditingBook(null);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse space-y-4 w-full max-w-4xl mx-auto p-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-12 bg-muted rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === "details" && selectedBook) {
    return (
      <div className="min-h-screen bg-background">
        <BookDetails book={selectedBook} onBack={handleBackToList} />
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  B
                </span>
              </div>
              <h1 className="text-xl font-semibold text-foreground">
                Book Catalog
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="text-muted-foreground hover:text-foreground"
              >
                {isDark ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              <div className="hidden sm:flex items-center gap-1 border rounded-md p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-2"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-2"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleAddBook}
                className="bg-primary hover:bg-primary-hover"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Book
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
        />

        {/* Books Display */}
        <div className="mt-8">
          {books?.length === 0 ? (
            <div className="flex justify-center py-12">
              <EmptyState
                type={
                  searchTerm || selectedGenre !== "all"
                    ? "no-search-results"
                    : "no-books"
                }
                onAddBook={handleAddBook}
                searchTerm={searchTerm}
              />
            </div>
          ) : (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {books?.map((book) => (
                <BookCard
                  key={book?._id}
                  book={book}
                  onEdit={handleEditBook}
                  onDelete={handleDeleteBook}
                  onView={handleViewBook}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Book Form Modal */}
      <BookForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBook(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingBook}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmBook}
        onOpenChange={() => setDeleteConfirmBook(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Book</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this book? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
