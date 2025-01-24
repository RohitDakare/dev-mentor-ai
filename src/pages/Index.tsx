import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import ProjectSuggestion from "@/components/ProjectSuggestion";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Index = () => {
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("perplexity");
  const [perplexityKey, setPerplexityKey] = useState("");
  const [geminiKey, setGeminiKey] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
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
      const prompt = `Skills: ${skills}\nExperience Level: ${experience}\nInterests: ${interests}\nPlease suggest some projects I could build.`;

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
                    "You are a helpful AI that suggests programming projects based on developer skills and interests. Provide 3 detailed project suggestions in JSON format with title, description, techStack, and difficulty fields.",
                },
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: 0.7,
            }),
          });
          break;

        case "gemini":
          response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `${prompt}\nRespond with exactly 3 project suggestions in JSON format. Each project should have: title, description, techStack (array), and difficulty (string).`
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
              },
            }),
          });
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
                    "You are a helpful AI that suggests programming projects based on developer skills and interests. Provide 3 detailed project suggestions in JSON format with title, description, techStack, and difficulty fields.",
                },
                {
                  role: "user",
                  content: prompt,
                },
              ],
              temperature: 0.7,
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
                AI Provider
              </label>
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select AI Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perplexity">Perplexity AI</SelectItem>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                  <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <Input
                type="password"
                placeholder={`Enter your ${
                  selectedProvider.charAt(0).toUpperCase() +
                  selectedProvider.slice(1)
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