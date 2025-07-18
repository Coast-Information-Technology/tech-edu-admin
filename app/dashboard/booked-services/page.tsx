"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Video,
  Phone,
  MessageCircle,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Download,
  Share2,
} from "lucide-react";
import { useRole } from "@/contexts/RoleContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

interface BookedService {
  id: string;
  serviceName: string;
  serviceType:
    | "coaching"
    | "mentorship"
    | "cv-review"
    | "interview-prep"
    | "assessment";
  provider: {
    name: string;
    avatar?: string;
    title: string;
    rating: number;
  };
  date: string;
  time: string;
  duration: number; // in minutes
  status: "upcoming" | "completed" | "cancelled" | "rescheduled";
  meetingType: "video" | "phone" | "in-person";
  location?: string;
  meetingLink?: string;
  notes?: string;
  price: number;
  currency: string;
}

export default function BookedServicesPage() {
  const { userData } = useRole();
  const [services, setServices] = useState<BookedService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({
    serviceName: "",
    serviceType: "coaching",
    providerName: "",
    providerTitle: "",
    date: "",
    time: "",
    duration: 60,
    meetingType: "video",
    location: "",
    meetingLink: "",
    notes: "",
    price: 0,
    currency: "USD",
  });

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Optionally add booking to list
    setShowCreateModal(false);
    setForm({
      serviceName: "",
      serviceType: "coaching",
      providerName: "",
      providerTitle: "",
      date: "",
      time: "",
      duration: 60,
      meetingType: "video",
      location: "",
      meetingLink: "",
      notes: "",
      price: 0,
      currency: "USD",
    });
  };

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockServices: BookedService[] = [
      {
        id: "1",
        serviceName: "Academic Coaching Session",
        serviceType: "coaching",
        provider: {
          name: "Dr. Sarah Johnson",
          avatar: "/assets/team/Dr-Godbless-Akaighe.png",
          title: "Senior Academic Coach",
          rating: 4.8,
        },
        date: "2024-01-20",
        time: "14:00",
        duration: 60,
        status: "upcoming",
        meetingType: "video",
        meetingLink: "https://meet.google.com/abc-defg-hij",
        notes: "Focus on study planning and exam preparation strategies",
        price: 75,
        currency: "USD",
      },
      {
        id: "2",
        serviceName: "CV Review & Feedback",
        serviceType: "cv-review",
        provider: {
          name: "Michael Chen",
          avatar: "/assets/team/developer.avif",
          title: "Career Development Specialist",
          rating: 4.9,
        },
        date: "2024-01-18",
        time: "10:30",
        duration: 45,
        status: "completed",
        meetingType: "video",
        meetingLink: "https://meet.google.com/xyz-uvw-123",
        notes: "Comprehensive CV review with actionable feedback",
        price: 50,
        currency: "USD",
      },
      {
        id: "3",
        serviceName: "Mentorship Session",
        serviceType: "mentorship",
        provider: {
          name: "Emily Rodriguez",
          title: "Tech Industry Mentor",
          rating: 4.7,
        },
        date: "2024-01-25",
        time: "16:00",
        duration: 90,
        status: "upcoming",
        meetingType: "phone",
        notes: "Career guidance and industry insights discussion",
        price: 100,
        currency: "USD",
      },
      {
        id: "4",
        serviceName: "Interview Preparation",
        serviceType: "interview-prep",
        provider: {
          name: "David Kim",
          avatar: "/assets/team/Maria.webp",
          title: "Interview Coach",
          rating: 4.6,
        },
        date: "2024-01-15",
        time: "11:00",
        duration: 60,
        status: "completed",
        meetingType: "video",
        meetingLink: "https://meet.google.com/def-ghi-jkl",
        notes: "Mock interview with feedback on responses and body language",
        price: 80,
        currency: "USD",
      },
      {
        id: "5",
        serviceName: "Skill Assessment",
        serviceType: "assessment",
        provider: {
          name: "Lisa Thompson",
          title: "Assessment Specialist",
          rating: 4.5,
        },
        date: "2024-01-30",
        time: "13:00",
        duration: 120,
        status: "upcoming",
        meetingType: "in-person",
        location: "Tech EduK Center, Room 205",
        notes: "Comprehensive skill evaluation and career path recommendations",
        price: 120,
        currency: "USD",
      },
    ];

    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case "coaching":
        return "BookOpen";
      case "mentorship":
        return "Users";
      case "cv-review":
        return "FileText";
      case "interview-prep":
        return "Calendar";
      case "assessment":
        return "Target";
      default:
        return "BookOpen";
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "phone":
        return Phone;
      case "in-person":
        return MapPin;
      default:
        return Video;
    }
  };

  const upcomingServices = services.filter(
    (service) => service.status === "upcoming"
  );
  const completedServices = services.filter(
    (service) => service.status === "completed"
  );
  const cancelledServices = services.filter(
    (service) => service.status === "cancelled"
  );

  const totalSpent = completedServices.reduce(
    (sum, service) => sum + service.price,
    0
  );
  const upcomingCount = upcomingServices.length;
  const completedCount = completedServices.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 rounded animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Services</h1>
          <p className="text-gray-600 mt-2">
            Manage your booked services and upcoming sessions
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Calendar className="w-4 h-4 mr-2" />
          Create a Booking
        </Button>
      </div>
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Create a Booking</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
            <input
              name="serviceName"
              placeholder="Service Name"
              value={form.serviceName}
              onChange={handleFormChange}
              required
              className="w-full border p-2"
            />
            <select
              name="serviceType"
              value={form.serviceType}
              onChange={handleFormChange}
              className="w-full border p-2"
            >
              <option value="coaching">Coaching</option>
              <option value="mentorship">Mentorship</option>
              <option value="cv-review">CV Review</option>
              <option value="interview-prep">Interview Prep</option>
              <option value="assessment">Assessment</option>
            </select>
            <input
              name="providerName"
              placeholder="Provider Name"
              value={form.providerName}
              onChange={handleFormChange}
              required
              className="w-full border p-2"
            />
            <input
              name="providerTitle"
              placeholder="Provider Title"
              value={form.providerTitle}
              onChange={handleFormChange}
              required
              className="w-full border p-2"
            />
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleFormChange}
              required
              className="w-full border p-2"
            />
            <input
              name="time"
              type="time"
              value={form.time}
              onChange={handleFormChange}
              required
              className="w-full border p-2"
            />
            <input
              name="duration"
              type="number"
              min={1}
              value={form.duration}
              onChange={handleFormChange}
              required
              className="w-full border p-2"
              placeholder="Duration (minutes)"
            />
            <select
              name="meetingType"
              value={form.meetingType}
              onChange={handleFormChange}
              className="w-full border p-2"
            >
              <option value="video">Video</option>
              <option value="phone">Phone</option>
              <option value="in-person">In-person</option>
            </select>
            {form.meetingType === "in-person" && (
              <input
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleFormChange}
                className="w-full border p-2"
              />
            )}
            {form.meetingType === "video" && (
              <input
                name="meetingLink"
                placeholder="Meeting Link"
                value={form.meetingLink}
                onChange={handleFormChange}
                className="w-full border p-2"
              />
            )}
            <input
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleFormChange}
              className="w-full border p-2"
            />
            <input
              name="price"
              type="number"
              min={0}
              value={form.price}
              onChange={handleFormChange}
              required
              className="w-full border p-2"
              placeholder="Price"
            />
            <input
              name="currency"
              placeholder="Currency (e.g. USD)"
              value={form.currency}
              onChange={handleFormChange}
              required
              className="w-full border p-2"
            />
            <Button type="submit">Create Booking</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Upcoming Sessions
                </p>
                <p className="text-2xl font-bold">{upcomingCount}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-[10px]">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Completed Sessions
                </p>
                <p className="text-2xl font-bold">{completedCount}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-[10px]">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">${totalSpent}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-[10px]">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcomingCount})</TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedCount})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledServices.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingServices.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Upcoming Sessions
                </h3>
                <p className="text-gray-600 mb-4">
                  You don't have any upcoming sessions scheduled.
                </p>
                <Button>Book Your First Session</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingServices.map((service) => (
                <Card
                  key={service.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-[10px]">
                          <Calendar className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {service.serviceName}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {new Date(service.date).toLocaleDateString()} at{" "}
                            {service.time}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Provider Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={service.provider.avatar} />
                          <AvatarFallback>
                            {service.provider.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{service.provider.name}</p>
                          <p className="text-sm text-gray-600">
                            {service.provider.title}
                          </p>
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            {service.provider.rating}
                          </div>
                        </div>
                      </div>

                      {/* Meeting Details */}
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          {(() => {
                            const IconComponent = getMeetingTypeIcon(
                              service.meetingType
                            );
                            return <IconComponent className="w-4 h-4 mr-2" />;
                          })()}
                          {service.meetingType === "in-person" &&
                          service.location
                            ? service.location
                            : `${
                                service.meetingType.charAt(0).toUpperCase() +
                                service.meetingType.slice(1)
                              } Meeting`}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-2" />
                          {service.duration} minutes
                        </div>
                        {service.notes && (
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                            <strong>Notes:</strong> {service.notes}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-4 border-t">
                        {service.meetingType === "video" &&
                          service.meetingLink && (
                            <Button size="sm" className="flex-1">
                              <Video className="w-4 h-4 mr-2" />
                              Join Meeting
                            </Button>
                          )}
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedServices.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Completed Sessions
                </h3>
                <p className="text-gray-600">
                  Your completed sessions will appear here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {completedServices.map((service) => (
                <Card
                  key={service.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-[10px]">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {service.serviceName}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            Completed on{" "}
                            {new Date(service.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Provider Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={service.provider.avatar} />
                          <AvatarFallback>
                            {service.provider.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{service.provider.name}</p>
                          <p className="text-sm text-gray-600">
                            {service.provider.title}
                          </p>
                          <div className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            {service.provider.rating}
                          </div>
                        </div>
                      </div>

                      {/* Session Details */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Duration:</span>
                          <span>{service.duration} minutes</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span>Price:</span>
                          <span>
                            ${service.price} {service.currency}
                          </span>
                        </div>
                        {service.notes && (
                          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                            <strong>Session Notes:</strong> {service.notes}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-4 border-t">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download Receipt
                        </Button>
                        <Button size="sm" variant="outline">
                          <Star className="w-4 h-4 mr-2" />
                          Rate Session
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share Feedback
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-6">
          {cancelledServices.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  No Cancelled Sessions
                </h3>
                <p className="text-gray-600">
                  Great! You haven't cancelled any sessions.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cancelledServices.map((service) => (
                <Card
                  key={service.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 rounded-[10px]">
                          <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {service.serviceName}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            Cancelled on{" "}
                            {new Date(service.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Provider Info */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={service.provider.avatar} />
                          <AvatarFallback>
                            {service.provider.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{service.provider.name}</p>
                          <p className="text-sm text-gray-600">
                            {service.provider.title}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2 pt-4 border-t">
                        <Button size="sm" variant="outline">
                          <Calendar className="w-4 h-4 mr-2" />
                          Rebook Session
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
