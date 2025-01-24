import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import ProjectSuggestion from "@/components/ProjectSuggestion";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const generateSuggestions = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!skills || !experience || !interests) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before generating suggestions.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-large-128k-online",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful AI that suggests programming projects based on developer skills and interests. Provide 3 detailed project suggestions in JSON format with title, description, techStack, and difficulty fields.",
            },
            {
              role: "user",
              content: `Skills: ${skills}\nExperience Level: ${experience}\nInterests: ${interests}\nPlease suggest some projects I could build.`,
            },
          ],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      const suggestions = JSON.parse(
        data.choices[0].message.content.replace(/```json\n?|```/g, "")
      );
      setSuggestions(Array.isArray(suggestions) ? suggestions : [suggestions]);
      toast({
        title: "Success!",
        description: "Project suggestions generated successfully.",
      });
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate project suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-blue-900">
            AI Project Suggester
          </h1>
          <p className="text-lg text-blue-700">
            Get personalized project suggestions based on your skills and interests
          </p>
        </div>

        <Card className="p-6 space-y-6 bg-white/80 backdrop-blur-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <Input
                type="password"
                placeholder="Enter your Perplexity API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills
              </label>
              <Input
                placeholder="e.g., JavaScript, Python, React"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <Input
                placeholder="e.g., Beginner, Intermediate, Advanced"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interests
              </label>
              <Textarea
                placeholder="What kind of projects interest you?"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <Button
            onClick={generateSuggestions}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Suggestions...
              </>
            ) : (
              "Generate Project Suggestions"
            )}
          </Button>
        </Card>

        {suggestions.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-blue-900 text-center">
              Suggested Projects
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((suggestion, index) => (
                <ProjectSuggestion key={index} suggestion={suggestion} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;