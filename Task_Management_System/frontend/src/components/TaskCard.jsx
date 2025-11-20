const TaskCard = ({ task, isAdmin, onDelete, onEdit }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isCreator = user.id === task.createdBy;

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
      <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
      <p className="text-gray-600 mt-2">{task.description}</p>
      <div className="mt-3 flex justify-between items-center">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
          {task.status.toUpperCase()}
        </span>
        {isAdmin && (
          <span className="text-sm text-gray-500">
            **Creator**: {task.createdByUsername || task.createdBy}
          </span>
        )}
      </div>
      <div className="mt-4 flex space-x-2">
        {(isCreator && !isAdmin) && (
          <button
            onClick={() => onEdit(task)}
            className="text-sm bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
          >
            Edit
          </button>
        )}
        {(isAdmin || isCreator) && (
          <button
            onClick={() => onDelete(task.id)}
            className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;