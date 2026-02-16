import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Eye,
  Edit3,
  Trash2,
  Clock,
  AlertTriangle,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  MessageCircle,
  Send,
  CheckCircle,
  XCircle,
  Filter,
  Search,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { LoadingMask } from "../../components/LoadingMask";

interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  status: "new" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  assigned_to?: number;
  assigned_first_name?: string;
  assigned_last_name?: string;
  response_count: number;
  created_at: string;
  updated_at: string;
}

interface SupportResponse {
  id: number;
  contact_submission_id: number;
  admin_id?: number;
  admin_first_name?: string;
  admin_last_name?: string;
  message: string;
  is_internal_note: boolean;
  created_at: string;
}

interface DetailedSubmission extends ContactSubmission {
  responses: SupportResponse[];
}

const SupportTickets: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<DetailedSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [newResponse, setNewResponse] = useState("");
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [error, setError] = useState("");

  const statusColors = {
    new: "bg-blue-100 text-blue-800 border-blue-200",
    in_progress: "bg-yellow-100 text-yellow-800 border-yellow-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
    closed: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const priorityColors = {
    low: "bg-gray-100 text-gray-800",
    medium: "bg-blue-100 text-blue-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/contact-submissions");

      if (!response.ok) {
        throw new Error("Failed to fetch contact submissions");
      }

      const data = await response.json();
      setSubmissions(data.data || []);
    } catch (err) {
      setError("Error loading contact submissions");
      console.error("Error fetching submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissionDetail = async (id: number) => {
    try {
      setDetailLoading(true);
      const response = await fetch(`/api/admin/contact-submissions/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch submission details");
      }

      const data = await response.json();
      setSelectedSubmission(data.data);
    } catch (err) {
      setError("Error loading submission details");
      console.error("Error fetching submission details:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const updateSubmissionStatus = async (
    id: number,
    status: string,
    priority?: string,
    assigned_to?: number,
  ) => {
    try {
      setUpdating(true);
      const updates: any = { status };
      if (priority) updates.priority = priority;
      if (assigned_to !== undefined) updates.assigned_to = assigned_to;

      const response = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update submission");
      }

      await fetchSubmissions();
      if (selectedSubmission && selectedSubmission.id === id) {
        await fetchSubmissionDetail(id);
      }
    } catch (err) {
      setError("Error updating submission");
      console.error("Error updating submission:", err);
    } finally {
      setUpdating(false);
    }
  };

  const addResponse = async (id: number) => {
    if (!newResponse.trim()) return;

    try {
      setUpdating(true);
      const response = await fetch(
        `/api/admin/contact-submissions/${id}/responses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: newResponse,
            is_internal_note: isInternalNote,
            admin_id: 1, // This should come from auth context
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add response");
      }

      setNewResponse("");
      setIsInternalNote(false);
      await fetchSubmissionDetail(id);
      await fetchSubmissions();
    } catch (err) {
      setError("Error adding response");
      console.error("Error adding response:", err);
    } finally {
      setUpdating(false);
    }
  };

  const deleteSubmission = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this submission? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete submission");
      }

      await fetchSubmissions();
      if (selectedSubmission?.id === id) {
        setShowDetailModal(false);
        setSelectedSubmission(null);
      }
    } catch (err) {
      setError("Error deleting submission");
      console.error("Error deleting submission:", err);
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      !searchTerm ||
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (submission.company &&
        submission.company.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || submission.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || submission.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <LoadingMask isLoading={true} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="h-8 w-8 mr-3 text-blue-600" />
            Tickets de Soporte
          </h1>
          <p className="text-gray-600 mt-1">
            Gestionar envíos de contacto de clientes y solicitudes de soporte
          </p>
        </div>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setPriorityFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Submissions List */}
      <div className="space-y-4">
        {filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Support Tickets
              </h3>
              <p className="text-gray-600">
                {searchTerm ||
                statusFilter !== "all" ||
                priorityFilter !== "all"
                  ? "No submissions match your current filters."
                  : "No contact submissions found."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSubmissions.map((submission) => (
            <Card
              key={submission.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        #{submission.id} - {submission.subject}
                      </h3>
                      <Badge className={statusColors[submission.status]}>
                        {submission.status.replace("_", " ").toUpperCase()}
                      </Badge>
                      <Badge
                        className={priorityColors[submission.priority]}
                        variant="outline"
                      >
                        {submission.priority.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{submission.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{submission.email}</span>
                      </div>
                      {submission.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4" />
                          <span>{submission.phone}</span>
                        </div>
                      )}
                      {submission.company && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Building className="h-4 w-4" />
                          <span>{submission.company}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(submission.created_at)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{submission.response_count} responses</span>
                      </div>
                      {submission.assigned_first_name && (
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>
                            Assigned to {submission.assigned_first_name}{" "}
                            {submission.assigned_last_name}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="mt-3 text-gray-700 line-clamp-2">
                      {submission.message}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Dialog
                      open={
                        showDetailModal &&
                        selectedSubmission?.id === submission.id
                      }
                      onOpenChange={(open) => {
                        if (open) {
                          fetchSubmissionDetail(submission.id);
                          setShowDetailModal(true);
                        } else {
                          setShowDetailModal(false);
                          setSelectedSubmission(null);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            Support Ticket #{submission.id} -{" "}
                            {submission.subject}
                          </DialogTitle>
                        </DialogHeader>

                        {detailLoading ? (
                          <LoadingMask isLoading={true} />
                        ) : (
                          selectedSubmission && (
                            <div className="space-y-6">
                              {/* Submission Details */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3">
                                    Contact Information
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <User className="h-4 w-4 text-gray-500" />
                                      <span>{selectedSubmission.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Mail className="h-4 w-4 text-gray-500" />
                                      <span>{selectedSubmission.email}</span>
                                    </div>
                                    {selectedSubmission.phone && (
                                      <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-gray-500" />
                                        <span>{selectedSubmission.phone}</span>
                                      </div>
                                    )}
                                    {selectedSubmission.company && (
                                      <div className="flex items-center space-x-2">
                                        <Building className="h-4 w-4 text-gray-500" />
                                        <span>
                                          {selectedSubmission.company}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3">
                                    Ticket Status
                                  </h4>
                                  <div className="space-y-3">
                                    <div className="flex items-center space-x-3">
                                      <Badge
                                        className={
                                          statusColors[
                                            selectedSubmission.status
                                          ]
                                        }
                                      >
                                        {selectedSubmission.status
                                          .replace("_", " ")
                                          .toUpperCase()}
                                      </Badge>
                                      <Badge
                                        className={
                                          priorityColors[
                                            selectedSubmission.priority
                                          ]
                                        }
                                        variant="outline"
                                      >
                                        {selectedSubmission.priority.toUpperCase()}
                                      </Badge>
                                    </div>
                                    <div className="flex space-x-2">
                                      <Select
                                        value={selectedSubmission.status}
                                        onValueChange={(status) =>
                                          updateSubmissionStatus(
                                            selectedSubmission.id,
                                            status,
                                          )
                                        }
                                      >
                                        <SelectTrigger className="w-32">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="new">
                                            New
                                          </SelectItem>
                                          <SelectItem value="in_progress">
                                            In Progress
                                          </SelectItem>
                                          <SelectItem value="resolved">
                                            Resolved
                                          </SelectItem>
                                          <SelectItem value="closed">
                                            Closed
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Select
                                        value={selectedSubmission.priority}
                                        onValueChange={(priority) =>
                                          updateSubmissionStatus(
                                            selectedSubmission.id,
                                            selectedSubmission.status,
                                            priority,
                                          )
                                        }
                                      >
                                        <SelectTrigger className="w-32">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="low">
                                            Low
                                          </SelectItem>
                                          <SelectItem value="medium">
                                            Medium
                                          </SelectItem>
                                          <SelectItem value="high">
                                            High
                                          </SelectItem>
                                          <SelectItem value="urgent">
                                            Urgent
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Original Message */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">
                                  Original Message
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <p className="text-gray-700 whitespace-pre-line">
                                    {selectedSubmission.message}
                                  </p>
                                </div>
                              </div>

                              {/* Responses */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">
                                  Responses (
                                  {selectedSubmission.responses.length})
                                </h4>
                                <div className="space-y-3 max-h-64 overflow-y-auto">
                                  {selectedSubmission.responses.map(
                                    (response) => (
                                      <div
                                        key={response.id}
                                        className={`p-3 rounded-lg ${response.is_internal_note ? "bg-yellow-50 border border-yellow-200" : "bg-blue-50 border border-blue-200"}`}
                                      >
                                        <div className="flex items-center justify-between mb-2">
                                          <div className="flex items-center space-x-2">
                                            <Badge
                                              variant={
                                                response.is_internal_note
                                                  ? "secondary"
                                                  : "default"
                                              }
                                            >
                                              {response.is_internal_note
                                                ? "Internal Note"
                                                : "Response"}
                                            </Badge>
                                            {response.admin_first_name && (
                                              <span className="text-sm text-gray-600">
                                                by {response.admin_first_name}{" "}
                                                {response.admin_last_name}
                                              </span>
                                            )}
                                          </div>
                                          <span className="text-xs text-gray-500">
                                            {formatDate(response.created_at)}
                                          </span>
                                        </div>
                                        <p className="text-sm text-gray-700 whitespace-pre-line">
                                          {response.message}
                                        </p>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>

                              {/* Add Response */}
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">
                                  Add Response
                                </h4>
                                <div className="space-y-3">
                                  <Textarea
                                    placeholder="Enter your response..."
                                    value={newResponse}
                                    onChange={(e) =>
                                      setNewResponse(e.target.value)
                                    }
                                    rows={4}
                                  />
                                  <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={isInternalNote}
                                        onChange={(e) =>
                                          setIsInternalNote(e.target.checked)
                                        }
                                        className="rounded"
                                      />
                                      <span className="text-sm text-gray-600">
                                        Internal note (not visible to customer)
                                      </span>
                                    </label>
                                    <div className="flex space-x-2">
                                      <Button
                                        variant="outline"
                                        onClick={() =>
                                          deleteSubmission(
                                            selectedSubmission.id,
                                          )
                                        }
                                        disabled={updating}
                                      >
                                        <Trash2 className="h-4 w-4 mr-1" />
                                        Delete
                                      </Button>
                                      <Button
                                        onClick={() =>
                                          addResponse(selectedSubmission.id)
                                        }
                                        disabled={
                                          !newResponse.trim() || updating
                                        }
                                      >
                                        <Send className="h-4 w-4 mr-1" />
                                        {updating
                                          ? "Sending..."
                                          : "Send Response"}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </DialogContent>
                    </Dialog>

                    <Select
                      value={submission.status}
                      onValueChange={(status) =>
                        updateSubmissionStatus(submission.id, status)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SupportTickets;
