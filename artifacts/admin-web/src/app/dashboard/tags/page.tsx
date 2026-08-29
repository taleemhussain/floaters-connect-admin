'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/providers/auth-provider';
import { Tags, Plus, RefreshCw } from 'lucide-react';

type SkillTag = {
  id?: string;
  name: string;
  description: string;
  active: boolean;
};

export default function TagsPage() {
  const { token } = useAuth();
  const [tags, setTags] = useState<SkillTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTag, setEditTag] = useState<SkillTag | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/tags', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setTags(data);
      } else {
        setError('Invalid response from server.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching tags.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, [token]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !name.trim() || !description.trim()) return;

    try {
      const payload: SkillTag = {
        name,
        description,
        active,
      };

      if (editTag?.id) {
        payload.id = editTag.id;
      }

      const res = await fetch('/api/v1/admin/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        handleCreateNew();
        fetchTags();
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to save tag.');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting tag configuration.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Match Tags</h1>
          <p className="text-xs text-muted-foreground">
            Configure skill tags available to Runners and required by Drivers during matchmaking.
          </p>
        </div>
        <button
          onClick={fetchTags}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
          title="Reload Tags"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-950/20 border border-red-900/30 p-3.5 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* Grid splits tags list and edit form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* List of tags */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Tag Registry</h3>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center space-x-1 rounded-lg bg-primary hover:bg-primary/90 px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Tag</span>
            </button>
          </div>

          {loading ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center text-xs text-muted-foreground font-medium">
              Loading tag registry...
            </div>
          ) : tags.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center text-xs text-muted-foreground font-medium">
              No match tags registered.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tags.map((tag) => (
                <div
                  key={tag.id}
                  onClick={() => handleEdit(tag)}
                  className={`bg-card border p-5 rounded-xl shadow-sm cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                    editTag?.id === tag.id
                      ? 'border-foreground/45 bg-card/80 shadow-md'
                      : 'border-border hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-accent/10'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-foreground truncate pr-2">
                        {tag.name}
                      </h4>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium tracking-wide uppercase ${
                        tag.active
                          ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {tag.active ? 'Active' : 'Retired'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {tag.description}
                    </p>
                  </div>

                  <span className="text-[10px] text-muted-foreground/80 mt-4 block font-semibold hover:text-foreground transition-colors">
                    Edit Configuration &rarr;
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Editor sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-5 space-y-5 sticky top-20 shadow-md">
            <div className="flex items-center space-x-2">
              <Tags className="h-4.5 w-4.5 text-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                {editTag ? 'Modify Skill Tag' : 'Add New Tag'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Tag Label
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. White-glove Courier"
                  className="w-full rounded-lg bg-background border border-border p-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-border transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Specify what operations this tag warrants..."
                  className="w-full rounded-lg bg-background border border-border p-2.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-border transition-colors"
                />
              </div>

              <div className="flex items-center justify-between bg-background border border-border p-3 rounded-lg">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-foreground/90">Status Active</span>
                  <span className="text-[10px] text-muted-foreground block leading-tight">Uncheck to retire from matchmaking</span>
                </div>
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4 rounded border-border bg-background text-foreground focus:ring-primary shrink-0"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold py-2 transition-all shadow-sm cursor-pointer"
                >
                  {editTag ? 'Save Changes' : 'Publish Tag'}
                </button>
                {editTag && (
                  <button
                    type="button"
                    onClick={handleCreateNew}
                    className="px-3.5 rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground text-xs font-semibold py-2 transition-all shadow-sm cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
