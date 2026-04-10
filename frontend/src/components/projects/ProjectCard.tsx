import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Edit, Trash2, FolderOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isOwner = user?.id === project.owner_id;

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(project);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(project.id);
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-lg"
      onClick={handleCardClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">{project.name}</CardTitle>
          </div>
          {isOwner && (
            <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleEdit}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleDeleteClick}
                className="h-8 w-8 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <CardDescription className="line-clamp-2">
          {project.description || 'No description provided'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-500">
          {project.created_at
            ? `Created ${format(new Date(project.created_at), 'MMM dd, yyyy')}`
            : 'Recently created'
          }
        </p>

        {showDeleteConfirm && (
          <div
            className="mt-4 rounded-md border border-red-200 bg-red-50 p-3"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-red-800 font-medium mb-2">
              Delete this project?
            </p>
            <p className="text-xs text-red-600 mb-3">
              This will permanently delete the project and all its tasks.
            </p>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDeleteConfirm}
              >
                Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDeleteCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
