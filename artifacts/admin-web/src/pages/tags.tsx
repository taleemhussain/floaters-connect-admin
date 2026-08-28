import React, { useState } from 'react';
import { Tags, Plus, CheckCircle, RefreshCcw } from 'lucide-react';
import { 
  useGetAdminTags, 
  useUpsertAdminTag,
  getGetAdminTagsQueryKey
} from '@workspace/api-client-react';
import type { SkillTag } from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';

export default function TagsPage() {
  const queryClient = useQueryClient();
  const { data: tags, isLoading: loading, error: queryError } = useGetAdminTags();
  const upsertTag = useUpsertAdminTag();

  const [editTag, setEditTag] = useState<SkillTag | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);

  const error = queryError ? 'Error fetching tags.' : null;

  const handleEdit = (tag: SkillTag) => {
    setEditTag(tag);
    setName(tag.name);
    setDescription(tag.description);
    setActive(tag.active);
  };

  const handleCreateNew = () => {
    setEditTag(null);
    setName('');
    setDescription('');
    setActive(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    upsertTag.mutate({
      data: {
        id: editTag?.id || null,
        name,
        description,
        active
      }
    }, {
      onSuccess: () => {
        handleCreateNew();
        queryClient.invalidateQueries({ queryKey: getGetAdminTagsQueryKey() });
      },
      onError: (err: any) => alert(err.message || 'Failed to save tag.')
    });
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Smart Match Tags</h1>
        <p className="mt-2 text-sm text-slate-400">
          Configure skill tags available to Runners and required by Drivers during matchmaking.
        </p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Grid splits tags list and edit form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List of tags */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Registered Tags</h3>
            <button
              onClick={handleCreateNew}
              data-testid="button-create-tag"
              className="inline-flex items-center space-x-1.5 rounded-lg bg-red-600 hover:bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Tag</span>
            </button>
          </div>

          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
              Loading tag registry...
            </div>
          ) : !tags || tags.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500">
              No match tags registered.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => handleEdit(tag)}
                  className={`bg-slate-900 border p-5 rounded-2xl shadow-sm cursor-pointer hover:border-slate-700 transition flex flex-col justify-between ${
                    editTag?.id === tag.id ? 'border-red-500' : 'border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-base font-bold text-white truncate pr-2">
                        {tag.name}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        tag.active
                          ? 'bg-green-600/10 text-green-400 ring-1 ring-green-500/20'
                          : 'bg-slate-800 text-slate-500 ring-1 ring-slate-700'
                      }`}>
                        {tag.active ? 'Active' : 'Retired'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {tag.description}
                    </p>
                  </div>

                  <span className="text-[10px] text-red-400/80 mt-4 block font-semibold hover:underline">
                    Edit Configuration &rarr;
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editor sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit sticky top-8">
          <div className="flex items-center space-x-2 mb-6">
            <Tags className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-white">
              {editTag ? 'Modify Skill Tag' : 'Scaffold New Tag'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Tag Label (Unique name)
              </label>
              <input
                type="text"
                required
                data-testid="input-tag-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. White-glove Courier"
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Description (Aims & Limits)
              </label>
              <textarea
                rows={4}
                required
                data-testid="textarea-tag-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Specify what operations this tag warrants, and what rules apply during matchmaking..."
                className="w-full rounded-lg bg-slate-950 border border-slate-800 p-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-between bg-slate-950 border border-slate-800/80 p-3 rounded-lg">
              <div>
                <span className="text-xs font-semibold text-slate-300 block">Status Active</span>
                <span className="text-[10px] text-slate-500 block">Uncheck to retire from matchmaking</span>
              </div>
              <input
                type="checkbox"
                checked={active}
                data-testid="checkbox-tag-active"
                onChange={(e) => setActive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-red-600 focus:ring-red-500 shrink-0 cursor-pointer"
              />
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="submit"
                disabled={upsertTag.isPending}
                data-testid="button-save-tag"
                className="flex-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold py-2 transition cursor-pointer disabled:opacity-50"
              >
                {upsertTag.isPending ? 'Saving...' : (editTag ? 'Save Changes' : 'Publish Tag')}
              </button>
              {editTag && (
                <button
                  type="button"
                  onClick={handleCreateNew}
                  disabled={upsertTag.isPending}
                  data-testid="button-reset-tag"
                  className="px-3 rounded-lg border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-300 text-sm font-semibold py-2 transition cursor-pointer disabled:opacity-50"
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
