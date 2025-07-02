
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockDataService } from "@/services/mockDataService";
import { useToast } from "@/hooks/use-toast";
import { Globe, Plus, Edit, Trash2, Eye } from "lucide-react";

interface WebsiteCMSProps {
  adminRole: string;
}

interface WebsiteContent {
  id: string;
  content_type: string;
  title: string;
  content: any;
  status: string;
  created_at: string;
  updated_at: string;
}

const WebsiteCMS = ({ adminRole }: WebsiteCMSProps) => {
  const [content, setContent] = useState<WebsiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    content_type: 'banner',
    title: '',
    content: '',
    status: 'draft'
  });
  const { toast } = useToast();

  const fetchContent = async () => {
    try {
      // Mock website content data
      const mockContent = [
        {
          id: '1',
          content_type: 'banner',
          title: 'Welcome Banner',
          content: { text: 'Welcome to UnionTrust', image: '/banner.jpg' },
          status: 'published',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          content_type: 'announcement',
          title: 'System Maintenance',
          content: { text: 'Scheduled maintenance tonight' },
          status: 'draft',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setContent(mockContent);
    } catch (error: any) {
      console.error('Error fetching website content:', error);
      toast({
        title: "Error",
        description: "Failed to load website content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const createContent = async () => {
    try {
      // Mock content creation
      const newContent = {
        id: Date.now().toString(),
        ...formData,
        content: JSON.parse(formData.content || '{}'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setContent(prev => [newContent, ...prev]);

      toast({
        title: "Success",
        description: "Content created successfully",
      });

      setShowCreateForm(false);
      setFormData({ content_type: 'banner', title: '', content: '', status: 'draft' });
    } catch (error: any) {
      console.error('Error creating content:', error);
      toast({
        title: "Error",
        description: "Failed to create content",
        variant: "destructive",
      });
    }
  };

  const updateContentStatus = async (contentId: string, newStatus: string) => {
    try {
      // Mock update - update local state
      setContent(prev => prev.map(item => 
        item.id === contentId 
          ? { ...item, status: newStatus, updated_at: new Date().toISOString() }
          : item
      ));

      toast({
        title: "Success",
        description: "Content status updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating content status:', error);
      toast({
        title: "Error",
        description: "Failed to update content status",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Draft</Badge>;
      case 'archived':
        return <Badge className="bg-gray-100 text-gray-800">Archived</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
        <h2 className="text-2xl font-bold text-gray-900">Website CMS</h2>
        <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Content
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Content Type</label>
                <select
                  value={formData.content_type}
                  onChange={(e) => setFormData({...formData, content_type: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="banner">Banner</option>
                  <option value="blog_post">Blog Post</option>
                  <option value="announcement">Announcement</option>
                  <option value="rate">Rate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Content title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content (JSON)</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder='{"text": "Content here", "image": "url"}'
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={createContent}>Create</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Website Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {content.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.content_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>
                      {new Date(item.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {item.status === 'draft' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateContentStatus(item.id, 'published')}
                          >
                            Publish
                          </Button>
                        )}
                        {item.status === 'published' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateContentStatus(item.id, 'archived')}
                          >
                            Archive
                          </Button>
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
    </div>
  );
};

export default WebsiteCMS;
