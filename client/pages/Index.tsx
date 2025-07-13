import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Sparkles, Users, Star } from "lucide-react";
import {
  CreateUserRequest,
  CreateUserResponse,
  INTERESTS_OPTIONS,
  LOOKING_FOR_OPTIONS,
} from "@shared/api";
import { PhotoUpload } from "@/components/ui/photo-upload";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function Index() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: "",
    age: 18,
    interests: [],
    photo: undefined,
    bio: "",
    location: "",
    occupation: "",
    lookingFor: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (formData.interests.length < 2) {
      toast.error("Please select at least 2 interests");
      return;
    }

    if (formData.bio && formData.bio.length > 500) {
      toast.error("Bio must be 500 characters or less");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: CreateUserResponse = await response.json();

      if (data.success) {
        toast.success("Profile created successfully!");
        navigate(`/matches/${formData.name}`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-start via-companion-pink to-gradient-end">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-16 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Heart className="h-12 w-12 text-white drop-shadow-lg" />
            <h1 className="text-5xl font-bold tracking-tight drop-shadow-lg">
              Companion Matcher
            </h1>
            <Sparkles className="h-12 w-12 text-white drop-shadow-lg" />
          </div>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow">
            Find your perfect companion based on shared interests. Connect with
            like-minded people who share your passions.
          </p>
          <div className="flex items-center justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Smart Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span>Interest-Based</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              <span>Find Companions</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-companion-purple to-companion-pink bg-clip-text text-transparent">
                Create Your Profile
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Tell us about yourself and we'll find your perfect matches
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Photo Upload */}
                <div className="space-y-2">
                  <Label className="text-lg font-semibold">Profile Photo</Label>
                  <PhotoUpload
                    value={formData.photo}
                    onChange={(photo) =>
                      setFormData((prev) => ({ ...prev, photo }))
                    }
                  />
                </div>

                {/* Basic Info Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Basic Information
                  </h3>

                  {/* Name Input */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg font-semibold">
                      What's your name? <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="h-12 text-lg border-gray-200 focus:border-companion-purple focus:ring-companion-purple"
                    />
                  </div>

                  {/* Age Input */}
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-lg font-semibold">
                      How old are you? <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      min="13"
                      max="120"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          age: parseInt(e.target.value) || 18,
                        }))
                      }
                      className="h-12 text-lg border-gray-200 focus:border-companion-purple focus:ring-companion-purple"
                    />
                  </div>

                  {/* Location Input */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-lg font-semibold">
                      Where are you located?
                    </Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="City, State/Country"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="h-12 text-lg border-gray-200 focus:border-companion-purple focus:ring-companion-purple"
                    />
                  </div>

                  {/* Occupation Input */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="occupation"
                      className="text-lg font-semibold"
                    >
                      What do you do?
                    </Label>
                    <Input
                      id="occupation"
                      type="text"
                      placeholder="Your occupation or field of study"
                      value={formData.occupation}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          occupation: e.target.value,
                        }))
                      }
                      className="h-12 text-lg border-gray-200 focus:border-companion-purple focus:ring-companion-purple"
                    />
                  </div>
                </div>

                {/* About Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    About You
                  </h3>

                  {/* Bio Textarea */}
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-lg font-semibold">
                      Tell us about yourself
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Share something interesting about yourself, your personality, or what makes you unique..."
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      className="min-h-[120px] text-lg border-gray-200 focus:border-companion-purple focus:ring-companion-purple resize-none"
                      maxLength={500}
                    />
                    <p className="text-sm text-gray-500 text-right">
                      {formData.bio?.length || 0}/500 characters
                    </p>
                  </div>

                  {/* Looking For Select */}
                  <div className="space-y-2">
                    <Label className="text-lg font-semibold">
                      What are you looking for?
                    </Label>
                    <Select
                      value={formData.lookingFor}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, lookingFor: value }))
                      }
                    >
                      <SelectTrigger className="h-12 text-lg border-gray-200 focus:border-companion-purple focus:ring-companion-purple">
                        <SelectValue placeholder="Select what you're looking for" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOOKING_FOR_OPTIONS.map((option) => (
                          <SelectItem
                            key={option}
                            value={option}
                            className="capitalize"
                          >
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Interests Section */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                    Interests & Hobbies
                  </h3>

                  <div className="space-y-4">
                    <Label className="text-lg font-semibold">
                      What are your interests?{" "}
                      <span className="text-red-500">*</span>
                      <span className="text-sm text-gray-500 block mt-1">
                        (Select at least 2 to find compatible matches)
                      </span>
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {INTERESTS_OPTIONS.map((interest) => (
                        <Badge
                          key={interest}
                          variant={
                            formData.interests.includes(interest)
                              ? "default"
                              : "outline"
                          }
                          className={`
                          cursor-pointer p-3 text-center justify-center capitalize transition-all duration-200 hover:scale-105
                          ${
                            formData.interests.includes(interest)
                              ? "bg-companion-purple hover:bg-companion-purple/90 text-white border-companion-purple"
                              : "hover:border-companion-purple hover:text-companion-purple border-gray-200"
                          }
                        `}
                          onClick={() => handleInterestToggle(interest)}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      Selected {formData.interests.length} interest
                      {formData.interests.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !formData.name.trim() ||
                    formData.interests.length < 2
                  }
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-companion-purple to-companion-pink hover:from-companion-purple/90 hover:to-companion-pink/90 transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Creating Profile...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Find My Matches
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white/80 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-companion-purple to-companion-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
              <p className="text-gray-600">
                Tell us about your interests and preferences
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-companion-purple to-companion-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Matching</h3>
              <p className="text-gray-600">
                Our algorithm finds compatible companions
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-companion-purple to-companion-pink rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Start meaningful conversations with your matches
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
