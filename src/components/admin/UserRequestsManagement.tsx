
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle, XCircle, Clock, Eye, MessageSquare } from "lucide-react";
import { UserRequest } from "@/services/adminUserService";

interface UserRequestsManagementProps {
  adminRole: string;
}

const UserRequestsManagement = ({ adminRole }: UserRequestsManagementProps) => {
  const { requests, updateRequestStatus, loading } = useAdminUsers();
  const { user } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState<UserRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestTypeLabel = (type: string) => {
    switch (type) {
      case 'account_unlock': return 'Account Unlock';
      case 'balance_adjustment': return 'Balance Adjustment';
      case 'role_change': return 'Role Change';
      case 'account_closure': return 'Account Closure';
      case 'verification_review': return 'Verification Review';
      default: return type;
    }
  };

  const handleApprove = async (requestId: string) => {
    if (!user) return;
    await updateRequestStatus(requestId, true, user.id);
  };

  const handleReject = async (requestId: string, reason: string) => {
    if (!user) return;
    await updateRequestStatus(requestId, false, user.id, reason);
    setIsRejectDialogOpen(false);
    setRejectionReason("");
    setSelectedRequest(null);
  };

  const canManageRequests = ['admin', 'super_admin', 'moderator'].includes(adminRole);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">User Requests Management</h2>
        <Badge variant="outline" className="text-sm">
          {requests.filter(r => r.status === 'pending').length} Pending
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All User Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request Type</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {getRequestTypeLabel(request.request_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">
                        {request.user_id.slice(0, 8)}...
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {request.description}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(request.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Request Details</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium">Request Type</h4>
                                <p className="text-sm text-gray-600">
                                  {getRequestTypeLabel(request.request_type)}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium">Description</h4>
                                <p className="text-sm text-gray-600">
                                  {request.description}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium">Status</h4>
                                <Badge className={getStatusColor(request.status)}>
                                  {request.status.toUpperCase()}
                                </Badge>
                              </div>
                              {request.metadata && (
                                <div>
                                  <h4 className="font-medium">Additional Details</h4>
                                  <pre className="text-xs bg-gray-100 p-2 rounded">
                                    {JSON.stringify(request.metadata, null, 2)}
                                  </pre>
                                </div>
                              )}
                              {request.reviewed_by && (
                                <div>
                                  <h4 className="font-medium">Reviewed By</h4>
                                  <p className="text-sm text-gray-600">
                                    {request.reviewed_by} on {new Date(request.reviewed_at!).toLocaleString()}
                                  </p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {request.status === 'pending' && canManageRequests && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleApprove(request.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsRejectDialogOpen(true);
                              }}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Rejection Reason</h4>
              <Textarea
                placeholder="Please provide a reason for rejecting this request..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsRejectDialogOpen(false);
                  setRejectionReason("");
                  setSelectedRequest(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (selectedRequest) {
                    handleReject(selectedRequest.id, rejectionReason);
                  }
                }}
                disabled={!rejectionReason.trim()}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserRequestsManagement;
