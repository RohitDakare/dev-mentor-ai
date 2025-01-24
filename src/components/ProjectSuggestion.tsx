import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-blue-900">
            {suggestion.title}
          </CardTitle>
          <Badge className={getDifficultyColor(suggestion.difficulty)}>
            {suggestion.difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">{suggestion.description}</p>
        <div className="flex flex-wrap gap-2">
          {suggestion.techStack.map((tech, index) => (
            <Badge key={index} variant="secondary">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSuggestion;