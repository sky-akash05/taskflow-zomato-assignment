import { useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Calendar, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import type { Task, TaskStatus, User as UserType } from '@/types';

interface TaskCardProps {
  task: Task;
  users?: UserType[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
  projectOwnerId: string;
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-700 border-gray-300',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  high: 'bg-red-100 text-red-700 border-red-300',
};

export function TaskCard({
  task,
  users,
  onEdit,
  onDelete,
  onStatusChange,
  projectOwnerId,
}: TaskCardProps) {
  const { user: currentUser } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const canDelete =
    currentUser?.id === projectOwnerId || currentUser?.id === task.assignee_id;

  const assignee = users?.find((u) => u.id === task.assignee_id);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(task.id, e.target.value as TaskStatus);
  };

  return (
    <Card className="relative transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight">{task.title}</CardTitle>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onEdit(task)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
            </Button>
            {canDelete && (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowDeleteConfirm(true)}
                className="h-8 w-8 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          <Badge className={`${priorityColors[task.priority]} border`}>
            {task.priority.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        )}

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{assignee ? assignee.name : 'Unassigned'}</span>
          </div>

          {task.due_date && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Due {format(new Date(task.due_date), 'MMM dd, yyyy')}</span>
            </div>
          )}
        </div>

        <div className="pt-2">
          <label className="text-xs font-medium text-gray-700 block mb-1">
            Status
          </label>
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        {showDeleteConfirm && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-800 font-medium mb-2">
              Delete this task?
            </p>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  onDelete(task.id);
                  setShowDeleteConfirm(false);
                }}
              >
                Delete
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
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
