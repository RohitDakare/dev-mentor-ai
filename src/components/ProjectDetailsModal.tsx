import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Star, GitFork } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface ProjectDetailsModalProps {
  project: {
    title: string;
    description: string;
    techStack: string[];
    difficulty: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState<{ text: string; date: string }[]>([]);
  const { toast } = useToast();

  if (!project) return null;

  const handleSaveProject = () => {
    const savedProjects = JSON.parse(localStorage.getItem("savedProjects") || "[]");
    if (!savedProjects.some((p: any) => p.title === project.title)) {
      savedProjects.push(project);
      localStorage.setItem("savedProjects", JSON.stringify(savedProjects));
      toast({
        title: "Project Saved",
        description: "The project has been added to your saved library.",
      });
    } else {
      toast({
        title: "Already Saved",
        description: "This project is already in your saved library.",
        variant: "destructive",
      });
    }
  };

  const handleAddReview = () => {
    if (review.trim()) {
      const newReview = {
        text: review,
        date: new Date().toLocaleDateString(),
      };
      setReviews([...reviews, newReview]);
      setReview("");
      toast({
        title: "Review Added",
        description: "Thank you for your feedback!",
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-yellow-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-blue-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-2xl font-bold">{project.title}</DialogTitle>
            <Badge className={`${getDifficultyColor(project.difficulty)} text-white`}>
              {project.difficulty}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" onClick={handleSaveProject}>
                <Bookmark className="h-4 w-4 mr-2" />
                Save Project
              </Button>
              <Button variant="outline" size="sm">
                <GitFork className="h-4 w-4 mr-2" />
                View Source
              </Button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold">Reviews</h3>
            <div className="space-y-4">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <p className="text-gray-600 dark:text-gray-300">{review.text}</p>
                  <p className="text-sm text-gray-400 mt-2">{review.date}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Write your review..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="min-h-[100px]"
              />
              <Button onClick={handleAddReview}>Add Review</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;