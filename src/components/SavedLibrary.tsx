import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, GitFork } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProjectDetailsModal from "./ProjectDetailsModal";

interface SavedProject {
  title: string;
  description: string;
  techStack: string[];
  difficulty: string;
}

const SavedLibrary = () => {
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    const saved = localStorage.getItem("savedProjects");
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

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

  const handleRemoveProject = (projectTitle: string) => {
    const updatedProjects = savedProjects.filter(
      (project) => project.title !== projectTitle
    );
    setSavedProjects(updatedProjects);
    localStorage.setItem("savedProjects", JSON.stringify(updatedProjects));
    toast({
      title: "Project Removed",
      description: "The project has been removed from your saved library.",
    });
  };

  const handleProjectClick = (project: SavedProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  if (savedProjects.length === 0) {
    return (
      <div className="text-center p-8 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Your Saved Library</h2>
        <p className="text-gray-600 dark:text-gray-300">
          No projects saved yet. Start exploring and save projects you're interested in!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Your Saved Library</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedProjects.map((project, index) => (
          <Card
            key={index}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden"
          >
            <CardHeader className="p-6">
              <div className="flex justify-between items-start space-x-4">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {project.title}
                </CardTitle>
                <Badge
                  className={`${getDifficultyColor(project.difficulty)} text-white`}
                >
                  {project.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                {project.description.length > 150
                  ? `${project.description.substring(0, 150)}...`
                  : project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, techIndex) => (
                  <Badge
                    key={techIndex}
                    variant="secondary"
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleProjectClick(project)}
                >
                  <GitFork className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveProject(project.title)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <ProjectDetailsModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default SavedLibrary;