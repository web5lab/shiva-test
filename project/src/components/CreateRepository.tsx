import React from 'react';
import { useMutation } from 'react-query';
import { createRepository } from '../lib/api';
import { Loader } from 'lucide-react';

interface CreateRepositoryProps {
  onSuccess: (repo: any) => void;
  onCancel: () => void;
}

export default function CreateRepository({ onSuccess, onCancel }: CreateRepositoryProps) {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const createMutation = useMutation(
    () => createRepository(name, description, isPrivate),
    {
      onSuccess: (repo) => {
        onSuccess(repo);
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Failed to create repository');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Repository name is required');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Create New Repository</h3>
        <p className="mt-1 text-sm text-gray-500">
          Create a new repository to store your project files.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Repository Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="my-awesome-project"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Brief description of your project"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="private"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="private" className="ml-2 block text-sm text-gray-700">
            Make this repository private
          </label>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createMutation.isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {createMutation.isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              'Create Repository'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}