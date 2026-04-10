import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { useProject } from '@/hooks/useProjects';
import {
  useTasks,
  useUsers,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
} from '@/hooks/useTasks';
import type { Task, CreateTaskInput, TaskStatus } from '@/types';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string | 'all'>('all');

  const {
    data: project,
    isLoading: isLoadingProject,
    error: projectError,
  } = useProject(id!);

  const filters =
    statusFilter !== 'all' || assigneeFilter !== 'all'
      ? {
          ...(statusFilter !== 'all' && { status: statusFilter }),
          ...(assigneeFilter !== 'all' && assigneeFilter !== 'unassigned' && { assignee: assigneeFilter }),
        }
      : undefined;

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    error: tasksError,
  } = useTasks(id!, filters);

  const { data: users } = useUsers();
  const createTask = useCreateTask(id!);
  const updateTask = useUpdateTask(id!);
  const deleteTask = useDeleteTask(id!);

  const handleCreateTask = (data: CreateTaskInput) => {
    createTask.mutate(data, {
      onSuccess: () => {
        setIsFormOpen(false);
      },
    });
  };

  const handleUpdateTask = (data: CreateTaskInput) => {
    if (!editingTask) return;

    updateTask.mutate(
      { id: editingTask.id, data },
      {
        onSuccess: () => {
          setEditingTask(undefined);
          setIsFormOpen(false);
        },
      }
    );
  };

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTask.mutate({ id: taskId, data: { status } });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDelete = (taskId: string) => {
    deleteTask.mutate(taskId);
  };

  const handleOpenForm = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingTask(undefined);
    setIsFormOpen(false);
  };

  // Filter tasks client-side for unassigned filter
  const filteredTasks =
    assigneeFilter === 'unassigned'
      ? tasks?.filter((task) => !task.assignee_id)
      : tasks;

  if (isLoadingProject) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (projectError || !project) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error loading project
          </h3>
          <p className="text-sm text-red-700 mb-4">
            {projectError instanceof Error ? projectError.message : 'Project not found'}
          </p>
          <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/projects')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            {project.description && (
              <p className="mt-2 text-sm text-gray-600">{project.description}</p>
            )}
          </div>
          <Button onClick={handleOpenForm} className="mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <TaskFilters
        statusFilter={statusFilter}
        assigneeFilter={assigneeFilter}
        users={users}
        onStatusChange={setStatusFilter}
        onAssigneeChange={setAssigneeFilter}
      />

      {isLoadingTasks ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : tasksError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error loading tasks
          </h3>
          <p className="text-sm text-red-700">
            {tasksError instanceof Error ? tasksError.message : 'An error occurred'}
          </p>
        </div>
      ) : filteredTasks && filteredTasks.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filters ? 'No tasks match your filters' : 'No tasks yet'}
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
            {filters
              ? 'Try adjusting your filters to see more tasks.'
              : 'Get started by creating your first task for this project.'}
          </p>
          {!filters && (
            <Button onClick={handleOpenForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Task
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              users={users}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
              projectOwnerId={project.owner_id}
            />
          ))}
        </div>
      )}

      <TaskForm
        open={isFormOpen}
        onOpenChange={handleCloseForm}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
        isLoading={createTask.isPending || updateTask.isPending}
      />
    </div>
  );
}
