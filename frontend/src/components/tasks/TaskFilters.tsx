import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { TaskStatus, User } from '@/types';

interface TaskFiltersProps {
  statusFilter: TaskStatus | 'all';
  assigneeFilter: string | 'all';
  users?: User[];
  onStatusChange: (status: TaskStatus | 'all') => void;
  onAssigneeChange: (assignee: string | 'all') => void;
}

export function TaskFilters({
  statusFilter,
  assigneeFilter,
  users,
  onStatusChange,
  onAssigneeChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-white rounded-lg border">
      <div className="flex-1">
        <Label htmlFor="status-filter" className="text-xs font-medium mb-1 block">
          Filter by Status
        </Label>
        <Select
          id="status-filter"
          value={statusFilter}
          onChange={(e) =>
            onStatusChange(e.target.value as TaskStatus | 'all')
          }
          className="w-full"
        >
          <option value="all">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </Select>
      </div>

      <div className="flex-1">
        <Label htmlFor="assignee-filter" className="text-xs font-medium mb-1 block">
          Filter by Assignee
        </Label>
        <Select
          id="assignee-filter"
          value={assigneeFilter}
          onChange={(e) => onAssigneeChange(e.target.value)}
          className="w-full"
        >
          <option value="all">All Assignees</option>
          <option value="unassigned">Unassigned</option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
