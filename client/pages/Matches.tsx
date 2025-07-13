import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Heart,
  ArrowLeft,
  Users,
  Star,
  Plus,
  MapPin,
  Briefcase,
  Target,
  User,
  MessageCircle,
} from "lucide-react";
import {
  GetMatchesResponse,
  UserMatch,
  ShortlistRequest,
  ShortlistResponse,
} from "@shared/api";
import { toast } from "sonner";

export default function Matches() {
  const { username } = useParams<{ username: string }>();
  const [matches, setMatches] = useState<UserMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [shortlistingUsers, setShortlistingUsers] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    if (username) {
      fetchMatches();
    }
  }, [username]);

  const fetchMatches = async () => {
    try {
      const response = await fetch(`/api/matches/${username}`);
      const data: GetMatchesResponse = await response.json();
      setMatches(data.matches);
    } catch (error) {
      toast.error("Failed to load matches");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShortlist = async (targetUsername: string) => {
    if (!username) return;

    setShortlistingUsers((prev) => new Set(prev).add(targetUsername));

    try {
      const response = await fetch("/api/shortlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          targetUsername,
        } as ShortlistRequest),
      });

      const data: ShortlistResponse = await response.json();

      if (data.success) {
        toast.success(`${targetUsername} added to shortlist!`);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to add to shortlist");
    } finally {
      setShortlistingUsers((prev) => {
        const next = new Set(prev);
        next.delete(targetUsername);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gradient-start via-companion-pink to-gradient-end flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Finding your perfect matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-start via-companion-pink to-gradient-end">
      {/* Header */}
      <header className="bg-black/20 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to={`/shortlist/${username}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Heart className="h-4 w-4 mr-2" />
                View Shortlist
              </Button>
            </Link>
            <Link to={`/conversations/${username}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Messages
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Matches for {username}</h1>
              <p className="text-white/80">
                {matches.length} compatible companion
                {matches.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {matches.length === 0 ? (
          <Card className="max-w-2xl mx-auto text-center bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                No Matches Found
              </h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any companions with at least 2 shared
                interests. Try creating a new profile with different interests
                or check back later as more users join!
              </p>
              <Link to="/">
                <Button className="bg-gradient-to-r from-companion-purple to-companion-pink">
                  Create New Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <Card
                key={match.name}
                className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
              >
                {/* Profile Photo Header */}
                <div className="relative h-48 bg-gradient-to-br from-companion-purple to-companion-pink">
                  {match.photo ? (
                    <img
                      src={match.photo}
                      alt={match.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-16 w-16 text-white/70" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="h-4 w-4 fill-companion-purple text-companion-purple" />
                    <span className="font-semibold text-companion-purple">
                      {match.compatibilityScore}%
                    </span>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <div className="space-y-2">
                    <CardTitle className="text-2xl text-gray-800">
                      {match.name}
                    </CardTitle>
                    <CardDescription className="text-green-600 font-medium">
                      {match.sharedInterests?.length || 0} shared interest
                      {(match.sharedInterests?.length || 0) !== 1 ? "s" : ""}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Details */}
                  <div className="space-y-3">
                    {match.age && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{match.age} years old</span>
                      </div>
                    )}
                    {match.location && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{match.location}</span>
                      </div>
                    )}
                    {match.occupation && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="h-4 w-4" />
                        <span>{match.occupation}</span>
                      </div>
                    )}
                    {match.lookingFor && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Target className="h-4 w-4" />
                        <span className="capitalize">{match.lookingFor}</span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {match.bio && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {match.bio}
                      </p>
                    </div>
                  )}

                  {/* Shared Interests */}
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Shared Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {match.sharedInterests?.map((interest) => (
                        <Badge
                          key={interest}
                          className="bg-green-100 text-green-800 border-green-200 capitalize"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* All Interests */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">
                      All Interests
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {match.interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant="outline"
                          className={`capitalize ${
                            match.sharedInterests?.includes(interest)
                              ? "border-green-200 text-green-700 bg-green-50"
                              : "border-gray-200 text-gray-600"
                          }`}
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to={`/chat/${username}/${[username?.toLowerCase(), match.name.toLowerCase()].sort().join("_")}`}
                      className="w-full"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-companion-purple text-companion-purple hover:bg-companion-light"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleShortlist(match.name)}
                      disabled={shortlistingUsers.has(match.name)}
                      className="w-full bg-gradient-to-r from-companion-purple to-companion-pink hover:from-companion-purple/90 hover:to-companion-pink/90"
                    >
                      {shortlistingUsers.has(match.name) ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          Adding...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Plus className="h-4 w-4" />
                          Shortlist
                        </div>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
