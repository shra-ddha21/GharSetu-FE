import { useState, useEffect } from 'react';
import { api } from '../../contexts/AuthContext';
import * as LucideIcons from 'lucide-react';
import toast from 'react-hot-toast';
import Skeleton from '../../components/Skeleton';

const AVAILABLE_ICONS = [
  'HardHat', 'Briefcase', 'Wrench', 'Truck', 'Hammer',
  'Store', 'Paintbrush', 'Zap', 'Shield', 'Star',
  'Settings', 'Package', 'Grid', 'Layers', 'Tool'
];

export default function AdminServices() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [addSubForm, setAddSubForm] = useState({ categoryId: null, value: '' });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [saving, setSaving] = useState(false);

  const [newCategory, setNewCategory] = useState({
    categoryId: '',
    name: '',
    icon: 'Wrench',
    description: '',
    subcategories: []
  });
  const [newSubInput, setNewSubInput] = useState('');

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/services/categories');
      setCategories(data);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.categoryId || !newCategory.name) {
      toast.error('Category ID and Name are required.');
      return;
    }
    setSaving(true);
    try {
      await api.post('/admin/services/categories', newCategory);
      toast.success('Category created successfully!');
      setShowAddCategory(false);
      setNewCategory({ categoryId: '', name: '', icon: 'Wrench', description: '', subcategories: [] });
      setNewSubInput('');
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubcategory = async (category) => {
    const sub = addSubForm.value.trim();
    if (!sub) return;
    if (category.subcategories.includes(sub)) {
      toast.error('Subcategory already exists');
      return;
    }
    setSaving(true);
    try {
      const updated = { subcategories: [...category.subcategories, sub] };
      await api.put(`/admin/services/categories/${category._id}`, updated);
      toast.success(`"${sub}" added!`);
      setAddSubForm({ categoryId: null, value: '' });
      fetchCategories();
    } catch {
      toast.error('Failed to add subcategory');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSubcategory = async (category, sub) => {
    setSaving(true);
    try {
      const updated = { subcategories: category.subcategories.filter(s => s !== sub) };
      await api.put(`/admin/services/categories/${category._id}`, updated);
      toast.success(`"${sub}" removed`);
      fetchCategories();
    } catch {
      toast.error('Failed to remove subcategory');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    setSaving(true);
    try {
      await api.delete(`/admin/services/categories/${id}`);
      toast.success('Category deleted');
      setDeleteConfirm(null);
      fetchCategories();
    } catch {
      toast.error('Failed to delete category');
    } finally {
      setSaving(false);
    }
  };

  const totalSubcategories = categories.reduce((acc, c) => acc + c.subcategories.length, 0);

  if (loading) {
    return (
      <div className="flex flex-col gap-8 pb-12">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton variant="title" className="w-64" />
            <Skeleton variant="text" className="w-96" />
          </div>
          <Skeleton className="h-12 w-40 rounded-2xl" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm">
              <Skeleton variant="avatar" className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton variant="text" className="w-12 h-6" />
                <Skeleton variant="text" className="w-24 h-3" />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-5">
              <Skeleton variant="avatar" className="h-12 w-12 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="text" className="w-1/3 h-5" />
                <Skeleton variant="text" className="w-1/4 h-3" />
              </div>
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Service Ecosystem</h1>
          <p className="text-slate-500 font-medium mt-1">Manage the categories and sub-services your platform offers.</p>
        </div>
        <button
          onClick={() => setShowAddCategory(true)}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
        >
          <LucideIcons.Plus className="w-5 h-5" /> Add Category
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Categories', value: categories.length, icon: 'Grid', color: 'indigo' },
          { label: 'Total Services', value: totalSubcategories, icon: 'Layers', color: 'violet' },
          { label: 'Avg. per Category', value: categories.length ? Math.round(totalSubcategories / categories.length) : 0, icon: 'BarChart2', color: 'sky' }
        ].map(stat => {
          const Icon = LucideIcons[stat.icon] || LucideIcons.Circle;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Categories List */}
      <div className="flex flex-col gap-4">
        {categories.map(category => {
          const Icon = LucideIcons[category.icon] || LucideIcons.Wrench;
          const isExpanded = expandedId === category._id;
          return (
            <div key={category._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
              <div
                className="flex items-center gap-5 p-6 cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                onClick={() => setExpandedId(isExpanded ? null : category._id)}
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-slate-900 text-lg truncate">{category.name}</h3>
                  <p className="text-sm font-medium text-slate-500">{category.subcategories.length} services</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteConfirm(category._id); }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete category"
                  >
                    <LucideIcons.Trash2 className="w-4 h-4" />
                  </button>
                  <LucideIcons.ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 p-6 bg-slate-50/50">
                  <div className="flex flex-wrap gap-2 mb-5">
                    {category.subcategories.map(sub => (
                      <div key={sub} className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-sm group">
                        <span className="text-sm font-semibold text-slate-700">{sub}</span>
                        <button
                          onClick={() => handleRemoveSubcategory(category, sub)}
                          className="text-slate-300 hover:text-red-500 transition-colors ml-1 opacity-0 group-hover:opacity-100"
                          disabled={saving}
                        >
                          <LucideIcons.X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    {category.subcategories.length === 0 && (
                      <p className="text-sm text-slate-400 font-medium italic">No subcategories yet.</p>
                    )}
                  </div>

                  {addSubForm.categoryId === category._id ? (
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        value={addSubForm.value}
                        onChange={e => setAddSubForm({ ...addSubForm, value: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && handleAddSubcategory(category)}
                        placeholder="e.g. Smart Home Installation"
                        className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button
                        onClick={() => handleAddSubcategory(category)}
                        disabled={saving}
                        className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setAddSubForm({ categoryId: null, value: '' })}
                        className="px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddSubForm({ categoryId: category._id, value: '' })}
                      className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100"
                    >
                      <LucideIcons.Plus className="w-4 h-4" /> Add Sub-service
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-8 relative">
            <button onClick={() => setShowAddCategory(false)} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
              <LucideIcons.X className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">New Category</h2>
            <form onSubmit={handleCreateCategory} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Category ID <span className="text-red-500">*</span></label>
                  <input
                    required placeholder="e.g. smart-home"
                    value={newCategory.categoryId}
                    onChange={e => setNewCategory({ ...newCategory, categoryId: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Icon</label>
                  <select
                    value={newCategory.icon}
                    onChange={e => setNewCategory({ ...newCategory, icon: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                  >
                    {AVAILABLE_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Category Name <span className="text-red-500">*</span></label>
                <input
                  required placeholder="e.g. Smart Home Services"
                  value={newCategory.name}
                  onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                <textarea
                  rows={2} placeholder="Brief description of this category..."
                  value={newCategory.description}
                  onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Add Initial Sub-services (optional)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newCategory.subcategories.map(sub => (
                    <span key={sub} className="flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-indigo-100">
                      {sub}
                      <button type="button" onClick={() => setNewCategory({...newCategory, subcategories: newCategory.subcategories.filter(s => s !== sub)})}>
                        <LucideIcons.X className="w-3 h-3 ml-1" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newSubInput}
                    onChange={e => setNewSubInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newSubInput.trim()) { setNewCategory({...newCategory, subcategories: [...newCategory.subcategories, newSubInput.trim()]}); setNewSubInput(''); }}}}
                    placeholder="Type and press Enter..."
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  <button type="button" onClick={() => { if (newSubInput.trim()) { setNewCategory({...newCategory, subcategories: [...newCategory.subcategories, newSubInput.trim()]}); setNewSubInput(''); }}} className="px-4 py-2.5 border border-slate-200 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors">
                    Add
                  </button>
                </div>
              </div>
              <button type="submit" disabled={saving} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50">
                {saving ? 'Creating...' : 'Create Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-5">
              <LucideIcons.Trash2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">Delete Category?</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">This will permanently delete the category and all its subcategories. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => handleDeleteCategory(deleteConfirm)} disabled={saving} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all disabled:opacity-50">
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
