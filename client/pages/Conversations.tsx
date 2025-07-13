import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  MessageCircle,
  Search,
  Users,
  Heart,
  Plus,
  User,
} from "lucide-react";
import { ConversationWithUser, GetConversationsResponse } from "@shared/api";
import { toast } from "sonner";
import { format, isToday, isYesterday, formatDistanceToNow } from "date-fns";

export default function Conversations() {
  const { username } = useParams<{ username: string }>();
  const [conversations, setConversations] = useState<ConversationWithUser[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (username) {
      fetchConversations();
    }
  }, [username]);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`/api/conversations/${username}`);
      const data: GetConversationsResponse = await response.json();
      setConversations(data.conversations);
    } catch (error) {
      toast.error("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  };

  const formatLastActivity = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "HH:mm");
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      const daysDiff = Math.floor(
        (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24),
      );
      if (daysDiff < 7) {
        return format(date, "EEEE"); // Day name
      } else {
        return format(date, "MMM d");
      }
    }
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.otherUser.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gradient-start via-companion-pink to-gradient-end flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading conversations...</p>
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
                Find Matches
              </Button>
            </Link>
            <Link to={`/shortlist/${username}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Heart className="h-4 w-4 mr-2" />
                Shortlist
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Messages</h1>
              <p className="text-white/80">
                {conversations.length} conversation
                {conversations.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Search and Actions */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-companion-purple focus:ring-companion-purple"
                  />
                </div>
                <Link to={`/matches/${username}`}>
                  <Button className="bg-gradient-to-r from-companion-purple to-companion-pink">
                    <Plus className="h-4 w-4 mr-2" />
                    Start New Chat
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Conversations List */}
          {filteredConversations.length === 0 ? (
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="py-16 text-center">
                {conversations.length === 0 ? (
                  <>
                    <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      No Conversations Yet
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Start chatting with your matches to see conversations
                      here. Find compatible companions and start meaningful
                      conversations!
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Link to={`/matches/${username}`}>
                        <Button className="bg-gradient-to-r from-companion-purple to-companion-pink">
                          <Users className="h-4 w-4 mr-2" />
                          Find Matches
                        </Button>
                      </Link>
                      <Link to={`/shortlist/${username}`}>
                        <Button
                          variant="outline"
                          className="border-companion-purple text-companion-purple hover:bg-companion-light"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          View Shortlist
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      No Results Found
                    </h2>
                    <p className="text-gray-600 mb-6">
                      No conversations match your search "{searchQuery}". Try a
                      different search term.
                    </p>
                    <Button
                      onClick={() => setSearchQuery("")}
                      variant="outline"
                      className="border-companion-purple text-companion-purple hover:bg-companion-light"
                    >
                      Clear Search
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredConversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  to={`/chat/${username}/${conversation.id}`}
                  className="block"
                >
                  <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.01] cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="relative">
                          <Avatar className="h-14 w-14">
                            <AvatarImage
                              src={conversation.otherUser.photo}
                              alt={conversation.otherUser.name}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-companion-purple to-companion-pink text-white text-lg">
                              {conversation.otherUser.name
                                .charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {conversation.unreadCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white rounded-full flex items-center justify-center">
                              {conversation.unreadCount > 9
                                ? "9+"
                                : conversation.unreadCount}
                            </Badge>
                          )}
                        </div>

                        {/* Conversation Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conversation.otherUser.name}
                            </h3>
                            <span className="text-sm text-gray-500 flex-shrink-0">
                              {formatLastActivity(conversation.lastActivity)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            {conversation.otherUser.age && (
                              <span>{conversation.otherUser.age}</span>
                            )}
                            {conversation.otherUser.location && (
                              <>
                                <span>•</span>
                                <span className="truncate">
                                  {conversation.otherUser.location}
                                </span>
                              </>
                            )}
                          </div>

                          {conversation.lastMessage ? (
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage.senderId ===
                              username?.toLowerCase()
                                ? "You: "
                                : ""}
                              {conversation.lastMessage.content}
                            </p>
                          ) : (
                            <p className="text-sm text-gray-500 italic">
                              Start the conversation...
                            </p>
                          )}
                        </div>

                        {/* Status Indicators */}
                        <div className="flex flex-col items-end gap-2">
                          {conversation.unreadCount > 0 && (
                            <div className="w-2 h-2 bg-companion-purple rounded-full"></div>
                          )}
                          <MessageCircle className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
