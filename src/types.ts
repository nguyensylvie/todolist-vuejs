export interface TodoList {
  title: string;
  tasks: Task[];
  showForm: boolean;
}

export interface Task {
  title: string;
  description: string;
}
