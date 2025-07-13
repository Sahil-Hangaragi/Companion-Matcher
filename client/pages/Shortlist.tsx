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
  MapPin,
  Briefcase,
  Target,
  User,
  MessageCircle,
} from "lucide-react";
import { GetShortlistResponse, UserMatch } from "@shared/api";
import { toast } from "sonner";

export default function Shortlist() {
  const { username } = useParams<{ username: string }>();
  const [shortlist, setShortlist] = useState<UserMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (username) {
      fetchShortlist();
    }
  }, [username]);

  const fetchShortlist = async () => {
    try {
      const response = await fetch(`/api/shortlist/${username}`);
      const data: GetShortlistResponse = await response.json();
      setShortlist(data.shortlist);
    } catch (error) {
      toast.error("Failed to load shortlist");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gradient-start via-companion-pink to-gradient-end flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading your shortlist...</p>
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
            <Link to={`/matches/${username}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Users className="h-4 w-4 mr-2" />
                View All Matches
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
            <Heart className="h-8 w-8 fill-current" />
            <div>
              <h1 className="text-3xl font-bold">{username}'s Shortlist</h1>
              <p className="text-white/80">
                {shortlist.length} shortlisted companion
                {shortlist.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {shortlist.length === 0 ? (
          <Card className="max-w-2xl mx-auto text-center bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardContent className="py-12">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Your Shortlist is Empty
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't shortlisted any companions yet. Go back to your
                matches and start adding people you're interested in connecting
                with!
              </p>
              <Link to={`/matches/${username}`}>
                <Button className="bg-gradient-to-r from-companion-purple to-companion-pink">
                  <Users className="h-4 w-4 mr-2" />
                  View Matches
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="py-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Your Favorite Companions
                  </h2>
                  <p className="text-gray-600">
                    These are the people you've shortlisted for potential
                    connections
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Shortlisted Users */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shortlist.map((companion) => (
                <Card
                  key={companion.name}
                  className="bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                >
                  {/* Profile Photo Header */}
                  <div className="relative h-48 bg-gradient-to-br from-companion-purple to-companion-pink">
                    {companion.photo ? (
                      <img
                        src={companion.photo}
                        alt={companion.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-16 w-16 text-white/70" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/90 backdrop-blur-sm text-companion-purple border-companion-purple">
                        <Heart className="h-3 w-3 mr-1 fill-current" />
                        Shortlisted
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-4">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl text-gray-800">
                        {companion.name}
                      </CardTitle>
                      <CardDescription>
                        {companion.interests.length} interest
                        {companion.interests.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Details */}
                    <div className="space-y-3">
                      {companion.age && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="h-4 w-4" />
                          <span>{companion.age} years old</span>
                        </div>
                      )}
                      {companion.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{companion.location}</span>
                        </div>
                      )}
                      {companion.occupation && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Briefcase className="h-4 w-4" />
                          <span>{companion.occupation}</span>
                        </div>
                      )}
                      {companion.lookingFor && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Target className="h-4 w-4" />
                          <span className="capitalize">
                            {companion.lookingFor}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bio */}
                    {companion.bio && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {companion.bio}
                        </p>
                      </div>
                    )}

                    {/* Interests */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Interests
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {companion.interests.map((interest) => (
                          <Badge
                            key={interest}
                            variant="outline"
                            className="capitalize border-companion-purple text-companion-purple hover:bg-companion-light"
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Link
                      to={`/chat/${username}/${[username?.toLowerCase(), companion.name.toLowerCase()].sort().join("_")}`}
                      className="w-full"
                    >
                      <Button className="w-full bg-gradient-to-r from-companion-purple to-companion-pink hover:from-companion-purple/90 hover:to-companion-pink/90">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Actions */}
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="py-6">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Ready to Connect?
                  </h3>
                  <p className="text-gray-600">
                    These are your shortlisted companions. Take the next step
                    and start a conversation!
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link to={`/matches/${username}`}>
                      <Button
                        variant="outline"
                        className="border-companion-purple text-companion-purple hover:bg-companion-light"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Find More Matches
                      </Button>
                    </Link>
                    <Link to="/">
                      <Button className="bg-gradient-to-r from-companion-purple to-companion-pink">
                        <Star className="h-4 w-4 mr-2" />
                        Update Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
