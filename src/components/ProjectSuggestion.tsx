import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, GitFork, Star } from "lucide-react";

interface ProjectSuggestionProps {
  suggestion: {
    title: string;
    description: string;
    techStack: string[];
    difficulty: string;
  };
}

const ProjectSuggestion = ({ suggestion }: ProjectSuggestionProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-500 hover:bg-green-600";
      case "intermediate":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "advanced":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <Card className="h-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden">
      <CardHeader className="p-6">
        <div className="flex justify-between items-start space-x-4">
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {suggestion.title}
          </CardTitle>
          <Badge className={`${getDifficultyColor(suggestion.difficulty)} text-white`}>
            {suggestion.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <p className="text-gray-600 dark:text-gray-300">{suggestion.description}</p>
        <div className="flex flex-wrap gap-2">
          {suggestion.techStack.map((tech, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {tech}
            </Badge>
          ))}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4">
            <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Star className="h-4 w-4" />
              <span>Star</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <GitFork className="h-4 w-4" />
              <span>Fork</span>
            </button>
          </div>
          <button className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <Bookmark className="h-4 w-4" />
            <span>Save</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSuggestion;