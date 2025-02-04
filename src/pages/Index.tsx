import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import ProjectSuggestion from "@/components/ProjectSuggestion";
import ProjectDetailsModal from "@/components/ProjectDetailsModal";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SavedLibrary from "@/components/SavedLibrary";

const Index = () => {
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("gemini");
  const [perplexityKey, setPerplexityKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("AIzaSyDmMaMTy-6hFUUyapt8_uSXURnin6mPRH0");
  const [openaiKey, setOpenaiKey] = useState("");
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const getApiKeyForProvider = () => {
    switch (selectedProvider) {
      case "perplexity":
        return perplexityKey;
      case "gemini":
        return geminiKey;
      case "openai":
        return openaiKey;
      default:
        return "";
    }
  };

  const generateSuggestions = async () => {
    const apiKey = getApiKeyForProvider();
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: `Please enter your ${selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)} API key to continue.`,
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
      let response;
      const projectCount = Math.floor(Math.random() * 11) + 10; // Random number between 10-20
      const prompt = `Skills: ${skills}\nExperience Level: ${experience}\nInterests: ${interests}\nPlease suggest ${projectCount} unique and creative projects I could build. Make them diverse, innovative, and different from typical tutorial projects. Include projects of varying complexity and scope.`;

      switch (selectedProvider) {
        case "perplexity":
          response = await fetch("https://api.perplexity.ai/chat/completions", {
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
                    `You are a creative AI that suggests unique programming projects based on developer skills and interests. Provide ${projectCount} detailed project suggestions in JSON format with title, description, techStack, and difficulty fields. Ensure each project is unique and innovative.`,
                },
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: 0.9,
            }),
          });
          break;

        case "gemini":
          response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                contents: [{
                  parts: [{
                    text: `${prompt}\nRespond with exactly ${projectCount} unique project suggestions in JSON format. Each project should have: title, description, techStack (array), and difficulty (string). Make each project different and innovative.`
                  }]
                }],
                generationConfig: {
                  temperature: 0.9,
                  topK: 40,
                  topP: 0.95,
                },
              }),
            }
          );
          break;

        case "openai":
          response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "gpt-4",
              messages: [
                {
                  role: "system",
                  content:
                    `You are a creative AI that suggests unique programming projects based on developer skills and interests. Provide ${projectCount} detailed project suggestions in JSON format with title, description, techStack, and difficulty fields. Ensure each project is unique and innovative.`,
                },
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: 0.9,
            }),
          });
          break;
      }

      const data = await response.json();
      let suggestions;
      
      if (selectedProvider === "perplexity") {
        suggestions = JSON.parse(
          data.choices[0].message.content.replace(/```json\n?|```/g, "")
        );
      } else if (selectedProvider === "gemini") {
        suggestions = JSON.parse(
          data.candidates[0].content.parts[0].text.replace(/```json\n?|```/g, "")
        );
      } else {
        suggestions = JSON.parse(
          data.choices[0].message.content.replace(/```json\n?|```/g, "")
        );
      }

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

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 font-inter">
            AI Project Suggester
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-inter">
            Get personalized project suggestions based on your skills and interests
          </p>
        </div>

        <Card className="p-8 space-y-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl animate-scale-in">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  AI Provider
                </label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select AI Provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="perplexity">Perplexity AI</SelectItem>
                    <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  API Key
                </label>
                <Input
                  type="password"
                  placeholder={`Enter your ${
                    selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)
                  } API key`}
                  value={getApiKeyForProvider()}
                  onChange={(e) => {
                    switch (selectedProvider) {
                      case "perplexity":
                        setPerplexityKey(e.target.value);
                        break;
                      case "gemini":
                        setGeminiKey(e.target.value);
                        break;
                      case "openai":
                        setOpenaiKey(e.target.value);
                        break;
                    }
                  }}
                  className="w-full transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skills
              </label>
              <Input
                placeholder="e.g., JavaScript, Python, React"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full transition-all duration-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Experience Level
              </label>
              <Select value={experience} onValueChange={setExperience}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Interests
              </label>
              <Textarea
                placeholder="What kind of projects interest you?"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="w-full min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <Button
            onClick={generateSuggestions}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Suggestions...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                Generate Project Suggestions
              </>
            )}
          </Button>
        </Card>

        {suggestions.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Suggested Projects
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="transform hover:-translate-y-1 transition-all duration-200"
                >
                  <ProjectSuggestion 
                    suggestion={suggestion} 
                    onClick={() => handleProjectClick(suggestion)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <SavedLibrary />
        </div>

        <ProjectDetailsModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Index;
